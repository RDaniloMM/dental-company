import { requireAdmin } from "@/lib/security/auth";
import { recordSecurityEvent } from "@/lib/security/events";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

type PersonalUpdatePayload = {
  activo?: boolean;
  especialidad?: string | null;
  id: string;
  nombre_completo?: string;
  rol?: "Admin" | "Odontólogo";
  telefono?: string | null;
};

function normalizePersonalUpdate(body: Record<string, unknown>): PersonalUpdatePayload {
  return {
    activo: typeof body.activo === "boolean" ? body.activo : undefined,
    especialidad:
      typeof body.especialidad === "string" ? body.especialidad.trim() || null : undefined,
    id: String(body.id || "").trim(),
    nombre_completo:
      typeof body.nombre_completo === "string"
        ? body.nombre_completo.trim()
        : undefined,
    rol:
      body.rol === "Admin" || body.rol === "Odontólogo"
        ? body.rol
        : undefined,
    telefono: typeof body.telefono === "string" ? body.telefono.trim() || null : undefined,
  };
}

function getChangedFields(
  before: Record<string, unknown>,
  after: Record<string, unknown>
) {
  return Object.keys(after).filter((key) => before[key] !== after[key]);
}

export async function PUT(req: NextRequest) {
  try {
    const sameOriginError = requireSameOrigin(req);
    if (sameOriginError) return sameOriginError;

    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    const body = normalizePersonalUpdate(await req.json());
    if (!body.id) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("personal")
      .select("id, nombre_completo, rol, especialidad, telefono, activo")
      .eq("id", body.id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (body.nombre_completo !== undefined) updates.nombre_completo = body.nombre_completo;
    if (body.rol !== undefined) updates.rol = body.rol;
    if (body.especialidad !== undefined) updates.especialidad = body.especialidad;
    if (body.telefono !== undefined) updates.telefono = body.telefono;
    if (body.activo !== undefined) updates.activo = body.activo;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No hay cambios para guardar" }, { status: 400 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("personal")
      .update(updates)
      .eq("id", body.id)
      .select("id, nombre_completo, rol, especialidad, telefono, activo")
      .single();

    if (updateError || !updated) {
      return NextResponse.json(
        { error: updateError?.message || "No se pudo actualizar el usuario" },
        { status: 500 }
      );
    }

    await recordSecurityEvent({
      eventType: "auth.personal.updated",
      request: req,
      userId: admin.user.id,
      severity: "warning",
      metadata: {
        changed_fields: getChangedFields(existing, updated),
        clinic_area: "personal",
        entity_type: "staff_profile",
        target_name_after: updated.nombre_completo,
        target_name_before: existing.nombre_completo,
        target_role_after: updated.rol,
        after: updated,
        before: existing,
        targetUserId: body.id,
      },
    });

    return NextResponse.json({ success: true, personal: updated });
  } catch (error) {
    console.error("Error en PUT personal:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un usuario del personal y de auth.users
export async function DELETE(req: NextRequest) {
  try {
    const sameOriginError = requireSameOrigin(req);
    if (sameOriginError) return sameOriginError;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    // No permitir que el usuario se elimine a sí mismo
    if (userId === admin.user.id) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propia cuenta" },
        { status: 400 }
      );
    }

    // Crear cliente admin con service_role key
    const supabaseAdmin = createAdminClient();

    // Verificar si el usuario tiene registros relacionados que impidan eliminarlo
    const { count: citasCount } = await supabaseAdmin
      .from("citas")
      .select("id", { count: "exact", head: true })
      .eq("odontologo_id", userId);

    // Si tiene citas asociadas, solo desactivar en lugar de eliminar
    if ((citasCount ?? 0) > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("personal")
        .update({ activo: false })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json(
          { error: `Error al desactivar: ${updateError.message}` },
          { status: 500 }
        );
      }

      await recordSecurityEvent({
        eventType: "auth.user.deactivated",
        request: req,
        userId: admin.user.id,
        severity: "warning",
        metadata: { targetUserId: userId, reason: "has_appointments" },
      });

      return NextResponse.json({
        success: true,
        message:
          "Usuario desactivado (tiene citas asociadas y no puede ser eliminado)",
      });
    }

    // Primero eliminar de la tabla personal
    const { error: personalError } = await supabaseAdmin
      .from("personal")
      .delete()
      .eq("id", userId);

    if (personalError) {
      console.error("Error eliminando de personal:", personalError);

      // Si falla por FK, desactivar en su lugar
      if (
        personalError.message.includes("foreign key") ||
        personalError.code === "23503"
      ) {
        const { error: updateError } = await supabaseAdmin
          .from("personal")
          .update({ activo: false })
          .eq("id", userId);

        if (updateError) {
          return NextResponse.json(
            { error: `Error al desactivar: ${updateError.message}` },
            { status: 500 }
          );
        }

        await recordSecurityEvent({
          eventType: "auth.user.deactivated",
          request: req,
          userId: admin.user.id,
          severity: "warning",
          metadata: { targetUserId: userId, reason: "foreign_key" },
        });

        return NextResponse.json({
          success: true,
          message: "Usuario desactivado (tiene registros asociados)",
        });
      }

      return NextResponse.json(
        { error: `Error al eliminar: ${personalError.message}` },
        { status: 500 }
      );
    }

    // Luego eliminar de auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (authError) {
      console.error("Error eliminando de auth:", authError);
      // Personal ya fue eliminado, el usuario no podrá acceder
      // No es crítico si auth falla
    }

    await recordSecurityEvent({
      eventType: "auth.user.deleted",
      request: req,
      userId: admin.user.id,
      severity: "critical",
      metadata: {
        clinic_area: "personal",
        entity_type: "staff_profile",
        targetUserId: userId,
        authDeleteFailed: Boolean(authError),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado completamente",
    });
  } catch (error) {
    console.error("Error en DELETE personal:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

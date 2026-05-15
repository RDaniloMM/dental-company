import { requireAdmin, normalizeRole } from "@/lib/security/auth";
import { recordSecurityEvent } from "@/lib/security/events";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function generateInviteCode() {
  return `DC-${randomBytes(5).toString("base64url").slice(0, 8).toUpperCase()}`;
}

// Obtener todos los códigos de invitación (solo admins)
export async function GET() {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    const { data, error } = await supabase
      .from("codigos_invitacion")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo invitaciones:", error);
      return NextResponse.json(
        { error: "Error al obtener invitaciones" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Crear nuevo código de invitación (solo admins)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    const body = await request.json();
    const {
      codigo,
      rol_asignado = "Odontólogo",
      usos_maximos = 1,
      expira_en_dias,
    } = body;

    const codigoFinal = String(codigo || generateInviteCode())
      .trim()
      .toUpperCase();

    if (!/^[A-Z0-9_-]{4,32}$/.test(codigoFinal.replace(/^DC-/, ""))) {
      return NextResponse.json(
        { error: "Código inválido: usa 4-32 caracteres alfanuméricos" },
        { status: 400 }
      );
    }

    const usosMaximos = Math.max(1, Math.min(Number(usos_maximos) || 1, 10));
    const expiraAt = expira_en_dias
      ? new Date(
          Date.now() + Math.min(Number(expira_en_dias), 30) * 24 * 60 * 60 * 1000
        ).toISOString()
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("codigos_invitacion")
      .insert({
        codigo: codigoFinal,
        creado_por: admin.user.id,
        rol_asignado: normalizeRole(rol_asignado),
        usos_maximos: usosMaximos,
        expira_at: expiraAt,
        activo: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "El código ya existe" },
          { status: 400 }
        );
      }
      console.error("Error creando invitación:", error);
      return NextResponse.json(
        { error: "Error al crear invitación" },
        { status: 500 }
      );
    }

    await recordSecurityEvent({
      eventType: "auth.invite.created",
      request,
      userId: admin.user.id,
      severity: "warning",
      metadata: { role: normalizeRole(rol_asignado), usosMaximos },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Actualizar código de invitación (activar/desactivar; solo admins)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    const body = await request.json();
    const { id, activo } = body;

    if (!id || typeof activo !== "boolean") {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const { error } = await supabase
      .from("codigos_invitacion")
      .update({ activo })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando invitación:", error);
      return NextResponse.json(
        { error: "Error al actualizar" },
        { status: 500 }
      );
    }

    await recordSecurityEvent({
      eventType: "auth.invite.updated",
      request,
      userId: admin.user.id,
      severity: "warning",
      metadata: { id, activo },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Eliminar código de invitación (solo admins)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const { error } = await supabase
      .from("codigos_invitacion")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error eliminando invitación:", error);
      return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
    }

    await recordSecurityEvent({
      eventType: "auth.invite.deleted",
      request,
      userId: admin.user.id,
      severity: "warning",
      metadata: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

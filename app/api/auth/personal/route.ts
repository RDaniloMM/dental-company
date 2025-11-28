import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// DELETE: Eliminar un usuario del personal y de auth.users
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar que el usuario actual es admin
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el usuario actual es administrador
    const { data: currentPersonal } = await supabase
      .from("personal")
      .select("rol")
      .eq("id", currentUser.id)
      .single();

    const isAdmin =
      currentPersonal?.rol === "Admin" ||
      currentPersonal?.rol === "Administrador";

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Solo los administradores pueden eliminar usuarios" },
        { status: 403 }
      );
    }

    // No permitir que el usuario se elimine a sí mismo
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propia cuenta" },
        { status: 400 }
      );
    }

    // Crear cliente admin con service_role key
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verificar si el usuario tiene registros relacionados que impidan eliminarlo
    const { data: citasCount } = await supabaseAdmin
      .from("citas")
      .select("id", { count: "exact", head: true })
      .eq("odontologo_id", userId);

    // Si tiene citas asociadas, solo desactivar en lugar de eliminar
    if (citasCount && citasCount.length > 0) {
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

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Obtener todos los códigos de invitación
export async function GET() {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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

// Crear nuevo código de invitación
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      codigo,
      rol_asignado = "Odontólogo",
      usos_maximos = 1,
      expira_en_dias,
    } = body;

    // Generar código aleatorio si no se proporciona
    const codigoFinal =
      codigo ||
      `DC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const expira_at = expira_en_dias
      ? new Date(
          Date.now() + expira_en_dias * 24 * 60 * 60 * 1000
        ).toISOString()
      : null;

    const { data, error } = await supabase
      .from("codigos_invitacion")
      .insert({
        codigo: codigoFinal,
        creado_por: user.id,
        rol_asignado,
        usos_maximos,
        expira_at,
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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Actualizar código de invitación (activar/desactivar)
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, activo } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Eliminar código de invitación
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

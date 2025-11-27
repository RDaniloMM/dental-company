import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Verificar configuración de seguridad
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("config_seguridad")
      .select("clave, valor, descripcion");

    if (error) {
      // Si no existe la config, por defecto requerir invitación
      return NextResponse.json({
        publicRegistration: false,
        requiresApproval: true,
      });
    }

    // Convertir a objeto
    const config: Record<string, string> = {};
    data?.forEach((item) => {
      config[item.clave] = item.valor;
    });

    return NextResponse.json({
      publicRegistration: config["registro_publico_habilitado"] === "true",
      requiresApproval: config["requiere_aprobacion_admin"] === "true",
      config: data,
    });
  } catch (error) {
    console.error("Error verificando config:", error);
    return NextResponse.json({
      publicRegistration: false,
      requiresApproval: true,
    });
  }
}

// Actualizar configuración de seguridad (solo admins)
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
    const { clave, valor } = body;

    if (!clave || valor === undefined) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    const { error } = await supabase.from("config_seguridad").upsert(
      {
        clave,
        valor: String(valor),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );

    if (error) {
      console.error("Error actualizando config:", error);
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

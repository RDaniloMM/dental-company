import { requireAdmin } from "@/lib/security/auth";
import { recordSecurityEvent } from "@/lib/security/events";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Verificar configuración pública de seguridad. No expone la tabla completa.
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("config_seguridad")
      .select("clave, valor")
      .in("clave", ["registro_publico_habilitado", "requiere_aprobacion_admin"]);

    if (error) {
      // Fail closed: por defecto requerir invitación y aprobación.
      return NextResponse.json({
        publicRegistration: false,
        requiresApproval: true,
      });
    }

    const config: Record<string, string> = {};
    data?.forEach((item) => {
      config[item.clave] = item.valor;
    });

    return NextResponse.json({
      publicRegistration: config["registro_publico_habilitado"] === "true",
      requiresApproval: config["requiere_aprobacion_admin"] !== "false",
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
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    const body = await request.json();
    const { clave, valor } = body;

    const allowedKeys = new Set([
      "registro_publico_habilitado",
      "requiere_aprobacion_admin",
      "max_intentos_login",
      "duracion_bloqueo_login_minutos",
      "min_password_length",
    ]);

    if (!clave || valor === undefined || !allowedKeys.has(String(clave))) {
      return NextResponse.json({ error: "Parámetro inválido" }, { status: 400 });
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

    await recordSecurityEvent({
      eventType: "security.config.updated",
      request,
      userId: admin.user.id,
      severity: "warning",
      metadata: { clave, valor: String(valor) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

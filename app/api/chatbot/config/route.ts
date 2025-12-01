import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET /api/chatbot/config
 * Obtiene la configuración del chatbot desde cms_tema (grupo='chatbot')
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cms_tema")
      .select("clave, valor")
      .eq("grupo", "chatbot")
      .order("clave");

    if (error) {
      console.error("Error obteniendo config:", error);
      return NextResponse.json(
        { error: "Error obteniendo configuración" },
        { status: 500 }
      );
    }

    // Convertir a objeto clave-valor
    const config = (data || []).reduce(
      (acc: Record<string, string>, item: { clave: string; valor: string }) => {
        acc[item.clave] = item.valor;
        return acc;
      },
      {} as Record<string, string>
    );

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error en GET config:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chatbot/config
 * Actualiza una o varias configuraciones del chatbot en cms_tema
 * Body: { clave: valor, clave2: valor2, ... }
 */
export async function POST(req: Request) {
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

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    // Actualizar cada configuración en cms_tema
    const updates = Object.entries(body).map(async ([clave, valor]) => {
      const { error } = await supabase.from("cms_tema").upsert(
        {
          clave,
          valor: String(valor),
          tipo: "otro",
          grupo: "chatbot",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clave" }
      );

      if (error) {
        console.error(`Error actualizando ${clave}:`, error);
        return { clave, success: false, error: error.message };
      }

      return { clave, success: true };
    });

    const results = await Promise.all(updates);
    const failed = results.filter((r) => !r.success);

    if (failed.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Algunas configuraciones no se pudieron actualizar",
          failed,
        },
        { status: 207 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Configuración actualizada",
    });
  } catch (error) {
    console.error("Error en POST config:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

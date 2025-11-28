import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/rag-utils";

// GET - Obtener contexto adicional del chatbot
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chatbot_contexto")
      .select("*")
      .eq("activo", true)
      .order("tipo", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error obteniendo contexto:", error);
    return NextResponse.json(
      { error: "Error al obtener contexto" },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar contexto
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { id, titulo, contenido, tipo, activo } = body;

    // Generar embedding automáticamente
    let embedding: number[] | null = null;
    try {
      const textForEmbedding = `${titulo} ${contenido}`;
      embedding = await generateEmbedding(textForEmbedding);
    } catch (embeddingError) {
      console.error(
        "Error generando embedding (continuando sin él):",
        embeddingError
      );
      // Continuar sin embedding - el sistema usará fallback
    }

    const contextoData: Record<string, unknown> = {
      titulo,
      contenido,
      tipo: tipo || "informacion",
      activo: activo !== false,
    };

    // Solo agregar embedding si se generó correctamente
    if (embedding) {
      contextoData.embedding = JSON.stringify(embedding);
      contextoData.embedding_updated_at = new Date().toISOString();
    }

    if (id) {
      const { error } = await supabase
        .from("chatbot_contexto")
        .update(contextoData)
        .eq("id", id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("chatbot_contexto")
        .insert(contextoData);

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      embeddingGenerated: !!embedding,
    });
  } catch (error) {
    console.error("Error guardando contexto:", error);
    return NextResponse.json(
      { error: "Error al guardar contexto" },
      { status: 500 }
    );
  }
}

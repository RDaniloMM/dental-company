import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/rag-utils";

// GET - Obtener FAQs (público para chatbot, completo para admin)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true"; // Para admin
    const categoria = searchParams.get("categoria");

    const supabase = await createClient();

    let query = supabase.from("chatbot_faqs").select("*");

    // Si no es admin request, solo mostrar activos
    if (!all) {
      query = query.eq("activo", true);
    }

    if (categoria) {
      query = query.eq("categoria", categoria);
    }

    const { data, error } = await query.order("prioridad", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error obteniendo FAQs:", error);
    return NextResponse.json(
      { error: "Error al obtener FAQs" },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar FAQ
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
    const { id, pregunta, respuesta, keywords, categoria, prioridad, activo } =
      body;

    // Procesar keywords (puede venir como string separado por comas o array)
    let keywordsArray: string[] = [];
    if (typeof keywords === "string") {
      keywordsArray = keywords
        .split(",")
        .map((k: string) => k.trim().toLowerCase())
        .filter(Boolean);
    } else if (Array.isArray(keywords)) {
      keywordsArray = keywords.map((k: string) => k.toLowerCase().trim());
    }

    // Generar embedding automáticamente
    let embedding: number[] | null = null;
    try {
      const textForEmbedding = [pregunta, respuesta, ...keywordsArray].join(" ");
      embedding = await generateEmbedding(textForEmbedding);
    } catch (embeddingError) {
      console.error("Error generando embedding (continuando sin él):", embeddingError);
      // Continuar sin embedding - el sistema usará fallback de keywords
    }

    const faqData: Record<string, unknown> = {
      pregunta,
      respuesta,
      keywords: keywordsArray,
      categoria: categoria || "general",
      prioridad: prioridad || 0,
      activo: activo !== false,
    };

    // Solo agregar embedding si se generó correctamente
    if (embedding) {
      faqData.embedding = JSON.stringify(embedding);
      faqData.embedding_updated_at = new Date().toISOString();
    }

    if (id) {
      // Actualizar existente
      const { error } = await supabase
        .from("chatbot_faqs")
        .update(faqData)
        .eq("id", id);

      if (error) throw error;
    } else {
      // Crear nuevo
      const { error } = await supabase.from("chatbot_faqs").insert(faqData);

      if (error) throw error;
    }

    return NextResponse.json({ 
      success: true,
      embeddingGenerated: !!embedding 
    });
  } catch (error) {
    console.error("Error guardando FAQ:", error);
    return NextResponse.json(
      { error: "Error al guardar FAQ" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar FAQ
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const { error } = await supabase.from("chatbot_faqs").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando FAQ:", error);
    return NextResponse.json(
      { error: "Error al eliminar FAQ" },
      { status: 500 }
    );
  }
}

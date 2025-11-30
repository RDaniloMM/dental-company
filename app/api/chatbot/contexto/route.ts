import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/rag-utils";

// GET - Obtener contexto adicional del chatbot
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    let query = supabase
      .from("chatbot_contexto")
      .select("*")
      .order("tipo", { ascending: true });

    // Si no es admin o no pide todos, solo mostrar activos
    if (!all) {
      query = query.eq("activo", true);
    }

    const { data, error } = await query;

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

    // Si solo estamos actualizando el campo 'activo' (toggle)
    if (id && titulo === undefined && contenido === undefined) {
      const { error } = await supabase
        .from("chatbot_contexto")
        .update({ activo: activo !== false })
        .eq("id", id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        toggleOnly: true,
      });
    }

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
      contextoData.embedding = `[${embedding.join(",")}]`;
      contextoData.embedding_updated_at = new Date().toISOString();
    }

    if (id) {
      const { error } = await supabase
        .from("chatbot_contexto")
        .update(contextoData)
        .eq("id", id);

      if (error) {
        console.error("Error SQL update contexto:", error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from("chatbot_contexto")
        .insert(contextoData);

      if (error) {
        console.error("Error SQL insert contexto:", error);
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      embeddingGenerated: !!embedding,
    });
  } catch (error) {
    console.error("Error guardando contexto:", error);
    return NextResponse.json(
      {
        error: "Error al guardar contexto",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar contexto
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

    const { error } = await supabase
      .from("chatbot_contexto")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando contexto:", error);
    return NextResponse.json(
      { error: "Error al eliminar contexto" },
      { status: 500 }
    );
  }
}

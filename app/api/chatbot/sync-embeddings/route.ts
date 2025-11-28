import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  syncAllFAQEmbeddings,
  updateFAQEmbedding,
  updateContextoEmbedding,
} from "@/lib/rag-utils";

export const runtime = "nodejs";
export const maxDuration = 60; // Puede tomar tiempo sincronizar todos

/**
 * POST /api/chatbot/sync-embeddings
 * Sincroniza los embeddings de FAQs y contexto
 *
 * Body opcional:
 * - type: "faq" | "contexto" | "all" (default: "all")
 * - id: string (opcional, para sincronizar un solo registro)
 */
export async function POST(req: Request) {
  try {
    // Verificar autenticación - solo admins pueden sincronizar
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { type = "all", id } = body;

    let faqsUpdated = 0;
    let faqsFailed = 0;
    let contextosUpdated = 0;
    let contextosFailed = 0;

    // Sincronizar un registro específico
    if (id) {
      if (type === "faq") {
        const success = await updateFAQEmbedding(id);
        if (success) faqsUpdated = 1;
        else faqsFailed = 1;
      } else if (type === "contexto") {
        const success = await updateContextoEmbedding(id);
        if (success) contextosUpdated = 1;
        else contextosFailed = 1;
      } else {
        return NextResponse.json(
          { error: "Tipo inválido. Use 'faq' o 'contexto'" },
          { status: 400 }
        );
      }
    } else {
      // Sincronizar todos
      if (type === "all" || type === "faq") {
        const faqResult = await syncAllFAQEmbeddings();
        faqsUpdated = faqResult.updated;
        faqsFailed = faqResult.failed;
      }

      // También sincronizar contexto si es "all" o "contexto"
      if (type === "all" || type === "contexto") {
        const { data: contextos } = await supabase
          .from("chatbot_contexto")
          .select("id")
          .eq("activo", true);

        if (contextos) {
          for (const ctx of contextos) {
            const success = await updateContextoEmbedding(ctx.id);
            if (success) contextosUpdated++;
            else contextosFailed++;
          }
        }
      }
    }

    const totalFailed = faqsFailed + contextosFailed;
    const message = `FAQs: ${faqsUpdated} actualizados, ${faqsFailed} fallidos | Contextos: ${contextosUpdated} actualizados, ${contextosFailed} fallidos`;

    return NextResponse.json({
      success: totalFailed === 0,
      faqsUpdated,
      faqsFailed,
      contextosUpdated,
      contextosFailed,
      message,
    });
  } catch (error) {
    console.error("Error en sync-embeddings:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chatbot/sync-embeddings
 * Obtiene el estado de los embeddings y sincroniza automáticamente si hay pendientes
 */
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const autoSync = searchParams.get("autoSync") === "true";

    // Primero verificar si las columnas existen
    const { error: testError } = await supabase
      .from("chatbot_faqs")
      .select("id")
      .limit(1);

    if (testError) {
      console.error("Error accediendo a chatbot_faqs:", testError);
      return NextResponse.json({
        error: "Error accediendo a la base de datos",
        details: testError.message,
        migrationNeeded: true,
      }, { status: 500 });
    }

    // Contar FAQs - intentar obtener embedding info
    const { data: faqs, error: faqError } = await supabase
      .from("chatbot_faqs")
      .select("id, embedding, embedding_updated_at, updated_at")
      .eq("activo", true);

    // Si hay error porque las columnas no existen
    if (faqError) {
      console.error("Error obteniendo FAQs con embeddings:", faqError);
      
      // Intentar sin las columnas de embedding
      const { data: faqsBasic } = await supabase
        .from("chatbot_faqs")
        .select("id")
        .eq("activo", true);

      return NextResponse.json({
        faqs: {
          total: faqsBasic?.length || 0,
          withEmbedding: 0,
          needsUpdate: faqsBasic?.length || 0,
        },
        contextos: {
          total: 0,
          withEmbedding: 0,
          needsUpdate: 0,
        },
        allSynced: false,
        migrationNeeded: true,
        migrationError: "Las columnas 'embedding' y 'embedding_updated_at' no existen. Ejecuta la migración SQL primero.",
      });
    }

    const { data: contextos } = await supabase
      .from("chatbot_contexto")
      .select("id, embedding, embedding_updated_at, updated_at")
      .eq("activo", true);

    const faqStats = {
      total: faqs?.length || 0,
      withEmbedding: faqs?.filter((f) => f.embedding).length || 0,
      needsUpdate:
        faqs?.filter((f) => {
          if (!f.embedding_updated_at) return true;
          return new Date(f.updated_at) > new Date(f.embedding_updated_at);
        }).length || 0,
    };

    const contextoStats = {
      total: contextos?.length || 0,
      withEmbedding: contextos?.filter((c) => c.embedding).length || 0,
      needsUpdate:
        contextos?.filter((c) => {
          if (!c.embedding_updated_at) return true;
          return new Date(c.updated_at) > new Date(c.embedding_updated_at);
        }).length || 0,
    };

    const allSynced =
      faqStats.needsUpdate === 0 && contextoStats.needsUpdate === 0;

    // Auto-sincronizar si se solicita y hay pendientes
    let syncResult = null;
    if (autoSync && !allSynced) {
      const faqResult = await syncAllFAQEmbeddings();

      let ctxUpdated = 0;
      let ctxFailed = 0;
      if (contextos) {
        for (const ctx of contextos) {
          if (
            !ctx.embedding ||
            new Date(ctx.updated_at) > new Date(ctx.embedding_updated_at || 0)
          ) {
            const success = await updateContextoEmbedding(ctx.id);
            if (success) ctxUpdated++;
            else ctxFailed++;
          }
        }
      }

      syncResult = {
        faqsUpdated: faqResult.updated,
        faqsFailed: faqResult.failed,
        contextosUpdated: ctxUpdated,
        contextosFailed: ctxFailed,
      };
    }

    return NextResponse.json({
      faqs: faqStats,
      contextos: contextoStats,
      allSynced:
        allSynced ||
        (syncResult &&
          syncResult.faqsFailed === 0 &&
          syncResult.contextosFailed === 0),
      syncResult,
    });
  } catch (error) {
    console.error("Error obteniendo estado de embeddings:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

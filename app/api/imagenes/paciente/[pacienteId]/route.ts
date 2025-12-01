import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pacienteId: string }> }
) {
  try {
    const { pacienteId } = await params;
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener parámetros de filtro
    const url = new URL(req.url);
    const casoId = url.searchParams.get("casoId");
    const etapa = url.searchParams.get("etapa");

    let query = supabase
      .from("imagenes_pacientes")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("fecha_subida", { ascending: false });

    // Filtrar por caso si se proporciona
    if (casoId) {
      query = query.eq("caso_id", casoId);
    }

    // Filtrar por etapa si se proporciona
    if (etapa) {
      query = query.eq("etapa", etapa);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error obteniendo imágenes:", error);
      return NextResponse.json(
        { error: "Error al obtener las imágenes" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

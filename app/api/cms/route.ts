import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Obtener contenido del CMS para la landing page
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const seccion = searchParams.get("seccion");
    const admin = searchParams.get("admin") === "true"; // Para obtener todos los registros

    const supabase = await createClient();

    // Si se especifica una sección, obtener solo esa
    if (seccion) {
      const { data, error } = await supabase
        .from("cms_secciones")
        .select("*")
        .eq("seccion", seccion)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    // Obtener todas las secciones visibles
    const { data: secciones, error: seccionesError } = await supabase
      .from("cms_secciones")
      .select("*")
      .eq("visible", true)
      .order("orden", { ascending: true });

    if (seccionesError) throw seccionesError;

    // Obtener servicios (todos si admin, solo visibles si no)
    let serviciosQuery = supabase.from("cms_servicios").select("*");
    if (!admin) serviciosQuery = serviciosQuery.eq("visible", true);
    const { data: servicios, error: serviciosError } =
      await serviciosQuery.order("orden", { ascending: true });

    if (serviciosError) throw serviciosError;

    // Obtener equipo (todos si admin, solo visibles si no)
    let equipoQuery = supabase.from("cms_equipo").select("*");
    if (!admin) equipoQuery = equipoQuery.eq("visible", true);
    const { data: equipo, error: equipoError } = await equipoQuery.order(
      "orden",
      { ascending: true }
    );

    if (equipoError) throw equipoError;

    // Obtener imágenes del carrusel
    const { data: carrusel, error: carruselError } = await supabase
      .from("cms_carrusel")
      .select("*")
      .eq("visible", true)
      .order("orden", { ascending: true });

    if (carruselError) throw carruselError;

    // Obtener configuración del tema
    const { data: tema, error: temaError } = await supabase
      .from("cms_tema")
      .select("*");

    if (temaError) throw temaError;

    // Convertir tema a objeto clave-valor
    const temaConfig = tema.reduce((acc, item) => {
      acc[item.clave] = item.valor;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      secciones,
      servicios,
      equipo,
      carrusel,
      tema: temaConfig,
    });
  } catch (error) {
    console.error("Error obteniendo CMS:", error);
    return NextResponse.json(
      { error: "Error al obtener contenido" },
      { status: 500 }
    );
  }
}

// POST - Actualizar contenido del CMS (requiere auth)
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { tipo, data } = body;

    switch (tipo) {
      case "seccion":
        const { error: seccionError } = await supabase
          .from("cms_secciones")
          .upsert(
            {
              ...data,
              updated_by: user.id,
            },
            { onConflict: "seccion" }
          );
        if (seccionError) throw seccionError;
        break;

      case "servicio":
        if (data.id) {
          const { error } = await supabase
            .from("cms_servicios")
            .update(data)
            .eq("id", data.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("cms_servicios").insert(data);
          if (error) throw error;
        }
        break;

      case "equipo":
        if (data.id) {
          const { error } = await supabase
            .from("cms_equipo")
            .update(data)
            .eq("id", data.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("cms_equipo").insert(data);
          if (error) throw error;
        }
        break;

      case "carrusel":
        if (data.id) {
          const { error } = await supabase
            .from("cms_carrusel")
            .update(data)
            .eq("id", data.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("cms_carrusel").insert(data);
          if (error) throw error;
        }
        break;

      case "tema":
        const { error: temaError } = await supabase
          .from("cms_tema")
          .upsert(data, { onConflict: "clave" });
        if (temaError) throw temaError;
        break;

      default:
        return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando CMS:", error);
    return NextResponse.json(
      { error: "Error al actualizar contenido" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar elemento del CMS (soft delete para equipo)
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
    const tipo = searchParams.get("tipo");
    const id = searchParams.get("id");
    const permanent = searchParams.get("permanent") === "true"; // Para eliminación permanente opcional

    if (!tipo || !id) {
      return NextResponse.json(
        { error: "Tipo e ID requeridos" },
        { status: 400 }
      );
    }

    const tableMap: Record<string, string> = {
      servicio: "cms_servicios",
      equipo: "cms_equipo",
      carrusel: "cms_carrusel",
    };

    const table = tableMap[tipo];
    if (!table) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    // Para equipo y servicios: soft delete (solo ocultar) a menos que sea permanente
    if ((tipo === "equipo" || tipo === "servicio") && !permanent) {
      const { error } = await supabase
        .from(table)
        .update({ visible: false })
        .eq("id", id);

      if (error) throw error;
      return NextResponse.json({ success: true, softDelete: true });
    }

    // Para otros tipos o eliminación permanente: eliminar de la BD
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando elemento:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

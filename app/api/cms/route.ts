import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/security/auth";
import { recordSecurityEvent } from "@/lib/security/events";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { NextResponse } from "next/server";

// GET - Obtener contenido del CMS para la landing page
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const seccion = searchParams.get("seccion");
    const adminView = searchParams.get("admin") === "true"; // Para obtener todos los registros

    const supabase = await createClient();

    if (adminView) {
      const admin = await requireAdmin(supabase);
      if (admin.ok === false) return admin.response;
    }

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
    if (!adminView) serviciosQuery = serviciosQuery.eq("visible", true);
    const { data: servicios, error: serviciosError } =
      await serviciosQuery.order("orden", { ascending: true });

    if (serviciosError) throw serviciosError;

    // Obtener equipo (todos si admin, solo visibles si no)
    let equipoQuery = supabase.from("cms_equipo").select("*");
    if (!adminView) equipoQuery = equipoQuery.eq("visible", true);
    const { data: equipo, error: equipoError } = await equipoQuery.order(
      "orden",
      { ascending: true }
    );

    if (equipoError) throw equipoError;

    // Obtener imágenes del carrusel (todos si admin, solo visibles si no)
    let carruselQuery = supabase.from("cms_carrusel").select("*");
    if (!adminView) carruselQuery = carruselQuery.eq("visible", true);
    const { data: carrusel, error: carruselError } = await carruselQuery.order(
      "orden",
      { ascending: true }
    );

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
    const sameOriginError = requireSameOrigin(req);
    if (sameOriginError) return sameOriginError;

    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    const body = await req.json();
    const { tipo, data } = body;

    let beforeRecord: Record<string, unknown> | null = null;
    const updateTableMap: Record<string, string> = {
      carrusel: "cms_carrusel",
      equipo: "cms_equipo",
      servicio: "cms_servicios",
    };

    if (data?.id && updateTableMap[tipo]) {
      const { data: existingRecord } = await supabase
        .from(updateTableMap[tipo])
        .select("*")
        .eq("id", data.id)
        .maybeSingle();
      beforeRecord = existingRecord;
    }

    switch (tipo) {
      case "seccion":
        const { error: seccionError } = await supabase
          .from("cms_secciones")
          .upsert(
            {
              ...data,
              updated_by: admin.user.id,
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

    await recordSecurityEvent({
      eventType: `cms.${tipo}.updated`,
      request: req,
      userId: admin.user.id,
      severity: tipo === "equipo" ? "warning" : "info",
      metadata: {
        clinic_area: tipo === "equipo" ? "equipo_publico" : "cms",
        entity_type: tipo,
        target_name_after: data?.nombre || data?.titulo || data?.seccion || null,
        target_name_before:
          (beforeRecord as Record<string, unknown> | null)?.nombre ||
          (beforeRecord as Record<string, unknown> | null)?.titulo ||
          (beforeRecord as Record<string, unknown> | null)?.seccion ||
          null,
        after: data,
        before: beforeRecord,
        tipo,
      },
    });

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
    const sameOriginError = requireSameOrigin(req);
    if (sameOriginError) return sameOriginError;

    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

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

    const { data: existingRecord } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();

    // Para equipo y servicios: soft delete (solo ocultar) a menos que sea permanente
    if ((tipo === "equipo" || tipo === "servicio") && !permanent) {
      const { error } = await supabase
        .from(table)
        .update({ visible: false })
        .eq("id", id);

      if (error) throw error;

      await recordSecurityEvent({
        eventType: `cms.${tipo}.hidden`,
        request: req,
        userId: admin.user.id,
        severity: tipo === "equipo" ? "warning" : "info",
        metadata: {
          clinic_area: tipo === "equipo" ? "equipo_publico" : "cms",
          entity_type: tipo,
          before: existingRecord,
          id,
          tipo,
        },
      });

      return NextResponse.json({ success: true, softDelete: true });
    }

    // Para otros tipos o eliminación permanente: eliminar de la BD
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw error;

    await recordSecurityEvent({
      eventType: `cms.${tipo}.deleted`,
      request: req,
      userId: admin.user.id,
      severity: tipo === "equipo" ? "warning" : "info",
      metadata: {
        clinic_area: tipo === "equipo" ? "equipo_publico" : "cms",
        entity_type: tipo,
        before: existingRecord,
        id,
        permanent,
        tipo,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando elemento:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

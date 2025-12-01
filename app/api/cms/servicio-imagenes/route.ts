import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

/**
 * GET /api/cms/servicio-imagenes
 * Obtiene las imágenes de un servicio o todas
 * Query params: servicioId (opcional)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const servicioId = searchParams.get("servicioId");
    const all = searchParams.get("all") === "true";

    const supabase = await createClient();

    let query = supabase
      .from("cms_servicio_imagenes")
      .select("*")
      .order("orden", { ascending: true });

    if (servicioId) {
      query = query.eq("servicio_id", servicioId);
    }

    // Solo mostrar visibles a menos que sea admin pidiendo todas
    if (!all) {
      query = query.eq("visible", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error obteniendo imágenes de servicio:", error);
      return NextResponse.json(
        { error: "Error al obtener imágenes" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error en GET servicio-imagenes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cms/servicio-imagenes
 * Sube una nueva imagen para un servicio
 * Body: FormData con file, servicioId, descripcion, altText
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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const servicioId = formData.get("servicioId") as string;
    const descripcion = formData.get("descripcion") as string | null;
    const altText = formData.get("altText") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    if (!servicioId) {
      return NextResponse.json(
        { error: "servicioId es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el servicio existe
    const { data: servicio, error: servicioError } = await supabase
      .from("cms_servicios")
      .select("id, nombre")
      .eq("id", servicioId)
      .single();

    if (servicioError || !servicio) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // Obtener el orden máximo actual para este servicio
    const { data: maxOrden } = await supabase
      .from("cms_servicio_imagenes")
      .select("orden")
      .eq("servicio_id", servicioId)
      .order("orden", { ascending: false })
      .limit(1)
      .single();

    const nuevoOrden = (maxOrden?.orden || 0) + 1;

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar ID único para la imagen
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 20);
    const publicId = `servicio_${servicioId.substring(
      0,
      8
    )}_${sanitizedName}_${timestamp}`;

    // Subir imagen a Cloudinary
    const folder = "dental_company/servicios";
    const result = await uploadImage(buffer, folder, publicId, "carrusel");

    // Guardar en la base de datos
    const { data: imagen, error: insertError } = await supabase
      .from("cms_servicio_imagenes")
      .insert({
        servicio_id: servicioId,
        imagen_url: result.secure_url,
        public_id: result.public_id,
        descripcion: descripcion || null,
        alt_text: altText || servicio.nombre,
        orden: nuevoOrden,
        visible: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error guardando imagen:", insertError);
      // Intentar eliminar la imagen subida si falla el guardado
      if (result.public_id) {
        await deleteImage(result.public_id);
      }
      return NextResponse.json(
        { error: "Error al guardar imagen" },
        { status: 500 }
      );
    }

    return NextResponse.json(imagen);
  } catch (error) {
    console.error("Error en POST servicio-imagenes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cms/servicio-imagenes
 * Actualiza una imagen (descripcion, altText, orden, visible)
 */
export async function PUT(req: Request) {
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
    const { id, descripcion, altText, orden, visible } = body;

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (altText !== undefined) updateData.alt_text = altText;
    if (orden !== undefined) updateData.orden = orden;
    if (visible !== undefined) updateData.visible = visible;

    const { data, error } = await supabase
      .from("cms_servicio_imagenes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error actualizando imagen:", error);
      return NextResponse.json(
        { error: "Error al actualizar imagen" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en PUT servicio-imagenes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/servicio-imagenes
 * Elimina una imagen
 * Query params: id
 */
export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }

    // Obtener la imagen para conseguir el public_id
    const { data: imagen, error: fetchError } = await supabase
      .from("cms_servicio_imagenes")
      .select("public_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error obteniendo imagen:", fetchError);
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar de Cloudinary si tiene public_id
    if (imagen?.public_id) {
      const deleteResult = await deleteImage(imagen.public_id);
      if (!deleteResult.success) {
        console.warn("No se pudo eliminar de Cloudinary:", deleteResult.error);
      }
    }

    // Eliminar de la base de datos
    const { error: deleteError } = await supabase
      .from("cms_servicio_imagenes")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error eliminando imagen:", deleteError);
      return NextResponse.json(
        { error: "Error al eliminar imagen" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE servicio-imagenes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

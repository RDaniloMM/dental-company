import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const casoId = formData.get("caso_id") as string;
    const tipo = formData.get("tipo") as string;
    const titulo = formData.get("titulo") as string | null;
    const descripcion = formData.get("descripcion") as string | null;
    const fechaCaptura = formData.get("fecha_captura") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    if (!casoId) {
      return NextResponse.json(
        { error: "No se proporcionó ID del caso" },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 10MB para imágenes clínicas)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo excede el tamaño máximo de 10MB" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no válido. Use JPG, PNG o WebP" },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar ID único para la imagen
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 20);
    const publicId = `${sanitizedName}_${timestamp}`;

    // Subir a Cloudinary - usar tipo "paciente" para mejor calidad (radiografías, etc.)
    const folder = `dental_company/casos/${casoId}`;
    const result = await uploadImage(buffer, folder, publicId, "paciente");

    // Guardar referencia en la base de datos
    const { data: imagen, error: dbError } = await supabase
      .from("seguimiento_imagenes")
      .insert({
        caso_id: casoId,
        url: result.secure_url,
        ruta: result.secure_url,
        public_id: result.public_id,
        titulo: titulo || null,
        descripcion: descripcion || null,
        tipo: tipo || "general",
        fecha_captura: fechaCaptura || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error guardando en BD:", dbError);
      // Intentar eliminar la imagen de Cloudinary si falla la BD
      try {
        await deleteImage(result.public_id);
      } catch (e) {
        console.error("Error eliminando imagen de Cloudinary:", e);
      }
      return NextResponse.json(
        { error: "Error al guardar la imagen en la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: imagen.id,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const imagenId = searchParams.get("id");
    const publicId = searchParams.get("public_id");

    if (!imagenId) {
      return NextResponse.json(
        { error: "No se proporcionó ID de imagen" },
        { status: 400 }
      );
    }

    // Eliminar de Cloudinary si tiene public_id
    if (publicId) {
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error("Error eliminando imagen de Cloudinary:", error);
        // Continuar aunque falle la eliminación
      }
    }

    // Eliminar de la base de datos
    const { error: dbError } = await supabase
      .from("seguimiento_imagenes")
      .delete()
      .eq("id", imagenId);

    if (dbError) {
      console.error("Error eliminando de BD:", dbError);
      return NextResponse.json(
        { error: "Error al eliminar la imagen" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando imagen:", error);
    return NextResponse.json(
      { error: "Error al eliminar la imagen" },
      { status: 500 }
    );
  }
}

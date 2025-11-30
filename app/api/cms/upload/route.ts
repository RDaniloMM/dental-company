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
    const tipo = formData.get("tipo") as string; // 'equipo' | 'carrusel'
    const oldPublicId = formData.get("old_public_id") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo excede el tamaño máximo de 5MB" },
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

    // Eliminar imagen anterior si existe
    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId);
      } catch (error) {
        console.error("Error eliminando imagen anterior:", error);
        // Continuar aunque falle la eliminación
      }
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

    // Subir a Cloudinary con optimización según tipo
    let folder: string;
    let tipoImagen: "perfil" | "carrusel" | "general" | "paciente";

    switch (tipo) {
      case "equipo":
        folder = "dental_company/equipo";
        tipoImagen = "perfil";
        break;
      case "casos":
        folder = "dental_company/casos";
        tipoImagen = "general";
        break;
      case "pacientes":
        folder = "dental_company/pacientes";
        tipoImagen = "paciente";
        break;
      case "servicios":
        folder = "dental_company/servicios";
        tipoImagen = "general";
        break;
      default:
        folder = "dental_company/carrusel";
        tipoImagen = "carrusel";
    }

    const result = await uploadImage(buffer, folder, publicId, tipoImagen);

    return NextResponse.json({
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

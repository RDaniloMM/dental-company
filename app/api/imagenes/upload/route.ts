import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

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
    const pacienteId = formData.get("paciente_id") as string;
    const tipo = formData.get("tipo") as string;
    const descripcion = formData.get("descripcion") as string | null;
    const casoId = formData.get("caso_id") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    if (!pacienteId) {
      return NextResponse.json(
        { error: "No se proporcionó ID de paciente" },
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

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar ID único para la imagen
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 20);
    const publicId = `${sanitizedName}_${timestamp}`;

    // Subir a Cloudinary
    const folder = `dental_company/pacientes/${pacienteId}`;
    const result = await uploadImage(buffer, folder, publicId, "paciente");

    // Guardar referencia en la base de datos
    const insertData: {
      paciente_id: string;
      public_id: string;
      url: string;
      tipo: string;
      descripcion?: string;
      caso_id?: string;
    } = {
      paciente_id: pacienteId,
      public_id: result.public_id,
      url: result.secure_url,
      tipo: tipo || "otro",
    };

    if (descripcion) {
      insertData.descripcion = descripcion;
    }

    if (casoId) {
      insertData.caso_id = casoId;
    }

    const { data: imagen, error: dbError } = await supabase
      .from("imagenes_paciente")
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error("Error guardando en BD:", dbError);
      return NextResponse.json(
        { error: "Error al guardar la imagen en la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: imagen.id,
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

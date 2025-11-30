import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { deleteImage } from "@/lib/cloudinary";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener la imagen para conseguir el public_id
    const { data: imagen, error: fetchError } = await supabase
      .from("imagenes_paciente")
      .select("public_id")
      .eq("id", id)
      .single();

    if (fetchError || !imagen) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar de Cloudinary
    try {
      await deleteImage(imagen.public_id);
    } catch (cloudinaryError) {
      console.error("Error eliminando de Cloudinary:", cloudinaryError);
      // Continuar aunque falle en Cloudinary
    }

    // Eliminar de la base de datos
    const { error: deleteError } = await supabase
      .from("imagenes_paciente")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error eliminando de BD:", deleteError);
      return NextResponse.json(
        { error: "Error al eliminar la imagen" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

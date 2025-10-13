import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { deleteImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: imageId } = await params;

  if (!imageId) {
    return NextResponse.json(
      { error: 'El ID de la imagen es requerido.' },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  try {
    // 1. Obtener el public_id de la imagen desde Supabase
    const { data: imageData, error: fetchError } = await supabase
      .from('imagenes_pacientes')
      .select('public_id')
      .eq('id', imageId)
      .single();

    if (fetchError || !imageData) {
      throw new Error('No se encontró la imagen en la base de datos.');
    }

    // 2. Eliminar la imagen de Cloudinary
    const deleteResult = await deleteImage(imageData.public_id);

    if (deleteResult.result !== 'ok') {
      // Aún si falla en Cloudinary, intentamos borrar de Supabase
      console.warn(`No se pudo eliminar la imagen de Cloudinary: ${imageData.public_id}`);
    }

    // 3. Eliminar el registro de Supabase
    const { error: deleteError } = await supabase
      .from('imagenes_pacientes')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      throw new Error('Error al eliminar el registro de la imagen en la base de datos.');
    }

    return NextResponse.json({ message: 'Imagen eliminada correctamente.' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

interface UploadResult {
  public_id: string;
  secure_url: string;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const paciente_id = formData.get('paciente_id') as string;
  const tipo = formData.get('tipo') as string;
  const descripcion = formData.get('descripcion') as string;

  if (!file || !paciente_id || !tipo) {
    return NextResponse.json({ error: 'Faltan datos requeridos.' }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) { // 5 MB
    return NextResponse.json({ error: 'El archivo excede el tamaño máximo de 5 MB.' }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    // 1. Obtener el número de historia del paciente
    const { data: paciente, error: pacienteError } = await supabase
      .from('pacientes')
      .select('numero_historia')
      .eq('id', paciente_id)
      .single();

    if (pacienteError || !paciente) {
      throw new Error('No se pudo encontrar al paciente.');
    }

    const { numero_historia } = paciente;

    // 2. Preparar la subida a Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = new Date().toISOString(); // Full ISO string for uniqueness
    
    const folder = `${numero_historia}/${tipo}`;
    // Use timestamp to ensure a unique public_id for every upload
    const publicId = `${numero_historia}_${tipo}_${timestamp}`;

    // 3. Subir imagen a Cloudinary
    const uploadResult: UploadResult = await uploadImage(buffer, folder, publicId);

    if (!uploadResult || !uploadResult.public_id) {
        throw new Error('Error al subir la imagen a Cloudinary.');
    }

    // 4. Guardar registro en Supabase
    const { data: newImageRecord, error: insertError } = await supabase
      .from('imagenes_pacientes')
      .insert({
        paciente_id,
        tipo,
        descripcion,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error al guardar en Supabase:', insertError);
      throw new Error('Error al guardar la información de la imagen.');
    }

    return NextResponse.json(newImageRecord);
  } catch (error: unknown) {
    console.error('Error en el proceso de subida:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

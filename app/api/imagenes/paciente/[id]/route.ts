import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const paciente_id = resolvedParams.id;
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo');

  if (!paciente_id) {
    return NextResponse.json(
      { error: 'El ID del paciente es requerido.' },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  try {
    let query = supabase
      .from('imagenes_pacientes')
      .select('*')
      .eq('paciente_id', paciente_id)
      .order('fecha_subida', { ascending: false });

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al obtener imágenes:', error);
      throw new Error('No se pudieron obtener las imágenes del paciente.');
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const casoId = formData.get('caso_id') as string
    const pacienteId = formData.get('paciente_id') as string
    const numeroHistoria = formData.get('numero_historia') as string
    
    const descripcion = formData.get('descripcion') as string
    const tipo = formData.get('tipo') as string
    const etapa = formData.get('etapa') as string
    const fechaCaptura = formData.get('fecha_captura') as string

    if (!file || !casoId || !pacienteId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const folder = `dental_company/pacientes/${numeroHistoria}/${casoId}/galeria`

    const uploadResponse = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error)
            const r = result as UploadApiResponse | undefined
            if (!r) return reject(new Error('No result from Cloudinary'))
            resolve({ secure_url: String(r.secure_url || ''), public_id: String(r.public_id || '') })
          }
        ).end(buffer)
    })

    // Siempre guardamos las nuevas subidas desde la galería en 'imagenes_pacientes'
    const { data, error } = await supabase
      .from('imagenes_pacientes')
      .insert({
        paciente_id: pacienteId,
        caso_id: casoId,
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
        tipo,
        etapa,
        descripcion,
        fecha_captura: fechaCaptura || new Date().toISOString(),
        fecha_subida: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Imagen subida' }, { status: 201 })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const publicId = searchParams.get('public_id')
    const origen = searchParams.get('origen') || 'galeria' // Detectar tabla

    if (!id || !publicId) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    await cloudinary.uploader.destroy(publicId)

    // Seleccionar tabla correcta
    const tabla = origen === 'seguimiento' ? 'seguimiento_imagenes' : 'imagenes_pacientes'

    const { error } = await supabase
      .from(tabla)
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Eliminado correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
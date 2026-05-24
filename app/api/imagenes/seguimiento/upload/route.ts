import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { uploadImage, deleteImage } from '@/lib/imagekit'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const tipos = formData.getAll('tipos') as string[]
    const etapas = formData.getAll('etapas') as string[]
    const descripciones = formData.getAll('descripciones') as string[]
    
    const seguimientoId = formData.get('seguimiento_id') as string
    const casoId = formData.get('caso_id') as string
    const numeroHistoria = formData.get('numero_historia') as string

    if (!files || files.length === 0 || !seguimientoId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const uploadPromises = files.map(async (file, index) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const tipoImagen = tipos[index] || 'evidencia'
      const folder = `dental_company/pacientes/${numeroHistoria}/${casoId}/${seguimientoId}/${tipoImagen}`

      const result = await uploadImage(buffer, folder, `${file.name}_${Date.now()}`, 'paciente')
      return { ...result, index }
    })

    const imageKitResults = await Promise.all(uploadPromises)

    const recordsToInsert = imageKitResults.map((result) => ({
      caso_id: casoId,
      seguimiento_id: seguimientoId,
      imagen_url: result.secure_url,
      public_id: result.public_id,
      tipo: tipos[result.index] || 'evidencia',
      etapa: etapas[result.index] || 'seguimiento',
      descripcion: descripciones[result.index] || '',
      fecha_captura: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('seguimiento_imagenes')
      .insert(recordsToInsert)
      .select()

    if (error) {
        await Promise.all(imageKitResults.map(r => deleteImage(r.public_id)))
        throw new Error(`Error BD: ${error.message}`)
    }

    revalidatePath(`/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/imagenes`)
    revalidatePath(`/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/seguimiento`)

    return NextResponse.json({ data, message: 'Imágenes subidas' }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const imagenId = searchParams.get('id')
    const publicId = searchParams.get('public_id')

    if (!imagenId) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    if (publicId) await deleteImage(publicId)

    const { error } = await supabase
      .from('seguimiento_imagenes')
      .delete()
      .eq('id', imagenId)

    if (error) throw error

    return NextResponse.json({ message: 'Imagen eliminada' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar imagen' }, { status: 500 })
  }
}

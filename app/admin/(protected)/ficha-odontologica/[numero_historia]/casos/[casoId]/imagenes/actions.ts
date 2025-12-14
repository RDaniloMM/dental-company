'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_noStore } from 'next/cache'

export async function getImagenesCaso(casoId: string) {
  unstable_noStore() 
  const supabase = await createClient()
  
  const { data: galeria } = await supabase
    .from('imagenes_pacientes')
    .select('id, url, public_id, tipo, etapa, descripcion, fecha_captura, fecha_subida')
    .eq('caso_id', casoId)

  const { data: seguimientosActivos } = await supabase
    .from('seguimientos')
    .select('id')
    .eq('caso_id', casoId)
    .is('deleted_at', null)

  const idsSeguimientosActivos = seguimientosActivos?.map(s => s.id) || []

  interface SeguimientoImagenRaw {
    id: string
    imagen_url?: string | null
    public_id?: string | null
    tipo?: string | null
    etapa?: string | null
    descripcion?: string | null
    fecha_captura?: string | null
    created_at?: string | null
  }

  let imagenesSeguimiento: Array<SeguimientoImagenRaw & { seguimiento_id: string }> = []

  if (idsSeguimientosActivos.length > 0) {
    const { data: imgs } = await supabase
      .from('seguimiento_imagenes')
      .select('id, imagen_url, public_id, tipo, etapa, descripcion, fecha_captura, created_at, seguimiento_id')
      .in('seguimiento_id', idsSeguimientosActivos)
    
    imagenesSeguimiento = (imgs || []) as unknown as Array<SeguimientoImagenRaw & { seguimiento_id: string }>
  }

  const seguimientosNormalizados = imagenesSeguimiento.map((img) => ({
    id: img.id,
    url: img.imagen_url,
    public_id: img.public_id,
    tipo: img.tipo || 'evidencia',
    etapa: img.etapa || 'seguimiento', 
    descripcion: img.descripcion || 'Imagen de seguimiento',
    fecha_captura: img.fecha_captura || img.created_at,
    fecha_subida: img.created_at,
    origen: 'seguimiento',
    seguimiento_id: img.seguimiento_id
  }))

  const galeriaNormalizada = (galeria || []).map((img) => ({
    ...img,
    origen: 'galeria'
  }))

  const todasLasImagenes = [...galeriaNormalizada, ...seguimientosNormalizados].sort((a, b) => {
    const dateA = new Date(a.fecha_captura || a.fecha_subida).getTime()
    const dateB = new Date(b.fecha_captura || b.fecha_subida).getTime()
    return dateB - dateA
  })
  
  return todasLasImagenes
}

export async function updateImagenMetadata(
  id: string, 
  data: { descripcion?: string; tipo?: string; etapa?: string; fecha_captura?: string },
  origen: string
) {
  const supabase = await createClient()
  const tabla = origen === 'seguimiento' ? 'seguimiento_imagenes' : 'imagenes_pacientes'
  
  const payload: Record<string, unknown> = {}
  if (data.descripcion !== undefined) payload.descripcion = data.descripcion
  if (data.tipo !== undefined) payload.tipo = data.tipo
  if (data.fecha_captura !== undefined) payload.fecha_captura = data.fecha_captura
  
  if (data.etapa !== undefined) {
      payload.etapa = data.etapa
  }

  const { error } = await supabase
    .from(tabla)
    .update(payload)
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/ficha-odontologica', 'layout')
  return { success: true }
}
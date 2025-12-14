'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type SeguimientoUpdateDTO = {
  descripcion?: string
  estado?: string
  proxima_cita?: string | null
  titulo?: string
}

export type SeguimientoCreateDTO = {
  caso_id: string
  descripcion: string
  estado?: string
  proxima_cita?: string | null
  titulo?: string
}

export async function getSeguimiento(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('seguimientos')
    .select(`
      *,
      pagos(id, monto, fecha_pago),
      seguimiento_imagenes(id, imagen_url, public_id),
      presupuestos(id, nombre, moneda_id),
      citas:proxima_cita_id(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getSeguimientos(casoId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('seguimientos')
    .select(`
      *,
      pagos(id, monto, fecha_pago, monedas(simbolo, codigo)),
      seguimiento_imagenes(id, imagen_url, public_id),
      presupuestos(id, nombre, costo_total, total_pagado, monedas(simbolo, codigo)),
      citas:proxima_cita_id(id, fecha_inicio, estado),
      personal:creador_personal_id(nombre_completo)
    `)
    .eq('caso_id', casoId)
    .is('deleted_at', null)
    .order('fecha', { ascending: false })

  if (error) throw error
  return data
}

export async function createSeguimiento(data: SeguimientoCreateDTO) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: result, error } = await supabase
    .from('seguimientos')
    .insert({
      caso_id: data.caso_id,
      descripcion: data.descripcion,
      proxima_cita_id: null,
      titulo: data.titulo || data.descripcion,
      estado: data.estado || 'activo',
      fecha: new Date().toISOString(),
      creador_personal_id: user?.id
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath('/admin/ficha-odontologica')
  return result
}

export async function updateSeguimiento(id: string, data: SeguimientoUpdateDTO) {
  const supabase = await createClient()
  
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }
  
  if (data.descripcion !== undefined) payload.descripcion = data.descripcion
  if (data.estado !== undefined) payload.estado = data.estado
  if (data.titulo !== undefined) payload.titulo = data.titulo

  const { data: result, error } = await supabase
    .from('seguimientos')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/admin/ficha-odontologica')
  return result
}

export async function deleteSeguimiento(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { error } = await supabase
    .from('seguimientos')
    .update({ 
      deleted_at: new Date().toISOString(),
      deleted_by: user?.id 
    })
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/admin/ficha-odontologica')
}
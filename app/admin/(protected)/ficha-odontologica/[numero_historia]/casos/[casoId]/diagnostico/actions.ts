'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const diagnosticoSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  caso_id: z.string().uuid(),
  odontologo_id: z.string().uuid().optional().nullable(),
  tipo: z.string().min(1, 'El tipo es requerido'),
  nombre: z.string().min(3, 'La descripción es requerida'),
})

export async function upsertDiagnostico(formData: unknown) {
  const supabase = await createClient()
  
  const parsedData = diagnosticoSchema.safeParse(formData)

  if (!parsedData.success) {
    return { error: { message: 'Datos inválidos' } }
  }

  const { id, ...dataToUpsert } = parsedData.data
  const { data: { user } } = await supabase.auth.getUser()

  if (!dataToUpsert.odontologo_id) {
      dataToUpsert.odontologo_id = user?.id
  }

  try {
    if (id) {
      const { error } = await supabase.from('diagnosticos').update(dataToUpsert).eq('id', id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('diagnosticos').insert(dataToUpsert)
      if (error) throw error
    }
    revalidatePath('/admin/ficha-odontologica')
    return { success: true }
  } catch (error) {
    return { error: { message: 'Error al guardar diagnóstico' } }
  }
}

export async function checkDiagnosticoUso(diagnosticoId: string) {
  const supabase = await createClient()
  try {
    const { count, error } = await supabase
      .from('presupuesto_diagnosticos')
      .select('presupuesto_id', { count: 'exact', head: true })
      .eq('diagnostico_id', diagnosticoId)

    if (error) return { count: 0, error: error.message }
    return { count: count || 0 }
  } catch (err) {
    return { count: 0, error: 'Error desconocido' }
  }
}

export async function deleteDiagnostico(id: string) {
  const supabase = await createClient()
  
  const { count } = await supabase
      .from('presupuesto_diagnosticos')
      .select('presupuesto_id', { count: 'exact', head: true })
      .eq('diagnostico_id', id)
  
  if (count && count > 0) {
      return { error: { message: 'No se puede eliminar: El diagnóstico está en uso' } }
  }

  const { error } = await supabase.from('diagnosticos').delete().eq('id', id)
  if (error) return { error: { message: error.message } }
  
  revalidatePath('/admin/ficha-odontologica')
  return { success: true }
}
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const diagnosticoSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  caso_id: z.string().uuid(),
  odontologo_id: z.string().uuid(),
  tipo: z.string().min(1, 'El tipo es requerido.'),
  cie10_id: z.string().min(1, 'El diagnóstico CIE10 es requerido.'),
})

export async function upsertDiagnostico(formData: unknown) {
  const supabase = await createClient()
  
  const parsedData = diagnosticoSchema.safeParse(formData)

  if (!parsedData.success) {
    return { error: { message: 'Datos inválidos.', issues: parsedData.error.issues } }
  }

  const { id, ...dataToUpsert } = parsedData.data

  try {
    if (id) {
      const { error } = await supabase
        .from('diagnosticos')
        .update(dataToUpsert)
        .eq('id', id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('diagnosticos')
        .insert(dataToUpsert)
      if (error) throw error
    }
    revalidatePath('/admin/ficha-odontologica')
    return { success: true }
  } catch (error) {
    console.error('Error en upsertDiagnostico:', error)
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido'
    function extractErrorInfo(err: unknown): { details?: string; code?: string | number } {
      if (err && typeof err === 'object') {
        const obj = err as Record<string, unknown>
        const details = typeof obj.details === 'string' ? obj.details : undefined
        const code = typeof obj.code === 'string' || typeof obj.code === 'number' ? (obj.code as string | number) : undefined
        return { details, code }
      }
      return {}
    }

    const { details, code } = extractErrorInfo(error)
    return { error: { message: `Error al guardar el diagnóstico: ${errorMessage}`, details, code } }
  }
}

export async function deleteDiagnostico(id: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('diagnosticos')
      .delete()
      .eq('id', id)
    
    if (error) throw error

    revalidatePath('/admin/ficha-odontologica/')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido'
    return { error: { message: `Error al eliminar el diagnóstico: ${errorMessage}` } }
  }
}

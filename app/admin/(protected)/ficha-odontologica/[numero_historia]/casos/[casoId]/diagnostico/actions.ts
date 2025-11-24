'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const diagnosticoSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  caso_id: z.string().uuid(),
  odontologo_id: z.string().uuid().optional().nullable(),
  tipo: z.string().min(1, 'El tipo es requerido.'),
  // cie10_id puede venir como string (del cliente), número (id entero) o null
  cie10_id: z.union([z.string(), z.number()]).optional().nullable(),
})

export async function upsertDiagnostico(formData: unknown) {
  const supabase = await createClient()
  
  const parsedData = diagnosticoSchema.safeParse(formData)

  if (!parsedData.success) {
    return { error: { message: 'Datos inválidos.', issues: parsedData.error.issues } }
  }

  const { id, ...dataToUpsert } = parsedData.data

  // Normalizar valores para evitar enviar cadenas vacías a columnas numéricas/uuid
  const normalized: Record<string, unknown> = { ...dataToUpsert }
  // cie10_id en la DB es integer; si recibimos cadena vacía -> null, si recibimos string numérica -> convertir a integer
  if (typeof normalized.cie10_id === 'string') {
    const raw = (normalized.cie10_id as string).trim()
    if (raw === '') normalized.cie10_id = null
    else {
      const asInt = parseInt(raw, 10)
      normalized.cie10_id = Number.isNaN(asInt) ? null : asInt
    }
  }
  // odontologo_id debe ser uuid o null; convertir cadena vacía a null
  if (typeof normalized.odontologo_id === 'string' && (normalized.odontologo_id as string).trim() === '') {
    normalized.odontologo_id = null
  }

  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id ?? null
  let currentUserRole = ((user?.user_metadata as unknown) as Record<string, unknown>)?.role as string | undefined

  // Si el role no está en user_metadata, intentar obtenerlo de la tabla `personal` (por id o email)
  async function fetchRoleFromPersonal() {
    try {
      if (currentUserId) {
        const { data: byId, error: idErr } = await supabase.from('personal').select('rol').eq('id', currentUserId).limit(1).maybeSingle()
        if (!idErr && byId && typeof byId.rol === 'string') return byId.rol
      }
      if (user?.email) {
        const { data: byEmail, error: emailErr } = await supabase.from('personal').select('rol').eq('email', user.email).limit(1).maybeSingle()
        if (!emailErr && byEmail && typeof byEmail.rol === 'string') return byEmail.rol
      }
    } catch {
      // ignore
    }
    return undefined
  }

  if (!currentUserRole) {
    const roleFromPersonal = await fetchRoleFromPersonal()
    if (roleFromPersonal) currentUserRole = roleFromPersonal
  }

  const normalizedRole = typeof currentUserRole === 'string' ? currentUserRole.toLowerCase() : ''
  const isAdmin = normalizedRole === 'admin' || normalizedRole === 'administrador'

  try {
    if (id) {
      const { data: existing, error: fetchErr } = await supabase.from('diagnosticos').select('odontologo_id').eq('id', id).single()
      if (fetchErr) throw fetchErr
      const existingRecord = (existing as Record<string, unknown> | null)
      const existingOdontologoId = existingRecord && typeof existingRecord['odontologo_id'] === 'string' ? (existingRecord['odontologo_id'] as string) : null
      if (!isAdmin) {
        if (!currentUserId) {
          return { error: { message: 'No autorizado.' } }
        }
        if (existingOdontologoId && currentUserId !== existingOdontologoId) {
          return { error: { message: 'No tiene permisos para editar este diagnóstico.' } }
        }
      }

      const { error } = await supabase
        .from('diagnosticos')
        .update(normalized)
        .eq('id', id)
      if (error) throw error
    } else {
      if (!isAdmin) {
        if (dataToUpsert.odontologo_id && currentUserId && dataToUpsert.odontologo_id !== currentUserId) {
          return { error: { message: 'No tiene permisos para asignar el odontólogo indicado.' } }
        }
      }

      const { error } = await supabase
        .from('diagnosticos')
        .insert(normalized)
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
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id ?? null
    let currentUserRole = ((user?.user_metadata as unknown) as Record<string, unknown>)?.role as string | undefined

    // Intentar obtener role desde tabla `personal` si no está en metadata
    async function fetchRoleFromPersonalLocal() {
      try {
        if (currentUserId) {
          const { data: byId, error: idErr } = await supabase.from('personal').select('rol').eq('id', currentUserId).limit(1).maybeSingle()
          if (!idErr && byId && typeof byId.rol === 'string') return byId.rol
        }
        if (user?.email) {
          const { data: byEmail, error: emailErr } = await supabase.from('personal').select('rol').eq('email', user.email).limit(1).maybeSingle()
          if (!emailErr && byEmail && typeof byEmail.rol === 'string') return byEmail.rol
        }
      } catch {
        // ignore
      }
      return undefined
    }

    if (!currentUserRole) {
      const roleFromPersonal = await fetchRoleFromPersonalLocal()
      if (roleFromPersonal) currentUserRole = roleFromPersonal
    }

    const normalizedRole = typeof currentUserRole === 'string' ? currentUserRole.toLowerCase() : ''
    const isAdmin = normalizedRole === 'admin' || normalizedRole === 'administrador'

    const { data: existing, error: fetchErr } = await supabase.from('diagnosticos').select('odontologo_id').eq('id', id).single()
    if (fetchErr) throw fetchErr
    const existingRecord = (existing as Record<string, unknown> | null)
    const existingOdontologoId = existingRecord && typeof existingRecord['odontologo_id'] === 'string' ? (existingRecord['odontologo_id'] as string) : null

    if (!isAdmin) {
      if (!currentUserId) return { error: { message: 'No autorizado.' } }
      if (existingOdontologoId && currentUserId !== existingOdontologoId) {
        return { error: { message: 'No tiene permisos para eliminar este diagnóstico.' } }
      }
    }

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

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { deleteGoogleCalendarEvent } from '@/lib/googleCalendar'
import { v2 as cloudinary } from 'cloudinary'
import { revalidatePath } from 'next/cache'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface UpdateRequestBody {
  descripcion?: string
  estado?: string
  tipo?: string
  titulo?: string
  fecha_proxima_cita?: string
  duracion_proxima_cita?: string | number
  estado_cita?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data, error } = await supabase
      .from('seguimientos')
      .select(`
        *,
        pagos:pago_id(*),
        citas:proxima_cita_id(*),
        seguimiento_imagenes(*),
        presupuestos(id, nombre, moneda_id)
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data: seguimiento } = await supabase
      .from('seguimientos')
      .select('pago_id, proxima_cita_id, cita_id, presupuesto_id, citas:proxima_cita_id(google_calendar_event_id)')
      .eq('id', id)
      .single()

    if (!seguimiento) throw new Error("Seguimiento no encontrado")

    const now = new Date().toISOString()
    const userId = user.id

    const { data: imagenes } = await supabase
        .from('seguimiento_imagenes')
        .select('id, public_id')
        .eq('seguimiento_id', id)
    
    if (imagenes && imagenes.length > 0) {
        const carpetasParaBorrar = new Set<string>()

        for (const img of imagenes) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id)
                const partes = img.public_id.split('/')
                if (partes.length > 1) {
                    partes.pop() 
                    const carpetaTipo = partes.join('/')
                    carpetasParaBorrar.add(carpetaTipo)
                    partes.pop()
                    const carpetaSeguimiento = partes.join('/')
                    carpetasParaBorrar.add(carpetaSeguimiento)
                }
            }
        }

        // Borrar de BD
        await supabase
            .from('seguimiento_imagenes')
            .delete()
            .eq('seguimiento_id', id)

        // Intentar borrar las carpetas vacías en Cloudinary
        // Cloudinary requiere borrar primero las subcarpetas, luego las padres.
        // Ordenamos por longitud descendente (las rutas más largas son subcarpetas)
        const carpetasOrdenadas = Array.from(carpetasParaBorrar).sort((a, b) => b.length - a.length)

        for (const folder of carpetasOrdenadas) {
            try {
                await cloudinary.api.delete_folder(folder)
            } catch (e) {
                // Si falla (ej: no está vacía por alguna razón), lo ignoramos para no bloquear el proceso
                console.warn(`No se pudo borrar carpeta Cloudinary: ${folder}`, e)
            }
        }
    }

    // 2. Borrar Pago (Soft) y RECALCULAR SALDO
    if (seguimiento.pago_id) {
      await supabase.from('pagos').update({ deleted_at: now, deleted_by: userId }).eq('id', seguimiento.pago_id)

      if (seguimiento.presupuesto_id) {
         const { data: allPagos } = await supabase
          .from('pagos')
          .select('monto')
          .eq('presupuesto_id', seguimiento.presupuesto_id)
          .is('deleted_at', null) 
        
        const nuevoTotalPagado = (allPagos || []).reduce((acc, curr) => acc + Number(curr.monto), 0)

        const { data: presData } = await supabase
            .from('presupuestos')
            .select('costo_total')
            .eq('id', seguimiento.presupuesto_id)
            .single()
        
        const costoTotal = Number(presData?.costo_total || 0)
        let nuevoEstado = 'Por Cobrar'
        if (nuevoTotalPagado > 0 && nuevoTotalPagado < costoTotal) nuevoEstado = 'Parcial'
        else if (nuevoTotalPagado >= costoTotal && costoTotal > 0) nuevoEstado = 'Pagado'

        await supabase
          .from('presupuestos')
          .update({ 
            total_pagado: nuevoTotalPagado,
            estado: nuevoEstado
          })
          .eq('id', seguimiento.presupuesto_id)
      }
    }

    // Determinar cuál ID de cita usar (prioridad: proxima_cita_id > cita_id)
    const citaIdToDelete = seguimiento.proxima_cita_id || seguimiento.cita_id

    if (citaIdToDelete) {
      const citasRaw = (seguimiento as Record<string, unknown>)['citas']
      let citaObj: { google_calendar_event_id?: string } | null = null
      if (Array.isArray(citasRaw) && citasRaw.length > 0) {
        const first = citasRaw[0]
        if (first && typeof first === 'object') {
          citaObj = { google_calendar_event_id: String((first as Record<string, unknown>).google_calendar_event_id || '') }
        }
      } else if (citasRaw && typeof citasRaw === 'object') {
        citaObj = { google_calendar_event_id: String((citasRaw as Record<string, unknown>).google_calendar_event_id || '') }
      }

      if (citaObj && citaObj.google_calendar_event_id) {
         try {
             await deleteGoogleCalendarEvent(citaObj.google_calendar_event_id)
         } catch (e) { }
      }

      await supabase.from('citas')
        .update({ estado: 'Cancelada', deleted_at: now, deleted_by: userId })
        .eq('id', citaIdToDelete)
    }

    const { error } = await supabase
      .from('seguimientos')
      .update({ deleted_at: now, deleted_by: userId, estado: 'inactivo' })
      .eq('id', id)

    if (error) throw error

    // Revalidar paths para actualizar datos en caché
    revalidatePath("/admin/ficha-odontologica", "layout");
    revalidatePath("/admin/ficha-odontologica/[numero_historia]/casos/[casoId]", "layout");

    return NextResponse.json({ message: 'Eliminado correctamente' })
  } catch (error) {
    console.error('Error delete seguimiento:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
    try {
      const body: UpdateRequestBody = await request.json()
      const { 
        descripcion, estado, tipo, titulo,
        fecha_proxima_cita, duracion_proxima_cita, estado_cita 
      } = body

      // 1. Obtener seguimiento actual para ver si tiene cita vinculada
      const { data: seguimientoActual } = await supabase
        .from('seguimientos')
        .select('proxima_cita_id, cita_id, profesional_id, paciente_id, caso_id')
        .eq('id', id)
        .single()

      if (!seguimientoActual) {
        return NextResponse.json({ error: 'Seguimiento no encontrado' }, { status: 404 })
      }

      // 2. Si hay cambios en la cita, actualizar
      const citaIdToUpdate = seguimientoActual.proxima_cita_id || seguimientoActual.cita_id

      if (fecha_proxima_cita && citaIdToUpdate) {
        const inicio = new Date(fecha_proxima_cita)
        const duracionMin = Number(duracion_proxima_cita || 60)
        const fin = new Date(inicio.getTime() + duracionMin * 60000)

        const { error: updateCitaError } = await supabase
          .from('citas')
          .update({
            fecha_inicio: inicio.toISOString(),
            fecha_fin: fin.toISOString(),
            estado: estado_cita || 'Programada',
            motivo: titulo || 'Control',
            notas: descripcion || ''
          })
          .eq('id', citaIdToUpdate)

        if (updateCitaError) {
          console.error('Error actualizando cita:', updateCitaError)
        }

        // 3. Sincronizar con Google Calendar (si existe)
        const { data: citaConGoogle } = await supabase
          .from('citas')
          .select('google_calendar_event_id')
          .eq('id', citaIdToUpdate)
          .single()

        if (citaConGoogle?.google_calendar_event_id) {
          try {
            // Obtener datos de paciente y médico
            const [pacienteRes, doctorRes] = await Promise.all([
              supabase.from('pacientes').select('nombres, apellidos').eq('id', seguimientoActual.paciente_id).single(),
              supabase.from('personal').select('nombre_completo').eq('id', seguimientoActual.profesional_id).single()
            ])

            const nombrePaciente = pacienteRes.data ? `${pacienteRes.data.nombres} ${pacienteRes.data.apellidos}` : 'Paciente'
            const nombreDoctor = doctorRes.data ? doctorRes.data.nombre_completo : 'Odontólogo'

            // TODO: Implementar updateGoogleCalendarEvent() en lib/googleCalendar.ts
            // await updateGoogleCalendarEvent({
            //   eventId: citaConGoogle.google_calendar_event_id,
            //   summary: `Cita: ${nombrePaciente} - ${nombreDoctor}`,
            //   description: `${titulo || 'Control'}\n\n${descripcion || ''}`,
            //   start: inicio,
            //   end: fin
            // })
            console.log('TODO: Sync Google Calendar event:', citaConGoogle.google_calendar_event_id)
          } catch (e) {
            console.error('Error sincronizando Google Calendar:', e)
          }
        }
      }

      // 4. Actualizar seguimiento
      const payload: Record<string, unknown> = {
          updated_at: new Date().toISOString()
      }
      
      if (descripcion !== undefined) payload.descripcion = descripcion
      if (estado !== undefined) payload.estado = estado
      if (tipo !== undefined) payload.tipo = tipo
      if (titulo !== undefined) payload.titulo = titulo
  
      const { data, error } = await supabase
        .from('seguimientos')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
  
      if (error) throw error
  
      // Revalidar paths para actualizar datos en caché
      revalidatePath("/admin/ficha-odontologica", "layout");
      revalidatePath("/admin/ficha-odontologica/[numero_historia]/casos/[casoId]", "layout");
  
      return NextResponse.json({ data, message: 'Seguimiento y cita actualizados correctamente' })
    } catch (error) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }
}
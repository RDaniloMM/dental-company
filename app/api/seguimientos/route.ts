import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createGoogleCalendarEvent } from '@/lib/googleCalendar'
import { revalidatePath } from 'next/cache'

interface PagoRequest {
  presupuesto_id: string
  monto: number
  moneda_id: string
  tipo: string
  numero_comprobante?: string
}

interface SeguimientoRequestBody {
  caso_id: string
  paciente_id: string
  descripcion: string
  estado?: string
  estado_cita?: string
  tipo?: string
  titulo?: string
  profesional_id?: string
  odontograma_version?: number
  pago?: PagoRequest | null
  fecha_proxima_cita?: string
  duracion_proxima_cita?: string | number
  tratamientos_realizados_ids?: string[]
  fecha_seguimiento?: string
  fecha?: string
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const casoId = searchParams.get('caso_id')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!casoId) return NextResponse.json({ error: 'caso_id es requerido' }, { status: 400 })

  try {
    const { data, error } = await supabase
      .from('seguimientos')
      .select(`
        id, fecha, descripcion, estado, tipo, proxima_cita_id, titulo, profesional_id, odontograma_version, creador_personal_id, presupuesto_id, saldo_pendiente_snapshot, tratamientos_realizados_ids,
        pagos:pago_id(id, monto, fecha_pago, metodo_pago, numero_comprobante, moneda_id, monedas(codigo, simbolo)),
        seguimiento_imagenes(id, imagen_url, public_id, tipo, fecha_captura),
        presupuestos(id, nombre, costo_total, total_pagado, estado, monedas(codigo, simbolo), correlativo),
        citas:proxima_cita_id(id, fecha_inicio, estado),
        personal:creador_personal_id(nombre_completo)
      `)
      .eq('caso_id', casoId)
      .is('deleted_at', null)
      .order('fecha', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener seguimientos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body: SeguimientoRequestBody = await request.json()
    const {
      caso_id, paciente_id, descripcion, tipo, titulo,
      odontograma_version, pago,
      fecha_proxima_cita, duracion_proxima_cita,
      estado_cita, tratamientos_realizados_ids,
      fecha_seguimiento, fecha
    } = body

    const fechaSeguimiento = (() => {
      const candidate = fecha_seguimiento || fecha
      if (candidate) {
        const parsed = new Date(candidate)
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
      }
      return new Date().toISOString()
    })()

    let pagoId: string | null = null
    let presupuestoIdParaSeguimiento: string | null = null
    let saldoSnapshot = 0

    if (pago && pago.monto > 0 && pago.presupuesto_id) {
      presupuestoIdParaSeguimiento = pago.presupuesto_id

      const { data: presupuesto } = await supabase.from('presupuestos').select('costo_total').eq('id', pago.presupuesto_id).single()
      const { data: pagosPrevios } = await supabase.from('pagos').select('monto').eq('presupuesto_id', pago.presupuesto_id).is('deleted_at', null)
      
      const totalPagadoAntes = (pagosPrevios || []).reduce((acc, p) => acc + Number(p.monto), 0)
      const costoTotal = Number(presupuesto?.costo_total || 0)
      const saldoAntes = Math.max(0, costoTotal - totalPagadoAntes)

      if (pago.monto < 0) throw new Error("El monto no puede ser negativo")
      if (pago.monto > (saldoAntes + 0.01)) throw new Error(`El pago excede el saldo pendiente (${saldoAntes})`)

      const { data: pagoData, error: pagoError } = await supabase
        .from('pagos')
        .insert({
          presupuesto_id: pago.presupuesto_id,
          paciente_id,
          monto: pago.monto,
          moneda_id: pago.moneda_id,
          metodo_pago: pago.tipo || 'efectivo',
          numero_comprobante: pago.numero_comprobante,
          fecha_pago: new Date().toISOString(),
          recibido_por: user.id
        }).select('id').single()

      if (pagoError) throw pagoError
      pagoId = pagoData.id

      saldoSnapshot = Math.max(0, saldoAntes - pago.monto)
      const nuevoTotalPagado = totalPagadoAntes + pago.monto
      let nuevoEstado = 'Por Cobrar'
      if (nuevoTotalPagado > 0 && nuevoTotalPagado < (costoTotal - 0.01)) nuevoEstado = 'Parcial'
      else if (nuevoTotalPagado >= (costoTotal - 0.01)) nuevoEstado = 'Pagado'

      await supabase.from('presupuestos').update({ total_pagado: nuevoTotalPagado, estado: nuevoEstado }).eq('id', pago.presupuesto_id)
    }

    let citaId: string | null = null
    let profesionalIdFinal = body.profesional_id
    let creadorNombre = ''
    let creadorRol = ''
    
    if (!profesionalIdFinal && user.email) {
       const { data: personalData } = await supabase.from('personal').select('id, nombre_completo, rol').eq('email', user.email).single()
       if(personalData) {
         profesionalIdFinal = personalData.id
         creadorNombre = personalData.nombre_completo || ''
         creadorRol = personalData.rol || ''
       }
    } else if (profesionalIdFinal) {
       const { data: personalData } = await supabase.from('personal').select('nombre_completo, rol').eq('id', profesionalIdFinal).single()
       if(personalData) {
         creadorNombre = personalData.nombre_completo || ''
         creadorRol = personalData.rol || ''
       }
    }

    if (fecha_proxima_cita && profesionalIdFinal) {
      const inicio = new Date(fecha_proxima_cita)
      const duracionMin = Number(duracion_proxima_cita || 60)
      const fin = new Date(inicio.getTime() + duracionMin * 60000)
      const [pacienteRes, doctorRes] = await Promise.all([
         supabase.from('pacientes').select('nombres, apellidos').eq('id', paciente_id).single(),
         supabase.from('personal').select('nombre_completo').eq('id', profesionalIdFinal).single()
      ])
      const nombrePaciente = pacienteRes.data ? `${pacienteRes.data.nombres} ${pacienteRes.data.apellidos}` : 'Paciente'
      const nombreDoctor = doctorRes.data ? doctorRes.data.nombre_completo : 'Odontólogo'
      
      const motivoCita = titulo || 'Control Seguimiento'
      const notasCita = descripcion || ''
      const googleDescription = `${motivoCita}\n\n${notasCita}`.trim()

      let googleEventId: string | null = null
      try {
        const googleEvent = await createGoogleCalendarEvent({
            summary: `Cita: ${nombrePaciente} - ${nombreDoctor}`,
            description: googleDescription,
            start: inicio,
            end: fin
        })
        if (googleEvent.success) {
            googleEventId = googleEvent.eventId
        }
      } catch (e) {
        console.error('Error creando evento Google Calendar:', e)
        // Continuar incluso si Google Calendar falla
      }

      // Crear cita siempre, independiente de Google Calendar
      const { data: citaData, error: citaError } = await supabase.from('citas').insert({
          paciente_id,
          odontologo_id: profesionalIdFinal,
          fecha_inicio: inicio.toISOString(),
          fecha_fin: fin.toISOString(),
          estado: estado_cita || 'Programada',
          motivo: motivoCita,
          caso_id,
          notas: notasCita,
          google_calendar_event_id: googleEventId
      }).select('id').single()

      if (citaError) {
        console.error('Error creando cita:', citaError)
      } else if (citaData) {
        citaId = citaData.id
      }
    }

    const { data: seguimientoData, error: seguimientoError } = await supabase
      .from('seguimientos')
      .insert({
        caso_id, paciente_id, descripcion, estado: 'activo', tipo: tipo || 'control', cita_id: citaId, proxima_cita_id: citaId,
        titulo: titulo || descripcion || 'Control', profesional_id: profesionalIdFinal,
        odontograma_version: typeof odontograma_version !== 'undefined' ? odontograma_version : null,
        pago_id: pagoId, presupuesto_id: presupuestoIdParaSeguimiento, creador_personal_id: user.id,
        creador_nombre: creadorNombre, creador_rol: creadorRol,
        fecha: fechaSeguimiento, saldo_pendiente_snapshot: saldoSnapshot, tratamientos_realizados_ids: tratamientos_realizados_ids || []
      }).select().single()

    if (seguimientoError) throw seguimientoError
    
    // Revalidar paths para actualizar datos en caché
    revalidatePath("/admin/ficha-odontologica", "layout");
    revalidatePath("/admin/ficha-odontologica/[numero_historia]/casos/[casoId]", "layout");
    
    return NextResponse.json({ data: seguimientoData, message: 'Seguimiento creado' }, { status: 201 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
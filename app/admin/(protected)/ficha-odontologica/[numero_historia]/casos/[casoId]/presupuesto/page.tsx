'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { PresupuestoTable } from '@/components/casos/presupuesto/PresupuestoTable'
import { PresupuestoHeader } from '@/components/casos/presupuesto/PresupuestoHeader'
import { PresupuestoForm } from '@/components/casos/presupuesto/PresupuestoForm'
import { createClient } from '@/lib/supabase/client'

function PresupuestoFormWrapper({ 
  casoId, 
  pacienteId, 
  numeroHistoria, 
  presupuestoId 
}: { 
  casoId: string; 
  pacienteId: string; 
  numeroHistoria: string; 
  presupuestoId: string 
}) {
  const [presupuesto, setPresupuesto] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPresupuesto = async () => {
      const supabase = createClient()
      try {
        const { data } = await supabase
          .from('presupuestos')
          .select('*')
          .eq('id', presupuestoId)
          .single()
        
        setPresupuesto(data)
      } catch (error) {
        console.error('Error fetching presupuesto:', error)
        router.push(`/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto`)
      } finally {
        setLoading(false)
      }
    }

    fetchPresupuesto()
  }, [presupuestoId, casoId, numeroHistoria, router])

  if (loading) {
    return <div className="p-4">Cargando presupuesto...</div>
  }

  if (!presupuesto) {
    return <div className="p-4">Presupuesto no encontrado</div>
  }

  return <PresupuestoForm casoId={casoId} pacienteId={pacienteId} numeroHistoria={numeroHistoria} presupuesto={presupuesto} />
}

interface PresupuestoPageProps {
  params: Promise<{
    numero_historia: string
    casoId: string
  }>
  searchParams?: Promise<{
    action?: string
    presupuestoId?: string
  }>
}

export default function PresupuestoPage({ params: paramsPromise, searchParams: searchParamsPromise }: PresupuestoPageProps) {
  const router = useRouter()
  const params = use(paramsPromise)
  const searchParams = use(searchParamsPromise || Promise.resolve({ action: undefined, presupuestoId: undefined }))
  const { casoId, numero_historia } = params
  const { action, presupuestoId } = searchParams as { action?: string; presupuestoId?: string }
  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/admin/login')
          return
        }

        const { data: caso } = await supabase
          .from('casos_clinicos')
          .select('id, historia_id')
          .eq('id', casoId)
          .single()

        if (!caso) {
          router.push('/admin/login')
          return
        }

        const { data: historia } = await supabase
          .from('historias_clinicas')
          .select('paciente_id')
          .eq('id', caso.historia_id)
          .single()

        if (!historia) {
          router.push('/admin/login')
          return
        }

        setPacienteId(historia.paciente_id)
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [casoId, router])

  if (loading) {
    return <div className="p-4">Cargando...</div>
  }

  if (!pacienteId) {
    return <div className="p-4">Error al cargar datos</div>
  }

  if (action === 'crear') {
    return <PresupuestoForm casoId={casoId} pacienteId={pacienteId} numeroHistoria={numero_historia} />
  }

  if (action === 'editar' && presupuestoId) {
    return <PresupuestoFormWrapper casoId={casoId} pacienteId={pacienteId} numeroHistoria={numero_historia} presupuestoId={presupuestoId} />
  }

  return (
    <div className='container mx-auto p-4'>
      <PresupuestoHeader 
        casoId={casoId} 
        numeroHistoria={numero_historia}
      />
      
      <div className='mt-6'>
        <PresupuestoTable 
          casoId={casoId} 
          pacienteId={pacienteId} 
          numeroHistoria={numero_historia}
        />
      </div>
    </div>
  )
}

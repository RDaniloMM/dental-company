import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PresupuestoTable } from '@/components/casos/presupuesto/PresupuestoTable'
import { PresupuestoHeader } from '@/components/casos/presupuesto/PresupuestoHeader'
import { PresupuestoForm } from '@/components/casos/presupuesto/PresupuestoForm'
import { getPresupuestoById } from './actions'
import { PageHeader } from '@/components/ui/PageHeader'

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

export default async function PresupuestoPage({ params: paramsPromise, searchParams: searchParamsPromise }: PresupuestoPageProps) {
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
  const supabase = await createClient()
  const { casoId, numero_historia } = params
  const { action, presupuestoId } = searchParams || {}

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return notFound()
  }

  const { data: caso, error: casoError } = await supabase
    .from('casos_clinicos')
    .select('id, historia_id')
    .eq('id', casoId)
    .single()

  if (casoError || !caso) {
    return notFound()
  }

  const { data: historia, error: historiaError } = await supabase
    .from('historias_clinicas')
    .select('paciente_id')
    .eq('id', caso.historia_id)
    .single()

  if (historiaError || !historia) {
    return notFound()
  }

  // Modo crear presupuesto
  if (action === 'crear') {
    return <PresupuestoForm casoId={casoId} pacienteId={historia.paciente_id} numeroHistoria={numero_historia} />
  }

  // Modo editar presupuesto
  if (action === 'editar' && presupuestoId) {
    const presupuestoResult = await getPresupuestoById(presupuestoId)
    if (presupuestoResult.error) {
      return notFound()
    }
    return <PresupuestoForm casoId={casoId} pacienteId={historia.paciente_id} numeroHistoria={numero_historia} presupuesto={presupuestoResult.data} />
  }

  // Modo lista de presupuestos
  return (
    <div className="container mx-auto p-4">
      <PageHeader title="Presupuestos del Caso">
        <PresupuestoHeader casoId={casoId} numeroHistoria={numero_historia} />
      </PageHeader>
      <PresupuestoTable casoId={casoId} pacienteId={historia.paciente_id} numeroHistoria={numero_historia} />
    </div>
  )
}

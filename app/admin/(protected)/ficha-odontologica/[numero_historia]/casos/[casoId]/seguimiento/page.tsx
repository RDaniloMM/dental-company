import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SeguimientoHeader from '@/components/casos/seguimiento/SeguimientoHeader'
import SeguimientoTable from '@/components/casos/seguimiento/SeguimientoTable'
import SeguimientoForm from '@/components/casos/seguimiento/SeguimientoForm'

interface Props {
  params: Promise<{
    numero_historia: string
    casoId: string
  }>
  searchParams?: Promise<{
    action?: string
    seguimientoId?: string
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Props) {
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
  const supabase = await createClient()
  const { casoId, numero_historia } = params
  const { action, seguimientoId } = searchParams || {}

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return notFound()

  const { data: caso } = await supabase.from('casos_clinicos').select('id, historia_id').eq('id', casoId).single()
  if (!caso) return notFound()

  const { data: historia } = await supabase.from('historias_clinicas').select('paciente_id').eq('id', caso.historia_id).single()
  if (!historia) return notFound()
  if (action === 'crear' || (action === 'editar' && seguimientoId)) {
    return (
      <div className='container mx-auto p-4 max-w-6xl'>
        <SeguimientoForm 
          casoId={casoId} 
          numeroHistoria={numero_historia} 
          pacienteId={historia.paciente_id}
          seguimientoId={action === 'editar' ? seguimientoId : undefined} 
        />
      </div>
    )
  }
  return (
    <div className='container mx-auto p-4'>
      <SeguimientoHeader casoId={casoId} numeroHistoria={numero_historia} />
      
      <div className='mt-6'>
        <SeguimientoTable 
          casoId={casoId} 
          pacienteId={historia.paciente_id} 
          numeroHistoria={numero_historia} 
        />
      </div>
    </div>
  )
}
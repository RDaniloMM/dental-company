import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ImagenesGallery from '@/components/casos/imagenes/ImagenGallery'

interface PageProps {
  params: Promise<{
    numero_historia: string
    casoId: string
  }>
}

export default async function ImagenesPage({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise
  const supabase = await createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return notFound()

  const { data: caso } = await supabase
    .from('casos_clinicos')
    .select('id, historia_id')
    .eq('id', params.casoId)
    .single()

  if (!caso) return notFound()

  const { data: historia } = await supabase
    .from('historias_clinicas')
    .select('paciente_id')
    .eq('id', caso.historia_id)
    .single()

  if (!historia) return notFound()

  return (
    <div className="animate-in fade-in duration-500">
      <ImagenesGallery 
        casoId={params.casoId} 
        pacienteId={historia.paciente_id}
        numeroHistoria={params.numero_historia}
      />
    </div>
  )
}
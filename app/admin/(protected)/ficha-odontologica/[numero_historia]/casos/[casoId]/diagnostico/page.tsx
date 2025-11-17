import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DiagnosticoTable } from '@/components/casos/diagnostico/DiagnosticoTable'
import { PageHeader } from '@/components/ui/PageHeader'

interface DiagnosticoPageProps {
  params: Promise<{
    numero_historia: string;
    casoId: string;
  }>;
}

export default async function DiagnosticoPage({ params: paramsPromise }: DiagnosticoPageProps) {
  const params = await paramsPromise; // Resuelve la promesa de los parámetros
  const supabase = await createClient()
  const { casoId } = params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader title="Diagnósticos del Caso">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostico-modal'))}
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
        >
          + Nuevo Diagnóstico
        </button>
      </PageHeader>
      <DiagnosticoTable
        casoId={casoId}
        userId={user.id}
      />
    </div>
  )
}

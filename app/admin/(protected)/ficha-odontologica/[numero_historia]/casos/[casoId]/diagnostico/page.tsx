import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DiagnosticoTable } from '@/components/casos/diagnostico/DiagnosticoTable'
import { DiagnosticoHeader } from '@/components/casos/diagnostico/diagnostico-header'

interface DiagnosticoPageProps {
  params: Promise<{
    numero_historia: string;
    casoId: string;
  }>;
}

export default async function DiagnosticoPage({ params: paramsPromise }: DiagnosticoPageProps) {
  const params = await paramsPromise;
  const supabase = await createClient()
  const { casoId } = params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return notFound()
  }

  const email = user.email ?? 'desconocido'
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  let name =
    (meta['name'] as string) || (meta['full_name'] as string) || (meta['nombre_completo'] as string) || ''
  let role = (meta['role'] as string) || ''

  if (!name || !role) {
    try {
      const { data: personalData, error: personalError } = await supabase
        .from('personal')
        .select('id, nombre_completo, rol, email')
        .or(`email.eq.${email},id.eq.${user.id}`)
        .limit(1)
        .maybeSingle()

      if (!personalError && personalData) {
        if (!name && typeof personalData.nombre_completo === 'string') {
          name = personalData.nombre_completo
        }
        if (!role && typeof personalData.rol === 'string') {
          role = personalData.rol
        }
      }
    } catch {
    }
  }

  if (!name) name = 'desconocido'
  if (!role) role = 'desconocido'

  return (
    <div className="container mx-auto p-4">
      <div className='flex items-center justify-between mb-6'>
        <h2 className="text-2xl font-bold text-sky-950 dark:text-sky-100 tracking-tight">
          Diagnósticos del Caso
        </h2>
        <DiagnosticoHeader />
      </div>
      <DiagnosticoTable
        casoId={casoId}
        userId={user.id}
      />
    </div>
  )
}

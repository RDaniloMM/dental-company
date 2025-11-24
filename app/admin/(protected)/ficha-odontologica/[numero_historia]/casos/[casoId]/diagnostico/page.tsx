import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DiagnosticoTable } from '@/components/casos/diagnostico/DiagnosticoTable'
import { DiagnosticoHeader } from '@/components/casos/diagnostico/diagnostico-header'
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

  // Recopilar información del usuario para depuración rápida
  const email = user.email ?? 'desconocido'
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  // Intentar obtener nombre y rol desde user_metadata primero
  let name =
    (meta['name'] as string) || (meta['full_name'] as string) || (meta['nombre_completo'] as string) || ''
  let role = (meta['role'] as string) || ''

  // Si metadata no contiene información, buscar en la tabla `personal` por email o id
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
          // Normalizar: en la base aparece 'Admin' o 'Odontólogo' — lo dejamos tal cual
          role = personalData.rol
        }
      }
    } catch {
      // ignorar errores de consulta; mantener los valores que tengamos
    }
  }

  if (!name) name = 'desconocido'
  if (!role) role = 'desconocido'

  return (
    <div className="container mx-auto p-4">
      <PageHeader title="Diagnósticos del Caso">
        <DiagnosticoHeader />
      </PageHeader>
      {/* Bloque auxiliar removido: información de sesión ya no se muestra aquí */}
      <DiagnosticoTable
        casoId={casoId}
        userId={user.id}
      />
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PresupuestoHeaderProps {
  casoId: string
  numeroHistoria: string
}

export function PresupuestoHeader({ casoId, numeroHistoria }: PresupuestoHeaderProps) {
  const router = useRouter()

  const handleNew = () => {
    router.push(`/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto?action=crear`)
  }

  return (
    <div className='flex items-center justify-between mb-6'>
      <h2 className="text-2xl font-bold text-sky-950 dark:text-sky-100 tracking-tight">
        Presupuestos del Caso
      </h2>
      <Button onClick={handleNew} variant="default">
        <Plus className="mr-2 h-4 w-4" /> Agregar Presupuesto
      </Button>
    </div>
  )
}
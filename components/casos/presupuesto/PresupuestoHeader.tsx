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
    <div>
      <Button onClick={handleNew} variant="default">
        <Plus className="mr-2 h-4 w-4" /> Agregar Presupuesto
      </Button>
    </div>
  )
}
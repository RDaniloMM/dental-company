'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SeguimientoHeaderProps {
  casoId: string
  numeroHistoria: string
}

export default function SeguimientoHeader({
  casoId,
  numeroHistoria,
}: SeguimientoHeaderProps) {
  const router = useRouter()

  return (
    <div className='flex items-center justify-between mb-6'>
      <h2 className="text-2xl font-bold text-sky-950 dark:text-sky-100 tracking-tight">
        Seguimientos del caso
      </h2>
      <Button
        onClick={() =>
          router.push(
            `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/seguimiento?action=crear`
          )
        }
        variant="default"
      >
        <Plus className='mr-2 h-4 w-4' />
        Agregar Avance
      </Button>
    </div>
  )
}

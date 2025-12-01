'use client';

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function DiagnosticoHeader() {
  return (
    <Button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostico-modal'))}
      variant="default"
      size="sm"
    >
      <Plus className="mr-2 h-4 w-4" /> Nuevo Diagnóstico
    </Button>
  );
}

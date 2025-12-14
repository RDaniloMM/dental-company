'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import { upsertDiagnostico } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/diagnostico/actions'
import { Loader2 } from 'lucide-react'
import { Diagnostico } from './DiagnosticoTable'

type DiagnosticoFormModalProps = {
  isOpen: boolean
  onClose: () => void
  diagnostico: Diagnostico | null
  casoId: string
  userId: string
}

export default function DiagnosticoFormModal({ isOpen, onClose, diagnostico, casoId, userId }: DiagnosticoFormModalProps) {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('Presuntivo')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
        setNombre(diagnostico?.nombre || '')
        setTipo(diagnostico?.tipo || 'Presuntivo')
    }
  }, [diagnostico, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return toast.error('Escribe el diagnóstico')
    
    setIsSubmitting(true)
    const res = await upsertDiagnostico({
        id: diagnostico?.id,
        caso_id: casoId,
        tipo,
        nombre,
        odontologo_id: userId
    })

    if (res.error) {
        toast.error(res.error.message, { style: { backgroundColor: '#FF0000', color: 'white' } })
    } else {
        toast.success(diagnostico ? 'Diagnóstico actualizado' : 'Diagnóstico creado', { style: { backgroundColor: '#008000', color: 'white' } })
        onClose()
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{diagnostico ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}</DialogTitle>
          <DialogDescription>Describe la condición clínica del paciente.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Presuntivo">Presuntivo</SelectItem>
                        <SelectItem value="Definitivo">Definitivo</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Descripción del Diagnóstico</Label>
                <Input 
                    placeholder="Ej: Caries dental en pieza 18..." 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="off"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-sky-700 hover:bg-sky-800 text-white">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
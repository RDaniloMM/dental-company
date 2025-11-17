'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react'
import DiagnosticoFormModal from './DiagnosticoFormModal'
import { deleteDiagnostico } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/diagnostico/actions'
import { toast } from '@/components/ui/use-toast'

export type Diagnostico = {
  id: string
  fecha: string
  tipo: string
  cie10_id: string
  cie10_catalogo: { 
    codigo: string
    descripcion: string
  } | null | { codigo: string; descripcion: string }[]
  odontologo_id: string
  personal: {
    nombre_completo: string
  } | null | { nombre_completo: string }[]
}

type DiagnosticoTableProps = {
  casoId: string
  userId: string
}

export function DiagnosticoTable({ casoId, userId }: DiagnosticoTableProps) { 
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedDiagnostico, setSelectedDiagnostico] = useState<Diagnostico | null>(null)

  const fetchDiagnosticos = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    const { data, error } = await supabase
      .from('diagnosticos')
      .select(`
        id,
        fecha,
        tipo,
        cie10_id,
        cie10_catalogo (
          codigo,
          descripcion
        ),
        odontologo_id,
        personal (
          nombre_completo
        )
      `)
      .eq('caso_id', casoId)
      .order('fecha', { ascending: false })

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los diagnósticos.',
        variant: 'destructive',
      })
      setDiagnosticos([])
    } else {
      setDiagnosticos(data as Diagnostico[])
    }
    setLoading(false)
  }, [casoId])

  useEffect(() => {
    fetchDiagnosticos()
  }, [fetchDiagnosticos])

  useEffect(() => {
    const handler = () => {
      setSelectedDiagnostico(null)
      setIsFormModalOpen(true)
    }
    window.addEventListener('open-diagnostico-modal', handler as EventListener)
    return () => window.removeEventListener('open-diagnostico-modal', handler as EventListener)
  }, [])

  const handleModalClose = () => {
    setIsFormModalOpen(false)
    fetchDiagnosticos()
  }

  const handleEdit = (diagnostico: Diagnostico) => {
    setSelectedDiagnostico(diagnostico)
    setIsFormModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este diagnóstico?')) {
      const result = await deleteDiagnostico(id)
      if (result.error) {
        toast({
          title: 'Error',
          description: `No se pudo eliminar el diagnóstico: ${result.error.message}`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Éxito',
          description: 'Diagnóstico eliminado correctamente.',
        })
        fetchDiagnosticos()
      }
    }
  }

  const getOdontologoName = (personal: Diagnostico['personal']) => {
    if (!personal) return 'No asignado'
    if (Array.isArray(personal)) {
      return personal.length > 0 ? personal[0].nombre_completo : 'No asignado'
    }
    return personal.nombre_completo
  }

  const getCie10Data = (cie10_catalogo: Diagnostico['cie10_catalogo']) => {
    if (!cie10_catalogo) return { codigo: 'N/A', descripcion: 'N/A' }
    if (Array.isArray(cie10_catalogo)) {
      return cie10_catalogo.length > 0 ? cie10_catalogo[0] : { codigo: 'N/A', descripcion: 'N/A' }
    }
    return cie10_catalogo
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => {
          setSelectedDiagnostico(null)
          setIsFormModalOpen(true)
        }}>
          + Nuevo Diagnóstico
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Código CIE10</TableHead>
              <TableHead>Diagnóstico</TableHead>
              <TableHead>Odontólogo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : diagnosticos.length > 0 ? (
              diagnosticos.map((diagnostico) => (
                <TableRow key={diagnostico.id}>
                  <TableCell>
                    {new Date(diagnostico.fecha).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={diagnostico.tipo === 'Definitivo' ? 'default' : 'secondary'}
                    >
                      {diagnostico.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getCie10Data(diagnostico.cie10_catalogo).codigo}
                  </TableCell>
                  <TableCell className="max-w-sm truncate">
                    {getCie10Data(diagnostico.cie10_catalogo).descripcion}
                  </TableCell>
                  <TableCell>{getOdontologoName(diagnostico.personal)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {diagnostico.odontologo_id === userId && (
                          <>
                            <DropdownMenuItem onClick={() => handleEdit(diagnostico)}>
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(diagnostico.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No se han registrado diagnósticos para este caso.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isFormModalOpen && (
        <DiagnosticoFormModal
          isOpen={isFormModalOpen}
          onClose={handleModalClose}
          diagnostico={selectedDiagnostico}
          casoId={casoId}
          userId={userId}
        />
      )}
    </div>
  )
}

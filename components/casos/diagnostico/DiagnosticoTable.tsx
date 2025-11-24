"use client"

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
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import DiagnosticoFormModal from './DiagnosticoFormModal'
import { deleteDiagnostico } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/diagnostico/actions'
import { toast } from 'sonner'

export type Diagnostico = {
  id: string
  fecha: string
  tipo: string
  cie10_id: string
  cie10_catalogo:
    | {
        codigo: string
        descripcion: string
      }
    | null
    | { codigo: string; descripcion: string }[]
  odontologo_id: string
  personal:
    | {
        nombre_completo: string
      }
    | null
    | { nombre_completo: string }[]
}

type ActionResult = { success?: boolean; error?: { message?: string } }

  type DiagnosticoTableProps = {
    casoId: string
    userId: string
  }

  export function DiagnosticoTable({ casoId, userId }: DiagnosticoTableProps) {
    const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [selectedDiagnostico, setSelectedDiagnostico] = useState<Diagnostico | null>(null)
    const [previewDiagnostico, setPreviewDiagnostico] = useState<Diagnostico | null>(null)

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
        toast.error('No se pudieron cargar los diagnósticos.', { style: { backgroundColor: '#FF0000', color: 'white' } })
        setDiagnosticos([])
      } else {
        setDiagnosticos((data as Diagnostico[]) || [])
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

    const handlePreview = (diagnostico: Diagnostico) => {
      setPreviewDiagnostico(diagnostico)
    }

    const handleDelete = async (id: string) => {
      if (!window.confirm('¿Estás seguro de que deseas eliminar este diagnóstico?')) return
      try {
        const res = (await deleteDiagnostico(id)) as ActionResult
        if (res?.error) {
          toast.error(res.error?.message || 'No se pudo eliminar.', { style: { backgroundColor: '#FF0000', color: 'white' } })
        } else {
          toast.success('Diagnóstico eliminado correctamente.', { style: { backgroundColor: '#008000', color: 'white' } })
          fetchDiagnosticos()
        }
      } catch (err) {
        console.error('Error eliminando diagnóstico:', err)
        toast.error('Ocurrió un error al eliminar.', { style: { backgroundColor: '#FF0000', color: 'white' } })
      }
    }

    const getOdontologoName = (personal: Diagnostico['personal']) => {
      if (!personal) return 'No asignado'
      if (Array.isArray(personal)) return personal.length > 0 ? personal[0].nombre_completo : 'No asignado'
      return personal.nombre_completo
    }

    const getCie10Data = (cie10_catalogo: Diagnostico['cie10_catalogo']) => {
      if (!cie10_catalogo) return { codigo: 'N/A', descripcion: 'N/A' }
      if (Array.isArray(cie10_catalogo)) return cie10_catalogo.length > 0 ? cie10_catalogo[0] : { codigo: 'N/A', descripcion: 'N/A' }
      return cie10_catalogo
    }

    return (
      <div className="space-y-4">
        {previewDiagnostico && (
          <div className="mb-4 rounded-md overflow-hidden">
            <div className="p-4 bg-blue-600 text-white">
              <h3 className="font-semibold">{getCie10Data(previewDiagnostico.cie10_catalogo).descripcion}</h3>
            </div>
            <div className="p-4 bg-white border border-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado</span>
                <span className="text-sm">Abierto</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Fecha de inicio</span>
                <span className="text-sm">{new Date(previewDiagnostico.fecha).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium">Observaciones</p>
                <p className="text-sm">caries</p>
              </div>
            </div>
          </div>
        )}

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-sky-700 text-white text-center">Fecha</TableHead>
                <TableHead className="bg-sky-700 text-white text-center">Tipo</TableHead>
                <TableHead className="bg-sky-700 text-white text-center">Código CIE10</TableHead>
                <TableHead className="bg-sky-700 text-white text-center">Diagnóstico</TableHead>
                <TableHead className="bg-sky-700 text-white text-center">Odontólogo</TableHead>
                <TableHead className="bg-sky-700 text-white text-center">Acciones</TableHead>
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
                diagnosticos.map((diagnostico) => {
                  return (
                    <TableRow key={diagnostico.id} className="hover:bg-muted">
                      <TableCell onClick={() => handlePreview(diagnostico)}>{new Date(diagnostico.fecha).toLocaleDateString()}</TableCell>
                      <TableCell onClick={() => handlePreview(diagnostico)}>
                        <Badge variant={diagnostico.tipo === 'Definitivo' ? 'default' : 'secondary'}>{diagnostico.tipo}</Badge>
                      </TableCell>
                      <TableCell onClick={() => handlePreview(diagnostico)}>{getCie10Data(diagnostico.cie10_catalogo).codigo}</TableCell>
                      <TableCell onClick={() => handlePreview(diagnostico)} className="max-w-sm truncate">{getCie10Data(diagnostico.cie10_catalogo).descripcion}</TableCell>
                      <TableCell onClick={() => handlePreview(diagnostico)}>{getOdontologoName(diagnostico.personal)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(diagnostico)} aria-label={`Editar diagnóstico ${diagnostico.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(diagnostico.id)} aria-label={`Eliminar diagnóstico ${diagnostico.id}`}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No se han registrado diagnósticos para este caso.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {isFormModalOpen && (
          <DiagnosticoFormModal isOpen={isFormModalOpen} onClose={handleModalClose} diagnostico={selectedDiagnostico} casoId={casoId} userId={userId} />
        )}
      </div>
    )
  }

"use client"

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
interface Procedimiento {
  id: string
  nombre: string
  descripcion: string
  precio: number
}

interface ProcedimientosModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectProcedimientos: (
    procedimientos: Array<{ id: string; nombre: string; precioDefault: number; cantidad: number }>
  ) => void
  monedaId: string
  pacienteId?: string
}

export function ProcedimientosModal({
  isOpen,
  onClose,
  onSelectProcedimientos,
  monedaId,
  pacienteId,
}: ProcedimientosModalProps) {
  const supabase = createClient()
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [missingMoneda, setMissingMoneda] = useState(false)
  const [cantidades, setCantidades] = useState<Record<string, number>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 5

  const [currencySymbol, setCurrencySymbol] = useState<string>('S/')

  const getCurrencySymbol = (code?: string | null) => {
    if (!code) return 'S/'
    const map: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', PEN: 'S/', UYU: '$U' }
    return map[code] || code + ' '
  }

  useEffect(() => {
    if (!isOpen) return

    const loadProcedimientos = async () => {
      setLoading(true)
      try {
        if (!monedaId) {
          setMissingMoneda(true)
          setProcedimientos([])
          setTotalPages(1)
          setLoading(false)
          return
        }
        setMissingMoneda(false)

        let query = supabase
          .from('procedimientos')
          .select(
            `
            id,
            nombre,
            descripcion,
            procedimiento_precios!inner(precio)
          `,
            { count: 'exact' }
          )
          .eq('activo', true)
          .eq('procedimiento_precios.moneda_id', monedaId)

        if (searchTerm.trim()) {
          query = query.or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
        }

        const { data, count, error } = await query
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
          .order('nombre', { ascending: true })

        if (error) throw error

        const formatted = (data || []).map((p: {id: string; nombre: string; descripcion: string; procedimiento_precios: Array<{precio: number}>}) => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.procedimiento_precios[0]?.precio || 0,
        }))

        setProcedimientos(formatted)
        setTotalPages(Math.ceil((count || 0) / itemsPerPage))
      } catch (error) {
        console.error('Error loading procedimientos:', error)
        if (!missingMoneda) {
          toast.error('Error al cargar procedimientos.', { style: { backgroundColor: '#FF0000', color: 'white' } })
        }
      } finally {
        setLoading(false)
      }
    }

    loadProcedimientos()
  }, [isOpen, monedaId, searchTerm, currentPage, supabase, missingMoneda])

  useEffect(() => {
    const loadMoneda = async () => {
      if (!monedaId) {
        setCurrencySymbol(getCurrencySymbol(null))
        return
      }
      try {
        const { data, error } = await supabase.from('monedas').select('codigo').eq('id', monedaId).single()
        if (!error && data) {
          setCurrencySymbol(getCurrencySymbol(data.codigo))
        }
      } catch (e) {
        console.error('Error loading moneda code', e)
      }
    }

    loadMoneda()
  }, [monedaId, supabase])

  const handleAddProcedimiento = (procedimiento: Procedimiento) => {
    const cantidad = cantidades[procedimiento.id] || 1
    onSelectProcedimientos([
      {
        id: procedimiento.id,
        nombre: procedimiento.nombre,
        precioDefault: procedimiento.precio,
        cantidad,
      },
    ])
    setCantidades({ ...cantidades, [procedimiento.id]: 1 })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[70vw] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Agregar Procedimientos</DialogTitle>
          <DialogDescription>
            Selecciona procedimientos para agregarlos al presupuesto.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Sección izquierda: Tabla de procedimientos */}
          <div className="md:col-span-3 flex flex-col overflow-hidden">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                autoComplete="off"
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {missingMoneda && (
                  <div className="mb-4 p-3 rounded bg-yellow-50 text-yellow-800 border border-yellow-100 text-sm">
                    Selecciona una moneda en el formulario para ver los precios disponibles.
                  </div>
                )}
                <div className="border rounded-lg overflow-auto flex-1">
                  <Table>
                    <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="bg-sky-700 text-white">Procedimiento</TableHead>
                          <TableHead className="bg-sky-700 text-white text-center">Cantidad</TableHead>
                          <TableHead className="bg-sky-700 text-white text-right">Precio</TableHead>
                          <TableHead className="bg-sky-700 text-white text-center">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {procedimientos.map((proc) => (
                        <TableRow key={proc.id} className="hover:bg-muted">
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold text-sm">{proc.nombre}</p>
                              {proc.descripcion && (
                                <p className="text-xs text-muted-foreground">{proc.descripcion}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={cantidades[proc.id] || 1}
                              onChange={(e) =>
                                setCantidades({
                                  ...cantidades,
                                  [proc.id]: Math.max(1, parseInt(e.target.value) || 1),
                                })
                              }
                              className="h-8 text-center text-xs w-16"
                            />
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {currencySymbol}{proc.precio.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleAddProcedimiento(proc)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {procedimientos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron procedimientos.
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

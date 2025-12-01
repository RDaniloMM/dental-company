'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
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
import { Printer, Edit, Trash2, Loader2 } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deletePresupuesto } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/presupuesto/actions'

interface Presupuesto {
  id: string
  nombre: string
  costo_total: number | null
  fecha_creacion: string
  medico_id: string | null
  personal: {
    nombre_completo?: string
  } | null
  moneda_id?: string | null
  moneda_codigo?: string | null
  plan_items: Array<{
    estado: string
  }>
  creador_personal_id?: string | null
  creador_nombre?: string | null
  creador_rol?: string | null
}

interface PresupuestoRow {
  id: string
  nombre: string
  costo_total: number | null
  fecha_creacion: string
  medico_id: string | null
  moneda_id: string | null
  monedas: Array<{ codigo: string }> | null
  personal: { nombre_completo?: string } | null
  plan_items: Array<{ estado: string }>
  creador_personal_id?: string | null
  creador_nombre?: string | null
  creador_rol?: string | null
}

interface PresupuestoTableProps {
  casoId: string
  pacienteId: string
  numeroHistoria: string
}

export function PresupuestoTable({ casoId, numeroHistoria }: PresupuestoTableProps) {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [currentPersonal, setCurrentPersonal] = useState<{ id: string; nombre_completo: string; rol?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const lastPathnameRef = useRef<string>(pathname)

  const getCurrencySymbol = (code?: string | null) => {
    if (!code) return 'S/'
    const map: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      PEN: 'S/',
      UYU: '$U',
    }
    return map[code] || code + ' '
  }

  const fetchPresupuestos = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)

    try {
      // Query simple sin joins para evitar problemas de RLS
      const { data, error } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('caso_id', casoId)
        .order('fecha_creacion', { ascending: false })

      if (error) {
        console.error('[PresupuestoTable] Error fetching presupuestos:', error)
        setPresupuestos([])
        return
      }

      if (!data || data.length === 0) {
        console.log('[PresupuestoTable] No presupuestos found for casoId:', casoId)
        setPresupuestos([])
        setLoading(false)
        return
      }

      console.log('[PresupuestoTable] Fetched presupuestos:', data.length, 'for casoId:', casoId)

      // Obtener médicos (personal) por separado
      const medicoIds = Array.from(new Set(data.map((p: any) => p.medico_id).filter(Boolean)))
      let medicoMap: Record<string, { nombre_completo: string }> = {}

      if (medicoIds.length > 0) {
        const { data: medicosData } = await supabase
          .from('personal')
          .select('id, nombre_completo')
          .in('id', medicoIds)
        if (medicosData) {
          medicoMap = medicosData.reduce((acc: Record<string, any>, m: any) => {
            acc[m.id] = { nombre_completo: m.nombre_completo }
            return acc
          }, {})
        }
      }

      // Obtener monedas por separado
      const monedaIds = Array.from(new Set(data.map((p: any) => p.moneda_id).filter(Boolean)))
      let monedaMap: Record<string, string> = {}

      if (monedaIds.length > 0) {
        const { data: monedasData } = await supabase
          .from('monedas')
          .select('id, codigo')
          .in('id', monedaIds)
        if (monedasData) {
          monedaMap = monedasData.reduce((acc: Record<string, string>, m: any) => {
            acc[m.id] = m.codigo
            return acc
          }, {})
        }
      }

      const transformed = data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        costo_total: item.costo_total,
        fecha_creacion: item.fecha_creacion,
        medico_id: item.medico_id,
        moneda_id: item.moneda_id,
        moneda_codigo: item.moneda_id ? monedaMap[item.moneda_id] || null : null,
        personal: item.medico_id ? medicoMap[item.medico_id] || null : null,
        plan_items: [],
        creador_personal_id: item.creador_personal_id || null,
        creador_nombre: item.creador_nombre || null,
        creador_rol: item.creador_rol || null,
      }))

      setPresupuestos(transformed)
    } catch (err) {
      console.error('[PresupuestoTable] Exception:', err)
      setPresupuestos([])
    } finally {
      setLoading(false)
    }
  }, [casoId])

  useEffect(() => {
    fetchPresupuestos()
  }, [fetchPresupuestos])

  // Refetch cuando volvemos a esta ruta (detectar cambio de pathname)
  useEffect(() => {
    if (pathname.includes('presupuesto') && lastPathnameRef.current !== pathname) {
      // Solo refetch si la ruta actual es presupuesto pero la anterior NO era (volvimos)
      if (!lastPathnameRef.current.includes('presupuesto')) {
        fetchPresupuestos()
      }
    }
    lastPathnameRef.current = pathname
  }, [pathname, fetchPresupuestos])

  // Resolver usuario actual para controlar permisos (borrado)
  useEffect(() => {
    const resolveCurrent = async () => {
      const supabase = createClient()
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          const { data: personalMatch } = await supabase
            .from('personal')
            .select('id, nombre_completo, rol, email')
            .ilike('email', user.email)
            .limit(1)
          if (personalMatch && personalMatch.length > 0) setCurrentPersonal({ id: personalMatch[0].id, nombre_completo: personalMatch[0].nombre_completo, rol: personalMatch[0].rol })
        }
      } catch (e) {
        console.error('Error resolving current personal', e)
      }
    }
    resolveCurrent()
  }, [])

  const getEstadoPago = (items: Array<{ estado: string }>) => {
    if (!items || items.length === 0) return { label: 'Por Cobrar', color: 'destructive' }

    const completados = items.filter((i) => i.estado === 'Completado').length
    const total = items.length

    if (completados === 0) return { label: 'Por Cobrar', color: 'destructive' }
    if (completados === total) return { label: 'Pagado', color: 'default' }
    return { label: 'Abonado', color: 'secondary' }
  }

  const handleDelete = async (presupuestoId: string) => {
    setDeleting(presupuestoId)
    const result = await deletePresupuesto(presupuestoId)

    if (result.success) {
      setPresupuestos((prev) => prev.filter((p) => p.id !== presupuestoId))
      toast.success('El presupuesto ha sido eliminado.', { style: { backgroundColor: '#008000', color: 'white' } })
    } else {
      toast.error(result.error?.message || 'Error al eliminar', { style: { backgroundColor: '#FF0000', color: 'white' } })
    }
    setDeleting(null)
  }

  const handleEdit = (presupuestoId: string) => {
    router.push(`/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto?action=editar&presupuestoId=${presupuestoId}`)
  }

  const handlePrint = (presupuestoId: string) => {
    window.open(`/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/presupuesto/${presupuestoId}/print`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-sky-700 text-white font-semibold">Secuencia</TableHead>
            <TableHead className="bg-sky-700 text-white font-semibold">Tratamiento</TableHead>
            <TableHead className="bg-sky-700 text-white font-semibold">Médico</TableHead>
            <TableHead className="bg-sky-700 text-white font-semibold">Fecha</TableHead>
            <TableHead className="bg-sky-700 text-white font-semibold text-right">Total</TableHead>
            <TableHead className="bg-sky-700 text-white font-semibold">Pago</TableHead>
            <TableHead className="bg-sky-700 text-white text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {presupuestos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No hay presupuestos registrados.
              </TableCell>
            </TableRow>
          ) : (
            presupuestos.map((presupuesto, index) => {
              const estado = getEstadoPago(presupuesto.plan_items || [])
              const canDelete = currentPersonal?.rol === 'Admin' || (currentPersonal?.id && presupuesto.creador_personal_id && currentPersonal.id === presupuesto.creador_personal_id)
              return (
                <TableRow key={presupuesto.id} className="hover:bg-muted">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{presupuesto.nombre}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {presupuesto.personal?.nombre_completo || 'No asignado'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {presupuesto.fecha_creacion
                      ? format(new Date(presupuesto.fecha_creacion), 'dd/MM/yyyy', { locale: es })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {getCurrencySymbol(presupuesto.moneda_codigo)}{(presupuesto.costo_total ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={estado.color as 'default' | 'secondary' | 'destructive'}
                      className={
                        estado.color === 'destructive'
                          ? 'bg-red-100 text-red-800'
                          : estado.color === 'secondary'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      {estado.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePrint(presupuesto.id)}
                        title="Imprimir presupuesto"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(presupuesto.id)}
                        title="Editar presupuesto"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deleting === presupuesto.id || !canDelete}
                            title={!canDelete ? 'Solo el creador o un Admin puede eliminar' : 'Eliminar presupuesto'}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar presupuesto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará el presupuesto y todos sus items. No se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(presupuesto.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {deleting === presupuesto.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Eliminando...
                                </>
                              ) : (
                                'Eliminar'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
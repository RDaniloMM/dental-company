'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Filter, Eye, ImageIcon, RefreshCw, Plus, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import ImagenFormModal from './ImagenFormModal'
import ImagenViewer from './ImagenViewer'
import { getImagenesCaso } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/imagenes/actions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export interface ImagenPaciente {
  id: string
  url: string
  public_id: string
  tipo: string 
  etapa: string 
  descripcion: string
  fecha_captura: string
  fecha_subida: string
  origen: string
  seguimiento_id?: string
}

interface SeguimientoInfo {
  id: string
  fecha: string
  presupuesto_id?: string
}

interface Props {
  casoId: string
  pacienteId: string
  numeroHistoria: string
}

export default function ImagenesGallery({ casoId, pacienteId, numeroHistoria }: Props) {
  const [imagenes, setImagenes] = useState<ImagenPaciente[]>([])
  const [filteredImagenes, setFilteredImagenes] = useState<ImagenPaciente[]>([])
  const [seguimientos, setSeguimientos] = useState<Map<string, SeguimientoInfo>>(new Map())
  const [presupuestos, setPresupuestos] = useState<Map<string, { correlativo: number }>>(new Map())
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroEtapa, setFiltroEtapa] = useState<string>('todos')
  const [filtroPresupuesto, setFiltroPresupuesto] = useState<string>('todos')
  const [filtroFecha, setFiltroFecha] = useState<string>('todos')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<ImagenPaciente | null>(null)
  const [viewerImage, setViewerImage] = useState<ImagenPaciente | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<ImagenPaciente | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const data = await getImagenesCaso(casoId)
      setImagenes(data as ImagenPaciente[])

      // Cargar seguimientos
      const { data: seguimientosData } = await supabase
        .from('seguimientos')
        .select('id, fecha, presupuesto_id')
        .eq('caso_id', casoId)
        .is('deleted_at', null)

      type SeguimientoRaw = {
        id: string;
        fecha: string;
        presupuesto_id?: string;
      }

      const segMap = new Map()
      if (seguimientosData) {
        seguimientosData.forEach((s: SeguimientoRaw) => {
          segMap.set(s.id, { id: s.id, fecha: s.fecha, presupuesto_id: s.presupuesto_id })
        })
      }
      setSeguimientos(segMap)

      // Cargar presupuestos
      const { data: presupuestosData } = await supabase
        .from('presupuestos')
        .select('id, correlativo')
        .eq('caso_id', casoId)
        .is('deleted_at', null)
        .order('correlativo', { ascending: true })

      type PresupuestoRaw = {
        id: string;
        correlativo: number;
      }

      const presMap = new Map()
      if (presupuestosData) {
        presupuestosData.forEach((p: PresupuestoRaw) => {
          presMap.set(p.id, { correlativo: p.correlativo })
        })
      }
      setPresupuestos(presMap)
    } catch (error) {
      console.error(error)
      toast.error("Error al cargar imágenes")
    } finally {
      setLoading(false)
    }
  }, [casoId])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  useEffect(() => {
    let result = imagenes

    if (filtroTipo !== 'todos') {
      result = result.filter(img => img.tipo === filtroTipo)
    }

    if (filtroEtapa !== 'todos') {
      result = result.filter(img => img.etapa === filtroEtapa)
    }

    if (filtroPresupuesto !== 'todos') {
      result = result.filter(img => {
        if (!img.seguimiento_id) return false
        const seg = seguimientos.get(img.seguimiento_id)
        if (!seg?.presupuesto_id) return false
        return seg.presupuesto_id === filtroPresupuesto
      })
    }

    if (filtroFecha !== 'todos') {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      result = result.filter(img => {
        const imgDate = new Date(img.fecha_captura)
        imgDate.setHours(0, 0, 0, 0)
        const diffTime = hoy.getTime() - imgDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        switch(filtroFecha) {
          case 'hoy': return diffDays === 0
          case '7dias': return diffDays >= 0 && diffDays <= 7
          case '30dias': return diffDays >= 0 && diffDays <= 30
          case '90dias': return diffDays >= 0 && diffDays <= 90
          default: return true
        }
      })
    }

    setFilteredImagenes(result)
  }, [imagenes, filtroTipo, filtroEtapa, filtroPresupuesto, filtroFecha, seguimientos])

  const handleDelete = async () => {
    if (!deleteCandidate) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/imagenes/caso?id=${deleteCandidate.id}&public_id=${deleteCandidate.public_id}&origen=${deleteCandidate.origen}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error('Error al eliminar')
      
      toast.success('Imagen eliminada correctamente', { style: { backgroundColor: '#008000', color: 'white' } })
      
      setImagenes(prev => prev.filter(img => img.id !== deleteCandidate.id))
      router.refresh()
    } catch (error) {
      toast.error('No se pudo eliminar la imagen', { style: { backgroundColor: '#FF0000', color: 'white' } })
    } finally {
      setIsDeleting(false)
      setDeleteCandidate(null)
    }
  }

  const getEtapaColor = (etapa: string) => {
    const colorMap: Record<string, string> = {
      'antes': 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      'durante': 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
      'despues': 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      'seguimiento': 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      default: 'bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800'
    }
    return colorMap[etapa] || colorMap['default']
  }

  // Agrupar imágenes por seguimiento
  const imagenesAgrupadas = useMemo(() => {
    const grupos = new Map<string, ImagenPaciente[]>()
    
    filteredImagenes.forEach(img => {
      const key = img.seguimiento_id || 'sin_seguimiento'
      if (!grupos.has(key)) {
        grupos.set(key, [])
      }
      grupos.get(key)!.push(img)
    })

    // Ordenar por fecha de seguimiento descendente
    const sorted = Array.from(grupos.entries()).sort((a, b) => {
      const segA = seguimientos.get(a[0])
      const segB = seguimientos.get(b[0])
      if (!segA && !segB) return 0
      if (!segA) return 1
      if (!segB) return -1
      return new Date(segB.fecha).getTime() - new Date(segA.fecha).getTime()
    })

    return sorted
  }, [filteredImagenes, seguimientos])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-sky-950 dark:text-sky-100 tracking-tight">
          Imágenes del Caso
        </h2>
        <Button
          type="button"
          onClick={() => { setEditingImage(null); setIsFormOpen(true); }}
          variant="default"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Imagen
        </Button>
      </div>
      <div className="bg-transparent border-transparent">
        <div className="flex flex-col xl:flex-row gap-4 items-end">
          <div className="flex flex-wrap gap-3 w-full items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden md:inline">Filtros:</span>
            </div>

            <Select value={filtroEtapa} onValueChange={setFiltroEtapa}>
              <SelectTrigger className="w-[160px] h-8 text-xs bg-background">
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las etapas</SelectItem>
                <SelectItem value="antes">Antes</SelectItem>
                <SelectItem value="durante">Durante</SelectItem>
                <SelectItem value="despues">Después</SelectItem>
                <SelectItem value="seguimiento">Seguimiento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[160px] h-8 text-xs bg-background">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="radiografia">Radiografía</SelectItem>
                <SelectItem value="fotografia">Fotografía</SelectItem>
                <SelectItem value="intraoral">Intraoral</SelectItem>
                <SelectItem value="extraoral">Extraoral</SelectItem>
                <SelectItem value="documento">Documento</SelectItem>
                <SelectItem value="evidencia">Evidencia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroPresupuesto} onValueChange={setFiltroPresupuesto}>
              <SelectTrigger className="w-[210px] h-8 text-xs bg-background">
                <SelectValue placeholder="Presupuesto" />
              </SelectTrigger>
              <SelectContent className="w-[210px]">
                <SelectItem value="todos">Todos los presupuestos</SelectItem>
                {Array.from(presupuestos.entries())
                  .sort((a, b) => {
                    const aVal = a[1]?.correlativo ?? Number.MAX_SAFE_INTEGER
                    const bVal = b[1]?.correlativo ?? Number.MAX_SAFE_INTEGER
                    return aVal - bVal
                  })
                  .map(([id, info]) => {
                  const correlativo = info?.correlativo
                  const label = correlativo ? `Presupuesto #${String(correlativo).padStart(3, '0')}` : 'Presupuesto sin correlativo'
                  return (
                    <SelectItem key={id} value={id} className="truncate">
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <Select value={filtroFecha} onValueChange={setFiltroFecha}>
              <SelectTrigger className="w-[160px] h-8 text-xs bg-background">
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las fechas</SelectItem>
                <SelectItem value="hoy">Hoy</SelectItem>
                <SelectItem value="7dias">Últimos 7 días</SelectItem>
                <SelectItem value="30dias">Últimos 30 días</SelectItem>
                <SelectItem value="90dias">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline"
            size="icon"
            onClick={fetchImages} 
            className="text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 shrink-0"
            title="Recargar imágenes"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="flex gap-3">
                {[1,2,3].map(j => <div key={j} className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded"></div>)}
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-800 mt-4"></div>
            </div>
          ))}
        </div>
      ) : imagenesAgrupadas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/30">
          <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No se encontraron imágenes</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Cambia los filtros o sube imágenes desde los seguimientos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {imagenesAgrupadas.map(([segId, imgs]) => {
            const seg = seguimientos.get(segId)
            const pres = seg?.presupuesto_id ? presupuestos.get(seg.presupuesto_id) : null
            const correlativo = pres?.correlativo
            const correlativoLabel = correlativo ? `#${String(correlativo).padStart(3, '0')}` : 'S/N'
            
            return (
              <div key={segId} className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                {seg && (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Seguimiento: {format(new Date(seg.fecha), 'dd/MM/yyyy')} — Presupuesto {correlativoLabel}
                    </p>
                  </div>
                )}
                
                <div className="p-4">
                  {imgs.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Sin imágenes</p>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {imgs.map((img) => (
                        <div key={img.id} className="flex-shrink-0">
                          <Card className="group overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:border-slate-400 dark:hover:border-slate-600 w-28 h-28">
                            <div 
                              className="w-full h-full relative cursor-pointer overflow-hidden bg-slate-200 dark:bg-slate-800"
                              onClick={() => setViewerImage(img)}
                              title={img.descripcion || 'Ver imagen'}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={img.url} 
                                alt={img.descripcion || 'Imagen'} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Eye className="text-white w-5 h-5 drop-shadow-md" />
                              </div>
                            </div>
                            
                            { /* Acciones fuera del modal removidas: se centralizan dentro del visor */ }
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {isFormOpen && (
        <ImagenFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            fetchImages()
            router.refresh()
            setIsFormOpen(false)
          }}
          initialData={editingImage}
          casoId={casoId}
          pacienteId={pacienteId}
          numeroHistoria={numeroHistoria}
        />
      )}

      {viewerImage && (
        <ImagenViewer
          isOpen={!!viewerImage}
          onClose={() => setViewerImage(null)}
          imagen={viewerImage}
          onEdit={(img) => { setEditingImage(img); setIsFormOpen(true) }}
          onDelete={(img) => setDeleteCandidate(img)}
        />
      )}

      <AlertDialog open={!!deleteCandidate} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-950 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              ¿Eliminar imagen?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <p>Esta acción eliminará la imagen permanentemente.</p>
                <p className="font-medium text-red-600 dark:text-red-400">Esta acción no se puede deshacer.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { UploadCloud, X, Loader2, Maximize2, Minimize2 } from 'lucide-react'
import { toast } from 'sonner'
import { ImagenPaciente } from './ImagenGallery'
import { updateImagenMetadata } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/imagenes/actions'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData: ImagenPaciente | null
  casoId: string
  pacienteId: string
  numeroHistoria: string
}

export default function ImagenFormModal({ 
  isOpen, onClose, onSuccess, initialData, 
  casoId, pacienteId, numeroHistoria 
}: Props) {
  
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('fotografia')
  const [etapa, setEtapa] = useState('durante')
  const [fechaCaptura, setFechaCaptura] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [seguimientoId, setSeguimientoId] = useState<string>('ninguno')
  const [seguimientos, setSeguimientos] = useState<Array<{ id: string; fecha: string; presupuesto_correlativo: string }>>([])
  const [loadingSeguimientos, setLoadingSeguimientos] = useState(false)

  // Cargar seguimientos disponibles cuando se abre el modal para crear
  useEffect(() => {
    if (!initialData && isOpen) {
      const fetchSeguimientos = async () => {
        setLoadingSeguimientos(true)
        try {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          
          const { data: segsData } = await supabase
            .from('seguimientos')
            .select('id, fecha, presupuesto_id')
            .eq('caso_id', casoId)
            .is('deleted_at', null)
            .order('fecha', { ascending: false })

          if (segsData && segsData.length > 0) {
            const presupuestoIds = Array.from(
              new Set(
                (segsData as Array<{ presupuesto_id: string | null }> )
                  .map((s) => s.presupuesto_id)
                  .filter((id): id is string => !!id)
              )
            )

            let correlativosMap = new Map<string, number>()
            if (presupuestoIds.length > 0) {
              const { data: presupuestosData } = await supabase
                .from('presupuestos')
                .select('id, correlativo')
                .eq('caso_id', casoId)
                .in('id', presupuestoIds)
                .is('deleted_at', null)
                .order('correlativo', { ascending: true })

              if (presupuestosData) {
                correlativosMap = new Map(
                  presupuestosData.map((p: { id: string; correlativo: number }) => [p.id, p.correlativo])
                )
              }
            }

            const mapped = (segsData as Array<{ id: string; fecha: string; presupuesto_id: string | null }>).map((s) => {
              const correlativo = s.presupuesto_id ? correlativosMap.get(s.presupuesto_id) : null
              const correlativoLabel = correlativo ? String(correlativo).padStart(3, '0') : 'S/N'
              return {
                id: s.id,
                fecha: s.fecha,
                presupuesto_id: s.presupuesto_id,
                correlativoNumber: correlativo,
                presupuesto_correlativo: correlativoLabel,
              }
            })

            // Quedarse con el seguimiento más reciente por presupuesto y ordenar por fecha desc + correlativo desc
            const latestByPresupuesto = new Map<string, typeof mapped[0]>()
            mapped.forEach((item) => {
              if (!item.presupuesto_id) return
              const existing = latestByPresupuesto.get(item.presupuesto_id)
              if (!existing || new Date(item.fecha).getTime() > new Date(existing.fecha).getTime()) {
                latestByPresupuesto.set(item.presupuesto_id, item)
              }
            })

            const dateOnly = (value: string) => {
              const d = new Date(value)
              d.setHours(0, 0, 0, 0)
              return d.getTime()
            }

            const uniqueSorted = Array.from(latestByPresupuesto.values()).sort((a, b) => {
              const dateDiff = dateOnly(b.fecha) - dateOnly(a.fecha)
              if (dateDiff !== 0) return dateDiff
              const aCor = a.correlativoNumber ?? 0
              const bCor = b.correlativoNumber ?? 0
              return bCor - aCor
            })

            setSeguimientos(uniqueSorted.map(({ id, fecha, presupuesto_correlativo }) => ({ id, fecha, presupuesto_correlativo })))
          }
        } catch (error) {
          console.error('Error cargando seguimientos:', error)
        } finally {
          setLoadingSeguimientos(false)
        }
      }
      fetchSeguimientos()
    }
  }, [initialData, isOpen, casoId])

  useEffect(() => {
    if (initialData) {
      setDescripcion(initialData.descripcion || '')
      setTipo(initialData.tipo || 'fotografia')
      setEtapa(initialData.etapa || 'durante')
      setFechaCaptura(initialData.fecha_captura ? new Date(initialData.fecha_captura).toISOString().split('T')[0] : '')
      setPreview(initialData.url)
      setSeguimientoId('ninguno')
    } else {
      setDescripcion('')
      setTipo('fotografia')
      setEtapa('durante')
      setFechaCaptura(new Date().toISOString().split('T')[0])
      setFile(null)
      setPreview(null)
      setSeguimientoId('ninguno')
    }
  }, [initialData, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(selected)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (initialData) {
        // EDICIÓN (Solo Metadata) - Pasamos el origen
        const res = await updateImagenMetadata(initialData.id, {
          descripcion,
          tipo,
          etapa,
          fecha_captura: fechaCaptura
        }, initialData.origen) // <--- PASAR ORIGEN
        
        if (!res.success) throw new Error(res.error)
        toast.success('Imagen actualizada', { style: { backgroundColor: '#008000', color: 'white' } })

      } else {
        // CREACIÓN (Subida)
        if (!file) {
          toast.error('Selecciona una imagen', { style: { backgroundColor: '#FF0000', color: 'white' } })
          setIsSubmitting(false)
          return
        }

        // Si se seleccionó un seguimiento, subir a seguimiento_imagenes
        if (seguimientoId && seguimientoId !== 'ninguno') {
          const formData = new FormData()
          // El endpoint espera arreglos para archivos y metadatos.
          formData.append('files', file)
          formData.append('tipos', tipo)
          formData.append('etapas', etapa)
          formData.append('descripciones', descripcion)
          formData.append('seguimiento_id', seguimientoId)
          formData.append('caso_id', casoId)
          formData.append('numero_historia', numeroHistoria)
          formData.append('fecha_captura', fechaCaptura)

          const res = await fetch('/api/imagenes/seguimiento/upload', {
            method: 'POST',
            body: formData
          })

          if (!res.ok) throw new Error('Error al subir imagen a seguimiento')
          toast.success('Imagen asociada al seguimiento correctamente', { style: { backgroundColor: '#008000', color: 'white' } })
        } else {
          // Sin seguimiento, subir a imagenes_pacientes (galería general del caso)
          const formData = new FormData()
          formData.append('file', file)
          formData.append('caso_id', casoId)
          formData.append('paciente_id', pacienteId)
          formData.append('numero_historia', numeroHistoria)
          formData.append('descripcion', descripcion)
          formData.append('tipo', tipo)
          formData.append('etapa', etapa)
          formData.append('fecha_captura', fechaCaptura)

          const res = await fetch('/api/imagenes/caso', {
            method: 'POST',
            body: formData
          })

          if (!res.ok) throw new Error('Error al subir imagen')
          toast.success('Imagen subida correctamente', { style: { backgroundColor: '#008000', color: 'white' } })
        }
      }

      onSuccess()
    } catch (error) {
      toast.error('Ocurrió un error', { style: { backgroundColor: '#FF0000', color: 'white' } })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isFullscreen && preview) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
          title="Salir de pantalla completa"
        >
          <Minimize2 className="w-6 h-6" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Vista completa" className="max-w-full max-h-full object-contain" />
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <DialogTitle>{initialData ? 'Editar Imagen' : 'Subir Nueva Imagen'}</DialogTitle>
              <DialogDescription>
                {initialData 
                  ? 'Modifica los detalles de la imagen seleccionada.' 
                  : 'Sube una nueva imagen y asigna sus metadatos.'}
              </DialogDescription>
            </div>
            {preview && initialData && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                title="Ver en pantalla completa"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          
          <div className="flex flex-col items-center justify-center">
            {preview ? (
              <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="max-h-[400px] flex items-center justify-center bg-slate-100 dark:bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-contain max-h-[400px]" />
                </div>
                {!initialData && (
                  <button 
                    type="button"
                    onClick={() => { setFile(null); setPreview(null) }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Clic para seleccionar imagen</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">JPG, PNG o WEBP (recomendado 1920x1080)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="mt-1 h-8 text-xs bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fotografia">Fotografía</SelectItem>
                  <SelectItem value="radiografia">Radiografía</SelectItem>
                  <SelectItem value="intraoral">Intraoral</SelectItem>
                  <SelectItem value="extraoral">Extraoral</SelectItem>
                  <SelectItem value="documento">Documento</SelectItem>
                  <SelectItem value="evidencia">Evidencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Etapa</Label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger className="mt-1 h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="antes">Antes</SelectItem>
                  <SelectItem value="durante">Durante</SelectItem>
                  <SelectItem value="despues">Después</SelectItem>
                  <SelectItem value="seguimiento">Seguimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Fecha Captura</Label>
              <Input 
                type="date" 
                value={fechaCaptura} 
                onChange={(e) => setFechaCaptura(e.target.value)} 
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>

          {!initialData && (
            <div>
              <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Seguimiento (opcional)
              </Label>
              <Select value={seguimientoId} onValueChange={setSeguimientoId} disabled={loadingSeguimientos}>
                <SelectTrigger className="mt-1 h-8 text-xs bg-background">
                  <SelectValue placeholder={loadingSeguimientos ? "Cargando..." : "Seleccionar seguimiento o dejar vacío"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguno">Sin seguimiento (Galería general)</SelectItem>
                  {seguimientos.map((seg) => (
                    <SelectItem key={seg.id} value={seg.id}>
                      {new Date(seg.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {seg.presupuesto_correlativo === 'S/N' ? 'Sin presupuesto' : `Presupuesto #${seg.presupuesto_correlativo}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Si seleccionas un seguimiento, la imagen se asociará a ese seguimiento específico.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="desc" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Descripción</Label>
            <Textarea 
              id="desc" 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              placeholder="Detalles clínicos..." 
              className="mt-1 h-20 resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
            <Button 
              type="submit" 
              variant="default" 
              disabled={isSubmitting}
              className="min-w-[120px] bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (initialData ? 'Guardar Cambios' : 'Subir Imagen')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Badge } from "@/components/ui/badge"
import SeguimientoImagesUploader, { ExtendedFileMeta } from '@/components/casos/seguimiento/SeguimientoImagesUploader'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import VersionSelect from '@/components/odontograma/VersionSelect'
import { CheckCircle2, Save, ChevronLeft, Trash2, X, ChevronsUpDown, Check, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Props { casoId: string; numeroHistoria: string; pacienteId?: string; seguimientoId?: string }
interface ProcedimientoItem { id: string; procedimiento_id: string | null; nombre_procedimiento: string; descripcion?: string; cantidad: number; costo_unitario: number; costo_final: number; pieza_dental?: string }
interface PresupuestoItemRaw {
  procedimiento_id: string
  procedimiento_nombre: string
  cantidad: number
  costo: number
  pieza_dental?: string
  orden_ejecucion?: number
  notas?: string
}
interface Presupuesto { id: string; nombre: string; costo_total: number; moneda_id: string | null; fecha_creacion: string; moneda_codigo?: string; correlativo?: number; items_json?: PresupuestoItemRaw[] | null }
interface StoredFormData {
  descripcion: string; motivo: string; inicio: string; duracion: string; estado: string; presupuestoId: string; montoPago: string; tipoPago: string;
  comprobante: string; monedaSeleccionada: string; versionSeleccionada: number | null; proximaCitaHabilitada: boolean; pendingFiles: ExtendedFileMeta[]
}
interface ImagenExistente { id: string; imagen_url: string; public_id: string; tipo: string; descripcion?: string }
interface MonedaDB { id: string; codigo: string }
interface PresupuestoRaw { id: string; nombre: string; costo_total: number; moneda_id: string | null; fecha_creacion: string; correlativo: number; items_json?: PresupuestoItemRaw[] | null }

export default function SeguimientoForm({ casoId, numeroHistoria, pacienteId, seguimientoId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [tempSeguimientoId] = useState(() => 'temp_' + Math.random().toString(36).substr(2, 9))
  
  const [descripcion, setDescripcion] = useState('')
  const [motivo, setMotivo] = useState('')
  const [motivoEdited, setMotivoEdited] = useState(false)
  const [inicio, setInicio] = useState('')
  const [duracion, setDuracion] = useState<string>('') 
  const [estado, setEstado] = useState<string>('') 
  const [presupuestoId, setPresupuestoId] = useState<string>('') 
  const [montoPago, setMontoPago] = useState('')
  const [tipoPago, setTipoPago] = useState<string>('')
  const [comprobante, setComprobante] = useState('')
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<string>('')
  
  const [proximaCitaHabilitada, setProximaCitaHabilitada] = useState(() => !!seguimientoId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [monedas, setMonedas] = useState<Array<{ id: string; codigo: string }>>([])
  const [saldoSeleccionado, setSaldoSeleccionado] = useState<number | null>(null)
  
  const [loadingPresupuestos, setLoadingPresupuestos] = useState(true)
  const [loadingMonedas, setLoadingMonedas] = useState(true)
  const [loadingVersiones, setLoadingVersiones] = useState(true)
  
  const [pendingFiles, setPendingFiles] = useState<ExtendedFileMeta[]>([])
  const [existingImages, setExistingImages] = useState<ImagenExistente[]>([])
  
  const [versionesOdonto, setVersionesOdonto] = useState<number[]>([])
  const [versionSeleccionada, setVersionSeleccionada] = useState<number | null>(null)

  // Diagnósticos eliminados del flujo de selección en Pago/Presupuesto
  const [procedimientosDelPresupuesto, setProcedimientosDelPresupuesto] = useState<ProcedimientoItem[]>([])
  const [procedimientosSeleccionados, setProcedimientosSeleccionados] = useState<string[]>([])
  const [procSearchTerm, setProcSearchTerm] = useState("")
  const [isProcOpen, setIsProcOpen] = useState(false)
  const procWrapperRef = useRef<HTMLDivElement>(null)
  
  // Eliminado: selección de diagnósticos y UI asociada

  const storageKey = `seguimiento_form_${casoId}`

  const getCurrencySymbol = (code?: string | null): string => {
    if (!code) return 'S/'
    const map: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', PEN: 'S/', CLP: 'CLP', UYU: '$U', MXN: '$', ARS: '$' }
    return map[code] || code + ' '
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!val) { setInicio(''); return }
    const yearPart = val.split('-')[0]
    if (yearPart.length > 4) return
    setInicio(val)
  }

  const handleFilesChange = useCallback((files: ExtendedFileMeta[]) => {
    setPendingFiles(files)
  }, [])

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') {
          setMontoPago('');
          return;
      }
      
      const numericVal = parseFloat(val);
      if (isNaN(numericVal)) return;
      if (numericVal < 0) return;

      if (saldoSeleccionado !== null) {
          if (numericVal > (saldoSeleccionado + 0.01)) {
              setMontoPago(saldoSeleccionado.toFixed(2));
              toast.warning("El pago no puede exceder el saldo pendiente.");
              return;
          }
      }
      setMontoPago(val);
  }

  // Eliminado: manejador de click-outside para diagnóstico

  useEffect(() => {
    const handleProcClickOutside = (event: MouseEvent) => {
      if (procWrapperRef.current && !procWrapperRef.current.contains(event.target as Node)) {
        setIsProcOpen(false)
      }
    }
    document.addEventListener("mousedown", handleProcClickOutside)
    return () => document.removeEventListener("mousedown", handleProcClickOutside)
  }, [])

  useEffect(() => {
    if (!seguimientoId) return
    const loadSeguimiento = async () => {
      setLoadingData(true)
      try {
        const res = await fetch(`/api/seguimientos/${seguimientoId}`)
        if (!res.ok) throw new Error('Error cargando datos')
        const { data } = await res.json()
        setDescripcion(data.descripcion || '')
        setMotivo(data.titulo || '')
        if (data.titulo) setMotivoEdited(true)
        if (data.odontograma_version) setVersionSeleccionada(Number(data.odontograma_version))
        setProximaCitaHabilitada(true)
        if (data.citas) {
          const dateObj = new Date(data.citas.fecha_inicio)
          const localIso = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
          setInicio(localIso)
          setDuracion(((new Date(data.citas.fecha_fin).getTime() - dateObj.getTime()) / 60000).toString())
          setEstado(data.citas.estado || '')
        }
        if (data.pagos) {
          setPresupuestoId(data.pagos.presupuesto_id || '')
          setMontoPago(data.pagos.monto.toString())
          setTipoPago(data.pagos.metodo_pago || '')
          setComprobante(data.pagos.numero_comprobante || '')
        } else if (data.presupuesto_id) setPresupuestoId(data.presupuesto_id)
        if (data.seguimiento_imagenes) setExistingImages(data.seguimiento_imagenes)
        const tratamientos = data.tratamientos_realizados_ids || data.procedimientos_realizados || []
        if (Array.isArray(tratamientos) && tratamientos.length > 0) setProcedimientosSeleccionados(tratamientos)
      } catch (error) { toast.error('Error al cargar') } finally { setLoadingData(false) }
    }
    loadSeguimiento()
  }, [seguimientoId])

  useEffect(() => {
    if (seguimientoId) return 
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      try {
        const data = JSON.parse(raw) as StoredFormData
        setDescripcion(data.descripcion || '')
        setMotivo(data.motivo || '')
        setInicio(data.inicio || '')
        setDuracion(data.duracion || '')
        setEstado(data.estado || '')
        setPresupuestoId(data.presupuestoId || '')
        setMontoPago(data.montoPago || '')
        setTipoPago(data.tipoPago || '')
        setComprobante(data.comprobante || '')
        setMonedaSeleccionada(data.monedaSeleccionada || '')
        if (data.versionSeleccionada) setVersionSeleccionada(data.versionSeleccionada)
        if (data.proximaCitaHabilitada !== undefined) setProximaCitaHabilitada(data.proximaCitaHabilitada)
      } catch (e) { console.warn(e) }
    }
  }, [seguimientoId, storageKey])

  // Eliminado: autollenado del motivo desde diagnósticos

  useEffect(() => {
    if (seguimientoId) return
    const dataToSave: StoredFormData = {
      descripcion, motivo, inicio, duracion, estado,
      presupuestoId, montoPago, tipoPago, comprobante,
      monedaSeleccionada, versionSeleccionada, proximaCitaHabilitada,
      pendingFiles: []
    }
    localStorage.setItem(storageKey, JSON.stringify(dataToSave))
  }, [seguimientoId, descripcion, motivo, inicio, duracion, estado, presupuestoId, montoPago, tipoPago, comprobante, monedaSeleccionada, versionSeleccionada, proximaCitaHabilitada, storageKey])

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPresupuestos(true)
      setLoadingMonedas(true)
      try {
        const { data: monedasData } = await supabase.from('monedas').select('id, codigo')
        const mData = monedasData as MonedaDB[] | null
        const monedasMap = new Map((mData || []).map(m => [m.id, m.codigo]))
        if (mData) setMonedas(mData)
        const { data: presData } = await supabase
          .from('presupuestos')
          .select('id, nombre, costo_total, moneda_id, fecha_creacion, correlativo, items_json')
          .eq('caso_id', casoId)
          .is('deleted_at', null)
          .order('correlativo', { ascending: true })
        const rawPresupuestos = presData as unknown as PresupuestoRaw[] | null
        const presup = ((rawPresupuestos || [])).map((p) => ({ ...p, moneda_codigo: p.moneda_id ? monedasMap.get(p.moneda_id) : 'PEN' }))
        setPresupuestos(presup)
      } catch (err) { } finally { setLoadingPresupuestos(false); setLoadingMonedas(false) }
    }
    fetchData()
  }, [casoId, supabase])

  useEffect(() => {
    let isMounted = true;
    if (!pacienteId) { setLoadingVersiones(false); return; }
    const fetchOdontogramas = async () => {
        setLoadingVersiones(true);
        try {
            const { data: odontoData, error } = await supabase.from('odontogramas').select('version').eq('paciente_id', pacienteId).order('version', { ascending: false });
            if (error) throw error;
            if (isMounted) {
                if (odontoData && odontoData.length > 0) {
                    const versiones = odontoData.map(v => v.version);
                    const versionesUnicas = Array.from(new Set(versiones));
                    setVersionesOdonto(versionesUnicas);
                    if (!seguimientoId && versionSeleccionada === null) setVersionSeleccionada(versionesUnicas[0]);
                } else setVersionesOdonto([]);
            }
        } catch(e) { } finally { if (isMounted) setLoadingVersiones(false); }
    }
    fetchOdontogramas();
    return () => { isMounted = false; }
  }, [pacienteId, seguimientoId, supabase, versionSeleccionada]);

  useEffect(() => {
    if (!presupuestoId) {
      setSaldoSeleccionado(null)
      setProcedimientosDelPresupuesto([])
      return
    }
    const presupuesto = presupuestos.find((p) => p.id === presupuestoId)
    if (!presupuesto) return
    
    // Extraer items del items_json del presupuesto
    const itemsJson = Array.isArray(presupuesto.items_json) ? presupuesto.items_json : []
    const mappedItems: ProcedimientoItem[] = itemsJson.map((item, idx) => ({
      id: `${presupuestoId}_${item.procedimiento_id}_${idx}`,
      procedimiento_id: item.procedimiento_id,
      nombre_procedimiento: item.procedimiento_nombre,
      descripcion: item.notas,
      cantidad: item.cantidad || 1,
      costo_unitario: item.costo || 0,
      costo_final: (item.costo || 0) * (item.cantidad || 1),
      pieza_dental: item.pieza_dental
    }))
    setProcedimientosDelPresupuesto(mappedItems)
  }, [presupuestoId, presupuestos])

  useEffect(() => {
    if (!presupuestoId) { setSaldoSeleccionado(null); return }
    const calcularSaldo = async () => {
      try {
        const presupuesto = presupuestos.find((p) => p.id === presupuestoId)
        if (presupuesto) {
             if (!seguimientoId && !motivo && !motivoEdited) setMotivo(presupuesto.nombre)
             if (!monedaSeleccionada) {
                const codigo = monedas.find(m => m.id === presupuesto.moneda_id)?.codigo
                if (codigo) setMonedaSeleccionada(codigo)
             }
        }
        const { data: pagos } = await supabase.from('pagos').select('monto').eq('presupuesto_id', presupuestoId).is('deleted_at', null)
        const pagosList = pagos as { monto: number }[] | null
        const totalPagado = (pagosList || []).reduce((s, p) => s + Number(p.monto), 0)
        const saldo = Math.max(0, Number(presupuesto?.costo_total || 0) - totalPagado)
        setSaldoSeleccionado(saldo)

        // Eliminado: carga de diagnósticos vinculados al presupuesto
      } catch (error) { console.error(error) }
    }
    calcularSaldo()
  }, [presupuestoId, presupuestos, monedas, seguimientoId, motivo, monedaSeleccionada, supabase])

  const handleDeleteImage = async (imageId: string, publicId: string) => {
    if(!confirm("¿Eliminar imagen permanentemente?")) return
    try {
      await fetch(`/api/imagenes/caso?id=${imageId}&public_id=${publicId}&origen=seguimiento`, { method: 'DELETE' })
      setExistingImages(prev => prev.filter(img => img.id !== imageId))
      toast.success('Imagen eliminada', { style: { backgroundColor: '#008000', color: 'white' } })
    } catch {
      toast.error('Error al eliminar imagen', { style: { backgroundColor: '#FF0000', color: 'white' } })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const selectedVersion = versionSeleccionada ?? (versionesOdonto.length > 0 ? versionesOdonto[0] : null)
      const payload = {
        caso_id: casoId,
        paciente_id: pacienteId,
        descripcion,
        titulo: motivo || 'Control',
        estado: 'activo',
        tipo: 'control',
        odontograma_version: selectedVersion,
        fecha_proxima_cita: proximaCitaHabilitada ? inicio : null,
        duracion_proxima_cita: proximaCitaHabilitada ? duracion : null,
        estado_cita: proximaCitaHabilitada ? (estado || 'Programada') : null,
        // Guardar tratamientos seleccionados en la nueva columna tratamientos_realizados_ids
        tratamientos_realizados_ids: procedimientosSeleccionados,
        // Mantener procedimientos_realizados por compatibilidad, si el backend lo soporta
        procedimientos_realizados: procedimientosSeleccionados,
        pago: (!seguimientoId && presupuestoId && montoPago && parseFloat(montoPago) > 0)
          ? {
              presupuesto_id: presupuestoId,
              monto: parseFloat(montoPago),
              moneda_id: monedas.find(m => m.codigo === monedaSeleccionada)?.id,
              tipo: tipoPago,
              numero_comprobante: comprobante
            }
          : null
      }
      const url = seguimientoId ? `/api/seguimientos/${seguimientoId}` : '/api/seguimientos'
      const method = seguimientoId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Error') }
      const json = await res.json()
      const savedId = seguimientoId || json.data.id

      if (pendingFiles.length > 0) {
        const filesToUpload = pendingFiles.filter((p) => p && p.file instanceof File)
        
        if (filesToUpload.length > 0) {
            const formData = new FormData()
            
            formData.append('seguimiento_id', savedId)
            formData.append('caso_id', casoId)
            formData.append('numero_historia', numeroHistoria)

            filesToUpload.forEach((fileData) => {
                if (fileData.file) {
                    formData.append('files', fileData.file)
                    formData.append('tipos', fileData.tipo || 'evidencia')
                    formData.append('etapas', fileData.etapa || 'seguimiento')
                    formData.append('descripciones', fileData.descripcion || '')
                }
            })
            
            const uploadRes = await fetch('/api/imagenes/seguimiento/upload', { 
                method: 'POST', 
                body: formData 
            })

            if (!uploadRes.ok) {
                throw new Error('Error al subir imágenes')
            }
        }
      }

      toast.success(seguimientoId ? 'Actualizado' : 'Seguimiento registrado exitosamente', { style: { backgroundColor: '#008000', color: 'white' } })
      
      // Forzar recarga completa para actualizar KPIs
      window.location.href = `/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/seguimiento`
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error', { style: { backgroundColor: '#FF0000', color: 'white' } })
      setIsSubmitting(false)
    }
  }

  // Eliminado: filtro de diagnósticos

  if (loadingData) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>

  return (
    <div className='space-y-4'>
      <div className='flex items-center mb-6'>
        <h1 className='text-2xl font-bold'>{seguimientoId ? 'Editar Seguimiento' : 'Nuevo Seguimiento'}</h1>
      </div>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='space-y-6'>
            <Card className='p-4 border-slate-200 shadow-sm dark:border-slate-800 dark:bg-card'>
              <div className='-mx-4 -mt-4 px-4 py-3 mb-4 rounded-t-lg bg-sky-700 text-white'><h3 className='text-base font-semibold'>1. Odontograma</h3></div>
              <div className='flex items-end gap-3'>
                <div className='flex-1'><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Versión</label><VersionSelect key={loadingVersiones ? 'loading' : 'loaded'} versiones={versionesOdonto} selectedVersion={versionSeleccionada} onSelectVersion={setVersionSeleccionada} isLoading={loadingVersiones} /></div>
                <Button type='button' variant='outline' size='sm' className='h-8' onClick={() => {router.push(`/admin/ficha-odontologica/${numeroHistoria}/odontograma?from=detalles&casoId=${casoId}&numeroHistoria=${numeroHistoria}`)}}>Ver Detalles</Button>
              </div>
            </Card>

            <Card className='p-4 border-slate-200 shadow-sm dark:border-slate-800 dark:bg-card'>
              <div className='-mx-4 -mt-4 px-4 py-3 mb-4 rounded-t-lg bg-sky-700 text-white'><h3 className='text-base font-semibold'>2. Evidencia</h3></div>
              
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <ImageIcon className="w-4 h-4 text-sky-600" />
                    <label className="text-sm font-semibold text-slate-700">Imágenes Guardadas</label>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((img) => (
                      <Card key={img.id} className="relative group overflow-hidden border-slate-200 shadow-sm transition-all rounded-lg">
                        <div className="aspect-[4/3] relative bg-slate-100 border-b border-slate-100">
                            <Image 
                              src={img.imagen_url} 
                              alt="Evidencia" 
                              fill 
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                            
                            <div className='absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <Button 
                                    onClick={() => handleDeleteImage(img.id, img.public_id)} 
                                    variant="destructive" 
                                    size="icon" 
                                    className='h-7 w-7 rounded-full shadow-md opacity-90 hover:opacity-100' 
                                    type='button'
                                    title="Eliminar imagen permanentemente"
                                >
                                    <Trash2 className='h-3 w-3' />
                                </Button>
                            </div>

                            <div className="absolute bottom-2 left-2">
                                <Badge variant="secondary" className="text-[10px] uppercase shadow-sm bg-white/90 backdrop-blur-sm text-slate-700">
                                    {img.tipo || 'Evidencia'}
                                </Badge>
                            </div>
                        </div>
                        {img.descripcion && (
                            <div className="p-2 bg-white">
                                <p className="text-[10px] text-slate-500 line-clamp-2" title={img.descripcion}>
                                    {img.descripcion}
                                </p>
                            </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className='text-xs text-muted-foreground mb-3'>Nuevas imágenes:</div>
              <SeguimientoImagesUploader casoId={casoId} numeroHistoria={numeroHistoria} seguimientoId={seguimientoId || tempSeguimientoId} onFilesChange={handleFilesChange} />
            </Card>

            <Card className='p-4 border-slate-200 shadow-sm dark:border-slate-800 dark:bg-card'>
              <div className='-mx-4 -mt-4 px-4 py-3 mb-4 rounded-t-lg bg-sky-700 text-white'><h3 className='text-base font-semibold'>3. Pago y Presupuesto</h3></div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="md:col-span-1"> 
                  <label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Presupuesto</label>
                  <Select value={presupuestoId || ""} onValueChange={(v) => setPresupuestoId(v)} disabled={!!seguimientoId}>
                    <SelectTrigger className='w-full h-8 text-xs bg-background'><SelectValue placeholder='Seleccionar' /></SelectTrigger>
                      <SelectContent>
                        {presupuestos.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex flex-col text-left py-1">
                              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Presupuesto #{String(p.correlativo || 1).padStart(3, '0')}</span>
                              <span className="text-xs text-muted-foreground dark:text-slate-400">{format(new Date(p.fecha_creacion), 'dd/MM/yyyy')} — {getCurrencySymbol(p.moneda_codigo || 'PEN')} {p.costo_total.toFixed(2)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className='block text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase mb-1'>Saldo pendiente</label>
                  <div className='text-sm font-medium pt-2 text-slate-700 dark:text-slate-200'>{saldoSeleccionado !== null ? `${getCurrencySymbol(monedaSeleccionada)} ${saldoSeleccionado.toFixed(2)}` : '-'}</div>
                </div>
                
                {presupuestoId && (
                  <div className="col-span-2 space-y-6">
                    <div className="space-y-2">
                      <Label className="block text-xs font-semibold text-slate-500 uppercase">Tratamientos hechos hoy:</Label>
                        {procedimientosSeleccionados.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2 min-w-0">
                            {procedimientosSeleccionados.map((id) => {
                              const p = procedimientosDelPresupuesto.find(proc => proc.id === id);
                              if (!p) return null;
                              return (
                                <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1 gap-1 text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 min-w-0 max-w-full dark:bg-slate-700 dark:text-emerald-300 dark:border-slate-600 dark:hover:bg-slate-600">
                                  <span className="block truncate max-w-[260px]">{p.nombre_procedimiento}</span>
                                  <span className="cursor-pointer hover:text-emerald-950 p-0.5 rounded-full hover:bg-emerald-300/50 ml-2 dark:hover:bg-slate-600" onClick={() => setProcedimientosSeleccionados(prev => prev.filter(sid => sid !== id))}>
                                    <X className="h-3 w-3" />
                                  </span>
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                        <div className="relative" ref={procWrapperRef}>
                          <Input
                            value={procSearchTerm}
                            onChange={(e) => { setProcSearchTerm(e.target.value); setIsProcOpen(true); }}
                            onFocus={() => setIsProcOpen(true)}
                            placeholder="Buscar tratamiento registrado en presupuesto..."
                            className="w-full h-8 text-xs bg-background pr-8"
                            autoComplete="off"
                          />
                          <ChevronsUpDown className="absolute right-2 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
                          {isProcOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                              {procedimientosDelPresupuesto.filter(p => p.nombre_procedimiento.toLowerCase().includes(procSearchTerm.toLowerCase())).length > 0 ? (
                                procedimientosDelPresupuesto.filter(p => p.nombre_procedimiento.toLowerCase().includes(procSearchTerm.toLowerCase())).map((opt) => {
                                  const isSelected = procedimientosSeleccionados.includes(opt.id)
                                  return (
                                    <div
                                      key={opt.id}
                                      className={cn("px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 last:border-b-0", isSelected && "bg-emerald-50 text-emerald-900 dark:bg-slate-700 dark:text-emerald-300")}
                                      onClick={() => {
                                        if (!isSelected) setProcedimientosSeleccionados(prev => [...prev, opt.id]); else setProcedimientosSeleccionados(prev => prev.filter(sid => sid !== opt.id));
                                        setProcSearchTerm("");
                                      }}
                                    >
                                      <div className="flex-1 min-w-0">
                                        <span className={cn("block truncate", isSelected && "font-medium")}>{opt.nombre_procedimiento}</span>
                                        {opt.descripcion && <span className="text-[10px] text-muted-foreground dark:text-slate-400 line-clamp-1">{opt.descripcion}</span>}
                                      </div>
                                      {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 ml-2" />}
                                    </div>
                                  )
                                })
                              ) : (
                                <div className="px-3 py-2 text-sm text-muted-foreground italic text-center">No se encontraron tratamientos</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                  </div>
                )}

                 {seguimientoId && montoPago ? (
                   <div className="col-span-2 bg-blue-50 text-blue-700 p-3 rounded text-sm text-center border border-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:border-slate-700">Pago registrado: {montoPago}</div>
                 ) : (
                  <>
                    <div className='col-span-1 md:col-span-2'><hr className='border-t border-gray-200 my-2' /></div>
                    <div><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Moneda Pago</label><Select value={monedaSeleccionada || ""} onValueChange={(v) => setMonedaSeleccionada(v)} disabled={!!presupuestoId}><SelectTrigger className='w-full h-8 text-xs bg-background'><SelectValue placeholder='Sel.' /></SelectTrigger><SelectContent>{monedas.map((m) => (<SelectItem key={m.id} value={m.codigo}>{m.codigo}</SelectItem>))}</SelectContent></Select></div>
                    <div>
                      <div className='flex justify-between'><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Monto a pagar</label></div>
                      <Input type='number' step='0.01' value={montoPago} onChange={handleMontoChange} placeholder='0.00' className='h-8 text-xs mt-1' disabled={!presupuestoId || (saldoSeleccionado !== null && saldoSeleccionado <= 0)} />
                    </div>
                    <div className='col-span-1 md:col-span-2'><hr className='border-t border-gray-200 my-2' /></div>
                    <div><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Tipo de pago</label><Select value={tipoPago || ""} onValueChange={(v) => setTipoPago(v)} disabled={!presupuestoId}><SelectTrigger className='w-full h-8 text-xs bg-background'><SelectValue placeholder='Sel.' /></SelectTrigger><SelectContent><SelectItem value='efectivo'>Efectivo</SelectItem><SelectItem value='tarjeta'>Tarjeta</SelectItem><SelectItem value='transferencia'>Transferencia</SelectItem><SelectItem value='yape'>Yape/Plin</SelectItem></SelectContent></Select></div>
                    <div><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>N° Operación</label><Input value={comprobante} onChange={(e) => setComprobante(e.target.value)} placeholder='Opcional' className='mt-1 h-8 text-xs' disabled={!presupuestoId} /></div>
                  </>
                )}
              </div>
            </Card>
          </div>
          <div className='space-y-4'>
            <Card className='p-4 border-slate-200 shadow-sm dark:border-slate-800 dark:bg-card'>
              <div className='-mx-4 -mt-4 px-4 py-3 mb-4 rounded-t-lg bg-sky-700 text-white'><div className='flex items-center justify-between'><h3 className='text-base font-semibold'>4. Próxima Cita</h3><div className='flex items-center gap-2 cursor-pointer bg-white/20 px-2 py-1 rounded-full' onClick={() => setProximaCitaHabilitada(!proximaCitaHabilitada)}><span className='text-[10px] font-medium opacity-90 uppercase'>{proximaCitaHabilitada ? 'ON' : 'OFF'}</span><div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${proximaCitaHabilitada ? 'bg-green-400' : 'bg-slate-400'}`}><div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${proximaCitaHabilitada ? 'translate-x-4' : 'translate-x-0'}`} /></div></div></div></div>
              <div className={`space-y-4 transition-all ${proximaCitaHabilitada ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
                   <div><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Motivo / Título</label><Textarea value={motivo} onChange={(e) => { setMotivo(e.target.value); setMotivoEdited(true); }} className='h-20 resize-none' disabled={!proximaCitaHabilitada} /></div>
                <div className='flex flex-wrap gap-2 items-end'>
                  <div><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Inicio</label><Input type='datetime-local' value={inicio} onChange={handleDateChange} className='mt-0 h-8 text-sm w-fit px-2' disabled={!proximaCitaHabilitada} /></div>
                  <div className='flex items-end gap-2'><div className='w-24'><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Duración</label><Select value={duracion || ""} onValueChange={(v) => setDuracion(v)} disabled={!proximaCitaHabilitada}><SelectTrigger className='w-full h-8 text-xs bg-background'><SelectValue placeholder='Sel.' /></SelectTrigger><SelectContent><SelectItem value='15'>15 min</SelectItem><SelectItem value='30'>30 min</SelectItem><SelectItem value='45'>45 min</SelectItem><SelectItem value='60'>1 h</SelectItem></SelectContent></Select></div><div className='w-32'><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Estado</label><Select value={estado || ""} onValueChange={(v) => setEstado(v)} disabled={!proximaCitaHabilitada}><SelectTrigger className='w-full h-8 text-xs bg-background'><SelectValue placeholder='Sel.' /></SelectTrigger><SelectContent><SelectItem value='Programada'>Programada</SelectItem><SelectItem value='Confirmada'>Confirmada</SelectItem><SelectItem value='Cancelada'>Cancelada</SelectItem></SelectContent></Select></div></div>
                </div>
                <div><label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Notas adicionales</label><Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className='h-20 resize-none' disabled={!proximaCitaHabilitada} /></div>
              </div>
            </Card>
          </div>
        </div>
        <div className='flex gap-2 justify-end pt-4 border-t dark:border-slate-800'>
          <Button
            type='submit'
            variant='default'
            disabled={isSubmitting}
            className={`min-w-[200px] inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${isSubmitting ? 'opacity-60 pointer-events-none' : ''} bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100`}
          >
            {isSubmitting ? 'Guardando...' : <><Save className='w-4 h-4 mr-2' /> Guardar</>}
          </Button>

          <Button
            type='button'
            variant='default'
            onClick={() => router.push(`/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/seguimiento`)}
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${isSubmitting ? 'opacity-60 pointer-events-none' : ''} bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100`}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { upsertDiagnostico, deleteDiagnostico } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/diagnostico/actions'
import { type Diagnostico } from './DiagnosticoTable'
import { createClient } from '@/lib/supabase/client'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Cie10Entry = {
  id: string
  codigo: string
  descripcion: string
}

type DiagnosticoFormModalProps = {
  isOpen: boolean
  onClose: () => void
  diagnostico: Diagnostico | null
  casoId: string
  userId: string
}

type ActionResult = { success?: boolean; error?: { message?: string; details?: string } }

export default function DiagnosticoFormModal({
  isOpen,
  onClose,
  diagnostico,
  casoId,
  userId,
}: DiagnosticoFormModalProps) {
  function getCie10Data(cie10_catalogo: Diagnostico['cie10_catalogo']) {
    if (!cie10_catalogo) return { id: '', codigo: 'N/A', descripcion: 'N/A' }
    if (Array.isArray(cie10_catalogo)) {
      const entry = cie10_catalogo.length > 0 ? cie10_catalogo[0] : null
      if (entry) {
        const rec = entry as Record<string, unknown>
        const id = typeof rec['id'] === 'string' ? (rec['id'] as string) : ''
        const codigo = typeof rec['codigo'] === 'string' ? (rec['codigo'] as string) : 'N/A'
        const descripcion = typeof rec['descripcion'] === 'string' ? (rec['descripcion'] as string) : 'N/A'
        return { id, codigo, descripcion }
      }
      return { id: '', codigo: 'N/A', descripcion: 'N/A' }
    }
    const rec = cie10_catalogo as Record<string, unknown>
    return {
      id: typeof rec['id'] === 'string' ? (rec['id'] as string) : '',
      codigo: typeof rec['codigo'] === 'string' ? (rec['codigo'] as string) : 'N/A',
      descripcion: typeof rec['descripcion'] === 'string' ? (rec['descripcion'] as string) : 'N/A',
    }
  }

  const [tipo, setTipo] = useState(diagnostico?.tipo || '')
  const [cie10Id, setCie10Id] = useState<string | null>(diagnostico?.cie10_id || null)
  const [cie10SearchTerm, setCie10SearchTerm] = useState('')
  const [cie10Options, setCie10Options] = useState<Cie10Entry[]>([])
  const [isCie10Open, setIsCie10Open] = useState(false)
  const [selectedCie10State, setSelectedCie10State] = useState<Cie10Entry | null>(diagnostico ? getCie10Data(diagnostico.cie10_catalogo) : null)
  const [errors, setErrors] = useState<{ tipo?: string; cie10Id?: string; odontologoId?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalOptions, setPersonalOptions] = useState<Array<{ id: string; nombre_completo: string }>>([])
  const [odontologoId, setOdontologoId] = useState<string | null>(diagnostico?.odontologo_id || null)
  const [currentPersonalName, setCurrentPersonalName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const cieWrapperRef = useRef<HTMLDivElement | null>(null)

  const supabase = createClient()

  useEffect(() => {
    setTipo(diagnostico?.tipo || '')
    setCie10Id(diagnostico?.cie10_id || null)
    setCie10SearchTerm(diagnostico?.cie10_catalogo ? getCie10Data(diagnostico.cie10_catalogo).descripcion : '')
    setSelectedCie10State(diagnostico ? getCie10Data(diagnostico.cie10_catalogo) : null)
    setErrors({})
    setOdontologoId(diagnostico?.odontologo_id || null)
  }, [diagnostico, isOpen])

  useEffect(() => {
    let mounted = true
    const loadPersonal = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('personal').select('id, nombre_completo').eq('activo', true)
        if (error) throw error
        if (mounted && Array.isArray(data)) {
          const personalData = data as Array<{ id: string; nombre_completo: string }>
          setPersonalOptions(personalData)
          if (userId) {
            const match = personalData.find((p) => p.id === userId)
            if (match) setOdontologoId(match.id)
          }
        }
      } catch {
        // ignore
      }
    }
    loadPersonal()
    return () => { mounted = false }
  }, [userId])

  // Resolver usuario auth actual y su nombre en 'personal' para autocompletar
  useEffect(() => {
    const resolver = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        // usuario actual resuelto para autocompletar nombre en el formulario
        if (user?.email) {
          const { data: personalMatch } = await supabase.from('personal').select('id, nombre_completo').ilike('email', user.email).limit(1)
          if (personalMatch && personalMatch.length > 0) {
            setCurrentPersonalName(personalMatch[0].nombre_completo)
            // si no hay odontologoId y es creación, fijarlo al id auth (para acciones server-side que comparan con auth id)
            if (!odontologoId) setOdontologoId(user.id)
          }
        }
      } catch (e) {
        console.error('Error resolving current user for diagnostico:', e)
      }
    }
    resolver()
  }, [])

  useEffect(() => {
    const searchCie10 = async () => {
      const term = typeof cie10SearchTerm === 'string' ? cie10SearchTerm : String(cie10SearchTerm ?? '')
      const shouldSearchAll = (!term || term.length < 2) && isCie10Open

      if (!shouldSearchAll && (!term || term.length < 2)) {
        setCie10Options([])
        return
      }

      let query = supabase.from('cie10_catalogo').select('id, codigo, descripcion')
      query = query.order('codigo', { ascending: true })

      if (!shouldSearchAll) {
        const normalized = term.trim()
        const safe = normalized.replace(/[,%()"']/g, ' ').trim()
        const orConditions: string[] = []
        if (safe.includes(' - ')) {
          const [codePart, descPart] = safe.split(' - ', 2).map((s) => s.trim())
          if (codePart) orConditions.push(`codigo.ilike.%${codePart}%`)
          if (descPart) orConditions.push(`descripcion.ilike.%${descPart}%`)
        }
        orConditions.push(`codigo.ilike.%${safe}%`)
        orConditions.push(`descripcion.ilike.%${safe}%`)
        const filtered = orConditions.filter(Boolean)
        if (filtered.length > 0) query = query.or(filtered.join(','))
      }

      try {
  const { data, error } = await query.limit(200)

        if (error) {
          console.error('Error searching CIE10:', error, JSON.stringify(error, Object.getOwnPropertyNames(error)))
          setCie10Options([])
        } else {
          setCie10Options(data || [])
        }
        } catch (err) {
        console.error('Unexpected error searching CIE10:', err, typeof err === 'object' ? JSON.stringify(err) : err)
          toast.error('No se pudo conectar al servicio de CIE10.', { style: { backgroundColor: '#FF0000', color: 'white' } })
        setCie10Options([])
      }
    }
    const handler = setTimeout(() => {
      searchCie10()
    }, 300)
    return () => clearTimeout(handler)
  }, [cie10SearchTerm, supabase, isCie10Open])

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!cieWrapperRef.current) return
      if (!cieWrapperRef.current.contains(e.target as Node)) {
        setIsCie10Open(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCie10Open(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const validate = () => {
    const newErrors: { odontologoId?: string } = {}
    const newWarnings: { tipo?: string; cie10?: string; odontologo?: string } = {}

    if (!tipo) {
      newWarnings.tipo = 'Falta seleccionar el tipo de diagnóstico.'
    }
    if (!cie10Id) {
      newWarnings.cie10 = 'Falta seleccionar el código CIE10.'
    }
    if (!odontologoId) {
      // No requerimos selección manual de odontólogo; se autocompleta con la cuenta actual
    } else {
      const exists = personalOptions.some((p) => p.id === odontologoId)
      if (!exists) {
        newErrors.odontologoId = 'El odontólogo seleccionado no existe en la lista. Seleccione uno válido.'
      }
    }

    setErrors(newErrors)
    const hasErrors = Object.keys(newErrors).length > 0
    const hasWarnings = Object.keys(newWarnings).length > 0
    return { isValid: !hasErrors && !hasWarnings, errors: newErrors, warnings: newWarnings }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validate()
    if (validation.errors && Object.keys(validation.errors).length > 0) {
      Object.values(validation.errors).forEach((msg) => {
        if (msg) toast.error(msg, { style: { backgroundColor: '#FF0000', color: 'white' } })
      })
      return
    }

    if (validation.warnings && Object.keys(validation.warnings).length > 0) {
      Object.values(validation.warnings).forEach((msg) => {
        if (msg) toast.warning(msg, { style: { backgroundColor: '#FFA500', color: 'white' }, duration: 4000 })
      })
      return
    }
    setIsSubmitting(true)

    const formData = {
      id: diagnostico?.id ?? undefined,
      tipo: String(tipo ?? ''),
      cie10_id: cie10Id ?? null,
      caso_id: String(casoId ?? ''),
      odontologo_id: odontologoId ?? null,
    }

    console.debug('upsertDiagnostico payload:', formData)

    try {
      if (validation.warnings.cie10) {
        toast.warning(validation.warnings.cie10, { style: { backgroundColor: '#FFA500', color: 'white' }, duration: 4000 })
      }
      if (validation.warnings.odontologo) {
        toast.warning(validation.warnings.odontologo, { style: { backgroundColor: '#FFA500', color: 'white' }, duration: 4000 })
      }

      if (odontologoId && !personalOptions.some((p) => p.id === odontologoId)) {
        const msg = 'El odontólogo seleccionado no está disponible. Por favor seleccione un odontólogo válido.'
        setErrors((prev) => ({ ...prev, odontologoId: msg }))
        toast.error(msg, { style: { backgroundColor: '#FF0000', color: 'white' } })
        setIsSubmitting(false)
        return
      }

      const result = await upsertDiagnostico(formData)

      if (result.error) {
        try {
          console.error('UpsertDiagnostico error:', JSON.stringify(result.error, Object.getOwnPropertyNames(result.error), 2))
        } catch {
          console.error('UpsertDiagnostico error (raw):', result.error)
        }

        const errorMessage = `No se pudo guardar el diagnóstico: ${result.error.message || 'Error'}` + (result.error.details ? ` — ${result.error.details}` : '')
        type ServerValidationIssue = { path?: Array<string | number>; message: string }
        type ServerValidationError = { message?: string; details?: string; code?: string | number; issues?: ServerValidationIssue[] }

        const serverError = result.error as ServerValidationError
        if (serverError && Array.isArray(serverError.issues)) {
          const fieldErrors: { tipo?: string; cie10Id?: string } = {}
          for (const issue of serverError.issues) {
            if (issue && issue.path && issue.path.length > 0) {
              const key = String(issue.path[0])
              if (key === 'cie10_id') fieldErrors.cie10Id = issue.message
              if (key === 'tipo') fieldErrors.tipo = issue.message
              if (key === 'odontologo_id') fieldErrors.tipo = issue.message
              if (key === 'caso_id') fieldErrors.tipo = issue.message
            }
          }
          setErrors((prev) => ({ ...prev, ...fieldErrors }))
        }
        toast.error(errorMessage, { style: { backgroundColor: '#FF0000', color: 'white' } })
      } else {
        toast.success('Diagnóstico guardado correctamente.', { style: { backgroundColor: '#008000', color: 'white' } })
        onClose()
      }
    } catch (err) {
      console.error('Unexpected upsert error:', err)
      toast.error('Ocurrió un error al guardar el diagnóstico.', { style: { backgroundColor: '#FF0000', color: 'white' } })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!diagnostico?.id) return
    const ok = confirm('¿Confirma eliminar este diagnóstico? Esta acción no se puede deshacer.')
    if (!ok) return
    setIsSubmitting(true)
    try {
      const res: ActionResult = await deleteDiagnostico(diagnostico.id)
      if (res?.error) {
        toast.error(res.error?.message || 'No se pudo eliminar.', { style: { backgroundColor: '#FF0000', color: 'white' } })
      } else {
        toast.success('Diagnóstico eliminado correctamente.', { style: { backgroundColor: '#008000', color: 'white' } })
        onClose()
      }
    } catch (err) {
      console.error('Error eliminando diagnóstico:', err)
      toast.error('Ocurrió un error al eliminar.', { style: { backgroundColor: '#FF0000', color: 'white' } })
    } finally {
      setIsSubmitting(false)
    }
  }

    let selectedCie10 = selectedCie10State || cie10Options.find(opt => opt.id === cie10Id) || null
  if (!selectedCie10 && diagnostico && diagnostico.cie10_id === cie10Id) {
    selectedCie10 = getCie10Data(diagnostico.cie10_catalogo)
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {diagnostico ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
          </DialogTitle>
          <DialogDescription>Formulario para crear o editar un diagnóstico del caso.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Diagnóstico</Label>
            <Select onValueChange={setTipo} value={tipo}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preliminar">Preliminar</SelectItem>
                <SelectItem value="Definitivo">Definitivo</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="odontologo">Odontólogo</Label>
            <input
              id="odontologo"
              value={currentPersonalName || ''}
              readOnly
              className="w-full rounded-md border px-3 py-2 bg-background text-sm"
            />
            {errors.odontologoId && <p className="text-sm text-red-500">{errors.odontologoId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cie10">Diagnóstico CIE10</Label>
            <div ref={cieWrapperRef} className="relative w-full">
              <div
                className="w-full"
                onMouseDown={(e) => {
                  e.preventDefault()
                  setIsCie10Open(true)
                  inputRef.current?.focus()
                }}
              >
                <div className="flex w-full items-center gap-2 rounded-md border px-3 py-2 bg-background">
                  <input
                    id="cie10"
                    ref={inputRef}
                    className="flex-1 bg-transparent outline-none text-sm"
                    name="cie10-autocomplete"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder={selectedCie10 ? undefined : 'Buscar código o descripción CIE10...'}
                    value={cie10SearchTerm}
                    onChange={(e) => {
                      setCie10SearchTerm(String(e.target.value ?? ''))
                      setIsCie10Open(true)
                    }}
                    onFocus={() => setIsCie10Open(true)}
                  />
                      {selectedCie10State ? (
                        <button
                          type="button"
                          aria-label="Limpiar selección CIE10"
                          className="ml-2 h-6 w-6 flex items-center justify-center text-sm text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCie10State(null)
                            setCie10Id(null)
                            setCie10SearchTerm('')
                            setIsCie10Open(true)
                            setTimeout(() => inputRef.current?.focus(), 0)
                          }}
                        >
                          ✕
                        </button>
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                </div>
              </div>

              {isCie10Open && (
                <div className="absolute left-0 top-full mt-1 w-[500px] max-h-[300px] overflow-y-auto rounded-md border bg-white dark:bg-gray-800 shadow z-50 p-1">
                  {cie10Options.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">No se encontraron resultados.</div>
                  ) : (
                    <ul className="divide-y">
                      {cie10Options.map((cie) => (
                        <li key={cie.id}>
                          <button
                            type="button"
                            className={cn(
                              'w-full text-left px-3 py-2 text-sm hover:bg-accent/10',
                              cie10Id === cie.id ? 'bg-accent/20' : ''
                            )}
                            onClick={() => {
                              setCie10Id(cie.id)
                              setSelectedCie10State(cie)
                              setCie10SearchTerm(`${cie.codigo} - ${cie.descripcion}`)
                              setIsCie10Open(false)
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="truncate">
                                <strong className="mr-2">{cie.codigo}</strong>
                                <span className="text-muted-foreground">{cie.descripcion}</span>
                              </div>
                              {cie10Id === cie.id && <Check className="ml-2 h-4 w-4" />}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {errors.cie10Id && <p className="text-sm text-red-500">{errors.cie10Id}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
              {diagnostico && (
                <Button type="button" variant="ghost" onClick={handleDelete} disabled={isSubmitting}>
                  Eliminar
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Diagnóstico'}
              </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

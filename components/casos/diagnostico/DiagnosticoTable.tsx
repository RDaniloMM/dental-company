"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Edit, Trash2, Loader2, AlertTriangle, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react'
import DiagnosticoFormModal from './DiagnosticoFormModal'
import { deleteDiagnostico, checkDiagnosticoUso } from '@/app/admin/(protected)/ficha-odontologica/[numero_historia]/casos/[casoId]/diagnostico/actions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'

export type Diagnostico = {
  id: string
  fecha: string
  tipo: string
  nombre: string
  odontologo_id: string
  personal: { nombre_completo: string } | null
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
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; nombre?: string } | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [usageCount, setUsageCount] = useState<number>(0)
  const [checkingUsage, setCheckingUsage] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  const fetchDiagnosticos = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    const { data, error } = await supabase
      .from('diagnosticos')
      .select(`id, fecha, tipo, nombre, odontologo_id, personal(nombre_completo)`)
      .eq('caso_id', casoId)
      .order('fecha', { ascending: false })

    if (error) {
      toast.error('No se pudieron cargar los diagnósticos.')
      setDiagnosticos([])
    } else {
      const typedData = ((data || []) as unknown as Array<Record<string, unknown>>).map((d) => {
          const record = d || {} as Record<string, unknown>
          const personalRaw = record.personal
          let personalObj: { nombre_completo: string } | null = null
          if (Array.isArray(personalRaw) && personalRaw.length > 0) {
            const first = personalRaw[0]
            if (first && typeof first === 'object') personalObj = { nombre_completo: String((first as Record<string, unknown>).nombre_completo || '') }
          } else if (personalRaw && typeof personalRaw === 'object') {
            personalObj = { nombre_completo: String((personalRaw as Record<string, unknown>).nombre_completo || '') }
          }

          return {
            id: String(record.id || ""),
            fecha: String(record.fecha || ""),
            tipo: String(record.tipo || ""),
            nombre: String(record.nombre || ""),
            odontologo_id: String(record.odontologo_id || ""),
            personal: personalObj
          }
      })
      setDiagnosticos(typedData)
    }
    setLoading(false)
  }, [casoId])

  useEffect(() => { fetchDiagnosticos() }, [fetchDiagnosticos])

  useEffect(() => {
    const handler = () => { setSelectedDiagnostico(null); setIsFormModalOpen(true) }
    window.addEventListener('open-diagnostico-modal', handler)
    return () => window.removeEventListener('open-diagnostico-modal', handler)
  }, [])

  const handleModalClose = () => { setIsFormModalOpen(false); fetchDiagnosticos() }
  const handleEdit = (diagnostico: Diagnostico) => { setSelectedDiagnostico(diagnostico); setIsFormModalOpen(true) }

  const handleInitiateDelete = async (id: string, nombre: string) => {
    setDeleteCandidate({ id, nombre })
    setUsageCount(0)
    setCheckingUsage(true)
    setIsDeleteDialogOpen(true)
    try {
      const { count } = await checkDiagnosticoUso(id)
      setUsageCount(count || 0)
    } catch (e) { } finally { setCheckingUsage(false) }
  }

  const performDelete = async () => {
    if (!deleteCandidate) return
    setIsDeleting(true)
    try {
      const res = (await deleteDiagnostico(deleteCandidate.id)) as ActionResult
      if (res?.error) toast.error(res.error?.message, { style: { backgroundColor: '#FF0000', color: 'white' } })
      else {
          toast.success('Diagnóstico eliminado correctamente', { style: { backgroundColor: '#008000', color: 'white' } })
          fetchDiagnosticos()
      }
    } catch (err) { 
      toast.error('Error al eliminar', { style: { backgroundColor: '#FF0000', color: 'white' } }) 
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeleteCandidate(null)
    }
  }

  const normalized = (s: unknown) => String(s || "").toLowerCase()
  
  const matchesSearch = (d: Diagnostico) => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    const fecha = (() => {
      try { return format(new Date(d.fecha), "dd/MM/yyyy") } 
      catch { return "" }
    })().toLowerCase()
    return (
      normalized(d.nombre).includes(term) ||
      normalized(d.tipo).includes(term) ||
      fecha.includes(term)
    )
  }

  const filteredData = diagnosticos.filter(matchesSearch)
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
  const pagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex-1" />
        <div className="w-full max-w-sm relative">
          <Input
            placeholder="Buscar diagnóstico, tipo o fecha (dd/MM/yyyy)"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="h-9 pr-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          />
          <ChevronRight className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm border-sky-100 dark:border-slate-800 dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-sky-700 hover:bg-sky-700 border-b-sky-800 dark:bg-slate-800 dark:border-b-slate-700">
              <TableHead className="text-white font-semibold text-center w-[120px] dark:text-slate-100">Fecha</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px] dark:text-slate-100">Tipo</TableHead>
              <TableHead className="text-white font-semibold text-left pl-4 dark:text-slate-100">Descripción</TableHead>
              <TableHead className="text-white font-semibold text-center dark:text-slate-100">Odontólogo</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px] dark:text-slate-100">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : pagedData.length > 0 ? (
              pagedData.map((d) => (
                <TableRow key={d.id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/30 transition-colors border-b-sky-50 dark:border-b-slate-700">
                    <TableCell className="text-center align-middle text-sm text-sky-900 dark:text-slate-200 font-medium">{format(new Date(d.fecha), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-center align-middle">
                      <Badge variant="outline" className={d.tipo === 'Definitivo' ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-amber-50 text-amber-700 border-amber-200"}>{d.tipo}</Badge>
                    </TableCell>
                    <TableCell className="text-left pl-4 align-middle">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-200 font-medium truncate max-w-[350px]" title={d.nombre}>
                                {d.nombre}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center align-middle text-sm text-slate-600 dark:text-slate-400">{d.personal?.nombre_completo || 'No asignado'}</TableCell>
                    <TableCell className="text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(d)} className="h-8 w-8 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-slate-700"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleInitiateDelete(d.id, d.nombre)} className="h-8 w-8 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center p-8 text-muted-foreground"><div className="flex flex-col items-center gap-2"><AlertTriangle className="h-8 w-8 opacity-20"/>No hay diagnósticos</div></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 items-center py-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {isFormModalOpen && <DiagnosticoFormModal isOpen={isFormModalOpen} onClose={handleModalClose} diagnostico={selectedDiagnostico} casoId={casoId} userId={userId} />}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">{checkingUsage ? "Verificando..." : usageCount > 0 ? <span className="text-amber-600 flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> En uso</span> : "¿Estás seguro?"}</AlertDialogTitle>
            <AlertDialogDescription>
                {usageCount > 0 ? `Este diagnóstico está vinculado a ${usageCount} presupuesto(s). No se puede eliminar.` : `Vas a eliminar: ${deleteCandidate?.nombre}. Esta acción no se puede deshacer.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Cancelar</AlertDialogCancel>
            {!checkingUsage && usageCount === 0 && <AlertDialogAction onClick={performDelete} className="bg-destructive hover:bg-destructive/90">{isDeleting ? 'Eliminando...' : 'Confirmar'}</AlertDialogAction>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
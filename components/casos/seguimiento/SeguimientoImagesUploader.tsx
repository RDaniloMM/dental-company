"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, UploadCloud, Pencil, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export interface ExtendedFileMeta {
  file?: File
  preview: string
  tipo: string
  etapa: string
  descripcion: string
}

interface Props {
  casoId: string
  numeroHistoria: string
  seguimientoId: string
  onFilesChange?: (files: ExtendedFileMeta[]) => void
}

export default function SeguimientoImagesUploader({ onFilesChange }: Props) {
  const [files, setFiles] = useState<ExtendedFileMeta[]>([])
  const [dragActive, setDragActive] = useState(false)
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [tempData, setTempData] = useState<ExtendedFileMeta | null>(null)

  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(files)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const filesArray = Array.from(newFiles)
    
    filesArray.forEach((file) => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = (e) => {
        setFiles((prev) => [
            ...prev, 
            { 
                file, 
                preview: e.target?.result as string,
                tipo: 'evidencia',
                etapa: 'seguimiento',
                descripcion: '' 
            }
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    if (e.type === "dragleave" || e.type === "drop") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    addFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setTempData({ ...files[index] })
  }

  const saveEdits = () => {
    if (editingIndex !== null && tempData) {
      setFiles((prev) => {
        const updated = [...prev]
        updated[editingIndex] = tempData
        return updated
      })
      setEditingIndex(null)
      setTempData(null)
    }
  }

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case 'antes': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'durante': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'despues': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default: return 'bg-purple-100 text-purple-800 border-purple-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* AREA DRAG & DROP */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group ${
          dragActive ? "border-sky-500 bg-sky-50" : "border-slate-300 hover:border-sky-400 hover:bg-slate-50"
        }`}
      >
        <input
          id="seguimiento-file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <label htmlFor="seguimiento-file-input" className="cursor-pointer block">
          <div className="mx-auto bg-sky-100 text-sky-600 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Arrastra imágenes o haz clic para subir</p>
          <p className="text-xs text-slate-400 mt-1">Soporta JPG, PNG, WEBP</p>
        </label>
      </div>

      {/* GRID DE IMAGENES (3 Columnas) */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((item, index) => (
              <Card key={index} className="relative group overflow-hidden border-slate-200 shadow-sm transition-all rounded-lg">
                <div className="aspect-[4/3] relative bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                    
                    {/* OVERLAY CON BOTÓN CENTRADO */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center pt-8">
                        <Button 
                            onClick={() => startEditing(index)} 
                            variant="secondary" 
                            size="sm" 
                            className="h-8 px-4 text-xs gap-1 shadow-md bg-white hover:bg-sky-50 text-slate-800 font-medium"
                            type="button"
                        >
                            <Pencil className="w-3 h-3" /> Editar Datos
                        </Button>
                    </div>

                    <div className='absolute top-2 right-2 z-10'>
                        <Button 
                            onClick={() => removeFile(index)} 
                            variant="destructive" 
                            size="icon" 
                            className='h-7 w-7 rounded-full shadow-md opacity-90 hover:opacity-100' 
                            type='button'
                        >
                            <X className='h-3 w-3' />
                        </Button>
                    </div>

                    {/* Badge Tipo (Visible siempre) */}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <Badge className="text-[10px] capitalize shadow-sm bg-amber-200 text-amber-800 border border-amber-300 dark:bg-amber-200 dark:text-amber-700">
                        {item.tipo}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] capitalize shadow-sm ${getEtapaColor(item.etapa)}`}>
                        {item.etapa}
                      </Badge>
                    </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && setEditingIndex(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles de la imagen</DialogTitle>
            <DialogDescription>
              Edita la clasificación y descripción de esta imagen antes de guardarla.
            </DialogDescription>
          </DialogHeader>
          
          {tempData && (
            <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-xs font-semibold text-slate-500 uppercase">Tipo</Label>
                        <Select 
                          value={tempData.tipo} 
                          onValueChange={(val) => setTempData({...tempData, tipo: val})}
                        >
                            <SelectTrigger className='w-full h-8 text-xs bg-background'><SelectValue /></SelectTrigger>
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
                        <Label className="text-xs font-semibold text-slate-500 uppercase">Etapa</Label>
                        <Select 
                          value={tempData.etapa} 
                          onValueChange={(val) => setTempData({...tempData, etapa: val})}
                        >
                            <SelectTrigger className='w-full h-8 text-xs bg-background'><SelectValue /></SelectTrigger>
                          <SelectContent>
                                <SelectItem value="antes">Antes</SelectItem>
                                <SelectItem value="durante">Durante</SelectItem>
                                <SelectItem value="despues">Después</SelectItem>
                                <SelectItem value="seguimiento">Seguimiento</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label className="text-xs font-semibold text-slate-500 uppercase">Descripción</Label>
                    <Textarea 
                        value={tempData.descripcion} 
                        onChange={(e) => setTempData({...tempData, descripcion: e.target.value})}
                        className="mt-1 h-20 resize-none" 
                        placeholder="Detalle clínico de esta imagen..."
                    />
                </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingIndex(null)}>Cancelar</Button>
            <Button variant="default" onClick={saveEdits} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 gap-2">
                <Save className="w-4 h-4" /> Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
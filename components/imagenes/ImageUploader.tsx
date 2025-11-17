'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, UploadCloud, X, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

type Adjunto = {
  url: string
  public_id: string
  descripcion: string
  fecha_subida: string
}

interface ImageUploaderProps {
  value: Adjunto[]
  onChange: (value: Adjunto[]) => void
  pacienteId: string
}

export default function ImageUploader({ value, onChange, pacienteId }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true)
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`El archivo ${file.name} excede los 5 MB.`);
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('paciente_id', pacienteId)
        formData.append('tipo', 'diagnostico') 
        
        const response = await fetch('/api/imagenes/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error al subir ${file.name}.`)
        }
        
        const result = await response.json()
        return {
          url: result.secure_url,
          public_id: result.public_id,
          descripcion: file.name,
          fecha_subida: new Date().toISOString(),
        }
      })

      const newAdjuntos = await Promise.all(uploadPromises)
      onChange([...value, ...newAdjuntos])
      toast({ title: 'Éxito', description: 'Imágenes subidas correctamente.' })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido'
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }, [value, onChange, pacienteId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  })

  const handleRemove = (public_id: string) => {
    onChange(value.filter((adj) => adj.public_id !== public_id))
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative p-6 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-primary' : 'border-border'}
        hover:border-primary/70 transition-colors`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Subiendo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-24">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {isDragActive ? 'Suelta las imágenes aquí' : 'Arrastra y suelta, o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-muted-foreground/80">Tamaño máximo por archivo: 5 MB</p>
          </div>
        )}
      </div>

      {value && value.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Archivos adjuntos:</h4>
          <ul className="divide-y divide-border rounded-md border">
            {value.map((adjunto) => (
              <li key={adjunto.public_id} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                  <a href={adjunto.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                    {adjunto.descripcion || adjunto.public_id}
                  </a>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(adjunto.public_id)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

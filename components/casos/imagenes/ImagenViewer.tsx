'use client'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ImagenPaciente } from './ImagenGallery'
import { X, Calendar, Tag, Info } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

interface Props {
  isOpen: boolean
  onClose: () => void
  imagen: ImagenPaciente
  onEdit?: (imagen: ImagenPaciente) => void
  onDelete?: (imagen: ImagenPaciente) => void
}

export default function ImagenViewer({ isOpen, onClose, imagen, onEdit, onDelete }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 bg-slate-950/95 border-none shadow-2xl overflow-hidden h-[90vh] flex flex-col">
        
        <DialogTitle className="sr-only">Visor de imagen</DialogTitle>
        <DialogDescription className="sr-only">Visor detallado de imagen clínica del caso</DialogDescription>

        <div className="flex justify-between items-center p-4 text-white bg-sky-950/50 backdrop-blur-md z-10 shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Badge className="uppercase tracking-wider bg-sky-600 hover:bg-sky-700 text-white border-none">
                {imagen.tipo}
            </Badge>
            <Badge variant="outline" className="text-sky-100 border-sky-400/50 capitalize">
                {imagen.etapa}
            </Badge>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative bg-black/50">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
             src={imagen.url} 
             alt="Full size" 
             className="max-w-full max-h-full object-contain shadow-2xl" 
           />
        </div>

        <div className="p-5 bg-white text-slate-800 shrink-0 border-t border-slate-100">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg text-slate-800 leading-none mb-1">
                            {imagen.descripcion || 'Sin descripción clínica'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            Origen: {imagen.origen === 'seguimiento' ? 'Evolución / Seguimiento' : 'Galería General'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-sky-500" />
                        <span className="font-medium text-slate-700">Captura:</span>
                        <span>{format(new Date(imagen.fecha_captura), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-300 hidden md:block"></div>
                    <div className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-sky-500" />
                        <span className="font-medium text-slate-700">Subido:</span>
                        <span>{format(new Date(imagen.fecha_subida), 'dd/MM/yyyy')}</span>
                    </div>
                </div>
           </div>

           <div className="mt-4 flex items-center justify-end gap-3">
              <button
                className="px-3 py-2 text-sm rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                onClick={() => window.open(imagen.url, '_blank')}
              >
                Full size
              </button>
              {onEdit && (
                <button
                  className="px-3 py-2 text-sm rounded-md bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => onEdit(imagen)}
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  className="px-3 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => onDelete(imagen)}
                >
                  Eliminar
                </button>
              )}
           </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
"use client";

import { useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, X, Calendar, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface ImageViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: {
    id: string;
    url: string;
    titulo?: string | null;
    descripcion?: string | null;
    tipo?: string | null;
    etapa?: string | null;
    fecha_captura?: string | null;
    caso?: { id: string; nombre_caso: string } | null;
  } | null;
  tiposConfig?: { value: string; label: string; color: string }[];
  etapasConfig?: { value: string; label: string; color: string }[];
}

// Configuración por defecto para tipos de imagen
const defaultTiposConfig = [
  { value: "antes", label: "Antes", color: "bg-orange-100 text-orange-800" },
  { value: "durante", label: "Durante", color: "bg-blue-100 text-blue-800" },
  { value: "despues", label: "Después", color: "bg-green-100 text-green-800" },
  { value: "radiografia", label: "Radiografía", color: "bg-purple-100 text-purple-800" },
  { value: "general", label: "General", color: "bg-gray-100 text-gray-800" },
  { value: "retrato", label: "Retrato", color: "bg-pink-100 text-pink-800" },
  { value: "intraoral", label: "Intraoral", color: "bg-cyan-100 text-cyan-800" },
  { value: "panoramica", label: "Panorámica", color: "bg-indigo-100 text-indigo-800" },
  { value: "periapical", label: "Periapical", color: "bg-violet-100 text-violet-800" },
  { value: "modelo", label: "Modelo", color: "bg-amber-100 text-amber-800" },
  { value: "documento", label: "Documento", color: "bg-slate-100 text-slate-800" },
  { value: "otro", label: "Otro", color: "bg-gray-100 text-gray-800" },
];

const defaultEtapasConfig = [
  { value: "antes", label: "Antes", color: "bg-orange-100 text-orange-800" },
  { value: "durante", label: "Durante", color: "bg-blue-100 text-blue-800" },
  { value: "despues", label: "Después", color: "bg-green-100 text-green-800" },
  { value: "seguimiento", label: "Seguimiento", color: "bg-purple-100 text-purple-800" },
];

export function ImageViewer({
  open,
  onOpenChange,
  image,
  tiposConfig = defaultTiposConfig,
  etapasConfig = defaultEtapasConfig,
}: ImageViewerProps) {
  const [showControls, setShowControls] = useState(true);
  const [downloading, setDownloading] = useState(false);

  if (!image) return null;

  const tipoInfo = tiposConfig.find((t) => t.value === image.tipo);
  const etapaInfo = etapasConfig.find((e) => e.value === image.etapa);
  const titulo = image.titulo || image.descripcion || "Imagen";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${titulo.replace(/[^a-zA-Z0-9]/g, "_")}_${image.id.slice(0, 8)}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Imagen descargada");
    } catch (error) {
      console.error("Error descargando imagen:", error);
      toast.error("Error al descargar la imagen");
    } finally {
      setDownloading(false);
    }
  };

  const toggleControls = () => setShowControls(!showControls);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        >
          {/* Título oculto para accesibilidad */}
          <VisuallyHidden>
            <DialogPrimitive.Title>{titulo}</DialogPrimitive.Title>
          </VisuallyHidden>

        {/* Contenedor principal - click para mostrar/ocultar controles */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          onClick={toggleControls}
        >
          {/* Imagen centrada */}
          <Image
            src={image.url}
            alt={titulo}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />

          {/* Header flotante - info y cerrar */}
          <div
            className={`absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              {/* Info */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                {tipoInfo && (
                  <Badge className={`${tipoInfo.color} text-xs`}>
                    {tipoInfo.label}
                  </Badge>
                )}
                {etapaInfo && (
                  <Badge variant="outline" className={`${etapaInfo.color} text-xs border-white/30`}>
                    {etapaInfo.label}
                  </Badge>
                )}
                {image.caso && (
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-200 border-blue-400/30 text-xs hidden sm:flex">
                    <FolderOpen className="h-3 w-3 mr-1" />
                    {image.caso.nombre_caso}
                  </Badge>
                )}
              </div>
              
              {/* Botones */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={handleDownload}
                  disabled={downloading}
                  title="Descargar imagen"
                >
                  <Download className={`h-4 w-4 sm:h-5 sm:w-5 ${downloading ? "animate-bounce" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 text-white/80 hover:text-white hover:bg-white/20"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </div>
            
            {/* Título y fecha - segunda línea */}
            <div className="mt-2 text-white">
              <p className="font-medium text-sm sm:text-base truncate">{titulo}</p>
              {image.fecha_captura && (
                <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(image.fecha_captura).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Indicador de tap para móviles */}
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs sm:hidden transition-opacity duration-300 ${
              showControls ? "opacity-0" : "opacity-100"
            }`}
          >
            Toca para ver controles
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

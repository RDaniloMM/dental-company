"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Loader2,
  Upload,
  X,
  Trash2,
  ZoomIn,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ImageViewer } from "@/components/ImageViewer";

interface CasoImagen {
  id: string;
  caso_id: string;
  url: string;
  public_id: string | null;
  titulo: string | null;
  descripcion: string | null;
  tipo: string;
  fecha_captura: string | null;
  uploaded_at: string;
}

const tiposImagen = [
  {
    value: "antes",
    label: "Antes del tratamiento",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    value: "durante",
    label: "Durante el tratamiento",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    value: "despues",
    label: "Después del tratamiento",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    value: "radiografia",
    label: "Radiografía",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    value: "general",
    label: "General",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
];

export default function ImagenesCasoPage() {
  const params = useParams();
  const casoId = params.casoId as string;
  const supabase = createClient();

  const [imagenes, setImagenes] = useState<CasoImagen[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CasoImagen | null>(null);

  // Form state - fecha de hoy por defecto
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "general",
    fecha_captura: today,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cargar imágenes
  const loadImagenes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("seguimiento_imagenes")
        .select("*")
        .eq("caso_id", casoId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setImagenes(data || []);
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      toast.error("Error al cargar las imágenes");
    } finally {
      setLoading(false);
    }
  }, [casoId, supabase]);

  useEffect(() => {
    loadImagenes();
  }, [loadImagenes]);

  // Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo excede el tamaño máximo de 10MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  // Subir imagen
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Selecciona una imagen");
      return;
    }

    setUploading(true);
    try {
      // Usar API específica para imágenes de casos clínicos
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);
      formDataUpload.append("caso_id", casoId);
      formDataUpload.append("tipo", formData.tipo);
      if (formData.titulo) formDataUpload.append("titulo", formData.titulo);
      if (formData.descripcion)
        formDataUpload.append("descripcion", formData.descripcion);
      if (formData.fecha_captura)
        formDataUpload.append("fecha_captura", formData.fecha_captura);

      const uploadRes = await fetch("/api/imagenes/caso", {
        method: "POST",
        body: formDataUpload,
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(error.error || "Error al subir la imagen");
      }

      toast.success("Imagen subida correctamente");
      setDialogOpen(false);
      resetForm();
      loadImagenes();
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al subir la imagen"
      );
    } finally {
      setUploading(false);
    }
  };

  // Eliminar imagen
  const handleDelete = async (imagen: CasoImagen) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      // Usar API específica para imágenes de casos clínicos
      const params = new URLSearchParams({ id: imagen.id });
      if (imagen.public_id) params.append("public_id", imagen.public_id);

      const res = await fetch(`/api/imagenes/caso?${params.toString()}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar la imagen");
      }

      toast.success("Imagen eliminada");
      loadImagenes();
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar la imagen"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      tipo: "general",
      fecha_captura: new Date().toISOString().split("T")[0],
    });
    setPreviewUrl("");
    setSelectedFile(null);
  };

  const getTipoBadge = (tipo: string) => {
    const tipoInfo =
      tiposImagen.find((t) => t.value === tipo) || tiposImagen[4];
    return <Badge className={tipoInfo.color}>{tipoInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Imágenes del Caso</h2>
          <p className='text-muted-foreground'>
            Gestiona las imágenes asociadas a este caso clínico
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Nueva Imagen
        </Button>
      </div>

      {/* Grid de imágenes */}
      {imagenes.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <ImageIcon className='h-12 w-12 text-muted-foreground mb-4' />
            <p className='text-muted-foreground text-center'>
              No hay imágenes para este caso.
              <br />
              Usa el botón &quot;Nueva Imagen&quot; para comenzar a documentar
              el tratamiento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {imagenes.map((imagen) => (
            <Card
              key={imagen.id}
              className='overflow-hidden group'
            >
              <div className='relative aspect-square'>
                <Image
                  src={imagen.url}
                  alt={imagen.titulo || "Imagen del caso"}
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100'>
                  <Button
                    size='icon'
                    variant='secondary'
                    onClick={() => {
                      setSelectedImage(imagen);
                      setViewerOpen(true);
                    }}
                  >
                    <ZoomIn className='h-4 w-4' />
                  </Button>
                  <Button
                    size='icon'
                    variant='destructive'
                    onClick={() => handleDelete(imagen)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <CardContent className='p-3'>
                <div className='flex items-center justify-between mb-2'>
                  {getTipoBadge(imagen.tipo)}
                  {imagen.fecha_captura && (
                    <span className='text-xs text-muted-foreground flex items-center'>
                      <Calendar className='h-3 w-3 mr-1' />
                      {new Date(imagen.fecha_captura).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {imagen.titulo && (
                  <p className='font-medium text-sm truncate'>
                    {imagen.titulo}
                  </p>
                )}
                {imagen.descripcion && (
                  <p className='text-xs text-muted-foreground truncate'>
                    {imagen.descripcion}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para subir imagen */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Subir Nueva Imagen</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className='relative'>
                  <Image
                    src={previewUrl}
                    alt='Preview'
                    width={200}
                    height={200}
                    className='mx-auto rounded-lg object-cover'
                  />
                  <Button
                    size='icon'
                    variant='destructive'
                    className='absolute top-0 right-0'
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl("");
                      setSelectedFile(null);
                    }}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className='h-10 w-10 mx-auto text-muted-foreground mb-2' />
                  <p className='text-sm text-muted-foreground'>
                    Arrastra una imagen o haz clic para seleccionar
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    JPG, PNG o WebP (máx. 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Campos */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Tipo de imagen</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposImagen.map((tipo) => (
                      <SelectItem
                        key={tipo.value}
                        value={tipo.value}
                      >
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Fecha de captura</Label>
                <Input
                  type='date'
                  value={formData.fecha_captura}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_captura: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Título (opcional)</Label>
              <Input
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                placeholder='Ej: Radiografía panorámica inicial'
              />
            </div>

            <div className='space-y-2'>
              <Label>Descripción (opcional)</Label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder='Notas adicionales sobre la imagen...'
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
              Subir Imagen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visor de imagen */}
      <ImageViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        image={
          selectedImage
            ? {
                id: selectedImage.id,
                url: selectedImage.url,
                titulo: selectedImage.titulo,
                descripcion: selectedImage.descripcion,
                tipo: selectedImage.tipo,
                fecha_captura: selectedImage.fecha_captura,
              }
            : null
        }
        tiposConfig={tiposImagen}
      />
    </div>
  );
}

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

interface PacienteImagen {
  id: string;
  seguimiento_id: string | null;
  caso_id: string | null;
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
    value: "retrato",
    label: "Retrato/Foto facial",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
  {
    value: "intraoral",
    label: "Intraoral",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  },
  {
    value: "radiografia",
    label: "Radiografía",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  {
    value: "panoramica",
    label: "Panorámica",
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  {
    value: "periapical",
    label: "Periapical",
    color:
      "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  },
  {
    value: "modelo",
    label: "Modelo de estudio",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  {
    value: "documento",
    label: "Documento",
    color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  },
  {
    value: "general",
    label: "General",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
];

export default function ImagenesPacientePage() {
  const params = useParams();
  const numeroHistoria = params.numero_historia as string;
  const supabase = createClient();

  const [imagenes, setImagenes] = useState<PacienteImagen[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PacienteImagen | null>(
    null
  );
  const [historiaId, setHistoriaId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "general",
    fecha_captura: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Obtener historia_id del paciente
  useEffect(() => {
    const fetchHistoriaId = async () => {
      const { data: paciente } = await supabase
        .from("pacientes")
        .select("id")
        .eq("numero_historia", numeroHistoria)
        .single();

      if (paciente) {
        const { data: historia } = await supabase
          .from("historias_clinicas")
          .select("id")
          .eq("paciente_id", paciente.id)
          .single();

        if (historia) {
          setHistoriaId(historia.id);
        }
      }
    };

    fetchHistoriaId();
  }, [numeroHistoria, supabase]);

  // Cargar imágenes del paciente (todas las que no tienen caso_id)
  const loadImagenes = useCallback(async () => {
    if (!historiaId) return;

    try {
      setLoading(true);

      // Obtener todos los seguimientos de esta historia
      const { data: seguimientos } = await supabase
        .from("seguimientos")
        .select("id")
        .eq("historia_id", historiaId);

      if (!seguimientos || seguimientos.length === 0) {
        setImagenes([]);
        setLoading(false);
        return;
      }

      const seguimientoIds = seguimientos.map((s) => s.id);

      // Obtener imágenes de esos seguimientos (sin caso_id, que son las generales del paciente)
      const { data, error } = await supabase
        .from("seguimiento_imagenes")
        .select("*")
        .in("seguimiento_id", seguimientoIds)
        .is("caso_id", null)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setImagenes(data || []);
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      toast.error("Error al cargar las imágenes");
    } finally {
      setLoading(false);
    }
  }, [historiaId, supabase]);

  useEffect(() => {
    if (historiaId) {
      loadImagenes();
    }
  }, [historiaId, loadImagenes]);

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
    if (!selectedFile || !historiaId) {
      toast.error("Selecciona una imagen");
      return;
    }

    setUploading(true);
    try {
      // Primero necesitamos un seguimiento para asociar la imagen
      // Buscar o crear un seguimiento general
      let seguimientoId: string;

      const { data: existingSeguimiento } = await supabase
        .from("seguimientos")
        .select("id")
        .eq("historia_id", historiaId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (existingSeguimiento) {
        seguimientoId = existingSeguimiento.id;
      } else {
        // Crear un seguimiento nuevo
        const { data: newSeguimiento, error: segError } = await supabase
          .from("seguimientos")
          .insert({
            historia_id: historiaId,
            notas: "Seguimiento de imágenes",
          })
          .select("id")
          .single();

        if (segError) throw segError;
        seguimientoId = newSeguimiento.id;
      }

      // Subir a Cloudinary
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);
      formDataUpload.append("tipo", "pacientes");

      const uploadRes = await fetch("/api/cms/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(error.error || "Error al subir la imagen");
      }

      const { url, public_id } = await uploadRes.json();

      // Guardar en BD
      const { error: dbError } = await supabase
        .from("seguimiento_imagenes")
        .insert({
          seguimiento_id: seguimientoId,
          url,
          ruta: url,
          public_id,
          titulo: formData.titulo || null,
          descripcion: formData.descripcion || null,
          tipo: formData.tipo,
          fecha_captura: formData.fecha_captura || null,
        });

      if (dbError) throw dbError;

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
  const handleDelete = async (imagen: PacienteImagen) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      // Eliminar de Cloudinary si tiene public_id
      if (imagen.public_id) {
        await fetch(`/api/cms/upload?public_id=${imagen.public_id}`, {
          method: "DELETE",
        });
      }

      // Eliminar de BD
      const { error } = await supabase
        .from("seguimiento_imagenes")
        .delete()
        .eq("id", imagen.id);

      if (error) throw error;

      toast.success("Imagen eliminada");
      loadImagenes();
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      toast.error("Error al eliminar la imagen");
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      tipo: "general",
      fecha_captura: "",
    });
    setPreviewUrl("");
    setSelectedFile(null);
  };

  const getTipoBadge = (tipo: string) => {
    const tipoInfo =
      tiposImagen.find((t) => t.value === tipo) ||
      tiposImagen[tiposImagen.length - 1];
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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Imágenes del Paciente</h2>
          <p className='text-muted-foreground'>
            Radiografías, fotos y documentos del paciente
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
              No hay imágenes registradas para este paciente.
              <br />
              Sube radiografías, fotos o documentos para comenzar.
            </p>
            <Button
              className='mt-4'
              onClick={() => setDialogOpen(true)}
            >
              <Upload className='h-4 w-4 mr-2' />
              Subir Imagen
            </Button>
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
                  alt={imagen.titulo || "Imagen del paciente"}
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
      <Dialog
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      >
        <DialogContent className='max-w-4xl'>
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedImage.titulo || "Imagen del paciente"}
                </DialogTitle>
              </DialogHeader>
              <div className='relative aspect-video'>
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.titulo || "Imagen"}
                  fill
                  className='object-contain'
                />
              </div>
              <div className='flex items-center justify-between'>
                {getTipoBadge(selectedImage.tipo)}
                {selectedImage.descripcion && (
                  <p className='text-sm text-muted-foreground'>
                    {selectedImage.descripcion}
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

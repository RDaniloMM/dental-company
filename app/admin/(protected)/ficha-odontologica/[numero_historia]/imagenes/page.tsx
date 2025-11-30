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
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { ImageViewer } from "@/components/ImageViewer";

interface PacienteImagen {
  id: string;
  paciente_id: string;
  caso_id: string | null;
  url: string;
  public_id: string;
  tipo: string;
  descripcion: string | null;
  etapa: string | null;
  fecha_captura: string | null;
  es_principal: boolean;
  fecha_subida: string;
  caso?: {
    id: string;
    nombre_caso: string;
  } | null;
}

interface CasoClinico {
  id: string;
  nombre_caso: string;
  estado: string;
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
    value: "otro",
    label: "Otro",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
];

const etapasImagen = [
  {
    value: "antes",
    label: "Antes del tratamiento",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "durante",
    label: "Durante el tratamiento",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "despues",
    label: "Después del tratamiento",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "seguimiento",
    label: "Seguimiento",
    color: "bg-purple-100 text-purple-800",
  },
];

export default function ImagenesPacientePage() {
  const params = useParams();
  const numeroHistoria = params.numero_historia as string;
  const supabase = createClient();

  const [imagenes, setImagenes] = useState<PacienteImagen[]>([]);
  const [casos, setCasos] = useState<CasoClinico[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<PacienteImagen | null>(
    null
  );
  const [pacienteId, setPacienteId] = useState<string | null>(null);

  // Form state - fecha de hoy por defecto
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    descripcion: "",
    tipo: "otro",
    etapa: "",
    caso_id: "",
    fecha_captura: today,
    es_principal: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Obtener paciente_id
  useEffect(() => {
    const fetchPacienteId = async () => {
      const { data: paciente } = await supabase
        .from("pacientes")
        .select("id")
        .eq("numero_historia", numeroHistoria)
        .single();

      if (paciente) {
        setPacienteId(paciente.id);
      }
    };

    fetchPacienteId();
  }, [numeroHistoria, supabase]);

  // Cargar casos clínicos del paciente
  const loadCasos = useCallback(async () => {
    if (!pacienteId) return;

    try {
      // Obtener historia_id primero
      const { data: historia } = await supabase
        .from("historias_clinicas")
        .select("id")
        .eq("paciente_id", pacienteId)
        .single();

      if (historia) {
        const { data: casosData } = await supabase
          .from("casos_clinicos")
          .select("id, nombre_caso, estado")
          .eq("historia_id", historia.id)
          .order("fecha_inicio", { ascending: false });

        setCasos(casosData || []);
      }
    } catch (error) {
      console.error("Error cargando casos:", error);
    }
  }, [pacienteId, supabase]);

  // Cargar imágenes del paciente
  const loadImagenes = useCallback(async () => {
    if (!pacienteId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("imagenes_pacientes")
        .select(
          `
          *,
          caso:casos_clinicos(id, nombre_caso)
        `
        )
        .eq("paciente_id", pacienteId)
        .order("fecha_subida", { ascending: false });

      if (error) throw error;
      setImagenes(data || []);
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      toast.error("Error al cargar las imágenes");
    } finally {
      setLoading(false);
    }
  }, [pacienteId, supabase]);

  useEffect(() => {
    if (pacienteId) {
      loadImagenes();
      loadCasos();
    }
  }, [pacienteId, loadImagenes, loadCasos]);

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
    if (!selectedFile || !pacienteId) {
      toast.error("Selecciona una imagen");
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);
      formDataUpload.append("paciente_id", pacienteId);
      formDataUpload.append("tipo", formData.tipo);

      if (formData.descripcion) {
        formDataUpload.append("descripcion", formData.descripcion);
      }
      if (formData.caso_id) {
        formDataUpload.append("caso_id", formData.caso_id);
      }
      if (formData.etapa) {
        formDataUpload.append("etapa", formData.etapa);
      }
      if (formData.fecha_captura) {
        formDataUpload.append("fecha_captura", formData.fecha_captura);
      }
      if (formData.es_principal) {
        formDataUpload.append("es_principal", "true");
      }

      const uploadRes = await fetch("/api/imagenes/upload", {
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
  const handleDelete = async (imagen: PacienteImagen) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      const res = await fetch(`/api/imagenes/${imagen.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      toast.success("Imagen eliminada");
      loadImagenes();
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      toast.error("Error al eliminar la imagen");
    }
  };

  const resetForm = () => {
    setFormData({
      descripcion: "",
      tipo: "otro",
      etapa: "",
      caso_id: "",
      fecha_captura: new Date().toISOString().split("T")[0],
      es_principal: false,
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

  const getEtapaBadge = (etapa: string | null) => {
    if (!etapa) return null;
    const etapaInfo = etapasImagen.find((e) => e.value === etapa);
    if (!etapaInfo) return null;
    return (
      <Badge
        variant='outline'
        className={etapaInfo.color}
      >
        {etapaInfo.label}
      </Badge>
    );
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
              Usa el botón &quot;Nueva Imagen&quot; para subir radiografías,
              fotos o documentos.
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
                  alt={imagen.descripcion || "Imagen del paciente"}
                  fill
                  className='object-cover'
                />
                {imagen.es_principal && (
                  <div className='absolute top-2 left-2'>
                    <Badge className='bg-yellow-500 text-white'>
                      ⭐ Principal
                    </Badge>
                  </div>
                )}
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
              <CardContent className='p-3 space-y-2'>
                <div className='flex items-center justify-between flex-wrap gap-1'>
                  {getTipoBadge(imagen.tipo)}
                  {getEtapaBadge(imagen.etapa)}
                </div>

                {/* Mostrar caso asociado */}
                {imagen.caso && (
                  <div className='flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                    <FolderOpen className='h-3 w-3' />
                    <span className='truncate'>{imagen.caso.nombre_caso}</span>
                  </div>
                )}

                {imagen.fecha_captura && (
                  <span className='text-xs text-muted-foreground flex items-center'>
                    <Calendar className='h-3 w-3 mr-1' />
                    {new Date(imagen.fecha_captura).toLocaleDateString()}
                  </span>
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

            {/* Caso clínico asociado */}
            <div className='space-y-2'>
              <Label>Caso clínico (opcional)</Label>
              <Select
                value={formData.caso_id}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    caso_id: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Sin caso asociado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>Sin caso asociado</SelectItem>
                  {casos.map((caso) => (
                    <SelectItem
                      key={caso.id}
                      value={caso.id}
                    >
                      {caso.nombre_caso} ({caso.estado})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Label>Etapa del tratamiento</Label>
                <Select
                  value={formData.etapa}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      etapa: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>Sin especificar</SelectItem>
                    {etapasImagen.map((etapa) => (
                      <SelectItem
                        key={etapa.value}
                        value={etapa.value}
                      >
                        {etapa.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                titulo: selectedImage.descripcion,
                tipo: selectedImage.tipo,
                etapa: selectedImage.etapa,
                fecha_captura: selectedImage.fecha_captura,
                caso: selectedImage.caso,
              }
            : null
        }
        tiposConfig={tiposImagen}
        etapasConfig={etapasImagen}
      />
    </div>
  );
}

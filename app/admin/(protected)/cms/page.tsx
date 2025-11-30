"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  FileText,
  Users,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  X,
  Bot,
  Images,
} from "lucide-react";
import { toast } from "sonner";

// Componente de nota para chatbot
function ChatbotNote({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md ${
        enabled
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : "bg-gray-50 text-gray-500 border border-gray-200"
      }`}
    >
      <Bot className='h-3 w-3' />
      <span>
        {enabled
          ? "Esta información la conocerá el chatbot"
          : "El chatbot NO usará esta información"}
      </span>
    </div>
  );
}

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  orden: number;
  visible: boolean;
  detalle_completo?: string;
  beneficios?: string[];
  duracion?: string;
  recomendaciones?: string;
}

interface Curriculum {
  formacion: string[];
  experiencia: string[];
  especialidades: string[];
  filosofia: string;
}

interface Miembro {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  foto_url: string;
  foto_public_id?: string;
  orden: number;
  visible: boolean;
  curriculum?: Curriculum | null;
}

interface TemaConfig {
  [key: string]: string;
}

interface ServicioImagen {
  id: string;
  servicio_id: string;
  imagen_url: string;
  public_id?: string;
  descripcion?: string;
  alt_text?: string;
  orden: number;
  visible: boolean;
}

const iconOptions = [
  "Stethoscope",
  "Sparkles",
  "Smile",
  "Bone",
  "Syringe",
  "Microscope",
  "ShieldCheck",
  "Baby",
  "Puzzle",
  "FileSearch",
];

// Componente de subida de fotos
interface PhotoUploaderProps {
  onUpload: (url: string, publicId: string) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  oldPublicId?: string;
}

function PhotoUploader({
  onUpload,
  isUploading,
  setIsUploading,
  oldPublicId,
}: PhotoUploaderProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo excede el tamaño máximo de 5MB");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tipo", "equipo");
        if (oldPublicId) {
          formData.append("old_public_id", oldPublicId);
        }

        const response = await fetch("/api/cms/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al subir la imagen");
        }

        const result = await response.json();
        onUpload(result.secure_url, result.public_id);
        toast.success("Imagen subida correctamente");
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error instanceof Error ? error.message : "Error al subir la imagen"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, setIsUploading, oldPublicId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }
        ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className='flex flex-col items-center justify-center py-2'>
          <Loader2 className='h-6 w-6 animate-spin text-blue-500' />
          <p className='mt-2 text-sm text-gray-500'>Subiendo...</p>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-2'>
          <Upload className='h-6 w-6 text-gray-400' />
          <p className='mt-2 text-sm text-gray-500'>
            {isDragActive
              ? "Suelta la imagen aquí"
              : "Arrastra una imagen o haz clic"}
          </p>
          <p className='text-xs text-gray-400'>JPG, PNG, WebP (máx. 5MB)</p>
        </div>
      )}
    </div>
  );
}

export default function CMSPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [equipo, setEquipo] = useState<Miembro[]>([]);
  const [tema, setTema] = useState<TemaConfig>({});
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [editingMiembro, setEditingMiembro] = useState<Miembro | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"servicio" | "miembro">(
    "servicio"
  );

  // Estados para subida de fotos
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [miembroFotoUrl, setMiembroFotoUrl] = useState<string>("");
  const [miembroFotoPublicId, setMiembroFotoPublicId] = useState<string>("");

  // Estados para curriculum
  const [curriculumFormacion, setCurriculumFormacion] = useState<string>("");
  const [curriculumExperiencia, setCurriculumExperiencia] =
    useState<string>("");
  const [curriculumEspecialidades, setCurriculumEspecialidades] =
    useState<string>("");
  const [curriculumFilosofia, setCurriculumFilosofia] = useState<string>("");

  // Estados para servicios detallados
  const [servicioDetalleCompleto, setServicioDetalleCompleto] =
    useState<string>("");
  const [servicioBeneficios, setServicioBeneficios] = useState<string>("");
  const [servicioDuracion, setServicioDuracion] = useState<string>("");
  const [servicioRecomendaciones, setServicioRecomendaciones] =
    useState<string>("");

  // Estados para gestión de imágenes de servicios
  const [imagenesDialogOpen, setImagenesDialogOpen] = useState(false);
  const [servicioParaImagenes, setServicioParaImagenes] =
    useState<Servicio | null>(null);
  const [servicioImagenes, setServicioImagenes] = useState<ServicioImagen[]>(
    []
  );
  const [isLoadingImagenes, setIsLoadingImagenes] = useState(false);
  const [isUploadingServicioImage, setIsUploadingServicioImage] =
    useState(false);
  const [nuevaImagenDescripcion, setNuevaImagenDescripcion] = useState("");

  // Estados para configuración del chatbot (solo lectura para mostrar notas)
  const [chatbotConfig, setChatbotConfig] = useState<Record<string, string>>({
    chatbot_usar_info_general: "true",
    chatbot_usar_servicios: "true",
    chatbot_usar_equipo: "true",
  });

  // Cargar configuración del chatbot
  const fetchChatbotConfig = async () => {
    try {
      const res = await fetch("/api/chatbot/config");
      if (res.ok) {
        const data = await res.json();
        setChatbotConfig((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Error cargando config chatbot:", error);
    }
  };

  // Cargar datos (inicial)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cms?admin=true");
      if (res.ok) {
        const data = await res.json();
        setServicios(data.servicios || []);
        setEquipo(data.equipo || []);
        setTema(data.tema || {});
      }
    } catch (error) {
      console.error("Error cargando CMS:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  // Recargar solo servicios (sin cambiar de tab)
  const refreshServicios = async () => {
    try {
      const res = await fetch("/api/cms?admin=true");
      if (res.ok) {
        const data = await res.json();
        setServicios(data.servicios || []);
      }
    } catch (error) {
      console.error("Error recargando servicios:", error);
    }
  };

  // Recargar solo equipo (sin cambiar de tab)
  const refreshEquipo = async () => {
    try {
      const res = await fetch("/api/cms?admin=true");
      if (res.ok) {
        const data = await res.json();
        setEquipo(data.equipo || []);
      }
    } catch (error) {
      console.error("Error recargando equipo:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchChatbotConfig();
  }, []);

  // Guardar tema
  const saveTema = async (clave: string, valor: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "tema",
          data: { clave, valor, tipo: "otro" },
        }),
      });

      if (res.ok) {
        setTema((prev) => ({ ...prev, [clave]: valor }));
        toast.success("Configuración guardada");
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      console.error("Error guardando tema:", error);
      toast.error("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar servicio
  const saveServicio = async (servicio: Partial<Servicio>) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "servicio", data: servicio }),
      });

      if (res.ok) {
        toast.success(servicio.id ? "Servicio actualizado" : "Servicio creado");
        await refreshServicios();
        setDialogOpen(false);
        setEditingServicio(null);
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      console.error("Error guardando servicio:", error);
      toast.error("Error al guardar servicio");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar servicio (soft delete - solo oculta)
  const deleteServicio = async (id: string) => {
    if (
      !confirm(
        "¿Estás seguro de ocultar este servicio? Podrás restaurarlo después."
      )
    )
      return;

    try {
      const res = await fetch(`/api/cms?tipo=servicio&id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Servicio ocultado. Puedes restaurarlo desde la lista.");
        await refreshServicios();
      }
    } catch (error) {
      console.error("Error ocultando:", error);
      toast.error("Error al ocultar");
    }
  };

  // Restaurar servicio (cambiar visible a true)
  const restaurarServicio = async (servicio: Servicio) => {
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "servicio",
          data: { ...servicio, visible: true },
        }),
      });

      if (res.ok) {
        toast.success("Servicio restaurado");
        await refreshServicios();
      }
    } catch (error) {
      console.error("Error restaurando:", error);
      toast.error("Error al restaurar");
    }
  };

  // ============ GESTIÓN DE IMÁGENES DE SERVICIOS ============

  // Cargar imágenes de un servicio
  const fetchServicioImagenes = async (servicioId: string) => {
    setIsLoadingImagenes(true);
    try {
      const res = await fetch(
        `/api/cms/servicio-imagenes?servicioId=${servicioId}&all=true`
      );
      if (res.ok) {
        const data = await res.json();
        setServicioImagenes(data);
      }
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      toast.error("Error al cargar imágenes");
    } finally {
      setIsLoadingImagenes(false);
    }
  };

  // Abrir dialog de imágenes para un servicio
  const openImagenesDialog = (servicio: Servicio) => {
    setServicioParaImagenes(servicio);
    setImagenesDialogOpen(true);
    fetchServicioImagenes(servicio.id);
  };

  // Subir imagen de servicio
  const uploadServicioImagen = async (file: File, descripcion: string) => {
    if (!servicioParaImagenes) return;

    setIsUploadingServicioImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("servicioId", servicioParaImagenes.id);
      formData.append("descripcion", descripcion);
      formData.append("altText", servicioParaImagenes.nombre);

      const res = await fetch("/api/cms/servicio-imagenes", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Imagen subida correctamente");
        fetchServicioImagenes(servicioParaImagenes.id);
      } else {
        const error = await res.json();
        throw new Error(error.error || "Error al subir imagen");
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al subir imagen"
      );
    } finally {
      setIsUploadingServicioImage(false);
    }
  };

  // Eliminar imagen de servicio
  const deleteServicioImagen = async (imagenId: string) => {
    if (!confirm("¿Eliminar esta imagen?")) return;

    try {
      const res = await fetch(`/api/cms/servicio-imagenes?id=${imagenId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Imagen eliminada");
        if (servicioParaImagenes) {
          fetchServicioImagenes(servicioParaImagenes.id);
        }
      }
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      toast.error("Error al eliminar imagen");
    }
  };

  // Toggle visibilidad de imagen
  const toggleImagenVisibilidad = async (imagen: ServicioImagen) => {
    try {
      const res = await fetch("/api/cms/servicio-imagenes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: imagen.id, visible: !imagen.visible }),
      });

      if (res.ok) {
        if (servicioParaImagenes) {
          fetchServicioImagenes(servicioParaImagenes.id);
        }
      }
    } catch (error) {
      console.error("Error actualizando imagen:", error);
    }
  };

  // Guardar miembro
  const saveMiembro = async (miembro: Partial<Miembro>) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "equipo", data: miembro }),
      });

      if (res.ok) {
        toast.success(miembro.id ? "Miembro actualizado" : "Miembro añadido");
        await refreshEquipo();
        setDialogOpen(false);
        setEditingMiembro(null);
        setMiembroFotoUrl("");
        setMiembroFotoPublicId("");
      }
    } catch (error) {
      console.error("Error guardando miembro:", error);
      toast.error("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar miembro (soft delete - solo oculta)
  const deleteMiembro = async (id: string) => {
    if (
      !confirm(
        "¿Estás seguro de ocultar este miembro? Podrás restaurarlo después."
      )
    )
      return;

    try {
      const res = await fetch(`/api/cms?tipo=equipo&id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Miembro ocultado. Puedes restaurarlo desde la lista.");
        await refreshEquipo();
      }
    } catch (error) {
      console.error("Error ocultando:", error);
      toast.error("Error al ocultar");
    }
  };

  // Restaurar miembro (cambiar visible a true)
  const restaurarMiembro = async (miembro: Miembro) => {
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "equipo",
          data: { ...miembro, visible: true },
        }),
      });

      if (res.ok) {
        toast.success("Miembro restaurado");
        await refreshEquipo();
      }
    } catch (error) {
      console.error("Error restaurando:", error);
      toast.error("Error al restaurar");
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Gestión de Contenido (CMS)
          </h1>
          <p className='text-muted-foreground'>
            Administra el contenido de la página principal
          </p>
        </div>
        <Button
          variant='outline'
          onClick={fetchData}
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Actualizar
        </Button>
      </div>

      <Tabs
        defaultValue='general'
        className='space-y-6'
      >
        <TabsList className='flex flex-wrap justify-start gap-1 h-auto p-1 md:grid md:w-full md:grid-cols-4'>
          <TabsTrigger
            value='general'
            className='flex items-center gap-1 px-2 py-1.5 text-xs md:text-sm md:gap-2 md:px-3 md:py-2'
          >
            <Settings className='h-3 w-3 md:h-4 md:w-4' />
            <span className='hidden sm:inline'>General</span>
            <span className='sm:hidden'>Gen.</span>
          </TabsTrigger>
          <TabsTrigger
            value='servicios'
            className='flex items-center gap-1 px-2 py-1.5 text-xs md:text-sm md:gap-2 md:px-3 md:py-2'
          >
            <FileText className='h-3 w-3 md:h-4 md:w-4' />
            <span className='hidden sm:inline'>Servicios</span>
            <span className='sm:hidden'>Serv.</span>
          </TabsTrigger>
          <TabsTrigger
            value='equipo'
            className='flex items-center gap-1 px-2 py-1.5 text-xs md:text-sm md:gap-2 md:px-3 md:py-2'
          >
            <Users className='h-3 w-3 md:h-4 md:w-4' />
            Equipo
          </TabsTrigger>
          <TabsTrigger
            value='tema'
            className='flex items-center gap-1 px-2 py-1.5 text-xs md:text-sm md:gap-2 md:px-3 md:py-2'
          >
            <Palette className='h-3 w-3 md:h-4 md:w-4' />
            Tema
          </TabsTrigger>
        </TabsList>

        {/* Tab: Configuración General */}
        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Información General</CardTitle>
                  <CardDescription>
                    Configura la información básica de la clínica
                  </CardDescription>
                </div>
                <ChatbotNote
                  enabled={chatbotConfig.chatbot_usar_info_general !== "false"}
                />
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label htmlFor='nombre_clinica'>Nombre de la Clínica</Label>
                  <Input
                    id='nombre_clinica'
                    value={tema.nombre_clinica || ""}
                    onChange={(e) =>
                      setTema({ ...tema, nombre_clinica: e.target.value })
                    }
                    onBlur={(e) => saveTema("nombre_clinica", e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='slogan'>Slogan</Label>
                  <Input
                    id='slogan'
                    value={tema.slogan || ""}
                    onChange={(e) =>
                      setTema({ ...tema, slogan: e.target.value })
                    }
                    onBlur={(e) => saveTema("slogan", e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='telefono'>Teléfono</Label>
                  <Input
                    id='telefono'
                    value={tema.telefono || ""}
                    onChange={(e) =>
                      setTema({ ...tema, telefono: e.target.value })
                    }
                    onBlur={(e) => saveTema("telefono", e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='whatsapp_numero'>WhatsApp (sin +)</Label>
                  <Input
                    id='whatsapp_numero'
                    value={tema.whatsapp_numero || ""}
                    onChange={(e) =>
                      setTema({ ...tema, whatsapp_numero: e.target.value })
                    }
                    onBlur={(e) => saveTema("whatsapp_numero", e.target.value)}
                    placeholder='51914340074'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={tema.email || ""}
                    onChange={(e) =>
                      setTema({ ...tema, email: e.target.value })
                    }
                    onBlur={(e) => saveTema("email", e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='direccion'>Dirección</Label>
                  <Input
                    id='direccion'
                    value={tema.direccion || ""}
                    onChange={(e) =>
                      setTema({ ...tema, direccion: e.target.value })
                    }
                    onBlur={(e) => saveTema("direccion", e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='horario_semana'>Horario entre semana</Label>
                  <Input
                    id='horario_semana'
                    value={tema.horario_semana || ""}
                    onChange={(e) =>
                      setTema({ ...tema, horario_semana: e.target.value })
                    }
                    onBlur={(e) => saveTema("horario_semana", e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='horario_sabado'>Horario sábados</Label>
                  <Input
                    id='horario_sabado'
                    value={tema.horario_sabado || ""}
                    onChange={(e) =>
                      setTema({ ...tema, horario_sabado: e.target.value })
                    }
                    onBlur={(e) => saveTema("horario_sabado", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Servicios */}
        <TabsContent value='servicios'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between flex-wrap gap-4'>
              <div>
                <CardTitle>Servicios</CardTitle>
                <CardDescription>
                  Gestiona los servicios mostrados en la landing page
                </CardDescription>
                <div className='mt-2'>
                  <ChatbotNote
                    enabled={chatbotConfig.chatbot_usar_servicios !== "false"}
                  />
                </div>
              </div>
              <Dialog
                open={dialogOpen && dialogType === "servicio"}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) {
                    setEditingServicio(null);
                    // Limpiar campos de servicio detallado
                    setServicioDetalleCompleto("");
                    setServicioBeneficios("");
                    setServicioDuracion("");
                    setServicioRecomendaciones("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setDialogType("servicio");
                      setEditingServicio(null);
                      setServicioDetalleCompleto("");
                      setServicioBeneficios("");
                      setServicioDuracion("");
                      setServicioRecomendaciones("");
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Añadir Servicio
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                  <DialogHeader>
                    <DialogTitle>
                      {editingServicio?.id
                        ? "Editar Servicio"
                        : "Nuevo Servicio"}
                    </DialogTitle>
                    <DialogDescription>
                      Completa la información del servicio
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      saveServicio({
                        id: editingServicio?.id,
                        nombre: formData.get("nombre") as string,
                        descripcion: formData.get("descripcion") as string,
                        icono: formData.get("icono") as string,
                        orden: Number(formData.get("orden")) || 0,
                        visible: true,
                        detalle_completo: servicioDetalleCompleto || undefined,
                        beneficios: servicioBeneficios
                          ? servicioBeneficios
                              .split("\n")
                              .filter((line) => line.trim())
                          : undefined,
                        duracion: servicioDuracion || undefined,
                        recomendaciones: servicioRecomendaciones || undefined,
                      });
                    }}
                    className='space-y-4'
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {/* Columna izquierda: Datos básicos */}
                      <div className='space-y-4'>
                        <h4 className='font-semibold text-sm text-muted-foreground border-b pb-2'>
                          Información Básica
                        </h4>
                        <div className='space-y-2'>
                          <Label htmlFor='nombre'>Nombre *</Label>
                          <Input
                            id='nombre'
                            name='nombre'
                            defaultValue={editingServicio?.nombre}
                            required
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='descripcion'>
                            Descripción corta *
                          </Label>
                          <Textarea
                            id='descripcion'
                            name='descripcion'
                            defaultValue={editingServicio?.descripcion}
                            required
                            rows={3}
                            placeholder='Breve descripción para mostrar en la tarjeta'
                          />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='icono'>Icono</Label>
                            <select
                              id='icono'
                              name='icono'
                              defaultValue={
                                editingServicio?.icono || "Stethoscope"
                              }
                              className='w-full border rounded-md p-2'
                            >
                              {iconOptions.map((icon) => (
                                <option
                                  key={icon}
                                  value={icon}
                                >
                                  {icon}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='orden'>Orden</Label>
                            <Input
                              id='orden'
                              name='orden'
                              type='number'
                              defaultValue={editingServicio?.orden || 0}
                            />
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='duracion'>Duración estimada</Label>
                          <Input
                            id='duracion'
                            value={servicioDuracion}
                            onChange={(e) =>
                              setServicioDuracion(e.target.value)
                            }
                            placeholder='Ej: 30-60 minutos por consulta'
                          />
                        </div>
                      </div>

                      {/* Columna derecha: Detalles para el modal */}
                      <div className='space-y-4'>
                        <h4 className='font-semibold text-sm text-muted-foreground border-b pb-2'>
                          Información Detallada (para el modal)
                        </h4>
                        <div className='space-y-2'>
                          <Label htmlFor='detalle_completo'>
                            ¿En qué consiste?
                          </Label>
                          <Textarea
                            id='detalle_completo'
                            value={servicioDetalleCompleto}
                            onChange={(e) =>
                              setServicioDetalleCompleto(e.target.value)
                            }
                            rows={4}
                            placeholder='Descripción completa del servicio...'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='beneficios'>
                            Beneficios
                            <span className='text-xs text-muted-foreground ml-1'>
                              (uno por línea)
                            </span>
                          </Label>
                          <Textarea
                            id='beneficios'
                            value={servicioBeneficios}
                            onChange={(e) =>
                              setServicioBeneficios(e.target.value)
                            }
                            rows={4}
                            placeholder='Prevención de enfermedades&#10;Detección temprana&#10;Limpieza profunda'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='recomendaciones'>
                            Recomendaciones para el paciente
                          </Label>
                          <Textarea
                            id='recomendaciones'
                            value={servicioRecomendaciones}
                            onChange={(e) =>
                              setServicioRecomendaciones(e.target.value)
                            }
                            rows={3}
                            placeholder='Consejos prácticos para el paciente...'
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type='submit'
                        disabled={isSaving}
                      >
                        {isSaving && (
                          <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        )}
                        <Save className='h-4 w-4 mr-2' />
                        Guardar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Icono</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicios.map((servicio) => (
                    <TableRow
                      key={servicio.id}
                      className={
                        !servicio.visible ? "opacity-50 bg-gray-50" : ""
                      }
                    >
                      <TableCell>{servicio.orden}</TableCell>
                      <TableCell className='font-medium'>
                        {servicio.nombre}
                      </TableCell>
                      <TableCell className='max-w-[200px] truncate'>
                        {servicio.descripcion}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{servicio.icono}</Badge>
                      </TableCell>
                      <TableCell>
                        {servicio.detalle_completo ? (
                          <Badge
                            variant='outline'
                            className='text-blue-600 border-blue-600'
                          >
                            <FileText className='h-3 w-3 mr-1' />
                            Sí
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='text-gray-400 border-gray-400'
                          >
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {servicio.visible ? (
                          <Badge
                            variant='outline'
                            className='text-green-600 border-green-600'
                          >
                            <Eye className='h-3 w-3 mr-1' />
                            Visible
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='text-gray-400 border-gray-400'
                          >
                            <EyeOff className='h-3 w-3 mr-1' />
                            Oculto
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-right space-x-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => openImagenesDialog(servicio)}
                          title='Gestionar imágenes'
                        >
                          <Images className='h-4 w-4 text-purple-500' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            setEditingServicio(servicio);
                            // Cargar datos detallados existentes
                            setServicioDetalleCompleto(
                              servicio.detalle_completo || ""
                            );
                            setServicioBeneficios(
                              servicio.beneficios?.join("\n") || ""
                            );
                            setServicioDuracion(servicio.duracion || "");
                            setServicioRecomendaciones(
                              servicio.recomendaciones || ""
                            );
                            setDialogType("servicio");
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        {servicio.visible ? (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => deleteServicio(servicio.id)}
                            title='Ocultar servicio'
                          >
                            <Trash2 className='h-4 w-4 text-red-500' />
                          </Button>
                        ) : (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => restaurarServicio(servicio)}
                            title='Restaurar servicio'
                            className='text-green-600 hover:text-green-700'
                          >
                            <RefreshCw className='h-4 w-4' />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Equipo */}
        <TabsContent value='equipo'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between flex-wrap gap-4'>
              <div>
                <CardTitle>Equipo</CardTitle>
                <CardDescription>
                  Gestiona los miembros del equipo
                </CardDescription>
                <div className='mt-2'>
                  <ChatbotNote
                    enabled={chatbotConfig.chatbot_usar_equipo !== "false"}
                  />
                </div>
              </div>
              <Dialog
                open={dialogOpen && dialogType === "miembro"}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) setEditingMiembro(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setDialogType("miembro");
                      setEditingMiembro(null);
                      setMiembroFotoUrl("");
                      setMiembroFotoPublicId("");
                      // Limpiar campos de curriculum
                      setCurriculumFormacion("");
                      setCurriculumExperiencia("");
                      setCurriculumEspecialidades("");
                      setCurriculumFilosofia("");
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Añadir Miembro
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
                  <DialogHeader>
                    <DialogTitle>
                      {editingMiembro?.id ? "Editar Miembro" : "Nuevo Miembro"}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);

                      // Construir objeto curriculum si hay datos
                      const hasCurriculum =
                        curriculumFormacion ||
                        curriculumExperiencia ||
                        curriculumEspecialidades ||
                        curriculumFilosofia;
                      const curriculum = hasCurriculum
                        ? {
                            formacion: curriculumFormacion
                              .split("\n")
                              .filter((line) => line.trim()),
                            experiencia: curriculumExperiencia
                              .split("\n")
                              .filter((line) => line.trim()),
                            especialidades: curriculumEspecialidades
                              .split("\n")
                              .filter((line) => line.trim()),
                            filosofia: curriculumFilosofia.trim(),
                          }
                        : null;

                      saveMiembro({
                        id: editingMiembro?.id,
                        nombre: formData.get("nombre") as string,
                        cargo: formData.get("cargo") as string,
                        especialidad: formData.get("especialidad") as string,
                        foto_url:
                          miembroFotoUrl || editingMiembro?.foto_url || "",
                        foto_public_id:
                          miembroFotoPublicId ||
                          editingMiembro?.foto_public_id ||
                          "",
                        orden: Number(formData.get("orden")) || 0,
                        visible: true,
                        curriculum,
                      });
                    }}
                    className='space-y-4'
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {/* Columna izquierda: Datos básicos */}
                      <div className='space-y-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='nombre'>Nombre *</Label>
                          <Input
                            id='nombre'
                            name='nombre'
                            defaultValue={editingMiembro?.nombre}
                            required
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='cargo'>Cargo</Label>
                          <Input
                            id='cargo'
                            name='cargo'
                            defaultValue={editingMiembro?.cargo}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='especialidad'>Especialidad</Label>
                          <Input
                            id='especialidad'
                            name='especialidad'
                            defaultValue={editingMiembro?.especialidad}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='orden'>Orden</Label>
                          <Input
                            id='orden'
                            name='orden'
                            type='number'
                            defaultValue={editingMiembro?.orden || 0}
                          />
                        </div>

                        {/* Componente de subida de foto */}
                        <div className='space-y-2'>
                          <Label>Foto del miembro</Label>
                          <div className='space-y-3'>
                            {(miembroFotoUrl || editingMiembro?.foto_url) && (
                              <div className='relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 mx-auto'>
                                <Image
                                  src={
                                    miembroFotoUrl ||
                                    editingMiembro?.foto_url ||
                                    ""
                                  }
                                  alt='Preview'
                                  fill
                                  className='object-cover'
                                />
                                <button
                                  type='button'
                                  onClick={() => {
                                    setMiembroFotoUrl("");
                                    setMiembroFotoPublicId("");
                                  }}
                                  className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                                >
                                  <X className='h-3 w-3' />
                                </button>
                              </div>
                            )}
                            <PhotoUploader
                              onUpload={(url, publicId) => {
                                setMiembroFotoUrl(url);
                                setMiembroFotoPublicId(publicId);
                              }}
                              isUploading={isUploadingPhoto}
                              setIsUploading={setIsUploadingPhoto}
                              oldPublicId={editingMiembro?.foto_public_id}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Columna derecha: Curriculum */}
                      <div className='space-y-4'>
                        <h4 className='font-semibold text-sm text-muted-foreground'>
                          Curriculum Vitae (opcional)
                        </h4>
                        <div className='space-y-2'>
                          <Label htmlFor='formacion'>
                            Formación Académica
                            <span className='text-xs text-muted-foreground ml-1'>
                              (una por línea)
                            </span>
                          </Label>
                          <Textarea
                            id='formacion'
                            value={curriculumFormacion}
                            onChange={(e) =>
                              setCurriculumFormacion(e.target.value)
                            }
                            placeholder='Doctorado en Odontología&#10;Maestría en...'
                            rows={3}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='experiencia'>
                            Experiencia
                            <span className='text-xs text-muted-foreground ml-1'>
                              (una por línea)
                            </span>
                          </Label>
                          <Textarea
                            id='experiencia'
                            value={curriculumExperiencia}
                            onChange={(e) =>
                              setCurriculumExperiencia(e.target.value)
                            }
                            placeholder='10 años de experiencia&#10;Docente universitario...'
                            rows={3}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='especialidades'>
                            Especialidades
                            <span className='text-xs text-muted-foreground ml-1'>
                              (una por línea)
                            </span>
                          </Label>
                          <Textarea
                            id='especialidades'
                            value={curriculumEspecialidades}
                            onChange={(e) =>
                              setCurriculumEspecialidades(e.target.value)
                            }
                            placeholder='Implantes dentales&#10;Ortodoncia...'
                            rows={3}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='filosofia'>
                            Filosofía profesional
                          </Label>
                          <Textarea
                            id='filosofia'
                            value={curriculumFilosofia}
                            onChange={(e) =>
                              setCurriculumFilosofia(e.target.value)
                            }
                            placeholder='Mi objetivo es...'
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type='submit'
                        disabled={isSaving || isUploadingPhoto}
                      >
                        {isSaving && (
                          <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        )}
                        <Save className='h-4 w-4 mr-2' />
                        Guardar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>CV</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipo.map((miembro) => (
                    <TableRow
                      key={miembro.id}
                      className={
                        !miembro.visible ? "opacity-50 bg-gray-50" : ""
                      }
                    >
                      <TableCell>{miembro.orden}</TableCell>
                      <TableCell className='font-medium'>
                        {miembro.nombre}
                      </TableCell>
                      <TableCell>{miembro.cargo}</TableCell>
                      <TableCell>{miembro.especialidad}</TableCell>
                      <TableCell>
                        {miembro.curriculum ? (
                          <Badge
                            variant='outline'
                            className='text-blue-600 border-blue-600'
                          >
                            <FileText className='h-3 w-3 mr-1' />
                            Sí
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='text-gray-400 border-gray-400'
                          >
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {miembro.visible ? (
                          <Badge
                            variant='outline'
                            className='text-green-600 border-green-600'
                          >
                            <Eye className='h-3 w-3 mr-1' />
                            Visible
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='text-gray-400 border-gray-400'
                          >
                            <EyeOff className='h-3 w-3 mr-1' />
                            Oculto
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-right space-x-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            setEditingMiembro(miembro);
                            setMiembroFotoUrl(miembro.foto_url || "");
                            setMiembroFotoPublicId(
                              miembro.foto_public_id || ""
                            );
                            // Cargar curriculum existente
                            const cv = miembro.curriculum;
                            setCurriculumFormacion(
                              cv?.formacion?.join("\n") || ""
                            );
                            setCurriculumExperiencia(
                              cv?.experiencia?.join("\n") || ""
                            );
                            setCurriculumEspecialidades(
                              cv?.especialidades?.join("\n") || ""
                            );
                            setCurriculumFilosofia(cv?.filosofia || "");
                            setDialogType("miembro");
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        {miembro.visible ? (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => deleteMiembro(miembro.id)}
                            title='Ocultar miembro'
                          >
                            <Trash2 className='h-4 w-4 text-red-500' />
                          </Button>
                        ) : (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => restaurarMiembro(miembro)}
                            title='Restaurar miembro'
                            className='text-green-600 hover:text-green-700'
                          >
                            <RefreshCw className='h-4 w-4' />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Tema */}
        <TabsContent value='tema'>
          <Card>
            <CardHeader>
              <CardTitle>Colores del Tema</CardTitle>
              <CardDescription>
                Personaliza los colores de la marca (próximamente)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
                <div className='space-y-2'>
                  <Label>Color Primario</Label>
                  <div className='flex items-center gap-2'>
                    <Input
                      type='color'
                      value={tema.color_primario || "#3b82f6"}
                      onChange={(e) =>
                        setTema({ ...tema, color_primario: e.target.value })
                      }
                      onBlur={(e) => saveTema("color_primario", e.target.value)}
                      className='w-16 h-10 p-1 cursor-pointer'
                    />
                    <Input
                      value={tema.color_primario || "#3b82f6"}
                      onChange={(e) =>
                        setTema({ ...tema, color_primario: e.target.value })
                      }
                      className='font-mono'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Color Secundario</Label>
                  <div className='flex items-center gap-2'>
                    <Input
                      type='color'
                      value={tema.color_secundario || "#1e40af"}
                      onChange={(e) =>
                        setTema({ ...tema, color_secundario: e.target.value })
                      }
                      onBlur={(e) =>
                        saveTema("color_secundario", e.target.value)
                      }
                      className='w-16 h-10 p-1 cursor-pointer'
                    />
                    <Input
                      value={tema.color_secundario || "#1e40af"}
                      onChange={(e) =>
                        setTema({ ...tema, color_secundario: e.target.value })
                      }
                      className='font-mono'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Color de Acento</Label>
                  <div className='flex items-center gap-2'>
                    <Input
                      type='color'
                      value={tema.color_acento || "#22c55e"}
                      onChange={(e) =>
                        setTema({ ...tema, color_acento: e.target.value })
                      }
                      onBlur={(e) => saveTema("color_acento", e.target.value)}
                      className='w-16 h-10 p-1 cursor-pointer'
                    />
                    <Input
                      value={tema.color_acento || "#22c55e"}
                      onChange={(e) =>
                        setTema({ ...tema, color_acento: e.target.value })
                      }
                      className='font-mono'
                    />
                  </div>
                </div>
              </div>
              <p className='text-sm text-muted-foreground mt-6'>
                Nota: Los cambios de color requieren actualización del código
                para aplicarse completamente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para gestionar imágenes de servicio */}
      <Dialog
        open={imagenesDialogOpen}
        onOpenChange={(open) => {
          setImagenesDialogOpen(open);
          if (!open) {
            setServicioParaImagenes(null);
            setServicioImagenes([]);
            setNuevaImagenDescripcion("");
          }
        }}
      >
        <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              Imágenes de {servicioParaImagenes?.nombre || "Servicio"}
            </DialogTitle>
            <DialogDescription>
              Gestiona las imágenes del carrusel para este servicio
            </DialogDescription>
          </DialogHeader>

          {/* Subir nueva imagen */}
          <div className='space-y-4 border-b pb-4'>
            <Label className='text-base font-semibold'>
              Agregar nueva imagen
            </Label>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Imagen</Label>
                <Input
                  type='file'
                  accept='image/*'
                  disabled={isUploadingServicioImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await uploadServicioImagen(file, nuevaImagenDescripcion);
                      setNuevaImagenDescripcion("");
                      e.target.value = "";
                    }
                  }}
                />
              </div>
              <div className='space-y-2'>
                <Label>Descripción (opcional)</Label>
                <Input
                  placeholder='Descripción de la imagen...'
                  value={nuevaImagenDescripcion}
                  onChange={(e) => setNuevaImagenDescripcion(e.target.value)}
                  disabled={isUploadingServicioImage}
                />
              </div>
            </div>
            {isUploadingServicioImage && (
              <p className='text-sm text-muted-foreground flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Subiendo imagen...
              </p>
            )}
          </div>

          {/* Lista de imágenes */}
          <div className='space-y-4'>
            <Label className='text-base font-semibold'>
              Imágenes del carrusel ({servicioImagenes.length})
            </Label>

            {isLoadingImagenes ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
              </div>
            ) : servicioImagenes.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                No hay imágenes. Agrega la primera imagen arriba.
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {servicioImagenes.map((imagen, index) => (
                  <div
                    key={imagen.id}
                    className={`relative border rounded-lg overflow-hidden ${
                      !imagen.visible ? "opacity-50" : ""
                    }`}
                  >
                    <div className='aspect-video relative'>
                      <Image
                        src={imagen.imagen_url}
                        alt={imagen.descripcion || `Imagen ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                      <div className='absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs'>
                        #{imagen.orden}
                      </div>
                    </div>
                    <div className='p-3 space-y-2'>
                      {imagen.descripcion && (
                        <p className='text-sm text-muted-foreground truncate'>
                          {imagen.descripcion}
                        </p>
                      )}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => toggleImagenVisibilidad(imagen)}
                            title={imagen.visible ? "Ocultar" : "Mostrar"}
                          >
                            {imagen.visible ? (
                              <Eye className='h-4 w-4 text-green-500' />
                            ) : (
                              <EyeOff className='h-4 w-4 text-gray-400' />
                            )}
                          </Button>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => deleteServicioImagen(imagen.id)}
                          title='Eliminar imagen'
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

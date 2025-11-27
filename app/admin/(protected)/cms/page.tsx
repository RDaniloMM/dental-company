"use client";

import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
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
  Shield,
  Key,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  orden: number;
  visible: boolean;
}

interface Miembro {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  foto_url: string;
  orden: number;
  visible: boolean;
}

interface Invitacion {
  id: string;
  codigo: string;
  rol_asignado: string;
  usos_maximos: number;
  usos_actuales: number;
  activo: boolean;
  expira_at: string | null;
  created_at: string;
  used_at: string | null;
}

interface TemaConfig {
  [key: string]: string;
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

  // Estados para seguridad
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [registroPublico, setRegistroPublico] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Cargar datos
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cms");
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

  // Cargar configuración de seguridad
  const fetchSecurityConfig = async () => {
    try {
      const [configRes, invitesRes] = await Promise.all([
        fetch("/api/auth/config"),
        fetch("/api/auth/invitaciones"),
      ]);

      if (configRes.ok) {
        const config = await configRes.json();
        setRegistroPublico(config.publicRegistration);
      }

      if (invitesRes.ok) {
        const invites = await invitesRes.json();
        setInvitaciones(invites);
      }
    } catch (error) {
      console.error("Error cargando config seguridad:", error);
    }
  };

  // Toggle registro público
  const toggleRegistroPublico = async (enabled: boolean) => {
    try {
      const res = await fetch("/api/auth/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clave: "registro_publico_habilitado",
          valor: enabled ? "true" : "false",
        }),
      });

      if (res.ok) {
        setRegistroPublico(enabled);
        toast.success(
          enabled
            ? "Registro público habilitado"
            : "Registro público deshabilitado - Se requiere código de invitación"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar configuración");
    }
  };

  // Crear código de invitación
  const crearInvitacion = async (formData: FormData) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/invitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: formData.get("codigo") || undefined,
          rol_asignado: formData.get("rol") || "Odontólogo",
          usos_maximos: Number(formData.get("usos")) || 1,
          expira_en_dias: formData.get("expira")
            ? Number(formData.get("expira"))
            : undefined,
        }),
      });

      if (res.ok) {
        toast.success("Código de invitación creado");
        fetchSecurityConfig();
        setInviteDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Error al crear código");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear invitación");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar invitación
  const eliminarInvitacion = async (id: string) => {
    if (!confirm("¿Eliminar este código de invitación?")) return;

    try {
      const res = await fetch(`/api/auth/invitaciones?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Código eliminado");
        fetchSecurityConfig();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar");
    }
  };

  // Copiar código
  const copiarCodigo = async (codigo: string) => {
    await navigator.clipboard.writeText(codigo);
    setCopiedCode(codigo);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Código copiado");
  };

  useEffect(() => {
    fetchData();
    fetchSecurityConfig();
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
        fetchData();
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

  // Eliminar servicio
  const deleteServicio = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este servicio?")) return;

    try {
      const res = await fetch(`/api/cms?tipo=servicio&id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Servicio eliminado");
        fetchData();
      }
    } catch (error) {
      console.error("Error eliminando:", error);
      toast.error("Error al eliminar");
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
        fetchData();
        setDialogOpen(false);
        setEditingMiembro(null);
      }
    } catch (error) {
      console.error("Error guardando miembro:", error);
      toast.error("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar miembro
  const deleteMiembro = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este miembro?")) return;

    try {
      const res = await fetch(`/api/cms?tipo=equipo&id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Miembro eliminado");
        fetchData();
      }
    } catch (error) {
      console.error("Error eliminando:", error);
      toast.error("Error al eliminar");
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
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger
            value='general'
            className='flex items-center gap-2'
          >
            <Settings className='h-4 w-4' />
            General
          </TabsTrigger>
          <TabsTrigger
            value='servicios'
            className='flex items-center gap-2'
          >
            <FileText className='h-4 w-4' />
            Servicios
          </TabsTrigger>
          <TabsTrigger
            value='equipo'
            className='flex items-center gap-2'
          >
            <Users className='h-4 w-4' />
            Equipo
          </TabsTrigger>
          <TabsTrigger
            value='tema'
            className='flex items-center gap-2'
          >
            <Palette className='h-4 w-4' />
            Tema
          </TabsTrigger>
          <TabsTrigger
            value='seguridad'
            className='flex items-center gap-2'
          >
            <Shield className='h-4 w-4' />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* Tab: Configuración General */}
        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Configura la información básica de la clínica
              </CardDescription>
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
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Servicios</CardTitle>
                <CardDescription>
                  Gestiona los servicios mostrados en la landing page
                </CardDescription>
              </div>
              <Dialog
                open={dialogOpen && dialogType === "servicio"}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) setEditingServicio(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setDialogType("servicio");
                      setEditingServicio(null);
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Añadir Servicio
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
                      });
                    }}
                    className='space-y-4'
                  >
                    <div className='space-y-2'>
                      <Label htmlFor='nombre'>Nombre</Label>
                      <Input
                        id='nombre'
                        name='nombre'
                        defaultValue={editingServicio?.nombre}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='descripcion'>Descripción</Label>
                      <Textarea
                        id='descripcion'
                        name='descripcion'
                        defaultValue={editingServicio?.descripcion}
                        required
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='icono'>Icono</Label>
                        <select
                          id='icono'
                          name='icono'
                          defaultValue={editingServicio?.icono || "Stethoscope"}
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
                    <TableHead>Visible</TableHead>
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicios.map((servicio) => (
                    <TableRow key={servicio.id}>
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
                        {servicio.visible ? (
                          <Eye className='h-4 w-4 text-green-600' />
                        ) : (
                          <EyeOff className='h-4 w-4 text-gray-400' />
                        )}
                      </TableCell>
                      <TableCell className='text-right space-x-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            setEditingServicio(servicio);
                            setDialogType("servicio");
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => deleteServicio(servicio.id)}
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
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
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Equipo</CardTitle>
                <CardDescription>
                  Gestiona los miembros del equipo
                </CardDescription>
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
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Añadir Miembro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingMiembro?.id ? "Editar Miembro" : "Nuevo Miembro"}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      saveMiembro({
                        id: editingMiembro?.id,
                        nombre: formData.get("nombre") as string,
                        cargo: formData.get("cargo") as string,
                        especialidad: formData.get("especialidad") as string,
                        foto_url: formData.get("foto_url") as string,
                        orden: Number(formData.get("orden")) || 0,
                        visible: true,
                      });
                    }}
                    className='space-y-4'
                  >
                    <div className='space-y-2'>
                      <Label htmlFor='nombre'>Nombre</Label>
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
                      <Label htmlFor='foto_url'>URL de Foto</Label>
                      <Input
                        id='foto_url'
                        name='foto_url'
                        defaultValue={editingMiembro?.foto_url}
                        placeholder='/dentista.png'
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
                    <TableHead>Cargo</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipo.map((miembro) => (
                    <TableRow key={miembro.id}>
                      <TableCell>{miembro.orden}</TableCell>
                      <TableCell className='font-medium'>
                        {miembro.nombre}
                      </TableCell>
                      <TableCell>{miembro.cargo}</TableCell>
                      <TableCell>{miembro.especialidad}</TableCell>
                      <TableCell>
                        {miembro.visible ? (
                          <Eye className='h-4 w-4 text-green-600' />
                        ) : (
                          <EyeOff className='h-4 w-4 text-gray-400' />
                        )}
                      </TableCell>
                      <TableCell className='text-right space-x-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            setEditingMiembro(miembro);
                            setDialogType("miembro");
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => deleteMiembro(miembro.id)}
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
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

        {/* Tab: Seguridad */}
        <TabsContent value='seguridad'>
          <div className='space-y-6'>
            {/* Configuración de Registro */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Control de Acceso
                </CardTitle>
                <CardDescription>
                  Configura cómo los usuarios pueden registrarse en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex items-center justify-between p-4 bg-muted/50 rounded-lg'>
                  <div className='space-y-1'>
                    <h4 className='font-medium'>Registro Público</h4>
                    <p className='text-sm text-muted-foreground'>
                      {registroPublico
                        ? "Cualquier persona puede crear una cuenta"
                        : "Se requiere código de invitación para registrarse"}
                    </p>
                  </div>
                  <Switch
                    checked={registroPublico}
                    onCheckedChange={toggleRegistroPublico}
                  />
                </div>

                {!registroPublico && (
                  <div className='p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 rounded-lg'>
                    <p className='text-sm text-amber-800 dark:text-amber-200'>
                      <strong>Modo Seguro Activo:</strong> Los nuevos usuarios
                      necesitan un código de invitación válido para registrarse.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Códigos de Invitación */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <Key className='h-5 w-5' />
                      Códigos de Invitación
                    </CardTitle>
                    <CardDescription>
                      Gestiona los códigos para invitar nuevos usuarios
                    </CardDescription>
                  </div>
                  <Dialog
                    open={inviteDialogOpen}
                    onOpenChange={setInviteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className='h-4 w-4 mr-2' />
                        Nuevo Código
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear Código de Invitación</DialogTitle>
                        <DialogDescription>
                          El código será usado por el nuevo usuario para
                          registrarse
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          crearInvitacion(new FormData(e.currentTarget));
                        }}
                        className='space-y-4'
                      >
                        <div className='space-y-2'>
                          <Label htmlFor='codigo'>Código (opcional)</Label>
                          <Input
                            id='codigo'
                            name='codigo'
                            placeholder='Dejar vacío para generar automáticamente'
                          />
                          <p className='text-xs text-muted-foreground'>
                            Si no especificas, se generará uno como DC-XXXXXX
                          </p>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='rol'>Rol asignado</Label>
                          <select
                            id='rol'
                            name='rol'
                            className='w-full border rounded-md p-2'
                          >
                            <option value='Odontólogo'>Odontólogo</option>
                            <option value='Recepcionista'>Recepcionista</option>
                            <option value='Auxiliar'>Auxiliar</option>
                            <option value='Administrador'>Administrador</option>
                          </select>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='usos'>Usos máximos</Label>
                            <Input
                              id='usos'
                              name='usos'
                              type='number'
                              defaultValue={1}
                              min={1}
                              max={100}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='expira'>Expira en (días)</Label>
                            <Input
                              id='expira'
                              name='expira'
                              type='number'
                              placeholder='Sin expiración'
                              min={1}
                            />
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
                            Crear Código
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {invitaciones.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    <Key className='h-12 w-12 mx-auto mb-4 opacity-20' />
                    <p>No hay códigos de invitación creados</p>
                    <p className='text-sm'>
                      Crea uno para invitar nuevos usuarios
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Usos</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Expira</TableHead>
                        <TableHead className='text-right'>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invitaciones.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <code className='bg-muted px-2 py-1 rounded font-mono text-sm'>
                                {inv.codigo}
                              </code>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => copiarCodigo(inv.codigo)}
                              >
                                {copiedCode === inv.codigo ? (
                                  <Check className='h-4 w-4 text-green-500' />
                                ) : (
                                  <Copy className='h-4 w-4' />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant='outline'>{inv.rol_asignado}</Badge>
                          </TableCell>
                          <TableCell>
                            {inv.usos_actuales} / {inv.usos_maximos}
                          </TableCell>
                          <TableCell>
                            {inv.activo ? (
                              inv.usos_actuales >= inv.usos_maximos ? (
                                <Badge variant='secondary'>Agotado</Badge>
                              ) : (
                                <Badge className='bg-green-500'>Activo</Badge>
                              )
                            ) : (
                              <Badge variant='destructive'>Inactivo</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {inv.expira_at
                              ? new Date(inv.expira_at).toLocaleDateString()
                              : "Sin expiración"}
                          </TableCell>
                          <TableCell className='text-right'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => eliminarInvitacion(inv.id)}
                            >
                              <Trash2 className='h-4 w-4 text-red-500' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

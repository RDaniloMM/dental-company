"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCog,
  Users,
  Shield,
  Stethoscope,
  Plus,
  Search,
  Trash2,
  Mail,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Edit,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

interface Personal {
  id: string;
  nombre_completo: string;
  rol: "Admin" | "Odontólogo";
  especialidad: string | null;
  telefono: string | null;
  email: string | null;
  activo: boolean;
}

interface CodigoInvitacion {
  id: string;
  codigo: string;
  rol_asignado: string;
  usos_maximos: number;
  usos_actuales: number;
  activo: boolean;
  expira_at: string | null;
  created_at: string;
}

export default function PersonalPage() {
  const router = useRouter();
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [codigos, setCodigos] = useState<CodigoInvitacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [codigoDialogOpen, setCodigoDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Personal | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Verificar permisos de admin
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      setCurrentUserId(user.id);

      const { data: personalData } = await supabase
        .from("personal")
        .select("rol")
        .eq("id", user.id)
        .single();

      const isAdmin =
        personalData?.rol === "Admin" || personalData?.rol === "Administrador";
      setIsAuthorized(isAdmin);

      if (!isAdmin) {
        toast.error("No tienes permisos para acceder a esta sección");
        setTimeout(() => router.push("/admin/dashboard"), 2000);
      }
    };

    checkAuth();
  }, [router]);

  // Cargar personal
  const fetchPersonal = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("personal")
        .select(
          "id, nombre_completo, rol, especialidad, telefono, email, activo"
        )
        .order("nombre_completo", { ascending: true });

      if (error) {
        console.error(
          "Error cargando personal:",
          error.message,
          error.details,
          error.hint
        );
        toast.error(`Error: ${error.message}`);
      } else {
        console.log("Personal cargado:", data);
        setPersonal(data || []);
      }
    } catch (error) {
      console.error("Error catch:", error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar códigos de invitación
  const fetchCodigos = async () => {
    try {
      const res = await fetch("/api/auth/invitaciones");
      if (res.ok) {
        const data = await res.json();
        setCodigos(data || []);
      }
    } catch (error) {
      console.error("Error cargando códigos:", error);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchPersonal();
      fetchCodigos();
    }
  }, [isAuthorized]);

  // Mostrar pantalla de carga mientras verifica permisos
  if (isAuthorized === null) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center space-y-4'>
          <Loader2 className='h-12 w-12 animate-spin mx-auto text-primary' />
          <p className='text-muted-foreground'>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de acceso denegado
  if (!isAuthorized) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Card className='max-w-md'>
          <CardHeader className='text-center'>
            <ShieldAlert className='h-16 w-16 mx-auto text-destructive mb-4' />
            <CardTitle className='text-destructive'>Acceso Denegado</CardTitle>
            <CardDescription>
              Esta sección está reservada para administradores del sistema.
              Serás redirigido al inicio en unos segundos.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Crear código de invitación
  const crearCodigo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const rol = formData.get("rol") as string;
    const usos = Number(formData.get("usos")) || 1;

    try {
      const res = await fetch("/api/auth/invitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rol_asignado: rol,
          usos_maximos: usos,
        }),
      });

      if (res.ok) {
        toast.success("Código de invitación creado");
        fetchCodigos();
        setCodigoDialogOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Error al crear código");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear código");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar código
  const eliminarCodigo = async (id: string) => {
    try {
      const res = await fetch(`/api/auth/invitaciones?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Código eliminado");
        fetchCodigos();
      } else {
        toast.error("Error al eliminar código");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Copiar código
  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiedCode(codigo);
    toast.success("Código copiado al portapapeles");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Editar personal
  const guardarPersona = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPersona) return;

    setIsSaving(true);
    try {
      const supabase = createClient();
      const formData = new FormData(e.currentTarget);

      const updates = {
        nombre_completo: formData.get("nombre_completo") as string,
        rol: formData.get("rol") as "Admin" | "Odontólogo",
        especialidad: (formData.get("especialidad") as string) || null,
        telefono: (formData.get("telefono") as string) || null,
        activo: formData.get("activo") === "true",
      };

      const { error } = await supabase
        .from("personal")
        .update(updates)
        .eq("id", editingPersona.id);

      if (error) {
        console.error("Error actualizando personal:", error);
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success("Personal actualizado correctamente");
        setEditDialogOpen(false);
        setEditingPersona(null);
        fetchPersonal();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  // Abrir diálogo de edición
  const abrirEdicion = (persona: Personal) => {
    setEditingPersona(persona);
    setEditDialogOpen(true);
  };

  // Eliminar personal permanentemente
  const eliminarPersona = async (persona: Personal) => {
    if (persona.id === currentUserId) {
      toast.error("No puedes eliminar tu propia cuenta");
      return;
    }

    try {
      const res = await fetch(`/api/auth/personal?id=${persona.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        // Mostrar mensaje apropiado según si fue eliminado o desactivado
        if (data.message?.includes("desactivado")) {
          toast.warning(data.message);
        } else {
          toast.success(
            `${persona.nombre_completo} ha sido eliminado del sistema`
          );
        }
        fetchPersonal();
      } else {
        toast.error(data.error || "Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar usuario");
    }
  };

  // Filtrar personal
  const filteredPersonal = personal.filter((p) => {
    return (
      p.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.especialidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const stats = {
    total: personal.length,
    odontologos: personal.filter((p) => p.rol === "Odontólogo").length,
    admins: personal.filter((p) => p.rol === "Admin").length,
    activos: personal.filter((p) => p.activo).length,
    codigosActivos: codigos.filter((c) => c.activo).length,
  };

  return (
    <div className='container mx-auto p-4 md:p-6 space-y-4 md:space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold flex items-center gap-2'>
            <UserCog className='h-6 w-6 md:h-8 md:w-8' />
            Personal
          </h1>
          <p className='text-sm text-muted-foreground'>
            Gestiona odontólogos y administradores
          </p>
        </div>
        <Button
          size='sm'
          onClick={() => {
            fetchPersonal();
            fetchCodigos();
          }}
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          <span className='hidden sm:inline'>Actualizar</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        <Card>
          <CardHeader className='pb-2 px-4 pt-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground'>
              Total
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-blue-500' />
              <span className='text-xl font-bold'>{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2 px-4 pt-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground'>
              Odontólogos
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='flex items-center gap-2'>
              <Stethoscope className='h-4 w-4 text-green-500' />
              <span className='text-xl font-bold'>{stats.odontologos}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2 px-4 pt-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground'>
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='flex items-center gap-2'>
              <Shield className='h-4 w-4 text-purple-500' />
              <span className='text-xl font-bold'>{stats.admins}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2 px-4 pt-4'>
            <CardTitle className='text-xs font-medium text-muted-foreground'>
              Códigos
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 pb-4'>
            <div className='flex items-center gap-2'>
              <Plus className='h-4 w-4 text-orange-500' />
              <span className='text-xl font-bold'>{stats.codigosActivos}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger
            value='personal'
            className='flex items-center gap-2'
          >
            <Users className='h-4 w-4' />
            Personal
          </TabsTrigger>
          <TabsTrigger
            value='invitaciones'
            className='flex items-center gap-2'
          >
            <Mail className='h-4 w-4' />
            Códigos de Invitación
          </TabsTrigger>
        </TabsList>

        {/* Tab: Personal */}
        <TabsContent value='personal'>
          <Card>
            <CardHeader>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                  <CardTitle>Listado de Personal</CardTitle>
                  <CardDescription>
                    Odontólogos y administradores con acceso al sistema
                  </CardDescription>
                </div>
                <div className='relative w-full sm:w-auto'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Buscar...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-9 w-full sm:w-64'
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                </div>
              ) : filteredPersonal.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  {searchTerm
                    ? "No se encontraron resultados"
                    : "No hay personal registrado"}
                </div>
              ) : (
                <div className='overflow-x-auto -mx-6 px-6'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Email
                        </TableHead>
                        <TableHead className='hidden lg:table-cell'>
                          Teléfono
                        </TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className='hidden sm:table-cell'>
                          Estado
                        </TableHead>
                        <TableHead className='text-right'>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPersonal.map((persona) => (
                        <TableRow key={persona.id}>
                          <TableCell>
                            <div className='font-medium'>
                              {persona.nombre_completo}
                            </div>
                            <div className='text-xs text-muted-foreground md:hidden'>
                              {persona.email || "-"}
                            </div>
                            {persona.especialidad && (
                              <div className='text-xs text-muted-foreground'>
                                {persona.especialidad}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className='hidden md:table-cell text-muted-foreground'>
                            {persona.email || "-"}
                          </TableCell>
                          <TableCell className='hidden lg:table-cell text-muted-foreground'>
                            {persona.telefono || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                persona.rol === "Admin" ? "default" : "outline"
                              }
                              className='text-xs'
                            >
                              {persona.rol === "Admin" ? (
                                <Shield className='h-3 w-3 mr-1' />
                              ) : (
                                <Stethoscope className='h-3 w-3 mr-1' />
                              )}
                              <span className='hidden sm:inline'>
                                {persona.rol === "Admin"
                                  ? "Admin"
                                  : "Odontólogo"}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className='hidden sm:table-cell'>
                            <Badge
                              variant={persona.activo ? "default" : "secondary"}
                              className='text-xs'
                            >
                              {persona.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex items-center justify-end gap-1'>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => abrirEdicion(persona)}
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              {persona.id !== currentUserId && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant='ghost'
                                      size='icon'
                                      className='h-8 w-8 text-destructive hover:text-destructive'
                                    >
                                      <Trash2 className='h-4 w-4' />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        ¿Eliminar a {persona.nombre_completo}?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción eliminará permanentemente a
                                        este usuario del sistema. No podrá
                                        volver a acceder y deberá registrarse de
                                        nuevo.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => eliminarPersona(persona)}
                                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Códigos de Invitación */}
        <TabsContent value='invitaciones'>
          <Card>
            <CardHeader>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                  <CardTitle>Códigos de Invitación</CardTitle>
                  <CardDescription className='hidden sm:block'>
                    Códigos para registrar nuevos usuarios
                  </CardDescription>
                </div>
                <Dialog
                  open={codigoDialogOpen}
                  onOpenChange={setCodigoDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size='sm'>
                      <Plus className='h-4 w-4 mr-2' />
                      Nuevo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Código de Invitación</DialogTitle>
                      <DialogDescription>
                        Este código permitirá a nuevos usuarios registrarse en
                        el sistema
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={crearCodigo}
                      className='space-y-4'
                    >
                      <div className='space-y-2'>
                        <Label htmlFor='rol'>Rol asignado</Label>
                        <Select
                          name='rol'
                          defaultValue='Odontólogo'
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar rol' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Odontólogo'>
                              Odontólogo
                            </SelectItem>
                            <SelectItem value='Administrador'>
                              Administrador
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='usos'>Número de usos máximos</Label>
                        <Input
                          id='usos'
                          name='usos'
                          type='number'
                          defaultValue={1}
                          min={1}
                          max={100}
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
                          Crear Código
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {codigos.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  No hay códigos de invitación
                </div>
              ) : (
                <div className='overflow-x-auto -mx-6 px-6'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead className='hidden sm:table-cell'>
                          Rol
                        </TableHead>
                        <TableHead>Usos</TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Estado
                        </TableHead>
                        <TableHead className='text-right'>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {codigos.map((codigo) => (
                        <TableRow key={codigo.id}>
                          <TableCell>
                            <div className='flex items-center gap-1'>
                              <code className='bg-muted px-1.5 py-0.5 rounded font-mono text-xs'>
                                {codigo.codigo}
                              </code>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6'
                                onClick={() => copiarCodigo(codigo.codigo)}
                              >
                                {copiedCode === codigo.codigo ? (
                                  <Check className='h-3 w-3 text-green-500' />
                                ) : (
                                  <Copy className='h-3 w-3' />
                                )}
                              </Button>
                            </div>
                            <div className='text-xs text-muted-foreground sm:hidden mt-1'>
                              {codigo.rol_asignado}
                            </div>
                          </TableCell>
                          <TableCell className='hidden sm:table-cell'>
                            <Badge
                              variant={
                                codigo.rol_asignado === "Administrador"
                                  ? "default"
                                  : "outline"
                              }
                              className='text-xs'
                            >
                              {codigo.rol_asignado === "Administrador" ? (
                                <Shield className='h-3 w-3 mr-1' />
                              ) : (
                                <Stethoscope className='h-3 w-3 mr-1' />
                              )}
                              <span className='hidden md:inline'>
                                {codigo.rol_asignado}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className='text-sm'>
                            {codigo.usos_actuales}/{codigo.usos_maximos}
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <Badge
                              variant={codigo.activo ? "default" : "secondary"}
                              className='text-xs'
                            >
                              {codigo.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-8 w-8'
                                >
                                  <Trash2 className='h-4 w-4 text-destructive' />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ¿Eliminar código?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => eliminarCodigo(codigo.id)}
                                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Editar Personal */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Edit className='h-5 w-5' />
              Editar Personal
            </DialogTitle>
            <DialogDescription>
              Modifica los datos del personal. El email no puede ser cambiado.
            </DialogDescription>
          </DialogHeader>
          {editingPersona && (
            <form
              onSubmit={guardarPersona}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <Label htmlFor='nombre_completo'>Nombre Completo</Label>
                <Input
                  id='nombre_completo'
                  name='nombre_completo'
                  defaultValue={editingPersona.nombre_completo}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  value={editingPersona.email || ""}
                  disabled
                  className='bg-muted'
                />
                <p className='text-xs text-muted-foreground'>
                  El email está vinculado a la cuenta y no puede modificarse
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='rol'>Rol</Label>
                  <Select
                    name='rol'
                    defaultValue={editingPersona.rol}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Odontólogo'>
                        <div className='flex items-center gap-2'>
                          <Stethoscope className='h-4 w-4' />
                          Odontólogo
                        </div>
                      </SelectItem>
                      <SelectItem value='Admin'>
                        <div className='flex items-center gap-2'>
                          <Shield className='h-4 w-4' />
                          Administrador
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='activo'>Estado</Label>
                  <Select
                    name='activo'
                    defaultValue={editingPersona.activo ? "true" : "false"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='true'>Activo</SelectItem>
                      <SelectItem value='false'>Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='especialidad'>Especialidad</Label>
                <Input
                  id='especialidad'
                  name='especialidad'
                  defaultValue={editingPersona.especialidad || ""}
                  placeholder='Ej: Ortodoncia, Endodoncia, etc.'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='telefono'>Teléfono</Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='telefono'
                    name='telefono'
                    defaultValue={editingPersona.telefono || ""}
                    placeholder='+51 999 999 999'
                    className='pl-9'
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={isSaving}
                >
                  {isSaving && (
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  )}
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

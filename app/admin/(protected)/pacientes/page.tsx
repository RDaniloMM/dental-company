"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  FileText,
  Loader2,
  User,
  Phone,
  ClipboardPlus,
  Settings2,
  Mail,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

// Definición de columnas disponibles para la tabla de pacientes
const COLUMNAS_PACIENTES = {
  numero_historia: { label: "N° Historia", default: true },
  nombre: { label: "Paciente", default: true },
  dni: { label: "DNI", default: true },
  edad: { label: "Edad", default: true },
  telefono: { label: "Teléfono", default: true },
  email: { label: "Email", default: false },
  direccion: { label: "Dirección", default: false },
  sexo: { label: "Sexo", default: true },
  fecha_registro: { label: "Fecha Registro", default: false },
} as const;

type ColumnaPaciente = keyof typeof COLUMNAS_PACIENTES;

interface Paciente {
  id: string;
  numero_historia: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: string;
  sexo: string;
  telefono: string;
  email: string;
  direccion: string;
  created_at: string;
}

export default function PacientesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estado para columnas visibles
  const [columnasVisibles, setColumnasVisibles] = useState<
    Record<ColumnaPaciente, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    Object.entries(COLUMNAS_PACIENTES).forEach(([key, value]) => {
      initial[key] = value.default;
    });
    return initial as Record<ColumnaPaciente, boolean>;
  });

  // Form state para nuevo paciente
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    fecha_nacimiento: "",
    genero: "Masculino",
    telefono: "",
    email: "",
    direccion: "",
  });

  // Cargar pacientes
  const loadPacientes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPacientes(data || []);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
      toast.error("Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadPacientes();
  }, [loadPacientes]);

  // Filtrar pacientes
  const filteredPacientes = pacientes.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nombres?.toLowerCase().includes(term) ||
      p.apellidos?.toLowerCase().includes(term) ||
      p.dni?.includes(term) ||
      p.numero_historia?.includes(term)
    );
  });

  // Crear nuevo paciente
  const handleCreatePaciente = async (redirectToFicha = false) => {
    if (
      !formData.nombres ||
      !formData.apellidos ||
      !formData.dni ||
      !formData.fecha_nacimiento
    ) {
      toast.error(
        "Complete los campos obligatorios (nombres, apellidos, DNI y fecha de nacimiento)"
      );
      return;
    }

    setSaving(true);
    try {
      // El número de historia se genera automáticamente por trigger en la BD
      const { data: newPaciente, error } = await supabase
        .from("pacientes")
        .insert([formData])
        .select("numero_historia")
        .single();

      if (error) throw error;

      toast.success("Paciente registrado correctamente");
      setDialogOpen(false);
      setFormData({
        nombres: "",
        apellidos: "",
        dni: "",
        fecha_nacimiento: "",
        genero: "Masculino",
        telefono: "",
        email: "",
        direccion: "",
      });

      if (redirectToFicha && newPaciente?.numero_historia) {
        // Redirigir al formulario completo de filiación
        router.push(
          `/admin/ficha-odontologica/${newPaciente.numero_historia}/filiacion`
        );
      } else {
        loadPacientes();
      }
    } catch (error: unknown) {
      console.error("Error creando paciente:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || "Error desconocido";
      toast.error(`Error al registrar paciente: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // Ir a la ficha del paciente
  const goToFicha = (numeroHistoria: string) => {
    router.push(`/admin/ficha-odontologica/${numeroHistoria}`);
  };

  // Calcular edad
  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return "-";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Pacientes</h1>
          <p className='text-muted-foreground'>
            Gestiona los pacientes de la clínica
          </p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className='h-4 w-4 mr-2' />
              Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
              <DialogDescription>
                Complete los datos del paciente. Los campos con * son
                obligatorios.
              </DialogDescription>
            </DialogHeader>

            <div className='grid grid-cols-2 gap-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='nombres'>Nombres *</Label>
                <Input
                  id='nombres'
                  value={formData.nombres}
                  onChange={(e) =>
                    setFormData({ ...formData, nombres: e.target.value })
                  }
                  placeholder='Juan Carlos'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='apellidos'>Apellidos *</Label>
                <Input
                  id='apellidos'
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                  placeholder='Pérez García'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dni'>DNI *</Label>
                <Input
                  id='dni'
                  value={formData.dni}
                  onChange={(e) =>
                    setFormData({ ...formData, dni: e.target.value })
                  }
                  placeholder='12345678'
                  maxLength={8}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='fecha_nacimiento'>Fecha de Nacimiento</Label>
                <Input
                  id='fecha_nacimiento'
                  type='date'
                  value={formData.fecha_nacimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_nacimiento: e.target.value,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='genero'>Género</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) =>
                    setFormData({ ...formData, genero: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Masculino'>Masculino</SelectItem>
                    <SelectItem value='Femenino'>Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='telefono'>Teléfono</Label>
                <Input
                  id='telefono'
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder='+51 999 999 999'
                />
              </div>
              <div className='space-y-2 col-span-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder='email@ejemplo.com'
                />
              </div>
              <div className='space-y-2 col-span-2'>
                <Label htmlFor='direccion'>Dirección</Label>
                <Input
                  id='direccion'
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  placeholder='Av. Principal 123'
                />
              </div>
            </div>

            <DialogFooter className='flex-col sm:flex-row gap-2'>
              <Button
                variant='outline'
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant='secondary'
                onClick={() => handleCreatePaciente(false)}
                disabled={saving}
              >
                {saving && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                Registro Rápido
              </Button>
              <Button
                onClick={() => handleCreatePaciente(true)}
                disabled={saving}
              >
                {saving && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                <ClipboardPlus className='h-4 w-4 mr-2' />
                Registrar y Completar Ficha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Total Pacientes</CardDescription>
            <CardTitle className='text-3xl'>{pacientes.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Nuevos este mes</CardDescription>
            <CardTitle className='text-3xl'>
              {
                pacientes.filter((p) => {
                  const created = new Date(p.created_at);
                  const now = new Date();
                  return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Masculino</CardDescription>
            <CardTitle className='text-3xl'>
              {pacientes.filter((p) => p.sexo === "M").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Femenino</CardDescription>
            <CardTitle className='text-3xl'>
              {pacientes.filter((p) => p.sexo === "F").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-4'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar por nombre, DNI o N° historia...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-9'
              />
            </div>
            {/* Selector de columnas */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                >
                  <Settings2 className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-48'
              >
                <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(COLUMNAS_PACIENTES).map(([key, { label }]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={columnasVisibles[key as ColumnaPaciente]}
                    onCheckedChange={(checked) =>
                      setColumnasVisibles((prev) => ({
                        ...prev,
                        [key]: checked,
                      }))
                    }
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <div className='rounded-md border overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columnasVisibles.numero_historia && (
                      <TableHead>N° Historia</TableHead>
                    )}
                    {columnasVisibles.nombre && <TableHead>Paciente</TableHead>}
                    {columnasVisibles.dni && <TableHead>DNI</TableHead>}
                    {columnasVisibles.edad && <TableHead>Edad</TableHead>}
                    {columnasVisibles.telefono && (
                      <TableHead>Teléfono</TableHead>
                    )}
                    {columnasVisibles.email && <TableHead>Email</TableHead>}
                    {columnasVisibles.direccion && (
                      <TableHead>Dirección</TableHead>
                    )}
                    {columnasVisibles.sexo && <TableHead>Sexo</TableHead>}
                    {columnasVisibles.fecha_registro && (
                      <TableHead>Fecha Registro</TableHead>
                    )}
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPacientes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          Object.values(columnasVisibles).filter(Boolean)
                            .length + 1
                        }
                        className='text-center py-8'
                      >
                        <User className='h-12 w-12 mx-auto text-muted-foreground mb-2' />
                        <p className='text-muted-foreground'>
                          No se encontraron pacientes
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPacientes.map((paciente) => (
                      <TableRow key={paciente.id}>
                        {columnasVisibles.numero_historia && (
                          <TableCell>
                            <Badge variant='outline'>
                              {paciente.numero_historia}
                            </Badge>
                          </TableCell>
                        )}
                        {columnasVisibles.nombre && (
                          <TableCell className='font-medium'>
                            {paciente.nombres} {paciente.apellidos}
                          </TableCell>
                        )}
                        {columnasVisibles.dni && (
                          <TableCell>{paciente.dni || "-"}</TableCell>
                        )}
                        {columnasVisibles.edad && (
                          <TableCell>
                            {calcularEdad(paciente.fecha_nacimiento)} años
                          </TableCell>
                        )}
                        {columnasVisibles.telefono && (
                          <TableCell>
                            {paciente.telefono ? (
                              <span className='flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                {paciente.telefono}
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        )}
                        {columnasVisibles.email && (
                          <TableCell>
                            {paciente.email ? (
                              <span className='flex items-center gap-1'>
                                <Mail className='h-3 w-3' />
                                {paciente.email}
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        )}
                        {columnasVisibles.direccion && (
                          <TableCell>
                            {paciente.direccion ? (
                              <span className='flex items-center gap-1 max-w-[200px] truncate'>
                                <MapPin className='h-3 w-3 flex-shrink-0' />
                                {paciente.direccion}
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        )}
                        {columnasVisibles.sexo && (
                          <TableCell>
                            <Badge
                              variant={
                                paciente.sexo === "M" ? "default" : "secondary"
                              }
                            >
                              {paciente.sexo === "M" ? "M" : "F"}
                            </Badge>
                          </TableCell>
                        )}
                        {columnasVisibles.fecha_registro && (
                          <TableCell>
                            {new Date(paciente.created_at).toLocaleDateString()}
                          </TableCell>
                        )}
                        <TableCell className='text-right'>
                          <Button
                            size='sm'
                            onClick={() => goToFicha(paciente.numero_historia)}
                          >
                            <FileText className='h-4 w-4 mr-1' />
                            Ver Ficha
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

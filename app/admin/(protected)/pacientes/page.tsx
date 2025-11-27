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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  FileText,
  Loader2,
  User,
  Phone,
  ClipboardPlus,
} from "lucide-react";
import { toast } from "sonner";

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

  // Form state para nuevo paciente
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    fecha_nacimiento: "",
    sexo: "M",
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

  // Generar número de historia
  const generateNumeroHistoria = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `HC-${year}-${random}`;
  };

  // Crear nuevo paciente
  const handleCreatePaciente = async (redirectToFicha = false) => {
    if (!formData.nombres || !formData.apellidos || !formData.dni) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    setSaving(true);
    try {
      const numero_historia = generateNumeroHistoria();

      const { error } = await supabase.from("pacientes").insert([
        {
          ...formData,
          numero_historia,
        },
      ]);

      if (error) throw error;

      toast.success("Paciente registrado correctamente");
      setDialogOpen(false);
      setFormData({
        nombres: "",
        apellidos: "",
        dni: "",
        fecha_nacimiento: "",
        sexo: "M",
        telefono: "",
        email: "",
        direccion: "",
      });

      if (redirectToFicha) {
        // Redirigir al formulario completo de filiación
        router.push(`/admin/ficha-odontologica/${numero_historia}/filiacion`);
      } else {
        loadPacientes();
      }
    } catch (error) {
      console.error("Error creando paciente:", error);
      toast.error("Error al registrar paciente");
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
                <Label htmlFor='sexo'>Sexo</Label>
                <Select
                  value={formData.sexo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sexo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='M'>Masculino</SelectItem>
                    <SelectItem value='F'>Femenino</SelectItem>
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
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
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
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Historia</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacientes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
                      <TableCell>
                        <Badge variant='outline'>
                          {paciente.numero_historia}
                        </Badge>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {paciente.nombres} {paciente.apellidos}
                      </TableCell>
                      <TableCell>{paciente.dni || "-"}</TableCell>
                      <TableCell>
                        {calcularEdad(paciente.fecha_nacimiento)} años
                      </TableCell>
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
                      <TableCell>
                        <Badge
                          variant={
                            paciente.sexo === "M" ? "default" : "secondary"
                          }
                        >
                          {paciente.sexo === "M" ? "M" : "F"}
                        </Badge>
                      </TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Stethoscope,
  FolderTree,
  DollarSign,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
} from "lucide-react";

interface Procedimiento {
  id: string;
  nombre: string;
  descripcion?: string | null;
  unidad_id?: string | null;
  grupo_id?: string | null;
  medida?: string | null;
  tipo?: string | null;
  activo: boolean;
}

interface GrupoProcedimiento {
  id: string;
  nombre: string;
  descripcion?: string | null;
  unidad_id?: string | null;
}

interface Unidad {
  id: string;
  nombre: string;
}

interface Moneda {
  id: string;
  codigo: string;
  nombre: string;
  simbolo: string;
}

interface ProcedimientoPrecio {
  id: string;
  procedimiento_id: string;
  moneda_id: string;
  precio: number;
  vigente_desde: string;
  vigente_hasta?: string | null;
}

export default function TratamientosPage() {
  const supabase = createClient();
  const [procedimientos, setProcedimientos] = useState<Procedimiento[]>([]);
  const [grupos, setGrupos] = useState<GrupoProcedimiento[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [precios, setPrecios] = useState<ProcedimientoPrecio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [grupoFilter, setGrupoFilter] = useState("todos");

  // Form states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProcedimiento, setEditingProcedimiento] =
    useState<Procedimiento | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    grupo_id: "",
    unidad_id: "",
    medida: "",
    tipo: "",
    precio_soles: "",
    precio_dolares: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [procRes, gruposRes, unidadesRes, monedasRes, preciosRes] =
      await Promise.all([
        supabase.from("procedimientos").select("*").order("nombre"),
        supabase.from("grupos_procedimiento").select("*").order("nombre"),
        supabase.from("unidades").select("*").order("nombre"),
        supabase.from("monedas").select("*"),
        supabase
          .from("procedimiento_precios")
          .select("*")
          .is("vigente_hasta", null),
      ]);

    if (procRes.data) setProcedimientos(procRes.data);
    if (gruposRes.data) setGrupos(gruposRes.data);
    if (unidadesRes.data) setUnidades(unidadesRes.data);
    if (monedasRes.data) setMonedas(monedasRes.data);
    if (preciosRes.data) setPrecios(preciosRes.data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getGrupoName = (id: string | null | undefined) => {
    if (!id) return "Sin grupo";
    const grupo = grupos.find((g) => g.id === id);
    return grupo?.nombre || "Desconocido";
  };

  const getUnidadName = (id: string | null | undefined) => {
    if (!id) return "-";
    const unidad = unidades.find((u) => u.id === id);
    return unidad?.nombre || "-";
  };

  const getPrecio = (procedimientoId: string, monedaCodigo: string) => {
    const moneda = monedas.find((m) => m.codigo === monedaCodigo);
    if (!moneda) return null;
    const precio = precios.find(
      (p) => p.procedimiento_id === procedimientoId && p.moneda_id === moneda.id
    );
    return precio ? precio.precio : null;
  };

  const filteredProcedimientos = procedimientos.filter((proc) => {
    const matchesSearch =
      proc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrupo =
      grupoFilter === "todos" || proc.grupo_id === grupoFilter;
    return matchesSearch && matchesGrupo;
  });

  const handleOpenDialog = (procedimiento?: Procedimiento) => {
    if (procedimiento) {
      setEditingProcedimiento(procedimiento);
      const precioSoles = getPrecio(procedimiento.id, "PEN");
      const precioDolares = getPrecio(procedimiento.id, "USD");
      setFormData({
        nombre: procedimiento.nombre,
        descripcion: procedimiento.descripcion || "",
        grupo_id: procedimiento.grupo_id || "",
        unidad_id: procedimiento.unidad_id || "",
        medida: procedimiento.medida || "",
        tipo: procedimiento.tipo || "",
        precio_soles: precioSoles?.toString() || "",
        precio_dolares: precioDolares?.toString() || "",
      });
    } else {
      setEditingProcedimiento(null);
      setFormData({
        nombre: "",
        descripcion: "",
        grupo_id: "",
        unidad_id: "",
        medida: "",
        tipo: "",
        precio_soles: "",
        precio_dolares: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingProcedimiento) {
        // Actualizar procedimiento existente
        const { error } = await supabase
          .from("procedimientos")
          .update({
            nombre: formData.nombre,
            descripcion: formData.descripcion || null,
            grupo_id: formData.grupo_id || null,
            unidad_id: formData.unidad_id || null,
            medida: formData.medida || null,
            tipo: formData.tipo || null,
          })
          .eq("id", editingProcedimiento.id);

        if (error) throw error;

        // Actualizar precios
        await updatePrecios(editingProcedimiento.id);
      } else {
        // Crear nuevo procedimiento
        const { data, error } = await supabase
          .from("procedimientos")
          .insert({
            nombre: formData.nombre,
            descripcion: formData.descripcion || null,
            grupo_id: formData.grupo_id || null,
            unidad_id: formData.unidad_id || null,
            medida: formData.medida || null,
            tipo: formData.tipo || null,
            activo: true,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          await updatePrecios(data.id);
        }
      }

      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving procedimiento:", error);
      alert("Error al guardar el procedimiento");
    }
  };

  const updatePrecios = async (procedimientoId: string) => {
    const monedaSoles = monedas.find((m) => m.codigo === "PEN");
    const monedaDolares = monedas.find((m) => m.codigo === "USD");

    // Actualizar precio en soles
    if (formData.precio_soles && monedaSoles) {
      await supabase.from("procedimiento_precios").upsert(
        {
          procedimiento_id: procedimientoId,
          moneda_id: monedaSoles.id,
          precio: parseFloat(formData.precio_soles),
          vigente_desde: new Date().toISOString().split("T")[0],
        },
        {
          onConflict: "procedimiento_id,moneda_id,vigente_desde",
        }
      );
    }

    // Actualizar precio en dólares
    if (formData.precio_dolares && monedaDolares) {
      await supabase.from("procedimiento_precios").upsert(
        {
          procedimiento_id: procedimientoId,
          moneda_id: monedaDolares.id,
          precio: parseFloat(formData.precio_dolares),
          vigente_desde: new Date().toISOString().split("T")[0],
        },
        {
          onConflict: "procedimiento_id,moneda_id,vigente_desde",
        }
      );
    }
  };

  const handleToggleActive = async (procedimiento: Procedimiento) => {
    try {
      const { error } = await supabase
        .from("procedimientos")
        .update({ activo: !procedimiento.activo })
        .eq("id", procedimiento.id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error toggling procedimiento:", error);
    }
  };

  const stats = {
    total: procedimientos.length,
    activos: procedimientos.filter((p) => p.activo).length,
    grupos: grupos.length,
    conPrecio: precios.length,
  };

  return (
    <div className='container mx-auto py-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Tratamientos y Procedimientos</h1>
          <p className='text-muted-foreground'>
            Gestiona los procedimientos y sus precios
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className='h-4 w-4 mr-2' />
              Nuevo Procedimiento
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>
                {editingProcedimiento
                  ? "Editar Procedimiento"
                  : "Nuevo Procedimiento"}
              </DialogTitle>
              <DialogDescription>
                Complete los datos del procedimiento
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='nombre'>Nombre *</Label>
                  <Input
                    id='nombre'
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder='Nombre del procedimiento'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='grupo'>Grupo</Label>
                  <Select
                    value={formData.grupo_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, grupo_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar grupo' />
                    </SelectTrigger>
                    <SelectContent>
                      {grupos.map((grupo) => (
                        <SelectItem
                          key={grupo.id}
                          value={grupo.id}
                        >
                          {grupo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='descripcion'>Descripción</Label>
                <Textarea
                  id='descripcion'
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  placeholder='Descripción del procedimiento'
                  rows={2}
                />
              </div>
              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='unidad'>Unidad</Label>
                  <Select
                    value={formData.unidad_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unidad_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar' />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidad) => (
                        <SelectItem
                          key={unidad.id}
                          value={unidad.id}
                        >
                          {unidad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='medida'>Medida</Label>
                  <Select
                    value={formData.medida}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medida: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='No específica'>
                        No específica
                      </SelectItem>
                      <SelectItem value='General'>General</SelectItem>
                      <SelectItem value='Pieza'>Pieza</SelectItem>
                      <SelectItem value='Radiografía'>Radiografía</SelectItem>
                      <SelectItem value='Prótesis'>Prótesis</SelectItem>
                      <SelectItem value='Corona'>Corona</SelectItem>
                      <SelectItem value='Consulta'>Consulta</SelectItem>
                      <SelectItem value='Cirugías'>Cirugías</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='tipo'>Tipo</Label>
                  <Input
                    id='tipo'
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo: e.target.value })
                    }
                    placeholder='Tipo (opcional)'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 pt-2 border-t'>
                <div className='space-y-2'>
                  <Label htmlFor='precio_soles'>Precio en Soles (S/)</Label>
                  <Input
                    id='precio_soles'
                    type='number'
                    step='0.01'
                    value={formData.precio_soles}
                    onChange={(e) =>
                      setFormData({ ...formData, precio_soles: e.target.value })
                    }
                    placeholder='0.00'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='precio_dolares'>Precio en Dólares ($)</Label>
                  <Input
                    id='precio_dolares'
                    type='number'
                    step='0.01'
                    value={formData.precio_dolares}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        precio_dolares: e.target.value,
                      })
                    }
                    placeholder='0.00'
                  />
                </div>
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
                onClick={handleSave}
                disabled={!formData.nombre}
              >
                {editingProcedimiento
                  ? "Guardar Cambios"
                  : "Crear Procedimiento"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Procedimientos
            </CardTitle>
            <Stethoscope className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Activos</CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {stats.activos}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Grupos</CardTitle>
            <FolderTree className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {stats.grupos}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Con Precio</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-purple-600'>
              {stats.conPrecio}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue='procedimientos'
        className='space-y-4'
      >
        <TabsList>
          <TabsTrigger
            value='procedimientos'
            className='flex items-center gap-2'
          >
            <Stethoscope className='h-4 w-4' />
            Procedimientos
          </TabsTrigger>
          <TabsTrigger
            value='grupos'
            className='flex items-center gap-2'
          >
            <FolderTree className='h-4 w-4' />
            Grupos
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value='procedimientos'
          className='space-y-4'
        >
          <Card>
            <CardHeader>
              <CardTitle>Lista de Procedimientos</CardTitle>
              <CardDescription>
                Todos los procedimientos disponibles en la clínica
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className='flex flex-col md:flex-row gap-4 mb-6'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Buscar por nombre o descripción...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <Select
                  value={grupoFilter}
                  onValueChange={setGrupoFilter}
                >
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder='Filtrar por grupo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todos los grupos</SelectItem>
                    {grupos.map((grupo) => (
                      <SelectItem
                        key={grupo.id}
                        value={grupo.id}
                      >
                        {grupo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant='outline'
                  onClick={fetchData}
                >
                  Actualizar
                </Button>
              </div>

              {loading ? (
                <p className='text-center py-8 text-muted-foreground'>
                  Cargando procedimientos...
                </p>
              ) : filteredProcedimientos.length === 0 ? (
                <p className='text-center py-8 text-muted-foreground'>
                  No se encontraron procedimientos
                </p>
              ) : (
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Grupo</TableHead>
                        <TableHead>Medida</TableHead>
                        <TableHead className='text-right'>
                          Precio (S/)
                        </TableHead>
                        <TableHead className='text-right'>Precio ($)</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className='text-right'>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProcedimientos.map((proc) => (
                        <TableRow
                          key={proc.id}
                          className={!proc.activo ? "opacity-50" : ""}
                        >
                          <TableCell>
                            <div className='font-medium'>{proc.nombre}</div>
                            {proc.descripcion && (
                              <div className='text-sm text-muted-foreground line-clamp-1'>
                                {proc.descripcion}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{getGrupoName(proc.grupo_id)}</TableCell>
                          <TableCell>{proc.medida || "-"}</TableCell>
                          <TableCell className='text-right'>
                            {getPrecio(proc.id, "PEN")?.toFixed(2) || "-"}
                          </TableCell>
                          <TableCell className='text-right'>
                            {getPrecio(proc.id, "USD")?.toFixed(2) || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={proc.activo ? "default" : "secondary"}
                            >
                              {proc.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleOpenDialog(proc)}
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleToggleActive(proc)}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
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

        <TabsContent
          value='grupos'
          className='space-y-4'
        >
          <Card>
            <CardHeader>
              <CardTitle>Grupos de Procedimientos</CardTitle>
              <CardDescription>
                Categorías para organizar los procedimientos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {grupos.length === 0 ? (
                <p className='text-center py-8 text-muted-foreground'>
                  No hay grupos registrados
                </p>
              ) : (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {grupos.map((grupo) => {
                    const procedimientosEnGrupo = procedimientos.filter(
                      (p) => p.grupo_id === grupo.id
                    );
                    return (
                      <Card key={grupo.id}>
                        <CardHeader className='pb-2'>
                          <CardTitle className='text-lg flex items-center gap-2'>
                            <FolderTree className='h-5 w-5 text-blue-600' />
                            {grupo.nombre}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className='text-sm text-muted-foreground mb-2'>
                            {grupo.descripcion || "Sin descripción"}
                          </p>
                          <div className='flex items-center gap-2'>
                            <Badge variant='secondary'>
                              {procedimientosEnGrupo.length} procedimientos
                            </Badge>
                            <span className='text-sm text-muted-foreground'>
                              Unidad: {getUnidadName(grupo.unidad_id)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

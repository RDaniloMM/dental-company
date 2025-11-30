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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Stethoscope,
  FolderTree,
  DollarSign,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Settings2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Definición de columnas disponibles para la tabla de procedimientos
const COLUMNAS_PROCEDIMIENTOS = {
  nombre: { label: "Nombre", default: true },
  descripcion: { label: "Descripción", default: false },
  grupo: { label: "Grupo", default: true },
  medida: { label: "Medida", default: true },
  tipo: { label: "Tipo", default: false },
  precio_pen: { label: "Precio (S/)", default: true },
  precio_clp: { label: "Precio (CLP$)", default: true },
  precio_usd: { label: "Precio ($)", default: false },
  estado: { label: "Estado", default: true },
} as const;

type ColumnaProc = keyof typeof COLUMNAS_PROCEDIMIENTOS;

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

  // Estado para columnas visibles
  const [columnasVisibles, setColumnasVisibles] = useState<
    Record<ColumnaProc, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    Object.entries(COLUMNAS_PROCEDIMIENTOS).forEach(([key, value]) => {
      initial[key] = value.default;
    });
    return initial as Record<ColumnaProc, boolean>;
  });

  // Form states - Procedimientos
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
  });
  // Precios dinámicos por moneda: { moneda_id: precio_string }
  const [formPrecios, setFormPrecios] = useState<Record<string, string>>({});

  // Form states - Grupos
  const [grupoDialogOpen, setGrupoDialogOpen] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<GrupoProcedimiento | null>(
    null
  );
  const [grupoFormData, setGrupoFormData] = useState({
    nombre: "",
    descripcion: "",
    unidad_id: "",
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
    // Filtrar monedas duplicadas por código (mantener solo la primera)
    if (monedasRes.data) {
      const uniqueMonedas = monedasRes.data.filter(
        (moneda, index, self) =>
          index === self.findIndex((m) => m.codigo === moneda.codigo)
      );
      setMonedas(uniqueMonedas);
    }
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
      // Cargar precios existentes para cada moneda
      const preciosMap: Record<string, string> = {};
      monedas.forEach((moneda) => {
        const precio = getPrecio(procedimiento.id, moneda.codigo);
        if (precio !== null) {
          preciosMap[moneda.id] = precio.toString();
        }
      });
      setFormPrecios(preciosMap);
      setFormData({
        nombre: procedimiento.nombre,
        descripcion: procedimiento.descripcion || "",
        grupo_id: procedimiento.grupo_id || "",
        unidad_id: procedimiento.unidad_id || "",
        medida: procedimiento.medida || "",
        tipo: procedimiento.tipo || "",
      });
    } else {
      setEditingProcedimiento(null);
      setFormPrecios({});
      setFormData({
        nombre: "",
        descripcion: "",
        grupo_id: "",
        unidad_id: "",
        medida: "",
        tipo: "",
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
    const hoy = new Date().toISOString().split("T")[0];

    // Iterar sobre todas las monedas y actualizar/crear precios
    for (const moneda of monedas) {
      const precioStr = formPrecios[moneda.id];

      if (precioStr && parseFloat(precioStr) > 0) {
        // Insertar o actualizar precio para esta moneda
        await supabase.from("procedimiento_precios").upsert(
          {
            procedimiento_id: procedimientoId,
            moneda_id: moneda.id,
            precio: parseFloat(precioStr),
            vigente_desde: hoy,
          },
          {
            onConflict: "procedimiento_id,moneda_id,vigente_desde",
          }
        );
      }
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

  // Funciones para manejar grupos
  const handleOpenGrupoDialog = (grupo?: GrupoProcedimiento) => {
    if (grupo) {
      setEditingGrupo(grupo);
      setGrupoFormData({
        nombre: grupo.nombre,
        descripcion: grupo.descripcion || "",
        unidad_id: grupo.unidad_id || "",
      });
    } else {
      setEditingGrupo(null);
      setGrupoFormData({
        nombre: "",
        descripcion: "",
        unidad_id: "",
      });
    }
    setGrupoDialogOpen(true);
  };

  const handleSaveGrupo = async () => {
    try {
      const data = {
        nombre: grupoFormData.nombre,
        descripcion: grupoFormData.descripcion || null,
        unidad_id: grupoFormData.unidad_id || null,
      };

      if (editingGrupo) {
        const { error } = await supabase
          .from("grupos_procedimiento")
          .update(data)
          .eq("id", editingGrupo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("grupos_procedimiento")
          .insert(data);
        if (error) throw error;
      }

      setGrupoDialogOpen(false);
      setEditingGrupo(null);
      fetchData();
    } catch (error) {
      console.error("Error guardando grupo:", error);
      alert("Error al guardar el grupo");
    }
  };

  const handleDeleteGrupo = async (grupo: GrupoProcedimiento) => {
    // Verificar si hay procedimientos en este grupo
    const procedimientosEnGrupo = procedimientos.filter(
      (p) => p.grupo_id === grupo.id
    );

    if (procedimientosEnGrupo.length > 0) {
      alert(
        `No se puede eliminar el grupo "${grupo.nombre}" porque tiene ${procedimientosEnGrupo.length} procedimiento(s) asignados.`
      );
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el grupo "${grupo.nombre}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("grupos_procedimiento")
        .delete()
        .eq("id", grupo.id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error eliminando grupo:", error);
      alert("Error al eliminar el grupo");
    }
  };

  const stats = {
    total: procedimientos.length,
    activos: procedimientos.filter((p) => p.activo).length,
    grupos: grupos.length,
    conPrecio: precios.length,
  };

  return (
    <div className='container mx-auto py-4 sm:py-6 px-4 sm:px-6 space-y-4 sm:space-y-6'>
      <div className='flex flex-col gap-4'>
        <div>
          <h1 className='text-xl sm:text-3xl font-bold'>
            Tratamientos y Procedimientos
          </h1>
          <p className='text-sm text-muted-foreground'>
            Gestiona los procedimientos y sus precios
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className='w-full sm:w-auto'
            >
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

              {/* Precios dinámicos por moneda */}
              <div className='pt-2 border-t'>
                <Label className='text-sm font-medium mb-3 block'>
                  Precios por Moneda
                </Label>
                {monedas.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No hay monedas configuradas. Configúralas en la base de
                    datos.
                  </p>
                ) : (
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    {monedas.map((moneda) => (
                      <div
                        key={moneda.id}
                        className='space-y-2'
                      >
                        <Label
                          htmlFor={`precio_${moneda.id}`}
                          className='text-xs'
                        >
                          {moneda.nombre} ({moneda.simbolo})
                        </Label>
                        <Input
                          id={`precio_${moneda.id}`}
                          type='number'
                          step='0.01'
                          min='0'
                          value={formPrecios[moneda.id] || ""}
                          onChange={(e) =>
                            setFormPrecios({
                              ...formPrecios,
                              [moneda.id]: e.target.value,
                            })
                          }
                          placeholder='0.00'
                        />
                      </div>
                    ))}
                  </div>
                )}
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
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Total Procedimientos
            </CardTitle>
            <Stethoscope className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold'>{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Activos
            </CardTitle>
            <Package className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-green-600'>
              {stats.activos}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Grupos
            </CardTitle>
            <FolderTree className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-blue-600'>
              {stats.grupos}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-xs sm:text-sm font-medium'>
              Con Precio
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground hidden sm:block' />
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold text-purple-600'>
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
                    {Object.entries(COLUMNAS_PROCEDIMIENTOS).map(
                      ([key, { label }]) => (
                        <DropdownMenuCheckboxItem
                          key={key}
                          checked={columnasVisibles[key as ColumnaProc]}
                          onCheckedChange={(checked) =>
                            setColumnasVisibles((prev) => ({
                              ...prev,
                              [key]: checked,
                            }))
                          }
                        >
                          {label}
                        </DropdownMenuCheckboxItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                <div className='rounded-md border overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columnasVisibles.nombre && (
                          <TableHead>Nombre</TableHead>
                        )}
                        {columnasVisibles.descripcion && (
                          <TableHead>Descripción</TableHead>
                        )}
                        {columnasVisibles.grupo && <TableHead>Grupo</TableHead>}
                        {columnasVisibles.medida && (
                          <TableHead>Medida</TableHead>
                        )}
                        {columnasVisibles.tipo && <TableHead>Tipo</TableHead>}
                        {columnasVisibles.precio_pen && (
                          <TableHead className='text-right'>
                            Precio (S/)
                          </TableHead>
                        )}
                        {columnasVisibles.precio_clp && (
                          <TableHead className='text-right'>
                            Precio (CLP$)
                          </TableHead>
                        )}
                        {columnasVisibles.precio_usd && (
                          <TableHead className='text-right'>
                            Precio ($)
                          </TableHead>
                        )}
                        {columnasVisibles.estado && (
                          <TableHead className='text-center'>Estado</TableHead>
                        )}
                        <TableHead className='text-center'>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProcedimientos.map((proc) => (
                        <TableRow
                          key={proc.id}
                          className={!proc.activo ? "opacity-50" : ""}
                        >
                          {columnasVisibles.nombre && (
                            <TableCell>
                              <div className='font-medium'>{proc.nombre}</div>
                            </TableCell>
                          )}
                          {columnasVisibles.descripcion && (
                            <TableCell>
                              <div className='text-sm text-muted-foreground line-clamp-2'>
                                {proc.descripcion || "-"}
                              </div>
                            </TableCell>
                          )}
                          {columnasVisibles.grupo && (
                            <TableCell>{getGrupoName(proc.grupo_id)}</TableCell>
                          )}
                          {columnasVisibles.medida && (
                            <TableCell>{proc.medida || "-"}</TableCell>
                          )}
                          {columnasVisibles.tipo && (
                            <TableCell>{proc.tipo || "-"}</TableCell>
                          )}
                          {columnasVisibles.precio_pen && (
                            <TableCell className='text-right'>
                              {getPrecio(proc.id, "PEN")?.toFixed(2) || "-"}
                            </TableCell>
                          )}
                          {columnasVisibles.precio_clp && (
                            <TableCell className='text-right'>
                              {getPrecio(proc.id, "CLP")?.toFixed(2) || "-"}
                            </TableCell>
                          )}
                          {columnasVisibles.precio_usd && (
                            <TableCell className='text-right'>
                              {getPrecio(proc.id, "USD")?.toFixed(2) || "-"}
                            </TableCell>
                          )}
                          {columnasVisibles.estado && (
                            <TableCell className='text-center'>
                              <div className='flex items-center justify-center gap-2'>
                                <Switch
                                  checked={proc.activo}
                                  onCheckedChange={() =>
                                    handleToggleActive(proc)
                                  }
                                />
                                <span className='text-sm text-muted-foreground'>
                                  {proc.activo ? "Activo" : "Inactivo"}
                                </span>
                              </div>
                            </TableCell>
                          )}
                          <TableCell className='text-center'>
                            <div className='flex justify-center gap-2'>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleOpenDialog(proc)}
                              >
                                <Edit className='h-4 w-4' />
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
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Grupos de Procedimientos</CardTitle>
                <CardDescription>
                  Categorías para organizar los procedimientos
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenGrupoDialog()}>
                <Plus className='h-4 w-4 mr-2' />
                Nuevo Grupo
              </Button>
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
                          <div className='flex items-center justify-between'>
                            <CardTitle className='text-lg flex items-center gap-2'>
                              <FolderTree className='h-5 w-5 text-blue-600' />
                              {grupo.nombre}
                            </CardTitle>
                            <div className='flex gap-1'>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleOpenGrupoDialog(grupo)}
                              >
                                <Edit className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleDeleteGrupo(grupo)}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>
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

      {/* Dialog para crear/editar grupo */}
      <Dialog
        open={grupoDialogOpen}
        onOpenChange={setGrupoDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGrupo ? "Editar Grupo" : "Nuevo Grupo"}
            </DialogTitle>
            <DialogDescription>
              {editingGrupo
                ? "Modifica los datos del grupo"
                : "Crea una nueva categoría para organizar procedimientos"}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='grupo_nombre'>Nombre del Grupo *</Label>
              <Input
                id='grupo_nombre'
                value={grupoFormData.nombre}
                onChange={(e) =>
                  setGrupoFormData({ ...grupoFormData, nombre: e.target.value })
                }
                placeholder='Ej: Ortodoncia, Endodoncia, etc.'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='grupo_descripcion'>Descripción</Label>
              <Textarea
                id='grupo_descripcion'
                value={grupoFormData.descripcion}
                onChange={(e) =>
                  setGrupoFormData({
                    ...grupoFormData,
                    descripcion: e.target.value,
                  })
                }
                placeholder='Descripción opcional del grupo'
                rows={3}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='grupo_unidad'>Unidad</Label>
              <Select
                value={grupoFormData.unidad_id}
                onValueChange={(value) =>
                  setGrupoFormData({ ...grupoFormData, unidad_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Seleccionar unidad (opcional)' />
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
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setGrupoDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveGrupo}
              disabled={!grupoFormData.nombre}
            >
              {editingGrupo ? "Guardar Cambios" : "Crear Grupo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

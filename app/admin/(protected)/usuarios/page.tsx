"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
//import { User } from "@supabase/supabase-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface Personal {
  id: string;
  nombre_completo: string;
  rol: "Admin" | "Odontólogo";
  especialidad?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  created_at: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Personal | null>(null);
  const [formData, setFormData] = useState<{
    nombre_completo: string;
    email: string;
    rol: "Admin" | "Odontólogo";
    especialidad: string;
    telefono: string;
    activo: boolean;
  }>({
    nombre_completo: "",
    email: "",
    rol: "Odontólogo",
    especialidad: "",
    telefono: "",
    activo: true,
  });

  const supabase = createClient();

  // Cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("personal")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error al cargar usuarios: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Crear usuario
  const createUser = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: "temp123456", // Contraseña temporal
      });

      if (authError) throw authError;

      // Insertar en tabla personal
      const { error: personalError } = await supabase.from("personal").insert({
        id: authData.user?.id,
        nombre_completo: formData.nombre_completo,
        rol: formData.rol,
        especialidad: formData.especialidad,
        telefono: formData.telefono,
        email: formData.email,
        activo: formData.activo,
      });

      if (personalError) throw personalError;

      toast.success("Usuario creado exitosamente");
      resetForm();
      loadUsers();
      setDialogOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error al crear usuario: " + error.message);
      }
    }
  };

  // Actualizar usuario
  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("personal")
        .update({
          nombre_completo: formData.nombre_completo,
          rol: formData.rol,
          especialidad: formData.especialidad,
          telefono: formData.telefono,
          email: formData.email,
          activo: formData.activo,
        })
        .eq("id", editingUser.id);

      if (error) throw error;

      toast.success("Usuario actualizado exitosamente");
      resetForm();
      loadUsers();
      setDialogOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error al actualizar usuario: " + error.message);
      }
    }
  };

  // Eliminar usuario (desactivar)
  const deleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de desactivar este usuario?")) return;

    try {
      const { error } = await supabase
        .from("personal")
        .update({ activo: false })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Usuario desactivado exitosamente");
      loadUsers();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error al desactivar usuario: " + error.message);
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre_completo: "",
      email: "",
      rol: "Odontólogo",
      especialidad: "",
      telefono: "",
      activo: true,
    });
    setEditingUser(null);
  };

  // Abrir modal para editar
  const openEditDialog = (user: Personal) => {
    setEditingUser(user);
    setFormData({
      nombre_completo: user.nombre_completo,
      email: user.email || "",
      rol: user.rol,
      especialidad: user.especialidad || "",
      telefono: user.telefono || "",
      activo: user.activo,
    });
    setDialogOpen(true);
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(
    (user) =>
      user.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-4'>Administración de Personal</h1>

        <div className='flex items-center justify-between gap-4'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              placeholder='Buscar personal...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-9'
            />
          </div>

          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className='h-4 w-4 mr-2' />
                Nuevo Personal
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Editar Personal" : "Crear Nuevo Personal"}
                </DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? "Modifica los datos del personal"
                    : "Completa los datos para crear nuevo personal"}
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='nombre_completo'>Nombre Completo</Label>
                  <Input
                    id='nombre_completo'
                    value={formData.nombre_completo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombre_completo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!!editingUser}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='rol'>Rol</Label>
                  <Select
                    value={formData.rol}
                    onValueChange={(value: "Admin" | "Odontólogo") =>
                      setFormData({ ...formData, rol: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Odontólogo'>Odontólogo</SelectItem>
                      <SelectItem value='Admin'>Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='especialidad'>Especialidad</Label>
                  <Input
                    id='especialidad'
                    value={formData.especialidad}
                    onChange={(e) =>
                      setFormData({ ...formData, especialidad: e.target.value })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='telefono'>Teléfono</Label>
                  <Input
                    id='telefono'
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='activo'
                    checked={formData.activo}
                    onChange={(e) =>
                      setFormData({ ...formData, activo: e.target.checked })
                    }
                    className='rounded'
                  />
                  <Label htmlFor='activo'>Personal activo</Label>
                </div>
              </div>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={editingUser ? updateUser : createUser}>
                  {editingUser ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
        </div>
      ) : (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className='text-center'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className='text-center py-8'
                  >
                    No se encontró personal
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-medium'>
                      {user.nombre_completo}
                    </TableCell>
                    <TableCell>{user.email || "Sin email"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.rol === "Admin" ? "destructive" : "default"}
                        className={
                          user.rol === "Admin"
                            ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                        }
                      >
                        {user.rol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.especialidad || "Sin especialidad"}
                    </TableCell>
                    <TableCell>{user.telefono || "Sin teléfono"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.activo ? "default" : "destructive"}
                        className={
                          user.activo
                            ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                        }
                      >
                        {user.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex justify-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit2 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => deleteUser(user.id)}
                          className='text-red-600 hover:text-red-800'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
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

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  role: "admin" | "user" | "dentist";
  created_at: string;
  last_sign_in_at?: string;
  is_active: boolean;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<{
    email: string;
    username: string;
    role: "admin" | "user" | "dentist";
    is_active: boolean;
  }>({
    email: "",
    username: "",
    role: "user",
    is_active: true,
  });

  const supabase = createClient();

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users") // Asume que tienes una tabla profiles
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
  };

  // Crear usuario
  const createUser = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: "temp123456", // Contraseña temporal
        options: {
          data: {
            username: formData.username,
            role: formData.role,
          },
        },
      });

      if (authError) throw authError;

      // Insertar en tabla profiles
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user?.id,
        email: formData.email,
        username: formData.username,
        role: formData.role,
        is_active: formData.is_active,
      });

      if (profileError) throw profileError;

      resetForm();
      loadUsers();
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
        .from("users")
        .update({
          username: formData.username,
          role: formData.role,
          is_active: formData.is_active,
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

  // Eliminar usuario
  const deleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      // No se puede eliminar el usuario de auth directamente desde el cliente
      // por seguridad. Se recomienda hacerlo desde una función de Supabase (Edge Function).
      // Por ahora, solo desactivaremos el usuario.
      const { error } = await supabase
        .from("users")
        .update({ is_active: false })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Usuario desactivado exitosamente");
      loadUsers();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error al eliminar usuario: " + error.message);
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      role: "user",
      is_active: true,
    });
    setEditingUser(null);
  };

  // Abrir modal para editar
  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      username: user.username || "",
      role: user.role,
      is_active: user.is_active,
    });
    setDialogOpen(true);
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-4'>Administración de Usuarios</h1>

        <div className='flex items-center justify-between gap-4'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              placeholder='Buscar usuarios...'
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
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
                </DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? "Modifica los datos del usuario"
                    : "Completa los datos para crear un nuevo usuario"}
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!!editingUser}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='username'>Usuario</Label>
                  <Input
                    id='username'
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='role'>Rol</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "user" | "dentist") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='user'>Usuario</SelectItem>
                      <SelectItem value='dentist'>Dentista</SelectItem>
                      <SelectItem value='admin'>Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='is_active'
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className='rounded'
                  />
                  <Label htmlFor='is_active'>Usuario activo</Label>
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
                <TableHead>Email</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-center py-8'
                  >
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-medium'>{user.email}</TableCell>
                    <TableCell>{user.username || "Sin usuario"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "dentist"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role === "admin"
                          ? "Administrador"
                          : user.role === "dentist"
                          ? "Dentista"
                          : "Usuario"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
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

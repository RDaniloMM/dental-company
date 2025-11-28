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
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  MessageCircle,
  BookOpen,
  Tag,
  HelpCircle,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
  keywords: string[];
  categoria: string;
  prioridad: number;
  activo: boolean;
}

interface EmbeddingStats {
  faqs: {
    total: number;
    withEmbedding: number;
    needsUpdate: number;
  };
  contextos: {
    total: number;
    withEmbedding: number;
    needsUpdate: number;
  };
  allSynced: boolean;
}

const categorias = [
  "general",
  "horarios",
  "citas",
  "servicios",
  "precios",
  "contacto",
  "emergencias",
  "ubicacion",
];

export default function ChatbotFAQsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("");

  // Estados para embeddings
  const [embeddingStats, setEmbeddingStats] = useState<EmbeddingStats | null>(
    null
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Cargar estado de embeddings
  const fetchEmbeddingStats = async () => {
    try {
      const res = await fetch("/api/chatbot/sync-embeddings");
      if (res.ok) {
        const data = await res.json();
        setEmbeddingStats(data);
      }
    } catch (error) {
      console.error("Error cargando estado de embeddings:", error);
    }
  };

  // Sincronizar embeddings
  const syncEmbeddings = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/chatbot/sync-embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "all" }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(
          `Embeddings sincronizados: ${data.faqsUpdated} FAQs, ${data.contextosUpdated} contextos`
        );
        fetchEmbeddingStats();
      } else {
        const error = await res.json();
        toast.error(error.error || "Error al sincronizar embeddings");
      }
    } catch (error) {
      console.error("Error sincronizando embeddings:", error);
      toast.error("Error al sincronizar embeddings");
    } finally {
      setIsSyncing(false);
    }
  };

  // Cargar FAQs
  const fetchFAQs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chatbot/faqs?all=true");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error("Error cargando FAQs:", error);
      toast.error("Error al cargar las FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
    fetchEmbeddingStats();
  }, []);

  // Guardar FAQ
  const saveFAQ = async (faq: Partial<FAQ>) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/chatbot/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faq),
      });

      if (res.ok) {
        toast.success(faq.id ? "FAQ actualizada" : "FAQ creada");
        fetchFAQs();
        setDialogOpen(false);
        setEditingFAQ(null);
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      console.error("Error guardando FAQ:", error);
      toast.error("Error al guardar FAQ");
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar FAQ
  const deleteFAQ = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta FAQ?")) return;

    try {
      const res = await fetch(`/api/chatbot/faqs?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("FAQ eliminada");
        fetchFAQs();
      }
    } catch (error) {
      console.error("Error eliminando:", error);
      toast.error("Error al eliminar");
    }
  };

  // Toggle activo
  const toggleActivo = async (faq: FAQ) => {
    await saveFAQ({ ...faq, activo: !faq.activo });
  };

  // Filtrar FAQs
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchTerm === "" ||
      faq.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.respuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some((k) => k.includes(searchTerm.toLowerCase()));

    const matchesCategoria =
      filterCategoria === "" || faq.categoria === filterCategoria;

    return matchesSearch && matchesCategoria;
  });

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
          <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
            <MessageCircle className='h-6 w-6' />
            Base de Conocimiento del Chatbot
          </h1>
          <p className='text-muted-foreground'>
            Gestiona las preguntas frecuentes que el chatbot usa para responder
          </p>
        </div>
        <div className='flex gap-2 items-center'>
          {/* Indicador de estado de embeddings */}
          {embeddingStats && !embeddingStats.allSynced && (
            <Badge
              variant='outline'
              className='bg-yellow-50 text-yellow-700 border-yellow-300'
            >
              <AlertCircle className='h-3 w-3 mr-1' />
              {embeddingStats.faqs.needsUpdate +
                embeddingStats.contextos.needsUpdate}{" "}
              sin sincronizar
            </Badge>
          )}
          {embeddingStats?.allSynced && (
            <Badge
              variant='outline'
              className='bg-green-50 text-green-700 border-green-300'
            >
              <CheckCircle2 className='h-3 w-3 mr-1' />
              IA sincronizada
            </Badge>
          )}

          <Button
            variant='outline'
            onClick={syncEmbeddings}
            disabled={isSyncing || embeddingStats?.allSynced}
            title='Sincroniza los embeddings para búsqueda semántica'
          >
            {isSyncing ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <Sparkles className='h-4 w-4 mr-2' />
            )}
            {isSyncing ? "Sincronizando..." : "Sync IA"}
          </Button>
          <Button
            variant='outline'
            onClick={fetchFAQs}
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </Button>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditingFAQ(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingFAQ(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Nueva FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  <HelpCircle className='h-5 w-5' />
                  {editingFAQ?.id ? "Editar FAQ" : "Nueva FAQ"}
                </DialogTitle>
                <DialogDescription>
                  Esta información será usada por el chatbot para responder
                  preguntas
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  saveFAQ({
                    id: editingFAQ?.id,
                    pregunta: formData.get("pregunta") as string,
                    respuesta: formData.get("respuesta") as string,
                    keywords: (formData.get("keywords") as string)
                      .split(",")
                      .map((k) => k.trim())
                      .filter((k) => k.length > 0),
                    categoria: formData.get("categoria") as string,
                    prioridad: Number(formData.get("prioridad")) || 0,
                    activo: true,
                  });
                }}
                className='space-y-4'
              >
                <div className='space-y-2'>
                  <Label htmlFor='pregunta'>Pregunta</Label>
                  <Input
                    id='pregunta'
                    name='pregunta'
                    defaultValue={editingFAQ?.pregunta}
                    required
                    placeholder='¿Cuál es el horario de atención?'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='respuesta'>Respuesta</Label>
                  <Textarea
                    id='respuesta'
                    name='respuesta'
                    defaultValue={editingFAQ?.respuesta}
                    required
                    rows={4}
                    placeholder='Nuestro horario de atención es...'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='keywords'
                    className='flex items-center gap-2'
                  >
                    <Tag className='h-4 w-4' />
                    Palabras clave (separadas por coma)
                  </Label>
                  <Input
                    id='keywords'
                    name='keywords'
                    defaultValue={editingFAQ?.keywords?.join(", ")}
                    placeholder='horario, atención, abierto, cerrado'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Estas palabras ayudan al chatbot a encontrar esta FAQ cuando
                    el usuario pregunta
                  </p>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='categoria'>Categoría</Label>
                    <select
                      id='categoria'
                      name='categoria'
                      defaultValue={editingFAQ?.categoria || "general"}
                      className='w-full border rounded-md p-2'
                    >
                      {categorias.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='prioridad'>Prioridad</Label>
                    <Input
                      id='prioridad'
                      name='prioridad'
                      type='number'
                      defaultValue={editingFAQ?.prioridad || 0}
                      min={0}
                      max={100}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Mayor = más relevante
                    </p>
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
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-2xl font-bold'>{faqs.length}</div>
            <p className='text-xs text-muted-foreground'>Total FAQs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-2xl font-bold text-green-600'>
              {faqs.filter((f) => f.activo).length}
            </div>
            <p className='text-xs text-muted-foreground'>Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-2xl font-bold text-gray-400'>
              {faqs.filter((f) => !f.activo).length}
            </div>
            <p className='text-xs text-muted-foreground'>Inactivas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-2xl font-bold text-blue-600'>
              {new Set(faqs.map((f) => f.categoria)).size}
            </div>
            <p className='text-xs text-muted-foreground'>Categorías</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            Preguntas Frecuentes
          </CardTitle>
          <CardDescription>
            El chatbot usa estas FAQs para responder consultas de los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4 mb-6'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar en preguntas, respuestas o keywords...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className='border rounded-md px-3'
            >
              <option value=''>Todas las categorías</option>
              {categorias.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Pregunta</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFAQs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell>
                    <Switch
                      checked={faq.activo}
                      onCheckedChange={() => toggleActivo(faq)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className='font-medium'>{faq.pregunta}</p>
                      <p className='text-sm text-muted-foreground truncate max-w-[300px]'>
                        {faq.respuesta}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{faq.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {faq.keywords?.slice(0, 3).map((keyword, i) => (
                        <Badge
                          key={i}
                          variant='secondary'
                          className='text-xs'
                        >
                          {keyword}
                        </Badge>
                      ))}
                      {faq.keywords?.length > 3 && (
                        <Badge
                          variant='secondary'
                          className='text-xs'
                        >
                          +{faq.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.prioridad >= 5 ? "default" : "outline"}>
                      {faq.prioridad}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right space-x-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setEditingFAQ(faq);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => deleteFAQ(faq.id)}
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredFAQs.length === 0 && (
            <div className='text-center py-8 text-muted-foreground'>
              {searchTerm || filterCategoria
                ? "No se encontraron FAQs con esos filtros"
                : "No hay FAQs creadas. ¡Añade la primera!"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

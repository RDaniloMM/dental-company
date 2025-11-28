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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileText,
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

interface Contexto {
  id: string;
  titulo: string;
  contenido: string;
  tipo: string;
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

const tiposContexto = [
  { value: "info", label: "Información General" },
  { value: "servicios", label: "Servicios" },
  { value: "politicas", label: "Políticas" },
  { value: "promociones", label: "Promociones" },
  { value: "equipo", label: "Equipo Médico" },
  { value: "otro", label: "Otro" },
];

export default function ChatbotFAQsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("");

  // Estados para Contextos
  const [isLoadingContextos, setIsLoadingContextos] = useState(true);
  const [isSavingContexto, setIsSavingContexto] = useState(false);
  const [contextos, setContextos] = useState<Contexto[]>([]);
  const [editingContexto, setEditingContexto] = useState<Contexto | null>(null);
  const [contextoDialogOpen, setContextoDialogOpen] = useState(false);
  const [searchTermContexto, setSearchTermContexto] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("");

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
    fetchContextos();
    fetchEmbeddingStats();
  }, []);

  // ============ CONTEXTOS ============
  const fetchContextos = async () => {
    setIsLoadingContextos(true);
    try {
      const res = await fetch("/api/chatbot/contexto?all=true");
      if (res.ok) {
        const data = await res.json();
        setContextos(data);
      }
    } catch (error) {
      console.error("Error cargando contextos:", error);
      toast.error("Error al cargar los contextos");
    } finally {
      setIsLoadingContextos(false);
    }
  };

  const saveContexto = async (contexto: Partial<Contexto>) => {
    setIsSavingContexto(true);
    try {
      const res = await fetch("/api/chatbot/contexto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contexto),
      });

      if (res.ok) {
        toast.success(contexto.id ? "Contexto actualizado" : "Contexto creado");
        fetchContextos();
        fetchEmbeddingStats();
        setContextoDialogOpen(false);
        setEditingContexto(null);
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      console.error("Error guardando contexto:", error);
      toast.error("Error al guardar contexto");
    } finally {
      setIsSavingContexto(false);
    }
  };

  const deleteContexto = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este contexto?")) return;

    try {
      const res = await fetch(`/api/chatbot/contexto?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Contexto eliminado");
        fetchContextos();
        fetchEmbeddingStats();
      }
    } catch (error) {
      console.error("Error eliminando:", error);
      toast.error("Error al eliminar");
    }
  };

  const toggleActivoContexto = async (contexto: Contexto) => {
    await saveContexto({ ...contexto, activo: !contexto.activo });
  };

  // Filtrar Contextos
  const filteredContextos = contextos.filter((ctx) => {
    const matchesSearch =
      searchTermContexto === "" ||
      ctx.titulo.toLowerCase().includes(searchTermContexto.toLowerCase()) ||
      ctx.contenido.toLowerCase().includes(searchTermContexto.toLowerCase());

    const matchesTipo = filterTipo === "" || ctx.tipo === filterTipo;

    return matchesSearch && matchesTipo;
  });

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
            Gestiona las preguntas frecuentes y contextos que el chatbot usa para responder
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
            <p className='text-xs text-muted-foreground'>FAQs Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-2xl font-bold text-blue-600'>
              {contextos.length}
            </div>
            <p className='text-xs text-muted-foreground'>Total Contextos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-2xl font-bold text-green-600'>
              {contextos.filter((c) => c.activo).length}
            </div>
            <p className='text-xs text-muted-foreground'>Contextos Activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para FAQs y Contextos */}
      <Tabs
        defaultValue='faqs'
        className='space-y-4'
      >
        <TabsList>
          <TabsTrigger
            value='faqs'
            className='flex items-center gap-2'
          >
            <HelpCircle className='h-4 w-4' />
            FAQs ({faqs.length})
          </TabsTrigger>
          <TabsTrigger
            value='contextos'
            className='flex items-center gap-2'
          >
            <FileText className='h-4 w-4' />
            Contextos ({contextos.length})
          </TabsTrigger>
        </TabsList>

        {/* ============ TAB FAQs ============ */}
        <TabsContent value='faqs'>
          {/* Filtros */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    Preguntas Frecuentes
                  </CardTitle>
                  <CardDescription>
                    El chatbot usa estas FAQs para responder consultas de los
                    usuarios
                  </CardDescription>
                </div>
                <div className='flex gap-2'>
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
                        <Badge
                          variant={faq.prioridad >= 5 ? "default" : "outline"}
                        >
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
        </TabsContent>

        {/* ============ TAB CONTEXTOS ============ */}
        <TabsContent value='contextos'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='h-5 w-5' />
                    Contextos Adicionales
                  </CardTitle>
                  <CardDescription>
                    Información general que el chatbot puede usar para cualquier
                    respuesta
                  </CardDescription>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    onClick={fetchContextos}
                  >
                    <RefreshCw className='h-4 w-4 mr-2' />
                    Actualizar
                  </Button>
                  <Dialog
                    open={contextoDialogOpen}
                    onOpenChange={(open) => {
                      setContextoDialogOpen(open);
                      if (!open) setEditingContexto(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingContexto(null);
                          setContextoDialogOpen(true);
                        }}
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        Nuevo Contexto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                      <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                          <FileText className='h-5 w-5' />
                          {editingContexto?.id
                            ? "Editar Contexto"
                            : "Nuevo Contexto"}
                        </DialogTitle>
                        <DialogDescription>
                          Agrega información que el chatbot pueda usar para
                          contextualizar sus respuestas
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          saveContexto({
                            id: editingContexto?.id,
                            titulo: formData.get("titulo") as string,
                            contenido: formData.get("contenido") as string,
                            tipo: formData.get("tipo") as string,
                            activo: true,
                          });
                        }}
                        className='space-y-4'
                      >
                        <div className='space-y-2'>
                          <Label htmlFor='titulo'>Título</Label>
                          <Input
                            id='titulo'
                            name='titulo'
                            defaultValue={editingContexto?.titulo}
                            required
                            placeholder='Ej: Sobre nuestra clínica'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='tipo'>Tipo de Contexto</Label>
                          <select
                            id='tipo'
                            name='tipo'
                            defaultValue={editingContexto?.tipo || "info"}
                            className='w-full border rounded-md p-2'
                          >
                            {tiposContexto.map((tipo) => (
                              <option
                                key={tipo.value}
                                value={tipo.value}
                              >
                                {tipo.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='contenido'>Contenido</Label>
                          <Textarea
                            id='contenido'
                            name='contenido'
                            defaultValue={editingContexto?.contenido}
                            required
                            rows={8}
                            placeholder='Escribe aquí toda la información relevante que el chatbot debe conocer...'
                          />
                          <p className='text-xs text-muted-foreground'>
                            Puedes escribir información extensa. El chatbot la
                            usará para responder preguntas relacionadas.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button
                            type='submit'
                            disabled={isSavingContexto}
                          >
                            {isSavingContexto && (
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
            </CardHeader>
            <CardContent>
              {/* Filtros Contextos */}
              <div className='flex gap-4 mb-6'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    placeholder='Buscar en títulos o contenido...'
                    value={searchTermContexto}
                    onChange={(e) => setSearchTermContexto(e.target.value)}
                    className='pl-10'
                  />
                </div>
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className='border rounded-md px-3'
                >
                  <option value=''>Todos los tipos</option>
                  {tiposContexto.map((tipo) => (
                    <option
                      key={tipo.value}
                      value={tipo.value}
                    >
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              {isLoadingContextos ? (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
                </div>
              ) : filteredContextos.length === 0 ? (
                <div className='text-center py-12 text-muted-foreground'>
                  <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p className='font-medium'>No hay contextos creados</p>
                  <p className='text-sm mt-1'>
                    Los contextos permiten agregar información general como
                    políticas, descripciones de servicios, o datos del equipo
                    médico.
                  </p>
                  <Button
                    className='mt-4'
                    onClick={() => {
                      setEditingContexto(null);
                      setContextoDialogOpen(true);
                    }}
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Crear primer contexto
                  </Button>
                </div>
              ) : (
                <div className='space-y-4'>
                  {filteredContextos.map((ctx) => (
                    <Card
                      key={ctx.id}
                      className={!ctx.activo ? "opacity-60" : ""}
                    >
                      <CardHeader className='pb-2'>
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center gap-2'>
                            <Switch
                              checked={ctx.activo}
                              onCheckedChange={() => toggleActivoContexto(ctx)}
                            />
                            <div>
                              <CardTitle className='text-base'>
                                {ctx.titulo}
                              </CardTitle>
                              <Badge
                                variant='outline'
                                className='mt-1'
                              >
                                {tiposContexto.find((t) => t.value === ctx.tipo)
                                  ?.label || ctx.tipo}
                              </Badge>
                            </div>
                          </div>
                          <div className='flex gap-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                setEditingContexto(ctx);
                                setContextoDialogOpen(true);
                              }}
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => deleteContexto(ctx.id)}
                            >
                              <Trash2 className='h-4 w-4 text-red-500' />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className='text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3'>
                          {ctx.contenido}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

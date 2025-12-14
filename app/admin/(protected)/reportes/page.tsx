"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
let captureOdontogramaAsBase64: (() => Promise<string | null>) | null = null;
const loadCapture = async () => {
  if (!captureOdontogramaAsBase64) {
    // @ts-ignore - Dynamic import resolves at runtime
    const { captureOdontogramaAsBase64: capture } = await import("@/lib/odontograma-to-image");
    captureOdontogramaAsBase64 = capture;
  }
  return captureOdontogramaAsBase64;
};
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Download, Eye, Loader2, User, Calendar, ClipboardList, Stethoscope, FileDown, Printer, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Paciente {
  id: string;
  numero_historia: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fecha_nacimiento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  genero?: string;
  estado_civil?: string;
  ocupacion?: string;
  lugar_procedencia?: string;
  alerta_medica?: string;
  recomendado_por?: string;
  antecedentes_patologicos?: Record<string, unknown>;
  habitos?: {
    tabaco?: string;
    tabaco_actual_detalle?: string;
    alcohol?: string;
    alcohol_frecuente_detalle?: string;
    drogas_recreacionales?: boolean;
    drogas_tipo?: string;
  };
  talla_m?: number;
  peso_kg?: number;
  imc?: number;
  presion_arterial?: string;
}

interface Caso {
  id: string;
  nombre_caso: string;
  estado: string;
  fecha_inicio: string;
}

interface Cita {
  id: string;
  estado: string;
  fecha_inicio: string;
}

interface ReporteInfo {
  paciente: Paciente;
  totalCitas: number;
  citasCompletadas: number;
  totalCasos: number;
  casosActivos: number;
  ultimaCita?: string;
}

interface OdontogramaData {
  version: number;
  fecha_registro: string;
  especificaciones: string;
  observaciones: string;
  odontograma_data: Record<string, unknown>;
}

interface PresupuestoResumen {
  id: string;
  nombre: string | null;
  correlativo: string | null;
  fecha_creacion: string | null;
  costo_total: number | null;
  moneda_id: string | null;
  items_json: unknown;
  monedas: { codigo: string; simbolo: string } | { codigo: string; simbolo: string }[] | null;
}

export default function ReportesPage() {
  const supabase = createClient();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [reporteInfo, setReporteInfo] = useState<ReporteInfo | null>(null);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [casoSeleccionado, setCasoSeleccionado] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [tipoReporte, setTipoReporte] = useState("ficha");
  const [presupuestos, setPresupuestos] = useState<PresupuestoResumen[]>([]);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState<string>("");

  const fetchPacientes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pacientes")
        .select("id, numero_historia, nombres, apellidos, dni, fecha_nacimiento, telefono, email")
        .order("apellidos");

      if (error) throw error;
      if (data) setPacientes(data);
    } catch (error) {
      console.error("Error fetching pacientes:", error);
      toast.error("Error al cargar la lista de pacientes");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  useEffect(() => {
    if (!casoSeleccionado || !selectedPaciente) {
      setPresupuestos([]);
      setPresupuestoSeleccionado("");
      return;
    }

    const loadPresupuestos = async () => {
      try {
        const { data, error } = await supabase
          .from("presupuestos")
          .select("id, nombre, correlativo, fecha_creacion, costo_total, moneda_id, items_json, monedas(codigo, simbolo)")
          .eq("caso_id", casoSeleccionado)
          .is("deleted_at", null)
          .order("correlativo", { ascending: true });

        if (error) throw error;
        
        const presupuestosData = (data as PresupuestoResumen[]) || [];
        setPresupuestos(presupuestosData);
        
        if (presupuestosData.length > 0) {
          setPresupuestoSeleccionado(presupuestosData[0].id);
        } else {
          setPresupuestoSeleccionado("");
        }
      } catch (error) {
        console.error("Error loading presupuestos:", error);
        toast.error("Error al cargar presupuestos");
      }
    };

    loadPresupuestos();
  }, [casoSeleccionado, selectedPaciente, supabase]);

  const filteredPacientes = pacientes.filter((p) => {
    const fullName = `${p.nombres} ${p.apellidos}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      (p.dni && p.dni.includes(search)) ||
      (p.numero_historia && p.numero_historia.toLowerCase().includes(search))
    );
  });

  const casosUnicos = casos.filter((caso, idx, arr) => arr.findIndex((c) => c.id === caso.id) === idx);

  const getHistoriaId = async (pacienteId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from("historias_clinicas")
        .select("id")
        .eq("paciente_id", pacienteId)
        .maybeSingle(); // Usamos maybeSingle para no lanzar error si no existe

      if (error || !data) return null;
      return data.id;
    } catch {
      return null;
    }
  };

  const handleViewReporte = async (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setDialogOpen(true);
    setCasoSeleccionado("");
    setPresupuestoSeleccionado("");

    try {
      const historiaId = await getHistoriaId(paciente.id);

      // Si no tiene historia clínica aún, asumimos datos vacíos para casos
      const casosQuery = historiaId 
        ? supabase
            .from("casos_clinicos")
            .select("id, nombre_caso, estado, fecha_inicio")
            .eq("historia_id", historiaId)
            .is("deleted_at", null)
            .order("fecha_inicio", { ascending: false })
        : Promise.resolve({ data: [], error: null });

      const [citasRes, casosRes] = await Promise.all([
        supabase.from("citas").select("id, estado, fecha_inicio").eq("paciente_id", paciente.id).is("deleted_at", null).order("fecha_inicio", { ascending: false }),
        casosQuery
      ]);

      const citas = (citasRes.data as Cita[]) || [];
      const casosData = (casosRes.data as Caso[]) || [];

      setReporteInfo({
        paciente,
        totalCitas: citas.length,
        citasCompletadas: citas.filter((c) => c.estado === "Completada").length,
        totalCasos: casosData.length,
        casosActivos: casosData.filter((c) => c.estado === "Abierto" || c.estado === "En Progreso").length,
        ultimaCita: citas[0]?.fecha_inicio,
      });
      setCasos(casosData);
      
      if (casosData.length === 1) {
        setCasoSeleccionado(casosData[0].id);
      } else {
        setCasoSeleccionado(""); // Forzar selección si hay múltiples
      }
    } catch (error) {
      console.error("Error loading report details:", error);
      toast.error("Error al cargar detalles del reporte");
    }
  };

  const handleGeneratePdf = async () => {
    if (!selectedPaciente) return;
    if (casosUnicos.length > 1 && !casoSeleccionado) {
      toast.error("Debes seleccionar un caso para continuar");
      return;
    }
    if (tipoReporte === "presupuesto" && !presupuestoSeleccionado) {
      toast.error("Selecciona un presupuesto");
      return;
    }

    setGeneratingPdf(true);
    try {
      let pdfPayload: Record<string, unknown> = {
        tipo_reporte: tipoReporte,
        numero_historia: selectedPaciente.numero_historia,
        caso_id: casoSeleccionado || (casosUnicos.length === 1 ? casosUnicos[0].id : undefined)
      };

      if (tipoReporte === "ficha") {
        // Obtener historia_id primero
        const historiaId = await getHistoriaId(selectedPaciente.id);
        
        // Obtener datos completos para Ficha Odontológica
        const { data: pacienteCompleto, error: pacienteError } = await supabase
          .from("pacientes")
          .select("*")
          .eq("id", selectedPaciente.id)
          .single();

        if (pacienteError || !pacienteCompleto) {
          throw new Error("No se pudo obtener los datos completos del paciente");
        }

        const { data: odontoData } = await supabase
          .from("odontogramas")
          .select("version, fecha_registro, especificaciones, observaciones, odontograma_data, imagen_base64")
          .eq("paciente_id", selectedPaciente.id)
          .order("version", { ascending: false })
          .limit(1)
          .single();

        // Obtener antecedentes de la tabla antecedentes
        let antecedentesData: Record<string, unknown> = {};
        if (historiaId) {
          const { data: antData } = await supabase
            .from("antecedentes")
            .select("categoria, datos, no_refiere")
            .eq("historia_id", historiaId);
          
          if (antData) {
            (antData || []).forEach((ant) => {
              const key = ((ant.categoria as string) || '').toLowerCase().replace(/\s+/g, "_");
              antecedentesData[key] = {
                no_refiere: ant.no_refiere,
                ...(ant.datos as Record<string, unknown>)
              };
            });
          }
        }

        // Obtener seguimientos de todos los casos
        let casosData: Record<string, unknown>[] = [];
        if (historiaId) {
          const { data: cData } = await supabase
            .from("casos_clinicos")
            .select("id")
            .eq("historia_id", historiaId);
          casosData = cData || [];
        }

        let seguimientos: Record<string, unknown>[] = [];
        if (casosData && casosData.length > 0) {
          const { data: segData } = await supabase
            .from("seguimientos")
            .select("fecha, tratamientos_realizados_ids, presupuesto_id")
            .in("caso_id", casosData.map(c => c.id))
            .is("deleted_at", null)
            .order("fecha", { ascending: false });

          if (segData) {
            // Obtener presupuestos para mapear tratamientos
            const presupuestoIds = [...new Set(segData.map((s: Record<string, unknown>) => s.presupuesto_id as string).filter(Boolean))];
            const presupuestosMap = new Map();
            
            if (presupuestoIds.length > 0) {
              const { data: presData } = await supabase
                .from("presupuestos")
                .select("id, items_json")
                .in("id", presupuestoIds);
              
              (presData || []).forEach((p: Record<string, unknown>) => {
                const items = Array.isArray(p.items_json) ? p.items_json : [];
                items.forEach((item: Record<string, unknown>, idx: number) => {
                  const key = `${p.id}_${item.procedimiento_id}_${idx}`;
                  presupuestosMap.set(key, {
                    nombre: item.procedimiento_nombre,
                    descripcion: item.notas || item.descripcion || ""
                  });
                });
              });
            }

            seguimientos = segData.map((seg) => {
              const tratamientosIds = Array.isArray(seg.tratamientos_realizados_ids) ? (seg.tratamientos_realizados_ids as unknown[]) : [];
              const tratamientos = tratamientosIds
                .filter(id => typeof id === 'string' && id.trim().length > 0)
                .map((id: string) => {
                  const item = presupuestosMap.get(id);
                  if (item) {
                    return item.descripcion ? `${item.nombre} (${item.descripcion})` : item.nombre;
                  }
                  // Si no encuentra mapeo, retorna la ID para debugging
                  return "";
                })
                .filter(Boolean);

              return {
                fecha: new Date(seg.fecha as string | number | Date).toLocaleDateString('es-ES'),
                tratamientos
              };
            });
          }
        }

        const odontogramaReciente = odontoData as OdontogramaData | null;
        const habitos = pacienteCompleto.habitos || {};

        // Capturar imagen del odontograma si existe
        let odontoBase64: string | null = null;
        let toastId: string | number | undefined;
        if (odontogramaReciente) {
          toastId = toast.loading("Capturando odontograma...");
          const captureFunc = await loadCapture();
          if (captureFunc) {
            odontoBase64 = await captureFunc();
          }
          if (toastId) toast.dismiss(toastId);
        }

        pdfPayload = {
          ...pdfPayload,
          filiacion: {
            nombres: pacienteCompleto.nombres || "",
            apellidos: pacienteCompleto.apellidos || "",
            fecha_nacimiento: pacienteCompleto.fecha_nacimiento || "",
            ocupacion: pacienteCompleto.ocupacion || "",
            telefono: pacienteCompleto.telefono || "",
            email: pacienteCompleto.email || "",
            alerta_medica: pacienteCompleto.alerta_medica || "",
            direccion: pacienteCompleto.direccion || "",
            sexo: pacienteCompleto.genero || "no_especifica",
            estado_civil: pacienteCompleto.estado_civil || "",
            lugar_procedencia: pacienteCompleto.lugar_procedencia || "",
            recomendado_por: pacienteCompleto.recomendado_por || "",
          },
          antecedentes: antecedentesData,
          odontograma: odontogramaReciente ? {
            existe: true,
            version: (odontogramaReciente.version as number),
            fecha_registro: new Date(odontogramaReciente.fecha_registro as string | number | Date).toLocaleDateString('es-ES'),
            observaciones: (odontogramaReciente.observaciones as string) || "Sin observaciones",
            // Usar imagen guardada en BD, o intentar capturar, o dejar undefined
            imagen_base64: ((odontogramaReciente as unknown as Record<string, unknown>).imagen_base64 as string) || odontoBase64 || undefined,
          } : {
            existe: false
          },
          seguimientos
        };
      } else {
        // Obtener datos para Presupuesto
        const presupuesto = presupuestos.find(p => p.id === presupuestoSeleccionado);
        if (!presupuesto) {
          throw new Error("Presupuesto no encontrado");
        }

        const items = Array.isArray(presupuesto.items_json) ? presupuesto.items_json : [];
        const monedasDataPres: { codigo: string; simbolo: string } | undefined = Array.isArray(presupuesto.monedas)
          ? presupuesto.monedas[0]
          : presupuesto.monedas ?? undefined;
        const monedaSimbolo = monedasDataPres?.simbolo || "S/";

        // Obtener pagos relacionados a este presupuesto desde seguimientos
        const { data: segData } = await supabase
          .from("seguimientos")
          .select("fecha, tratamientos_realizados_ids, pago_id, pagos(monto, moneda_id)")
          .eq("presupuesto_id", presupuestoSeleccionado)
          .is("deleted_at", null)
          .not("pago_id", "is", null)
          .order("fecha", { ascending: false });

        const pagos = (segData || []).map((seg) => {
          const tratamientosIds = (seg.tratamientos_realizados_ids as string[]) || [];
          const tratamientos = tratamientosIds.map((id: string) => {
            const item = items.find((it) => `${presupuestoSeleccionado}_${(it.procedimiento_id as string)}_${items.indexOf(it)}` === id);
            if (item) {
              const desc = (item.notas as string) || (item.descripcion as string) || "";
              return desc ? `${item.procedimiento_nombre} (${desc})` : (item.procedimiento_nombre as string);
            }
            return "";
          }).filter(Boolean);

          return {
            fecha: new Date(seg.fecha as string | number | Date).toLocaleDateString('es-ES'),
            tratamientos,
            monto: ((seg.pagos as unknown as Record<string, unknown> | undefined)?.monto as number) || 0
          };
        });

        pdfPayload = {
          ...pdfPayload,
          paciente_nombre: `${selectedPaciente.nombres}_${selectedPaciente.apellidos}`,
          fecha_presupuesto: presupuesto.fecha_creacion ? new Date(presupuesto.fecha_creacion).toLocaleDateString('es-ES') : "",
          correlativo: presupuesto.correlativo,
          items: items.map((item: Record<string, unknown>) => ({
            nombre: item.procedimiento_nombre,
            descripcion: item.notas || item.descripcion || "",
            cantidad: item.cantidad || 1,
            costo: (item.costo ?? item.precio_unitario ?? 0)
          })),
          moneda_simbolo: monedaSimbolo,
          pagos
        };
      }
      
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pdfPayload),
      });

      if (!response.ok) {
        throw new Error("Error en el servidor al generar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = tipoReporte === "ficha" 
        ? `Ficha_${selectedPaciente.nombres}_${selectedPaciente.apellidos}.pdf`
        : `Presupuesto_${selectedPaciente.nombres}_${selectedPaciente.apellidos}.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF generado correctamente");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar el PDF. Verifique los datos.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const getEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return "-";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  return (
    <div className='container mx-auto py-6 space-y-6'>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Reportes de Pacientes</h1>
          <p className='text-muted-foreground'>Genera reportes y fichas odontológicas completas</p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Pacientes</CardTitle>
            <User className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pacientes.length}</div>
            <p className='text-xs text-muted-foreground'>Pacientes registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Reportes Disponibles</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2</div>
            <p className='text-xs text-muted-foreground'>Tipos de reportes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Formato</CardTitle>
            <FileDown className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>PDF</div>
            <p className='text-xs text-muted-foreground'>Descarga estandarizada</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Paciente</CardTitle>
          <CardDescription>Busca un paciente para visualizar estadísticas y generar documentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4 mb-6'>
            <div className='relative w-full max-w-sm'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar por nombre, DNI o HC...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : filteredPacientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
              <p>No se encontraron pacientes</p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Historia</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead className='w-[180px]'>Contacto</TableHead>
                    <TableHead className='text-center'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPacientes.slice(0, 20).map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell><Badge variant='secondary' className="font-mono">{paciente.numero_historia || "-"}</Badge></TableCell>
                      <TableCell><div className='font-medium'>{paciente.nombres} {paciente.apellidos}</div></TableCell>
                      <TableCell>{paciente.dni || "-"}</TableCell>
                      <TableCell>{getEdad(paciente.fecha_nacimiento)}</TableCell>
                      <TableCell>
                        <div className='text-sm space-y-1'>
                          {paciente.telefono && <div>{paciente.telefono}</div>}
                          {paciente.email && <div className='text-muted-foreground text-xs truncate max-w-[150px]' title={paciente.email}>{paciente.email}</div>}
                        </div>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button variant="outline" size='sm' onClick={() => handleViewReporte(paciente)} className="hover:bg-primary hover:text-primary-foreground">
                          <Eye className='h-4 w-4 mr-2' /> Ver Reportes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {filteredPacientes.length > 20 && (
            <p className='text-center text-sm text-muted-foreground mt-4'>Mostrando 20 de {filteredPacientes.length} pacientes. Usa el buscador para filtrar.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-xl'>
              <FileText className='h-5 w-5 text-primary' />
              Reportes: {selectedPaciente?.nombres} {selectedPaciente?.apellidos}
            </DialogTitle>
            <DialogDescription>
              HC: <span className="font-mono font-medium text-foreground">{selectedPaciente?.numero_historia || "Sin asignar"}</span>
            </DialogDescription>
          </DialogHeader>

          {reporteInfo && (
            <div className='space-y-6'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-100 dark:border-blue-800'>
                  <Calendar className='h-5 w-5 mx-auto mb-2 text-blue-600 dark:text-blue-400' />
                  <div className='text-2xl font-bold text-blue-700 dark:text-blue-300'>{reporteInfo.totalCitas}</div>
                  <div className='text-xs text-muted-foreground font-medium uppercase'>Citas totales</div>
                </div>
                <div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border border-green-100 dark:border-green-800'>
                  <ClipboardList className='h-5 w-5 mx-auto mb-2 text-green-600 dark:text-green-400' />
                  <div className='text-2xl font-bold text-green-700 dark:text-green-300'>{reporteInfo.citasCompletadas}</div>
                  <div className='text-xs text-muted-foreground font-medium uppercase'>Completadas</div>
                </div>
                <div className='bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center border border-purple-100 dark:border-purple-800'>
                  <Stethoscope className='h-5 w-5 mx-auto mb-2 text-purple-600 dark:text-purple-400' />
                  <div className='text-2xl font-bold text-purple-700 dark:text-purple-300'>{reporteInfo.totalCasos}</div>
                  <div className='text-xs text-muted-foreground font-medium uppercase'>Casos</div>
                </div>
                <div className='bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center border border-orange-100 dark:border-orange-800'>
                  <User className='h-5 w-5 mx-auto mb-2 text-orange-600 dark:text-orange-400' />
                  <div className='text-2xl font-bold text-orange-700 dark:text-orange-300'>{reporteInfo.casosActivos}</div>
                  <div className='text-xs text-muted-foreground font-medium uppercase'>Casos activos</div>
                </div>
              </div>

              <div className='space-y-3 bg-card p-4 rounded-lg border'>
                {casosUnicos.length > 1 && (
                  <div className='space-y-2 pb-3 border-b'>
                    <label className='text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2'>
                      <AlertCircle className="h-4 w-4" />
                      Seleccionar Caso *
                    </label>
                    <Select value={casoSeleccionado} onValueChange={setCasoSeleccionado}>
                      <SelectTrigger className={`w-full ${!casoSeleccionado && 'border-red-500 border-2'}`}>
                        <SelectValue placeholder='Debes seleccionar un caso' />
                      </SelectTrigger>
                      <SelectContent>
                        {casosUnicos.map((caso) => (
                          <SelectItem key={caso.id} value={caso.id}>
                            {caso.nombre_caso}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!casoSeleccionado && casosUnicos.length > 1 && (
                      <p className='text-xs text-red-500 dark:text-red-400 font-medium'>Este paciente tiene múltiples casos. Selecciona uno para continuar.</p>
                    )}
                  </div>
                )}
                
                <label className='text-sm font-medium'>Tipo de Reporte a Generar</label>
                <Select value={tipoReporte} onValueChange={setTipoReporte} disabled={casosUnicos.length > 1 && !casoSeleccionado}>
                  <SelectTrigger className="w-full"><SelectValue placeholder='Selecciona el tipo' /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ficha'>Ficha Odontológica</SelectItem>
                    <SelectItem value='presupuesto'>Presupuesto</SelectItem>
                  </SelectContent>
                </Select>
                
                {tipoReporte === 'presupuesto' && presupuestos.length > 0 && (
                  <div className='space-y-2 mt-3'>
                    <label className='text-sm font-medium'>Seleccionar Presupuesto</label>
                    <Select value={presupuestoSeleccionado} onValueChange={setPresupuestoSeleccionado}>
                      <SelectTrigger className="w-full"><SelectValue placeholder='Elige un presupuesto' /></SelectTrigger>
                      <SelectContent>
                        {presupuestos.map((pres) => {
                          const presId = pres.id as string;
                          const correlativo = String(pres.correlativo || "000").padStart(3, "0");
                          const nombre = pres.nombre as string;
                          const monedasData = Array.isArray(pres.monedas) ? pres.monedas[0] : pres.monedas;
                          const monedaSimb = monedasData?.simbolo || "S/";
                          const costoTotal = ((pres.costo_total as number) || 0).toFixed(2);
                          return (
                            <SelectItem key={presId} value={presId}>
                              #{correlativo} - {nombre} ({monedaSimb} {costoTotal})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {tipoReporte === 'presupuesto' && presupuestos.length === 0 && (
                  <p className='text-sm text-amber-600 dark:text-amber-400 mt-2'>Este paciente no tiene presupuestos registrados</p>
                )}
              </div>

              {casosUnicos.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium flex items-center gap-2'><Stethoscope className="h-4 w-4" /> Casos Recientes (últimos 3)</h4>
                  <div className='space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar'>
                    {casosUnicos.slice(0, 3).map((caso) => (
                      <div key={caso.id} className='flex items-center justify-between p-3 bg-muted/40 rounded-md border text-sm hover:bg-muted/60 transition-colors'>
                        <div className="font-medium">{caso.nombre_caso}</div>
                        <Badge variant={caso.estado === "Abierto" || caso.estado === "En Progreso" ? "default" : "secondary"}>{caso.estado}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t'>
                <Button className='flex-1 shadow-sm' onClick={handleGeneratePdf} disabled={generatingPdf}>
                  {generatingPdf ? <Loader2 className='h-4 w-4 mr-2 animate-spin' /> : <Download className='h-4 w-4 mr-2' />}
                  {generatingPdf ? "Generando..." : "Descargar PDF"}
                </Button>
                <Button variant='outline' onClick={() => window.open(`/admin/ficha-odontologica/${selectedPaciente?.numero_historia}`, "_blank")}>
                  <Eye className='h-4 w-4 mr-2' /> Ir a Ficha
                </Button>
                <Button variant='ghost' size="icon" onClick={() => window.print()} title="Imprimir vista rápida"><Printer className='h-4 w-4' /></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
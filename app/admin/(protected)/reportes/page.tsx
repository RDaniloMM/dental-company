"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Search,
  Download,
  Eye,
  Loader2,
  User,
  Calendar,
  ClipboardList,
  Stethoscope,
  FileDown,
  Printer,
} from "lucide-react";
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
}

interface Caso {
  id: string;
  nombre: string;
  estado: string;
  fecha_creacion: string;
}

interface ReporteInfo {
  paciente: Paciente;
  totalCitas: number;
  citasCompletadas: number;
  totalCasos: number;
  casosActivos: number;
  ultimaCita?: string;
}

export default function ReportesPage() {
  const supabase = createClient();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [reporteInfo, setReporteInfo] = useState<ReporteInfo | null>(null);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [tipoReporte, setTipoReporte] = useState("ficha");

  const fetchPacientes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pacientes")
      .select("id, numero_historia, nombres, apellidos, dni, fecha_nacimiento, telefono, email")
      .order("apellidos");

    if (!error && data) {
      setPacientes(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  const filteredPacientes = pacientes.filter((p) => {
    const fullName = `${p.nombres} ${p.apellidos}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      p.dni?.includes(search) ||
      p.numero_historia?.includes(search)
    );
  });

  const handleViewReporte = async (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setDialogOpen(true);

    // Cargar información del reporte
    const [citasRes, casosRes] = await Promise.all([
      supabase
        .from("citas")
        .select("id, estado, fecha_inicio")
        .eq("paciente_id", paciente.id)
        .order("fecha_inicio", { ascending: false }),
      supabase
        .from("casos")
        .select("id, nombre, estado, fecha_creacion")
        .eq("paciente_id", paciente.id)
        .order("fecha_creacion", { ascending: false }),
    ]);

    const citas = citasRes.data || [];
    const casosData = casosRes.data || [];

    setReporteInfo({
      paciente,
      totalCitas: citas.length,
      citasCompletadas: citas.filter((c) => c.estado === "Completada").length,
      totalCasos: casosData.length,
      casosActivos: casosData.filter((c) => c.estado === "Activo" || c.estado === "En Progreso").length,
      ultimaCita: citas[0]?.fecha_inicio,
    });
    setCasos(casosData);
  };

  const handleGeneratePdf = async () => {
    if (!selectedPaciente) return;

    setGeneratingPdf(true);
    try {
      // Obtener datos completos del paciente para el PDF
      const { data: pacienteCompleto } = await supabase
        .from("pacientes")
        .select("*")
        .eq("id", selectedPaciente.id)
        .single();

      if (!pacienteCompleto) {
        toast.error("No se pudo obtener los datos del paciente");
        return;
      }

      // Obtener antecedentes y cuestionario
      const { data: antecedentes } = await supabase
        .from("antecedentes")
        .select("*")
        .eq("paciente_id", selectedPaciente.id)
        .single();

      const { data: cuestionario } = await supabase
        .from("cuestionarios")
        .select("*")
        .eq("paciente_id", selectedPaciente.id)
        .single();

      // Construir FormData para el PDF
      const formData = {
        filiacion: {
          nombres: pacienteCompleto.nombres || "",
          apellidos: pacienteCompleto.apellidos || "",
          fecha_nacimiento: pacienteCompleto.fecha_nacimiento || "",
          ocupacion: pacienteCompleto.ocupacion || "",
          telefono: pacienteCompleto.telefono || "",
          email: pacienteCompleto.email || "",
          alerta_medica: pacienteCompleto.alerta_medica || "",
          direccion: pacienteCompleto.direccion || "",
          dni: pacienteCompleto.dni || "",
          genero: pacienteCompleto.genero || "",
        },
        antecedentes: antecedentes || {},
        cuestionario: cuestionario || {},
        seguimientos: [],
      };

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al generar el PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ficha_${selectedPaciente.nombres}_${selectedPaciente.apellidos}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF generado correctamente");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar el PDF");
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Pacientes</h1>
          <p className="text-muted-foreground">
            Genera reportes y fichas odontológicas de los pacientes
          </p>
        </div>
      </div>

      {/* Tarjetas informativas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pacientes.length}</div>
            <p className="text-xs text-muted-foreground">Pacientes registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes Disponibles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Tipos de reportes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formato</CardTitle>
            <FileDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PDF</div>
            <p className="text-xs text-muted-foreground">Descarga en PDF</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Paciente</CardTitle>
          <CardDescription>
            Busca un paciente para generar su reporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Búsqueda */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, DNI o número de historia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPacientes.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No se encontraron pacientes
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Historia</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPacientes.slice(0, 20).map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell>
                        <Badge variant="outline">{paciente.numero_historia || "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {paciente.nombres} {paciente.apellidos}
                        </div>
                      </TableCell>
                      <TableCell>{paciente.dni || "-"}</TableCell>
                      <TableCell>{getEdad(paciente.fecha_nacimiento)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {paciente.telefono && <div>{paciente.telefono}</div>}
                          {paciente.email && (
                            <div className="text-muted-foreground text-xs">{paciente.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReporte(paciente)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Reportes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {filteredPacientes.length > 20 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Mostrando 20 de {filteredPacientes.length} pacientes. Usa el buscador para filtrar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Reportes del Paciente */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Reportes de {selectedPaciente?.nombres} {selectedPaciente?.apellidos}
            </DialogTitle>
            <DialogDescription>
              N° Historia: {selectedPaciente?.numero_historia || "Sin asignar"}
            </DialogDescription>
          </DialogHeader>

          {reporteInfo && (
            <div className="space-y-6">
              {/* Resumen del paciente */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-lg font-bold">{reporteInfo.totalCitas}</div>
                  <div className="text-xs text-muted-foreground">Citas totales</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <ClipboardList className="h-5 w-5 mx-auto mb-1 text-green-600" />
                  <div className="text-lg font-bold">{reporteInfo.citasCompletadas}</div>
                  <div className="text-xs text-muted-foreground">Completadas</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Stethoscope className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                  <div className="text-lg font-bold">{reporteInfo.totalCasos}</div>
                  <div className="text-xs text-muted-foreground">Casos</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <User className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                  <div className="text-lg font-bold">{reporteInfo.casosActivos}</div>
                  <div className="text-xs text-muted-foreground">Casos activos</div>
                </div>
              </div>

              {reporteInfo.ultimaCita && (
                <p className="text-sm text-muted-foreground">
                  Última cita:{" "}
                  {new Date(reporteInfo.ultimaCita).toLocaleDateString("es-PE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}

              {/* Selector de tipo de reporte */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Tipo de Reporte</label>
                <Select value={tipoReporte} onValueChange={setTipoReporte}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ficha">Ficha Odontológica Completa</SelectItem>
                    <SelectItem value="historial">Historial de Citas</SelectItem>
                    <SelectItem value="tratamientos">Resumen de Tratamientos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Casos del paciente */}
              {casos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Casos del Paciente</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {casos.map((caso) => (
                      <div
                        key={caso.id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                      >
                        <span className="text-sm">{caso.nombre}</span>
                        <Badge
                          variant={
                            caso.estado === "Activo" || caso.estado === "En Progreso"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {caso.estado}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={handleGeneratePdf}
                  disabled={generatingPdf}
                >
                  {generatingPdf ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Descargar PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(
                      `/admin/ficha-odontologica/${selectedPaciente?.numero_historia}`,
                      "_blank"
                    );
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Ficha
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

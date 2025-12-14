"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import OdontogramaSVG from "./OdontogramaSVG";
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Save, FilePlus, ArrowLeft } from "lucide-react";
import VersionSelect from "./VersionSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

type Zona = { zona: string; condicion: string; color: string };
type General = {
  condicion: string;
  icon: string;
  label?: string;
  color?: string;
};
type Diente = { zonas: Zona[]; generales: General[] };

export default function OdontoPage({ patientId, backToSeguimientoUrl }: { patientId: string; backToSeguimientoUrl?: string }) {
  const supabase = createClient();
  const router = useRouter();
  
  const [odontograma, setOdontograma] = useState<Record<string, Diente>>({});
  const [borderColors, setBorderColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [versiones, setVersiones] = useState<number[]>([]);
  const [versionSeleccionada, setVersionSeleccionada] = useState<number | null>(null);
  const [fechaRegistro, setFechaRegistro] = useState<string | null>(null);
  const [, setActiveTab] = useState<"adulto" | "nino">("adulto");
  const [especificaciones, setEspecificaciones] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const adultTeeth = [
    "18", "17", "16", "15", "14", "13", "12", "11",
    "21", "22", "23", "24", "25", "26", "27", "28",
    "48", "47", "46", "45", "44", "43", "42", "41",
    "31", "32", "33", "34", "35", "36", "37", "38"
  ];

  const childTeeth = [
    "-", "-", "-", "55", "54", "53", "52", "51", "61", "62", "63", "64", "65", "-", "-", "-",
    "-", "-", "-", "85", "84", "83", "82", "81", "71", "72", "73", "74", "75", "-", "-", "-"
  ];

  useEffect(() => {
    const fetchVersiones = async () => {
      const { data, error } = await supabase
        .from("odontogramas")
        .select("version")
        .eq("paciente_id", patientId)
        .order("version", { ascending: false });

      if (error) {
        console.error(error.message);
        return;
      }

      const vers = (data ?? []).map((v) => v.version);
      setVersiones(vers);
      setVersionSeleccionada(vers[0] ?? null);
    };
    fetchVersiones();
  }, [patientId, supabase]);

  useEffect(() => {
    if (!versionSeleccionada) return;

    const fetchOdontograma = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("odontogramas")
        .select("*")
        .eq("paciente_id", patientId)
        .eq("version", versionSeleccionada)
        .single();

      if (error) {
        setOdontograma({});
        setBorderColors({});
        setFechaRegistro(null);
      } else if (data) {
        const json = data.odontograma_data as Record<string, Diente>;
        setOdontograma(json);
        reconstruirBorderColors(json);
        setFechaRegistro(data.fecha_registro || data.created_at || null);
        setEspecificaciones(data.especificaciones || "");
        setObservaciones(data.observaciones || "");
      }
      setLoading(false);
    };

    fetchOdontograma();
  }, [patientId, versionSeleccionada, supabase]);

  const reconstruirBorderColors = (json: Record<string, Diente>) => {
    const newBorderColors: Record<string, string> = {};
    for (const toothId in json) {
      const diente = json[toothId];
      diente.zonas?.forEach((z) => {
        if (z.color) newBorderColors[`${toothId}_${z.zona}`] = z.color;
      });
      diente.generales?.forEach((gen) => {
        let color = gen.color;
        if (!color) {
          const match = gen.icon?.match(/_([RB])$/);
          if (match) color = match[1] === "R" ? "red" : "blue";
        }
        if (color) newBorderColors[`${toothId}_corona`] = color;
      });
    }
    setBorderColors(newBorderColors);
  };

  const guardarOdontograma = async () => {
    if (Object.keys(odontograma).length === 0) {
      return Swal.fire({
        title: "Aviso",
        text: "No hay información para guardar",
        icon: "warning",
        confirmButtonColor: "hsl(175, 80%, 35%)",
      });
    }

    setLoading(true);
    const nuevaVersion = versiones.length ? Math.max(...versiones) + 1 : 1;

    // Capturar imagen del odontograma
    let imagenBase64 = null;
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Buscar el contenedor del odontograma
      const odontoContainer = document.querySelector('[data-testid="odontograma-container"]') || 
                             document.querySelector('.odontograma-container');
      
      if (odontoContainer && ctx) {
        canvas.width = Math.min((odontoContainer as HTMLElement).scrollWidth || 1000, 1200);
        canvas.height = Math.min((odontoContainer as HTMLElement).scrollHeight || 600, 800);
        
        // Usar html2canvas si está disponible
        try {
          const html2canvas = (await import('html2canvas')).default;
          const canvasFromHtml = await html2canvas(odontoContainer as HTMLElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            useCORS: true,
          });
          imagenBase64 = canvasFromHtml.toDataURL('image/png');
        } catch (e) {
          console.warn("html2canvas no disponible, intentando canvas native");
        }
      }
    } catch (e) {
      console.warn("Error capturando imagen del odontograma:", e);
    }

    const { error } = await supabase.from("odontogramas").insert([
      {
        paciente_id: patientId,
        odontograma_data: odontograma,
        version: nuevaVersion,
        especificaciones: especificaciones,
        observaciones: observaciones,
        imagen_base64: imagenBase64,
      },
    ]);

    if (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar",
        icon: "error",
        confirmButtonColor: "hsl(175, 80%, 35%)",
      });
      return setLoading(false);
    }

    Swal.fire({
      title: "Guardado!",
      text: `Versión ${nuevaVersion}`,
      icon: "success",
      confirmButtonColor: "hsl(175, 80%, 35%)",
    });
    setVersiones([nuevaVersion, ...versiones]);
    setVersionSeleccionada(nuevaVersion);
    setLoading(false);
  };

  const nuevoOdontograma = () => {
    const nuevaVersion = versiones.length ? Math.max(...versiones) + 1 : 1;
    setOdontograma({});
    setBorderColors({});
    setEspecificaciones("");
    setObservaciones("");
    setVersionSeleccionada(nuevaVersion);
    setFechaRegistro(null);
  };

  return (
    <div className="w-full max-w-none">
      <div className="rounded-lg border border-border bg-card">
        <div className="bg-blue-500 dark:bg-blue-800 p-4 rounded-t-lg flex justify-center items-center px-6">
          <h2 className="text-2xl font-bold text-white">Odontograma Digital</h2>
        </div>

        <CardContent className="pt-6">
          <div className="flex flex-col xl:flex-row gap-6 mb-6 items-start xl:items-center justify-between border-b pb-4">
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex flex-col gap-1 w-40">
                <label className="text-xs font-medium text-muted-foreground">Versión</label>
                <VersionSelect
                  versiones={versiones}
                  selectedVersion={versionSeleccionada}
                  onSelectVersion={setVersionSeleccionada}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Fecha Registro</label>
                <input
                  type="text"
                  value={fechaRegistro ? new Date(fechaRegistro).toLocaleString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                  readOnly
                  className="h-9 px-3 py-1 text-sm bg-muted rounded-md border w-48 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {backToSeguimientoUrl && (
                <Button 
                  variant="default" 
                  onClick={() => router.push(backToSeguimientoUrl)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Volver a seguimiento
                </Button>
              )}

              <Button onClick={guardarOdontograma} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="w-4 h-4 mr-2" /> {loading ? "Guardando..." : "Guardar"}
              </Button>

              <Button onClick={nuevoOdontograma} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
                <FilePlus className="w-4 h-4 mr-2" /> Nuevo
              </Button>
            </div>
          </div>

          <Tabs defaultValue="adulto" className="w-full" onValueChange={(val) => setActiveTab(val as "adulto" | "nino")}>
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto mb-4">
              <TabsTrigger value="adulto">Adulto</TabsTrigger>
              <TabsTrigger value="nino">Niño</TabsTrigger>
            </TabsList>

            {/* Contenedor con Scroll Horizontal */}
            <div className="border rounded-xl bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto w-full custom-scrollbar">
              <div className="min-w-[1000px] p-6 flex justify-center">
                <TabsContent value="adulto" className="mt-0 w-full">
                  <div data-testid="odontograma-container" className="relative">
                    <OdontogramaSVG
                      teethList={adultTeeth}
                      odontograma={odontograma}
                      setOdontograma={setOdontograma}
                      borderColors={borderColors}
                      setBorderColors={setBorderColors}
                      isChild={false}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="nino" className="mt-0 w-full">
                  <div data-testid="odontograma-container" className="relative">
                    <OdontogramaSVG
                      teethList={childTeeth}
                      odontograma={odontograma}
                      setOdontograma={setOdontograma}
                      borderColors={borderColors}
                      setBorderColors={setBorderColors}
                      isChild={true}
                    />
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Especificaciones</label>
              <textarea
                className="border rounded-lg p-3 min-h-[100px] resize-none focus:ring-2 focus:ring-primary focus:outline-none bg-background text-sm"
                placeholder="Escribe aquí las especificaciones..."
                value={especificaciones}
                onChange={(e) => setEspecificaciones(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Observaciones</label>
              <textarea
                className="border rounded-lg p-3 min-h-[100px] resize-none focus:ring-2 focus:ring-primary focus:outline-none bg-background text-sm"
                placeholder="Escribe aquí las observaciones..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
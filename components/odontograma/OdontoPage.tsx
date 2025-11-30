"use client";

import { useState, useEffect } from "react";
import OdontogramaSVG from "./OdontogramaSVG";
import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Save, FilePlus } from "lucide-react";
import VersionSelect from "./VersionSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ------- tipos (sin cambios) -------
type Zona = { zona: string; condicion: string; color: string };
type General = {
  condicion: string;
  icon: string;
  label?: string;
  color?: string;
};
type Diente = { zonas: Zona[]; generales: General[] };

export default function OdontoPage({ patientId }: { patientId: string }) {
  const [odontograma, setOdontograma] = useState<Record<string, Diente>>({});
  const [borderColors, setBorderColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [versiones, setVersiones] = useState<number[]>([]);
  const [versionSeleccionada, setVersionSeleccionada] = useState<number | null>(
    null
  );
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

  // -------- Cargar versiones ----------
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
  }, [patientId]);

  // -------- Cargar odontograma según versión ----------
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
        console.warn("No hay datos para la versión seleccionada");
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
  }, [patientId, versionSeleccionada]);

  // -------- Reconstruir colores --------
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

  // -------- Guardar nueva versión --------
  const guardarOdontograma = async () => {
    if (Object.keys(odontograma).length === 0) {
      return Swal.fire("Aviso", "No hay información para guardar", "warning");
    }

    setLoading(true);
    const nuevaVersion = versiones.length ? Math.max(...versiones) + 1 : 1;

    const { error } = await supabase.from("odontogramas").insert([
      {
        paciente_id: patientId,
        odontograma_data: odontograma,
        version: nuevaVersion,
        especificaciones: especificaciones,
        observaciones: observaciones,
      },
    ]);

    if (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
      return setLoading(false);
    }

    Swal.fire("Guardado!", `Versión ${nuevaVersion}`, "success");
    setVersiones([nuevaVersion, ...versiones]);
    setVersionSeleccionada(nuevaVersion);
    setLoading(false);
  };

  // -------- Nuevo odontograma --------
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
    <div>
      <h1 className="text-xl font-bold mb-6">Odontograma Digital</h1>

      <div className="flex gap-4 flex-wrap items-center mb-6">
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Versión</label>
          <VersionSelect
            versiones={versiones}
            selectedVersion={versionSeleccionada}
            onSelectVersion={setVersionSeleccionada}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Fecha Registro</label>
          <input
            type="text"
            value={
              fechaRegistro
                ? new Date(fechaRegistro).toLocaleString("es-PE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "-"
            }
            readOnly
            className="border rounded px-2 py-1 text-sm bg-muted w-52"
          />
        </div>

        <button
          onClick={guardarOdontograma}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600 disabled:bg-green-300"
        >
          <Save className="w-4 h-4" /> {loading ? "Guardando..." : "Guardar"}
        </button>

        <button
          onClick={nuevoOdontograma}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-600 disabled:bg-yellow-300"
        >
          <FilePlus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      <Tabs defaultValue="adulto" className="w-full" onValueChange={(val) => setActiveTab(val as "adulto" | "nino")}>
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto mb-4">
          <TabsTrigger value="adulto">Adulto</TabsTrigger>
          <TabsTrigger value="nino">Niño</TabsTrigger>
        </TabsList>
        <TabsContent value="adulto">
          <OdontogramaSVG
            teethList={adultTeeth}
            odontograma={odontograma}
            setOdontograma={setOdontograma}
            borderColors={borderColors}
            setBorderColors={setBorderColors}
            isChild={false}
          />
        </TabsContent>
        <TabsContent value="nino">
          <OdontogramaSVG
            teethList={childTeeth}
            odontograma={odontograma}
            setOdontograma={setOdontograma}
            borderColors={borderColors}
            setBorderColors={setBorderColors}
            isChild={true}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Especificaciones</label>
          <textarea
            className="border rounded-lg p-3 min-h-[100px] resize-none focus:ring-2 focus:ring-primary focus:outline-none bg-background"
            placeholder="Escribe aquí las especificaciones..."
            value={especificaciones}
            onChange={(e) => setEspecificaciones(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Observaciones</label>
          <textarea
            className="border rounded-lg p-3 min-h-[100px] resize-none focus:ring-2 focus:ring-primary focus:outline-none bg-background"
            placeholder="Escribe aquí las observaciones..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

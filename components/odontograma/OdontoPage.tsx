"use client";

import { useState, useEffect } from "react";
import OdontogramaSVG from "./OdontogramaSVG";
import { createClient } from "@supabase/supabase-js";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Save, FilePlus } from "lucide-react";
import VersionSelect from "./VersionSelect";

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

  const teethList = [
    "18",
    "17",
    "16",
    "15",
    "14",
    "13",
    "12",
    "11",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "48",
    "47",
    "46",
    "45",
    "44",
    "43",
    "42",
    "41",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
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
      } else if (data) {
        const json = data.odontograma_data as Record<string, Diente>;
        setOdontograma(json);
        reconstruirBorderColors(json);
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
    setVersionSeleccionada(nuevaVersion);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Odontograma Digital</h1>

      <div className="flex gap-4 flex-wrap items-center">
        <VersionSelect
          versiones={versiones}
          selectedVersion={versionSeleccionada}
          onSelectVersion={setVersionSeleccionada}
        />

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

      <OdontogramaSVG
        teethList={teethList}
        odontograma={odontograma}
        setOdontograma={setOdontograma}
        borderColors={borderColors}
        setBorderColors={setBorderColors}
      />
    </div>
  );
}

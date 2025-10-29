"use client";
import { useState, useEffect } from "react";
import OdontogramaSVG from "./OdontogramaSVG";
import { createClient } from "@supabase/supabase-js";
// import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import { Save, FilePlus } from "lucide-react";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Zona = { zona: string; condicion: string; color: string };
type General = {
  condicion: string;
  icon: string;
  label?: string;
  color?: string;
};
type Diente = { zonas: Zona[]; generales: General[] };
type Paciente = {
  id: string;
  nombres: string;
  apellidos: string;
  numero_historia: string;
};

export default function OdontoPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<string>("");
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

  // ---------- Cargar pacientes ----------
  useEffect(() => {
    const fetchPacientes = async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("id, nombres, apellidos, numero_historia");
      if (error) console.error("Error al cargar pacientes:", error);
      else if (data) setPacientes(data as Paciente[]);
    };
    fetchPacientes();
  }, []);

  // ---------- Cargar versiones disponibles ----------
  useEffect(() => {
    if (!pacienteSeleccionado) return;

    const fetchVersiones = async () => {
      const { data, error } = await supabase
        .from("odontogramas")
        .select("version")
        .eq("paciente_id", pacienteSeleccionado)
        .order("version", { ascending: false });

      if (error) console.error("Error al cargar versiones:", error);
      else if (data) {
        const vers = (data as { version: number }[])
          .map((v) => v.version)
          .sort((a, b) => b - a);
        setVersiones(vers);
        setVersionSeleccionada(vers[0] || null);
      }
    };
    fetchVersiones();
  }, [pacienteSeleccionado]);

  // ---------- Cargar odontograma por versión ----------
  useEffect(() => {
    if (!pacienteSeleccionado || versionSeleccionada === null) return;

    const fetchOdontograma = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("odontogramas")
        .select("*")
        .eq("paciente_id", pacienteSeleccionado)
        .eq("version", versionSeleccionada)
        .single();

      if (error && error.code !== "PGRST116")
        console.error("Error al cargar odontograma:", error);
      else if (data) {
        const json = data.odontograma_data as Record<string, Diente>;
        setOdontograma(json);
        reconstruirBorderColors(json);
      } else {
        setOdontograma({});
        setBorderColors({});
      }
      setLoading(false);
    };
    fetchOdontograma();
  }, [pacienteSeleccionado, versionSeleccionada]);

  // ---------- Reconstruir colores ----------
  const reconstruirBorderColors = (json: Record<string, Diente>) => {
    const newBorderColors: Record<string, string> = {};
    for (const toothId in json) {
      const diente = json[toothId];
      diente.zonas.forEach((zona: Zona) => {
        if (zona.color) newBorderColors[`${toothId}_${zona.zona}`] = zona.color;
      });
      diente.generales.forEach((gen: General) => {
        let color = gen.color;
        if (!color) {
          const match = gen.icon.match(/_([RB])$/);
          if (match) color = match[1] === "R" ? "red" : "blue";
        }
        if (color) newBorderColors[`${toothId}_corona`] = color;
      });
    }
    setBorderColors(newBorderColors);
  };

  // ---------- Guardar odontograma (nueva versión) ----------
  const guardarOdontograma = async () => {
    if (!pacienteSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Seleccione un paciente primero.",
      });
      return;
    }
    setLoading(true);

    const nuevaVersion = versiones.length > 0 ? Math.max(...versiones) + 1 : 1;

    const { error } = await supabase.from("odontogramas").insert([
      {
        paciente_id: pacienteSeleccionado,
        odontograma_data: odontograma,
        version: nuevaVersion,
      },
    ]);

    if (error) {
      console.error("Error al guardar odontograma:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el odontograma. Revisa la consola.",
      });
      setLoading(false);
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Guardado!",
      text: `Odontograma guardado correctamente (versión ${nuevaVersion})`,
    });

    // ----- Refrescar versiones -----
    const { data: versionesData, error: versionesError } = await supabase
      .from("odontogramas")
      .select("version")
      .eq("paciente_id", pacienteSeleccionado)
      .order("version", { ascending: false });

    let vers: number[] = [];
    if (versionesError)
      console.error("Error al recargar versiones:", versionesError);
    else if (versionesData) {
      vers = (versionesData as { version: number }[])
        .map((v) => v.version)
        .sort((a, b) => b - a);
      setVersiones(vers);
      setVersionSeleccionada(vers[0] || nuevaVersion);
    }

    // ----- Cargar automáticamente el odontograma de la última versión -----
    if (vers.length > 0) {
      const { data, error: odontError } = await supabase
        .from("odontogramas")
        .select("*")
        .eq("paciente_id", pacienteSeleccionado)
        .eq("version", vers[0])
        .single();

      if (odontError) console.error("Error al cargar odontograma:", odontError);
      else if (data) {
        const json = data.odontograma_data as Record<string, Diente>;
        setOdontograma(json);
        reconstruirBorderColors(json);
      }
    }

    setLoading(false);
  };

  // ---------- Nuevo odontograma (limpiar para nuevo registro) ----------
  const nuevoOdontograma = () => {
    if (!pacienteSeleccionado) return;
    setOdontograma({});
    setBorderColors({});
    const nuevaVersion = versiones.length > 0 ? Math.max(...versiones) + 1 : 1;
    setVersionSeleccionada(nuevaVersion);
  };

  // ---------- Export / Import JSON ----------
  // const handleExport = () => {
  //   const blob = new Blob([JSON.stringify(odontograma, null, 2)], {
  //     type: "application/json",
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "odontograma.json";
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  // const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     try {
  //       const json = JSON.parse(e.target?.result as string);
  //       setOdontograma(json);
  //       reconstruirBorderColors(json);
  //       alert("Odontograma importado correctamente");
  //     } catch {
  //       alert("Error al importar el archivo");
  //     }
  //   };
  //   reader.readAsText(file);
  // };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Odontograma Digital</h1>

      <div className="flex gap-4 flex-wrap">
        {/* Dropdown de pacientes */}
        <select
          value={pacienteSeleccionado}
          onChange={(e) => setPacienteSeleccionado(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">-- Seleccione Paciente --</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombres} {p.apellidos} ({p.numero_historia})
            </option>
          ))}
        </select>

        {/* Dropdown de versiones */}
        <select
          value={versionSeleccionada || ""}
          onChange={(e) => setVersionSeleccionada(Number(e.target.value))}
          className="border px-2 py-1"
        >
          <option value="">-- Seleccione Versión --</option>
          {versiones.map((v) => (
            <option key={v} value={v}>
              Versión {v}
            </option>
          ))}
        </select>

        {/* Botones */}
        <button
          onClick={guardarOdontograma}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
          disabled={!pacienteSeleccionado || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              {/* <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              > */}
              <Save className="w-4 h-4" />
              {/* </motion.div> */}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
            </span>
          )}
        </button>

        <button
          onClick={nuevoOdontograma}
          className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
          disabled={!pacienteSeleccionado || loading}
        >
          <FilePlus className="w-4 h-4" />
        </button>

        {/* <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Exportar JSON
        </button> */}

        {/* <input
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="border px-2 py-1"
        /> */}
      </div>

      {/* Odontograma */}
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

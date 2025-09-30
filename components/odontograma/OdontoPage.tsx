"use client";
import { useState } from "react";
import OdontogramaSVG from "./OdontogramaSVG";

type Zona = { zona: string; condicion: string; color: string };
type General = { condicion: string; icon: string };
type Diente = { zonas: Zona[]; generales: General[] };

export default function OdontoPage() {
  const [odontograma, setOdontograma] = useState<Record<string, Diente>>({});

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

  // Exportar como JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(odontograma, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "odontograma.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  //Importar desde JSON
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        if (typeof json !== "object" || Array.isArray(json)) {
          throw new Error("Formato inválido");
        }

        setOdontograma(json);
        console.log("Importado:", json);
        alert("Odontograma importado correctamente ✅");
      } catch {
        alert("Error al importar el archivo ❌");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Odontograma Digital</h1>

      {/* Botones */}
      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Exportar JSON
        </button>

        <input
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="border px-2 py-1"
        />
      </div>

      {/* Render Odontograma */}
      <OdontogramaSVG
        teethList={teethList}
        odontograma={odontograma}
        setOdontograma={setOdontograma} //
      />
    </div>
  );
}

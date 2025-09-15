"use client";
import React, { useMemo, useState } from "react";
import OdontogramaSVG from "@/components/odontograma/OdontogramaSVG";
import CondicionMenu, { type CondicionValue } from "@/components/odontograma/CondicionMenu";

export default function Odontograma() {
  const teethList = useMemo(
    () => [
      "18","17","16","15","14","13","12","11","21","22","23","24","25","26","27","28",
      "48","47","46","45","44","43","42","41","31","32","33","34","35","36","37","38",
    ],
    []
  );

  const [data, setData] = useState<Record<string, Record<string, CondicionValue | undefined>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [menuState, setMenuState] = useState<{
    toothId: string | null;
    part: string | null;
    x: number;
    y: number;
  } | null>(null);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);

  // ---------------- Handlers ----------------
  const handlePartClick = (toothId: string, part: string, x: number, y: number) => {
    setMenuState({ toothId, part, x, y });
  };

  const handleNumberClick = (toothId: string) => {
    setNotes((prev) => ({ ...prev, [toothId]: prev[toothId] ?? "" }));
    setSelectedTooth(toothId);
  };

  const handleSelectCondition = (val: CondicionValue) => {
    if (!menuState?.toothId || !menuState?.part) return;
    const tid = menuState.toothId;
    const part = menuState.part;
    setData((prev) => ({ ...prev, [tid]: { ...(prev[tid] ?? {}), [part]: val } }));
    setMenuState(null);
  };

  const handleDeletePart = () => {
    if (!menuState?.toothId || !menuState?.part) return;
    const tid = menuState.toothId;
    const part = menuState.part;
    setData((prev) => {
      const copy = { ...prev };
      if (copy[tid]) {
        const newParts = { ...copy[tid] };
        delete newParts[part];
        copy[tid] = newParts;
      }
      return copy;
    });
    setMenuState(null);
  };

  const handleCloseMenu = () => setMenuState(null);

  const handleNotesChange = (toothId: string, text: string) => {
    setNotes((prev) => ({ ...prev, [toothId]: text }));
  };

  // Exportar JSON
  const handleExport = () => {
    const payload = { data, notes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "odontograma.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === "string") {
          const json = JSON.parse(result);
          if (json.data && json.notes) {
            setData(json.data);
            setNotes(json.notes);
            alert("Odontograma cargado correctamente");
          } else {
            alert("Archivo JSON inválido");
          }
        }
      } catch (err) {
        console.error(err);
        alert("Error al leer el archivo");
      }
    };
    reader.readAsText(file);
  };

  // ---------------- Render ----------------
  return (
    <div className="p-6 bg-white text-slate-800 rounded-lg">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">Odontograma — Prototipo</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500"
          >
            Exportar JSON
          </button>

          <input
            type="file"
            accept="application/json"
            onChange={handleImportJSON}
            className="px-3 py-2 bg-yellow-200 text-yellow-800 rounded cursor-pointer"
          />

          <button
            onClick={() => { setData({}); setNotes({}); }}
            className="px-3 py-2 bg-red-50 text-red-600 border border-red-100 rounded hover:bg-red-100"
          >
            Limpiar
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex gap-6">
        <section className="flex-1 bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
          <OdontogramaSVG
            teethList={teethList}
            data={data}
            onPartClick={handlePartClick}
            //onNumberClick={handleNumberClick}
          />
        </section>
      </div>

      {menuState && menuState.toothId && menuState.part && (
        <CondicionMenu
          x={menuState.x}
          y={menuState.y}
          onSelect={handleSelectCondition}
          onDeletePart={handleDeletePart}
          onClose={handleCloseMenu}
        />
      )}
    </div>
  );
}

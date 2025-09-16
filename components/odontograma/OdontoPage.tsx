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

  // ---------------- Handlers ----------------
  const handlePartClick = (toothId: string, part: string, x: number, y: number) => {
    setMenuState({ toothId, part, x, y });
  };
  
  const handleNumberClick = (toothId: string) => {
    setNotes((prev) => ({ ...prev, [toothId]: prev[toothId] ?? "" }));
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
        {/*
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
        */}
      </header>
        
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Odontograma */}
        <section className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
          <OdontogramaSVG
            teethList={teethList}
            data={data}
            onPartClick={handlePartClick}
            onNumberClick={handleNumberClick}
          />
        </section>

        {/* Notas debajo */}
        <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Notas</h2>
          {Object.keys(notes).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(notes).map(([toothId, text]) => (
                <div key={toothId}>
                  <label
                    htmlFor={`note-${toothId}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Diente {toothId}
                  </label>
                  <textarea
                    id={`note-${toothId}`}
                    value={text}
                    onChange={(e) => handleNotesChange(toothId, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Haz clic en el número de un diente para agregar una nota.
            </p>
          )}
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

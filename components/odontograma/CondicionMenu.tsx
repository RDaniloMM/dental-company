"use client";
import React, { useState } from "react";

interface CondicionMenuProps {
  toothId: string;
  selectedCondition: string | null; // <-- agregar
  selectedColor: "red" | "blue" | null;
  selectedZone: string | null;
  setSelectedCondition: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedColor: (c: "red" | "blue") => void;
  setZoneColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  updateTooth: (
    toothId: string,
    data: {
      zonas?: { zona: string; condicion: string; color: string }[];
      generales?: { condicion: string; icon: string }[];
    }
  ) => void;
  onClose: () => void;
}

const condiciones = [
  "Aparato ortodóntico fijo",
  "Aparato ortodóntico removible",
  "Corona",
  "Corona temporal",
  "Defectos de desarrollo del esmalte (DDE)",
  "Diastema",
  "Edéntulo total superior/inferior",
  "Espigomuñón",
  "Fosas y fisuras profundas",
  "Fractura dental",
  "Fusión",
  "Geminación",
  "Giroversión",
  "Impactación",
  "Implante dental",
  "Lesión de caries dental",
  "Macrodoncia",
  "Microdoncia",
  "Movilidad patológica",
  "Pieza dentaria ausente",
  "Pieza dentaria en clavija",
  "Pieza dentaria ectópica",
  "Pieza dentaria en erupción",
  "Pieza dentaria extruida",
  "Pieza dentaria intruida",
  "Pieza dentaria supernumeraria",
  "Pulpotomía",
  "Posición anormal dentaria",
  "Prótesis dental parcial fija",
  "Prótesis dental completa superior/inferior",
  "Prótesis dental parcial removible",
  "Remanente radicular",
  "Restauración definitiva",
  "Restauración temporal",
  "Sellantes",
  "Superficie desgastada",
  "Tratamiento de conducto (TC) / Pulpectomía (PC)",
  "Transposición dentaria",
];

export default function CondicionMenu({
  toothId,
  selectedColor,
  selectedZone,
  setSelectedColor,
  setZoneColors,
  updateTooth,
  onClose,
}: CondicionMenuProps) {
  const [selectedCondicion, setSelectedCondicion] = useState<string | null>(
    null
  );

  const handleColorSelect = (color: "red" | "blue") => {
    if (!selectedZone) {
      alert("Selecciona primero una zona del diente.");
      return;
    }

    setSelectedColor(color);

    const key = `${toothId}_${selectedZone}`;

    setZoneColors((prev) => ({
      ...prev,
      [key]: color,
    }));

    // <-- Mostrar en consola
    console.log(
      `Diente: ${toothId}, Zona: ${selectedZone}, Color seleccionado: ${color}`
    );
  };

  const handleSave = () => {
    if (!selectedCondicion) {
      alert("Debes seleccionar una condición.");
      return;
    }

    if (selectedZone && selectedColor) {
      // Guardar en zonas
      updateTooth(toothId, {
        zonas: [
          {
            zona: selectedZone,
            condicion: selectedCondicion,
            color: selectedColor,
          },
        ],
      });
    } else {
      // Guardar en generales (sin color → icon)
      updateTooth(toothId, {
        generales: [
          {
            condicion: selectedCondicion,
            icon: `${selectedCondicion.toLowerCase().replace(/\s+/g, "_")}.svg`,
          },
        ],
      });
    }

    console.log("Guardado en JSON");
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold text-blue-700 p-4 border-b sticky top-0 bg-white z-10">
        Condición del diente {toothId}
      </h2>

      {/* Lista scrollable */}
      {!selectedCondicion ? (
        <ul className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-2">
          {condiciones.map((c) => (
            <li
              key={c}
              className="p-2 border rounded-lg cursor-pointer hover:bg-blue-100 text-sm"
              onClick={() => setSelectedCondicion(c)}
            >
              {c}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
          <p className="text-sm text-gray-700">
            {`Elige un color para "${selectedCondicion}"`}
          </p>
          <div className="flex gap-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleColorSelect("red")}
            >
              Rojo
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleColorSelect("blue")}
            >
              Azul
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setSelectedCondicion(null)}
            >
              Volver a condiciones
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
              onClick={handleSave}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState } from "react";

interface CondicionMenuProps {
  toothId: string;
  selectedCondition: string | null;
  selectedColor: "red" | "blue" | null;
  selectedZone: string | null;
  setSelectedCondition: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedColor: (c: "red" | "blue") => void;
  setZoneColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  updateTooth: (
    toothId: string,
    data: {
      zonas?: { zona: string; condicion: string; color: string }[];
      generales?: { condicion: string; icon: string; label?: string }[];
    }
  ) => void;
  onClose: () => void;
}

// --- Lista completa de condiciones ---
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

// --- Solo estas condiciones estarán habilitadas ---
const habilitadas = [
  "Aparato ortodóntico fijo",
  "Aparato ortodóntico removible",
  "Corona",
    "Corona temporal",

];

// --- Dientes superiores e inferiores ---
const dientesSuperiores = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];
const dientesInferiores = [
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

// --- Opciones específicas de Corona ---
const opcionesCorona = ["CM", "CF", "CMC", "CV", "CLM"];

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
  const [, setSelectedCoronaOption] = useState<string | null>(null);
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [rangeEnd, setRangeEnd] = useState<string>("");

  const esDienteSuperior = dientesSuperiores.includes(Number(toothId));
  const dientesParaMostrar = esDienteSuperior
    ? dientesSuperiores
    : dientesInferiores;

  // --- Selección de color u opción ---
  const handleSelect = (value: string) => {
    if (selectedCondicion === "Corona") {
      setSelectedCoronaOption(value);
      updateTooth(toothId, {
        generales: [
          {
            condicion: "Corona",
            icon: `${value.replace(":", "").toLowerCase()}.svg`,
            label: value,
          },
        ],
      });
      console.log(`Diente ${toothId} - Corona opción: ${value}`);
      onClose();
      return;
    }

    setSelectedColor(value as "red" | "blue");

    if (
      selectedCondicion === "Aparato ortodóntico fijo" ||
      selectedCondicion === "Aparato ortodóntico removible"
    ) {
      setShowRangeModal(true);
      return;
    }

    if (!selectedZone) {
      alert("Selecciona primero una zona del diente.");
      return;
    }

    const key = `${toothId}_${selectedZone}`;
    setZoneColors((prev) => ({
      ...prev,
      [key]: value as "red" | "blue",
    }));

    console.log(
      `Diente: ${toothId}, Condición: ${selectedCondicion}, Color: ${value}`
    );
  };

  const handleSave = () => {
    if (!selectedCondicion) {
      alert("Debes seleccionar una condición.");
      return;
    }

    if (
      selectedCondicion === "Aparato ortodóntico fijo" ||
      selectedCondicion === "Aparato ortodóntico removible"
    ) {
      return;
    }

    if (selectedZone && selectedColor) {
      updateTooth(toothId, {
        zonas: [
          {
            zona: selectedZone,
            condicion: selectedCondicion,
            color: selectedColor,
          },
        ],
      });
    } else if (selectedCondicion !== "Corona") {
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

  const handleSaveRange = () => {
    if (!rangeEnd) {
      alert("Debes seleccionar el diente final.");
      return;
    }

    const isRemovible = selectedCondicion === "Aparato ortodóntico removible";

    updateTooth(toothId, {
      generales: [
        {
          condicion: `${selectedCondicion} - inicio`,
          icon: isRemovible
            ? `aparato_remo_inicio_${selectedColor}.svg`
            : `aparato_inicio_${selectedColor}.svg`,
        },
      ],
    });

    updateTooth(rangeEnd, {
      generales: [
        {
          condicion: `${selectedCondicion} - fin`,
          icon: isRemovible
            ? `aparato_remo_fin_${selectedColor}.svg`
            : `aparato_fin_${selectedColor}.svg`,
        },
      ],
    });

    const lineIcon = isRemovible
      ? `doble_${toothId}_${rangeEnd}_${selectedColor}`
      : `linea_${toothId}_${rangeEnd}_${selectedColor}`;

    updateTooth(toothId, {
      generales: [
        {
          condicion: `Linea ${selectedCondicion}`,
          icon: lineIcon,
        },
      ],
    });

    console.log(
      `Guardado ${selectedCondicion} desde ${toothId} hasta ${rangeEnd} en color ${selectedColor}`
    );

    setShowRangeModal(false);
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold text-blue-700 p-4 border-b sticky top-0 bg-white z-10">
        Condición del diente {toothId}
      </h2>

      {!selectedCondicion ? (
        <ul className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-2">
          {condiciones.map((c) => (
            <li
              key={c}
              className={`p-2 border rounded-lg text-sm ${
                habilitadas.includes(c)
                  ? "cursor-pointer hover:bg-blue-100"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => habilitadas.includes(c) && setSelectedCondicion(c)}
            >
              {c}
            </li>
          ))}
        </ul>
      ) : selectedCondicion === "Corona" ? (
        <div className="flex flex-col items-center gap-4 p-4">
          <p className="text-sm text-gray-700">Selecciona tipo de corona:</p>
          <div className="flex flex-col gap-2">
            {opcionesCorona.map((opt) => (
              <button
                key={opt}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
            onClick={() => setSelectedCondicion(null)}
          >
            Volver a condiciones
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
          <p className="text-sm text-gray-700">
            {`Elige un color para "${selectedCondicion}"`}
          </p>
          <div className="flex gap-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleSelect("red")}
            >
              Rojo
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleSelect("blue")}
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

      {/* Modal de rango */}
      {showRangeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center">
              Selecciona el diente final
            </h3>

            <div className="flex gap-2 overflow-x-auto py-1 px-1">
              {dientesParaMostrar.map((diente) => (
                <button
                  key={diente}
                  className={`px-3 py-2 border rounded ${
                    rangeEnd === `${diente}`
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setRangeEnd(`${diente}`)}
                >
                  {diente}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 bg-gray-400 text-white py-2 rounded"
                onClick={() => setShowRangeModal(false)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 bg-blue-600 text-white py-2 rounded"
                onClick={handleSaveRange}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState } from "react";
import type { CondicionValue } from "./CondicionMenu";

// --- Props del Odontograma principal ---
interface Props {
  teethList: string[];
  data: Record<string, Record<string, CondicionValue | undefined>>;
  onPartClick: (toothId: string, part: string, x: number, y: number) => void;
  onNumberClick?: (toothId: string) => void;
}

// --- Se define un tipo para las props que reciben los componentes de dientes ---
interface ToothComponentProps {
  toothId: string;
  data: Record<string, CondicionValue | undefined>;
  onPartClick: (toothId: string, part: string, x: number, y: number) => void;
  onNumberClick: () => void;
}


const Molar: React.FC<ToothComponentProps> = ({ toothId }) => (
  <div className="text-center">
    <svg width="40" height="40" viewBox="0 0 120 120">
      <rect x="10" y="10" width="100" height="100" rx="15" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="2" />
    </svg>
    <span className="text-xs font-semibold">{toothId}</span>
  </div>
);

const Premolar: React.FC<ToothComponentProps> = ({ toothId }) => (
    <div className="text-center">
    <svg width="40" height="40" viewBox="0 0 120 120">
      <rect x="20" y="10" width="80" height="100" rx="15" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="2" />
    </svg>
    <span className="text-xs font-semibold">{toothId}</span>
  </div>
);

const Canino: React.FC<ToothComponentProps> = ({ toothId }) => (
    <div className="text-center">
    <svg width="40" height="40" viewBox="0 0 120 120">
      <polygon points="60,10 110,60 60,110 10,60" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="2" />
    </svg>
    <span className="text-xs font-semibold">{toothId}</span>
  </div>
);

const Incisivo: React.FC<ToothComponentProps> = ({ toothId }) => (
    <div className="text-center">
    <svg width="40" height="40" viewBox="0 0 120 120">
      <rect x="30" y="10" width="60" height="100" rx="10" fill="#E0E0E0" stroke="#BDBDBD" strokeWidth="2" />
    </svg>
    <span className="text-xs font-semibold">{toothId}</span>
  </div>
);


const ToothTypeMap: Record<string, React.FC<ToothComponentProps>> = {
  molar: Molar,
  premolar: Premolar,
  canino: Canino,
  incisivo: Incisivo,
};

// Función para determinar el tipo de diente basado en su ID
function getToothType(toothId: string): keyof typeof ToothTypeMap {
  if (["16","17","18","26","27","28","36","37","38","46","47","48"].includes(toothId)) return "molar";
  if (["15","25","34","35","44","45"].includes(toothId)) return "premolar";
  if (["14","24"].includes(toothId)) return "canino";
  if (["11","12","13","21","22","23","31","32","33","41","42","43"].includes(toothId)) return "incisivo";
  return "molar"; // Valor por defecto
}


export default function OdontogramaSVG({ teethList, data, onPartClick, onNumberClick, }: Props) {
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);

  const top = teethList.slice(0, 16);
  const bottom = teethList.slice(16, 32);

  const renderTooth = (id: string) => {
    const ToothComponent = ToothTypeMap[getToothType(id)];
    return (
      <button
        key={id}
        onClick={() => setSelectedTooth(id)}
        className="p-2 rounded-md hover:bg-blue-50 transition cursor-pointer flex flex-col items-center"
      >
        <ToothComponent
          toothId={id}
          data={data[id] || {}}
          onPartClick={() => {}}
          onNumberClick={() => onNumberClick?.(id)}
        />
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* fila superior */}
      <div className="flex flex-wrap gap-2 items-center justify-center">{top.map(renderTooth)}</div>
      {/* fila inferior */}
      <div className="flex flex-wrap gap-2 items-center justify-center">{bottom.map(renderTooth)}</div>

      {/* Modal */}
      {selectedTooth && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedTooth(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-xl p-6 w-[420px] max-h-[90vh] flex flex-col items-center overflow-auto border border-gray-200 animate-in scale-100 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">
              Diente {selectedTooth}
            </h2>

            <div className="flex justify-center items-center w-full bg-blue-50 p-4 rounded-xl">
              {/* Se asegura que selectedTooth no sea nulo antes de renderizar */}
              {(() => {
                const ToothComponent = ToothTypeMap[getToothType(selectedTooth)];
                return (
                  <div style={{ width: "220px", height: "auto" }}>
                    <ToothComponent
                      toothId={selectedTooth}
                      data={data[selectedTooth] || {}}
                      // En el modal, sí se pasa la función onPartClick real
                      onPartClick={onPartClick}
                      onNumberClick={() => {}}
                    />
                  </div>
                );
              })()}
            </div>

            <p className="text-center text-gray-600 mt-4">
              Haz click en una zona del diente para asignar condición.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


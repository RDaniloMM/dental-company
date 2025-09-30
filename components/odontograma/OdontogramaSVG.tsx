"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Actions (componentes clickeables)
import MolarAction from "./Actions/Molar-actions";
import PremolarAction from "./Actions/Premolar-actions";
import CaninoAction from "./Actions/Canino-actions";
import CaninoActiond from "./Actions/Canino-actions-d";
import IncisivoAction from "./Actions/Incisivo-actions";

import CondicionMenu from "./CondicionMenu";

// ---------- Tipos ----------
interface ToothData {
  zonas: { zona: string; condicion: string; color: string }[];
  generales: { condicion: string; icon: string; label?: string }[];
}

interface Props {
  teethList: string[];
  odontograma: Record<string, ToothData>;
  setOdontograma: React.Dispatch<
    React.SetStateAction<Record<string, ToothData>>
  >;
}

interface ToothInputProps {
  width?: number;
  height?: number;
  marginBottom?: number;
  marginTop?: number;
  value?: string; // valor dinámico
  onChange?: (v: string) => void; // función para actualizarlo si se desea editable
}

// ---------- Input de diente ----------
function ToothInput({
  width = 40,
  height = 20,
  marginBottom = 4,
  marginTop = 0,
  value = "",
  onChange,
}: ToothInputProps) {
  return (
    <input
      type="text"
      value={value}
      readOnly={!onChange} // si no hay onChange, lo dejamos solo lectura
      onChange={(e) => onChange && onChange(e.target.value)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        border: "1px solid #aaa",
        fontSize: "15px",
        fontWeight: "Bold",
        marginBottom,
        marginTop,
        outline: "none",
        cursor: onChange ? "text" : "default",
      }}
    />
  );
}

// ---------- Mapeo de tipos de dientes ----------
const ActionsTypeMap: Record<
  string,
  React.FC<{
    toothId: string;
    onZoneSelect: (zone: string) => void;
    zoneColors: Record<string, string>;
    disabled?: boolean;
  }>
> = {
  molar: MolarAction,
  premolar: PremolarAction,
  canino: CaninoAction,
  caninod: CaninoActiond,
  incisivo: IncisivoAction,
};

// ---------- Función para obtener tipo de diente ----------
function getToothType(toothId: string): string {
  if (
    [
      "16",
      "17",
      "18",
      "26",
      "27",
      "28",
      "36",
      "37",
      "38",
      "46",
      "47",
      "48",
    ].includes(toothId)
  )
    return "molar";
  if (["15", "25", "34", "35", "44", "45"].includes(toothId)) return "premolar";
  if (["14"].includes(toothId)) return "canino";
  if (["24"].includes(toothId)) return "caninod";
  if (
    [
      "11",
      "12",
      "13",
      "21",
      "22",
      "23",
      "31",
      "32",
      "33",
      "41",
      "42",
      "43",
    ].includes(toothId)
  )
    return "incisivo";
  return "molar";
}

// 🔹 Función para renderizar condiciones

const renderCondicion = (condicion: string, icon: string, toothId: string) => {
  void toothId;
  if (icon.startsWith("linea_")) return null; // líneas las manejamos globalmente
  
  return (
    <Image
      key={icon}
      src={`/icons/${icon}`}
      alt={condicion}
      width={24}       // ajusta según tu diseño
      height={24}      // ajusta según tu diseño
      className="absolute"
      
    />
  );
};


// ---------- Componente principal ----------
export default function OdontogramaSVG({
  teethList,
  odontograma,
  setOdontograma,
}: Props) {
  const [selectedTooth, setSelectedTooth] = useState<{
    id: string;
    isTop: boolean;
  } | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<"red" | "blue" | null>(
    null
  );
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const [zoneColors, setZoneColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newZoneColors: Record<string, string> = {};
    Object.entries(odontograma).forEach(([toothId, toothData]) => {
      toothData.zonas.forEach((zona) => {
        newZoneColors[`${toothId}_${zona.zona}`] = zona.color;
      });
    });
    setZoneColors(newZoneColors);
  }, [odontograma]);

  const updateTooth = (toothId: string, data: Partial<ToothData>) => {
    setOdontograma((prev) => ({
      ...prev,
      [toothId]: {
        zonas: [...(prev[toothId]?.zonas || []), ...(data.zonas || [])],
        generales: [
          ...(prev[toothId]?.generales || []),
          ...(data.generales || []),
        ],
      },
    }));
  };

  const topTeeth = teethList.slice(0, 16);
  const bottomTeeth = teethList.slice(16, 32);
  const lineOffsetY = 10; // sube las lineas simples
  const dobleOffsetY = -20; // sube los zigzags dobles

  // ---------- Renderizado de cada diente ----------
  const renderTooth = (id: string, isTop: boolean) => {
    const ToothComponent = ActionsTypeMap[getToothType(id)];

    const coronaLabel =
      odontograma[id]?.generales?.find((g) => g.condicion === "Corona")
        ?.label || "";

    return (
      <motion.div
        key={id}
        id={`tooth-${id}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "2px solid #ccc",
          borderRadius: "8px",
          padding: 2,
          cursor: "pointer",
        }}
        whileHover={{
          scale: 1.1,
          borderColor: "#3b82f6",
          backgroundColor: "#bfdbfe",
        }}
        transition={{ duration: 0.2 }}
        onClick={() => setSelectedTooth({ id, isTop })}
      >
        {isTop ? (
          <>
            <ToothInput
              width={50}
              height={50}
              marginBottom={4}
              value={coronaLabel}
            />
            <button
              style={{
                background: "transparent",
                border: "none",
                fontWeight: "bold",
              }}
            >
              {id}
            </button>
            <div style={{ transform: "rotate(0deg)" }}>
              <ToothComponent
                toothId={id}
                zoneColors={zoneColors}
                onZoneSelect={(zone) => setSelectedZone(zone)}
                disabled
              />
            </div>
            <div className="relative">
              {odontograma[id]?.generales?.map((g) =>
                renderCondicion(g.condicion, g.icon, id)
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ transform: "rotate(180deg)" }}>
              <ToothComponent
                toothId={id}
                zoneColors={zoneColors}
                onZoneSelect={(zone) => setSelectedZone(zone)}
                disabled
              />
            </div>
            <button
              style={{
                background: "transparent",
                border: "none",
                fontWeight: "bold",
              }}
            >
              {id}
            </button>
            <ToothInput
              width={50}
              height={50}
              marginTop={4}
              value={coronaLabel}
            />
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative flex flex-col items-center gap-5 p-4 odontograma-container">
      {/* Dientes superiores */}
      <div className="flex gap-1">
        {topTeeth.map((id) => renderTooth(id, true))}
      </div>

      {/* Dientes inferiores */}
      <div className="flex gap-1">
        {bottomTeeth.map((id) => renderTooth(id, false))}
      </div>

      {/* 🔹 Overlay SVG para las líneas */}

      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* 🔹 Líneas simples (linea_) */}
        {Object.entries(odontograma).flatMap(([toothId, toothData]) =>
          toothData.generales
            .filter((g) => g.icon.startsWith("linea_"))
            .map((g, idx) => {
              void toothId;
              const parts = g.icon.split("_");
              const start = parts[1];
              const end = parts[2];
              const color = parts[3];

              const startEl = document.getElementById(`tooth-${start}`);
              const endEl = document.getElementById(`tooth-${end}`);
              const containerEl = document
                .querySelector(".odontograma-container")
                ?.getBoundingClientRect();

              if (!startEl || !endEl || !containerEl) return null;

              const startBox = startEl.getBoundingClientRect();
              const endBox = endEl.getBoundingClientRect();

              const x1 = startBox.left - containerEl.left;
              const x2 = endBox.right - containerEl.left;
              const y1 =
                startBox.top +
                startBox.height / 2 +
                lineOffsetY -
                containerEl.top;
              const y2 =
                endBox.top + endBox.height / 2 + lineOffsetY - containerEl.top;

              const line = (
                <line
                  key={`linea-${start}-${end}-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={2}
                />
              );

              const size = 8;
              const half = size / 2;
              const plusOffset = 2;

              const startSquare = (
                <g key={`start-square-${start}-${end}-${idx}`}>
                  <rect
                    x={x1 - half}
                    y={y1 - half}
                    width={size}
                    height={size}
                    fill="white"
                    stroke={color}
                    strokeWidth={1}
                  />
                  <line
                    x1={x1 - half + plusOffset}
                    y1={y1}
                    x2={x1 + half - plusOffset}
                    y2={y1}
                    stroke={color}
                    strokeWidth={1}
                  />
                  <line
                    x1={x1}
                    y1={y1 - half + plusOffset}
                    x2={x1}
                    y2={y1 + half - plusOffset}
                    stroke={color}
                    strokeWidth={1}
                  />
                </g>
              );

              const endSquare = (
                <g key={`end-square-${start}-${end}-${idx}`}>
                  <rect
                    x={x2 - half}
                    y={y2 - half}
                    width={size}
                    height={size}
                    fill="white"
                    stroke={color}
                    strokeWidth={1}
                  />
                  <line
                    x1={x2 - half + plusOffset}
                    y1={y2}
                    x2={x2 + half - plusOffset}
                    y2={y2}
                    stroke={color}
                    strokeWidth={1}
                  />
                  <line
                    x1={x2}
                    y1={y2 - half + plusOffset}
                    x2={x2}
                    y2={y2 + half - plusOffset}
                    stroke={color}
                    strokeWidth={1}
                  />
                </g>
              );

              return [line, startSquare, endSquare];
            })
        )}

{/* 🔹 Zigzags dobles (doble_) */}
{Object.entries(odontograma).flatMap(([toothId, toothData]) =>
  toothData.generales
  
    .filter((g) => g.icon.startsWith("doble_"))
    .map((g, idx) => {
      void toothId;
      const parts = g.icon.split("_");
      const start = parts[1];
      const end = parts[2];
      const color = parts[3];

      const startEl = document.getElementById(`tooth-${start}`);
      const endEl = document.getElementById(`tooth-${end}`);
      const containerEl = document
        .querySelector(".odontograma-container")
        ?.getBoundingClientRect();

      if (!startEl || !endEl || !containerEl) return null;

      const startBox = startEl.getBoundingClientRect();
      const endBox = endEl.getBoundingClientRect();

      const x1 = startBox.left - containerEl.left;
      const x2 = endBox.right - containerEl.left;
      const y1 = startBox.top + startBox.height / 2 + dobleOffsetY - containerEl.top;

      // --- Dientes superiores para invertir zigzag ---
      const dientesSuperiores = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
      const esDienteSuperior = dientesSuperiores.includes(Number(start));

      const teethOrder = [
        "18","17","16","15","14","13","12","11",
        "21","22","23","24","25","26","27","28",
        "48","47","46","45","44","43","42","41",
        "31","32","33","34","35","36","37","38"
      ];

      const startIndex = teethOrder.indexOf(start);
      const endIndex = teethOrder.indexOf(end);
      const numDientes = Math.abs(endIndex - startIndex) + 1;
      const segments = numDientes * 2; // 2 picos por diente
      const amplitude = 7;
      const points: string[] = [];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const xi = x1 + (x2 - x1) * t;
        const yi = y1 + (i % 2 === 0 ? -1 : 1) * amplitude * (esDienteSuperior ? -1 : 1);
        points.push(`${xi},${yi}`);
      }

      const pathData = `M ${points.join(" L ")}`;
      return (
        <path
          key={`zigzag-${start}-${end}-${idx}`}
          d={pathData}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
      );
    })
)}

      </svg>

      <AnimatePresence>
        {selectedTooth && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedTooth(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-6 max-w-[800px] w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">
                Diente {selectedTooth.id}
              </h2>
              <div className="flex w-full gap-4">
                <div className="flex-1 flex flex-col justify-center items-center bg-blue-50 p-4 rounded-xl">
                  {(() => {
                    const ActionComponent =
                      ActionsTypeMap[getToothType(selectedTooth.id)];
                    return (
                      <>
                        {selectedTooth.isTop && (
                          <ToothInput
                            width={100}
                            height={100}
                            marginBottom={6}
                            value={
                              odontograma[selectedTooth.id]?.generales?.find(
                                (g) => g.condicion === "Corona"
                              )?.label || ""
                            }
                          />
                        )}
                        <div
                          style={{
                            width: "220px",
                            transform: selectedTooth.isTop
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                          }}
                        >
                          <ActionComponent
                            toothId={selectedTooth.id}
                            onZoneSelect={(zone: string) =>
                              setSelectedZone(zone)
                            }
                            zoneColors={zoneColors}
                          />
                        </div>
                        {!selectedTooth.isTop && (
                          <ToothInput
                            width={100}
                            height={100}
                            marginTop={6}
                            value={
                              odontograma[selectedTooth.id]?.generales?.find(
                                (g) => g.condicion === "Corona"
                              )?.label || ""
                            }
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
                <div className="flex-1 overflow-y-auto max-h-[65vh] p-2 border-l border-gray-200">
                  <CondicionMenu
                    toothId={selectedTooth.id}
                    selectedCondition={selectedCondition}
                    selectedColor={selectedColor}
                    selectedZone={selectedZone}
                    setSelectedCondition={setSelectedCondition}
                    setSelectedColor={setSelectedColor}
                    setZoneColors={setZoneColors}
                    updateTooth={updateTooth}
                    onClose={() => {
                      setSelectedTooth(null);
                      setSelectedZone(null);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

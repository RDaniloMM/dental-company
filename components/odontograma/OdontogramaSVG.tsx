"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  generales: { condicion: string; icon: string }[];
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
}

// ---------- Input de diente ----------
function ToothInput({
  width = 40,
  height = 20,
  marginBottom = 4,
  marginTop = 0,
}: ToothInputProps) {
  return (
    <input
      type="text"
      value=""
      readOnly
      style={{
        width: `${width}px`,
        height: `${height}px`,
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        border: "1px solid #aaa",
        fontSize: "10px",
        marginBottom,
        marginTop,
        outline: "none",
        cursor: "default",
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

  // zoneColors se sincroniza con el odontograma
  const [zoneColors, setZoneColors] = useState<Record<string, string>>({});

  // ---------- Sincronizar zoneColors con odontograma (importación o actualización) ----------
  useEffect(() => {
    const newZoneColors: Record<string, string> = {};
    Object.entries(odontograma).forEach(([toothId, toothData]) => {
      toothData.zonas.forEach((zona) => {
        const key = `${toothId}_${zona.zona}`;
        newZoneColors[key] = zona.color;
      });
    });
    setZoneColors(newZoneColors);
  }, [odontograma]);

  // ---------- Función para actualizar un diente ----------
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

  // ---------- Renderizado de cada diente ----------
  const renderTooth = (id: string, isTop: boolean) => {
    const ToothComponent = ActionsTypeMap[getToothType(id)];

    return (
      <motion.div
        key={id}
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
            <ToothInput width={50} height={50} marginBottom={4} />
            <button
              style={{
                width: "30px",
                height: "20px",
                backgroundColor: "transparent",
                border: "none",
                color: "black",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
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
                width: "30px",
                height: "20px",
                backgroundColor: "transparent",
                border: "none",
                color: "black",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              {id}
            </button>
            <ToothInput width={50} height={50} marginTop={4} />
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      {/* Dientes superiores */}
      <div className="flex gap-1">
        {topTeeth.map((id) => renderTooth(id, true))}
      </div>

      {/* Dientes inferiores */}
      <div className="flex gap-1">
        {bottomTeeth.map((id) => renderTooth(id, false))}
      </div>

      {/* Modal */}
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
                {/* Columna izquierda: ActionComponent */}
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
                          />
                        )}
                        <div
                          style={{
                            width: "220px",
                            height: "auto",
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
                          <ToothInput width={100} height={100} marginTop={6} />
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Columna derecha: CondicionMenu */}
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

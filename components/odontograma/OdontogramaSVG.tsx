"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ToothCard from "./ToothCard";
import CondicionMenu from "./CondicionMenu";
import {
  renderAOF,
  renderAOR,
  renderPDCS,
  renderPDPR,
  renderETSI,
  renderDiastema,
  renderFusion,
  renderGeminacion,
  renderGiroversion,
  renderPiezaAusente,
  renderPiezaClavija,
  renderPiezaErupcion,
  renderPiezaExtruida,
  renderPiezaIntruida,
  renderTransposicion,
  renderProtesisParcialFija,
} from "./renderLines";

interface ToothData {
  zonas: { zona: string; condicion: string; color: string }[];
  generales: {
    condicion: string;
    icon: string;
    label?: string;
    color?: string;
  }[];
}

interface Props {
  teethList: string[];
  odontograma: Record<string, ToothData>;
  setOdontograma: React.Dispatch<
    React.SetStateAction<Record<string, ToothData>>
  >;
  borderColors: Record<string, string>;
  setBorderColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

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
  const [borderColors, setBorderColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newZoneColors: Record<string, string> = {};
    const newBorderColors: Record<string, string> = {};

    Object.entries(odontograma).forEach(([toothId, toothData]) => {
      toothData.zonas.forEach((zona) => {
        newZoneColors[`${toothId}_${zona.zona}`] = zona.color;
      });

      toothData.generales.forEach((gen) => {
        if (gen.color) {
          if (gen.condicion.includes("Corona")) {
            newZoneColors[`${toothId}_corona`] = gen.color;
            newBorderColors[toothId] = gen.color;
          }
        }
      });
    });

    setZoneColors(newZoneColors);
    setBorderColors(newBorderColors);
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

  return (
    <div className="relative flex flex-col items-center gap-5 p-4 odontograma-container">
      <div className="flex gap-1">
        {topTeeth.map((id) => (
          <ToothCard
            key={id}
            id={id}
            isTop
            odontograma={odontograma}
            zoneColors={zoneColors}
            setSelectedTooth={setSelectedTooth}
            onZoneSelect={(zone) => setSelectedZone(zone)}
            borderColor={"#ccc"}
          />
        ))}
      </div>
      <div className="flex gap-1">
        {bottomTeeth.map((id) => (
          <ToothCard
            key={id}
            id={id}
            isTop={false}
            odontograma={odontograma}
            zoneColors={zoneColors}
            setSelectedTooth={setSelectedTooth}
            onZoneSelect={(zone) => setSelectedZone(zone)}
            borderColor={borderColors[id] || "#ccc"}
          />
        ))}
      </div>

      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {renderAOF(odontograma)}
        {renderAOR(odontograma)}
        {renderPDCS(odontograma)}
        {renderPDPR(odontograma)}
        {renderETSI(odontograma)}
        {renderDiastema(odontograma)}
        {renderFusion(odontograma)}
        {renderGeminacion(odontograma)}
        {renderGiroversion(odontograma)}
        {renderPiezaAusente(odontograma)}
        {renderPiezaClavija(odontograma)}
        {renderPiezaErupcion(odontograma)}
        {renderPiezaExtruida(odontograma)}
        {renderPiezaIntruida(odontograma)}
        {renderTransposicion(odontograma)}
        {renderProtesisParcialFija(odontograma)}
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
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">
                Diente {selectedTooth.id}
              </h2>

              <div className="flex w-full gap-4">
                <div className="flex-1 flex flex-col justify-center items-center bg-blue-50 p-4 rounded-xl">
                  <ToothCard
                    id={selectedTooth.id}
                    isTop={selectedTooth.isTop}
                    odontograma={odontograma}
                    zoneColors={zoneColors}
                    setSelectedTooth={() => {}}
                    onZoneSelect={(zone) => setSelectedZone(zone)}
                    borderColor={borderColors[selectedTooth.id] || "#ccc"}
                  />
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
                    setBorderColors={setBorderColors}
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

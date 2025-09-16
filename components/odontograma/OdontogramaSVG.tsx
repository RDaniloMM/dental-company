"use client";
import Molar from "./Teeth/Molar";
import Premolar from "./Teeth/Premolar";
import Canino from "./Teeth/Canino";
import Incisivo from "./Teeth/Incisivo";
import type { CondicionValue } from "./CondicionMenu";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  teethList: string[];
  data: Record<string, Record<string, CondicionValue | undefined>>;
  onPartClick: (toothId: string, part: string, x: number, y: number) => void;
  onNumberClick: (toothId: string) => void;
}

type ToothComponentType = React.FC<{
  toothId: string;
  data: Record<string, CondicionValue | undefined>;
  onPartClick: (toothId: string, part: string, x: number, y: number) => void;
  onNumberClick: () => void;
}>;

const ToothTypeMap: Record<string, ToothComponentType> = {
  molar: Molar,
  premolar: Premolar,
  canino: Canino,
  incisivo: Incisivo,
};

function getToothType(toothId: string): string {
  if (
    ["16", "17", "18", "26", "27", "28", "36", "37", "38", "46", "47", "48"].includes(toothId)
  )
    return "molar";
  if (["15", "25", "34", "35", "44", "45"].includes(toothId)) return "premolar";
  if (["14", "24"].includes(toothId)) return "canino";
  if (
    ["11", "12", "13", "21", "22", "23", "31", "32", "33", "41", "42", "43"].includes(toothId)
  )
    return "incisivo";
  return "molar";
}

export default function OdontogramaSVG({
  teethList,
  data,
  onPartClick,
  onNumberClick, // ✅ agregado aquí
}: Props) {
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (selectedTooth) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflowY = "scroll";
    } else {
      const y = scrollYRef.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, y);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflowY = "";
    };
  }, [selectedTooth]);

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
          onNumberClick={() => onNumberClick(id)} // ✅ ahora usa la prop recibida
        />
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex gap-2 items-center">{top.map(renderTooth)}</div>
      <div className="flex gap-2 items-center">{bottom.map(renderTooth)}</div>

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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-3xl shadow-xl p-6 w-[420px] max-h-[90vh] flex flex-col items-center overflow-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">
                Diente {selectedTooth}
              </h2>

              <div className="flex justify-center items-center w-full bg-blue-50 p-4 rounded-xl">
                {selectedTooth && (() => {
                  const ToothComponent = ToothTypeMap[getToothType(selectedTooth)];
                  return (
                    <div style={{ width: "220px", height: "auto" }}>
                      <ToothComponent
                        toothId={selectedTooth}
                        data={data[selectedTooth] || {}}
                        onPartClick={onPartClick}
                        onNumberClick={() => onNumberClick(selectedTooth)} // ✅ corregido también aquí
                      />
                    </div>
                  );
                })()}
              </div>

              <p className="text-center text-gray-600 mt-4">
                Haz click en una zona del diente para asignar condición.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

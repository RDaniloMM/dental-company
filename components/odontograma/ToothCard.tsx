// components/odontograma/ToothCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ActionsTypeMap, getToothType } from "./dientes";

// ---------- Tipos ----------
export interface ToothGeneral {
  condicion?: string;
  icon?: string;
  label?: string;
  color?: "red" | "blue" | string;
}

export interface ToothData {
  zonas: { zona: string; condicion: string; color: string }[];
  generales: ToothGeneral[];
}

interface Props {
  id: string;
  isTop: boolean;
  odontograma: Record<string, ToothData>;
  zoneColors: Record<string, string>;
  setSelectedTooth: (t: { id: string; isTop: boolean }) => void;
  onZoneSelect: (zone: string) => void;
  borderColor?: string;
}

export default function ToothCard({
  id,
  isTop,
  odontograma,
  zoneColors,
  setSelectedTooth,
  onZoneSelect,
  borderColor,
}: Props) {
  const ToothComponent = ActionsTypeMap[getToothType(id)];

  const labelDiv = (
    <div
      style={{
        width: "50px",
        minHeight: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: isTop ? 4 : 0,
        marginTop: !isTop ? 4 : 0,
        border: "1px solid #3b82f6",
        borderRadius: "6px",
        padding: "2px",
        backgroundColor: "#f0f9ff",
      }}
    >
      {odontograma[id]?.generales
        ?.filter((g: ToothGeneral) => g.label)
        .map((g: ToothGeneral, idx: number) => (
          <span
            key={idx}
            style={{
              color:
                g.color === "red"
                  ? "#ef4444"
                  : g.color === "blue"
                  ? "#3b82f6"
                  : "#000",
              fontSize: "12px",
            }}
          >
            {g.label}
          </span>
        ))}
    </div>
  );

  return (
    <motion.div
      key={id}
      id={`tooth-${id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: `1px solid transparent`,
        borderRadius: "8px",
        padding: 2,
        cursor: "pointer",
        gap: "6px",
      }}
      whileHover={{
        scale: 1.0005,
        borderColor: "#87b3fbff",
        backgroundColor: "#cde0f6ff",
      }}
      transition={{ duration: 0.3 }}
      onClick={() => setSelectedTooth({ id, isTop })}
    >
      {isTop ? (
        <>
          {labelDiv}
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
              onZoneSelect={onZoneSelect}
              disabled={false}
              borderColor={borderColor}
            />
          </div>
        </>
      ) : (
        <>
          <div style={{ transform: "rotate(180deg)" }}>
            <ToothComponent
              toothId={id}
              zoneColors={zoneColors}
              onZoneSelect={onZoneSelect}
              disabled={false}
              borderColor={borderColor}
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
          {labelDiv}
        </>
      )}
    </motion.div>
  );
}

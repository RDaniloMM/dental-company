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
  drawPath?: string; // 🆕 añadido
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
        position: "relative", // 🆕 necesario para posicionar el overlay
      }}
      whileHover={{
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

          <div style={{ transform: "rotate(0deg)", position: "relative" }}>
            {/* SVG del diente base */}
            <ToothComponent
              toothId={id}
              zoneColors={zoneColors}
              onZoneSelect={onZoneSelect}
              disabled={false}
              borderColor={borderColor}
            />

            {/* 🆕 Dibujo guardado (paths sobre el diente) */}
            {odontograma[id]?.generales
              ?.filter((g) => g.drawPath)
              .map((g, i) => (
                <svg
                  key={`draw-${id}-${i}`}
                  viewBox="0 0 220 250"
                  width="100%"
                  height="100%"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                  }}
                >
                  <path
                    d={g.drawPath!}
                    stroke={g.color || "blue"}
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ transform: "rotate(180deg)", position: "relative" }}>
            <ToothComponent
              toothId={id}
              zoneColors={zoneColors}
              onZoneSelect={onZoneSelect}
              disabled={false}
              borderColor={borderColor}
            />

            {/* 🆕 Dibujo para dientes inferiores */}
            {odontograma[id]?.generales
              ?.filter((g) => g.drawPath)
              .map((g, i) => (
                <svg
                  key={`draw-${id}-${i}`}
                  viewBox="0 0 220 250"
                  width="100%"
                  height="100%"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    transform: "rotate(180deg)",
                  }}
                >
                  <path
                    d={g.drawPath!}
                    stroke={g.color || "blue"}
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              ))}
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

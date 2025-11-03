"use client";
import React from "react";
import { motion } from "framer-motion";
import { ActionsTypeMap, getToothType } from "./dientes";
export interface ToothGeneral {
  condicion?: string;
  icon?: string;
  label?: string;
  color?: "red" | "blue" | string;
  drawPath?: string;
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
  const maxHeight = 60;
  const labels = odontograma[id]?.generales?.filter((g) => g.label) || [];
  const maxVisible = 3;
  const showTooltip = labels.length > maxVisible;

  const visibleLabels = labels.slice(0, maxVisible);
  const hiddenLabels = labels.slice(maxVisible);

  const labelDiv = (
    <div
      style={{
        width: "50px",
        height: `${maxHeight}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: isTop ? 4 : 0,
        marginTop: !isTop ? 4 : 0,
        border: "1px solid #3b82f6",
        borderRadius: "6px",
        padding: "2px",
        backgroundColor: "#f0f9ff",
        position: "relative",
        cursor: showTooltip ? "pointer" : "default",
      }}
    >
      {visibleLabels.map((g, idx) => (
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
      {showTooltip && (
        <span style={{ fontSize: "10px" }}>+{hiddenLabels.length}</span>
      )}

      {/* 🆕 Tooltip estilizado con hover interno */}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: "-5px",
            left: "110%",
            backgroundColor: "#ffffff",
            border: "1px solid #3b82f6",
            borderRadius: "6px",
            padding: "6px 8px",
            fontSize: "12px",
            color: "#000",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            opacity: 0,
            transform: "translateY(-3px)",
            pointerEvents: "none",
            transition: "opacity 0.2s, transform 0.2s",
            zIndex: 10,
          }}
        >
          {hiddenLabels.map((g, idx) => (
            <div
              key={idx}
              style={{
                color:
                  g.color === "red"
                    ? "#ef4444"
                    : g.color === "blue"
                    ? "#3b82f6"
                    : "#000",
                fontWeight: "bold",
              }}
            >
              {g.label}
            </div>
          ))}
        </div>
      )}

      {/* 🆕 Estilo de hover inline (sin clases externas) */}
      <style jsx>{`
        div:hover > div {
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: translateY(0px) !important;
        }
      `}</style>
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
        position: "relative",
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
            <ToothComponent
              toothId={id}
              zoneColors={zoneColors}
              onZoneSelect={onZoneSelect}
              disabled={false}
              borderColor={borderColor}
            />
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

"use client";
import React from "react";
import type { CondicionValue } from "../CondicionMenu";

interface Props {
  toothId: string;
  data: Record<string, CondicionValue | undefined>;
  onPartClick: (toothId: string, part: string, x: number, y: number) => void;
  onNumberClick: (toothId: string) => void;
}

const CONDITION_COLORS: Record<CondicionValue, string> = {
  sano: "white",
  caries: "red",
  resina: "blue",
  amalgama: "gray",
  extraccion_programada: "purple",
  diente_ausente: "lightgray",
  corona: "yellow",
  sellante: "green",
};

export default function Molar({
  toothId,
  data,
  onPartClick,
  onNumberClick,
}: Props) {
  // ============================
  // Medidas de referencia
  // ============================
  const baseX = 56;
  const baseY = 150;
  const baseW = 102.11;
  const baseH = 55.18;

  const centerW = 102.11989;
  const centerH = 60.186192;
  const centerX = 55.995895;
  const centerY = 155.21916;

  const outerX = 19.642595;
  const outerY = 126.00449;
  const outerW = 174.24286;
  const outerH = 114.03075;

  return (
    <div
      style={{
        display: "inline-block",
        textAlign: "center",
        margin: "0 2px",
      }}
    >
      {/* Número del diente */}
      <div
        style={{
          marginBottom: 4,
          fontSize: 12,
          fontWeight: "bold",
        }}
        onClick={() => onNumberClick(toothId)}
      >
        {toothId}
      </div>

      <div style={{ height: "60%" }}>
        <svg
          viewBox="0 0 210 250"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          
        >
          {/* ==============================
              1) IMAGEN BASE DEL MOLAR (decorativa)
             ============================== */}
          <path
            d="M 19.598722,126.1842 H 92.66381 L 56.131267,14.684617 Z"
            stroke="#000"
            fill="white"
            strokeWidth="1.94"
          />
          <path
            d="M 120.49001,126.23026 H 193.5551 L 157.02256,14.73068 Z"
            stroke="#000"
            fill="white"
            strokeWidth="1.94"
          />
          <path
            d="m 70.09108,126.22554 h 73.06507 L 106.62363,14.725951 Z"
            stroke="#000"
            fill="white"
            strokeWidth="1.94"
          />

          <rect
            x={outerX}
            y={outerY}
            width={outerW}
            height={outerH}
            stroke="#000"
            fill="white"
            strokeWidth="2.48"
          />

          <g transform="matrix(0.99952832,0,0,1.1286498,0.05033008,-16.21145)">
            <rect
              x={centerX}
              y={baseY}
              width={centerW}
              height={baseH}
              stroke="#000"
              fill="white"
              strokeWidth="2.38"
            />
            <path
              d="M 56.861637,178.26189 158.74415,177.87153"
              stroke="#000"
              fill="none"
              strokeWidth="1.94"
            />
            <path
              d="m 89.911651,206.49752 v -56.08093"
              stroke="#000"
              fill="none"
              strokeWidth="1.94"
            />
            <path
              d="m 123.61225,151.06718 0.52047,53.21833"
              stroke="#000"
              fill="none"
              strokeWidth="1.94"
            />
            <path
              d="m 19.517724,126.73509 36.17285,23.42127"
              stroke="#000"
              fill="none"
              strokeWidth="1.94"
            />
            <path
              d="M 19.77796,226.66583 55.430337,205.06622"
              stroke="#000"
              fill="none"
              strokeWidth="1.94"
            />
            <path
              d="m 158.22368,204.80598 35.39214,21.59962"
              stroke="#000"
              fill="none"
              strokeWidth="1.94"
            />
            <path
              d="m 158.74416,150.15636 35.1319,-23.68151"
              stroke="#000"
              fill="none"
              strokeWidth="1.94"
            />
          </g>

          {/* ==============================
              2) ZONAS CLICKEABLES (overlays)
             ============================== */}

          {/* Oclusal (centro) */}
          <rect
            x={centerX}
            y={centerY}
            width={centerW}
            height={centerH}
            stroke="transparent"
            fill={data["oclusal"] ? CONDITION_COLORS[data["oclusal"]] : "transparent"}
            fillOpacity={data["oclusal"] ? 0.5 : 0}
            onClick={(e) =>
              onPartClick(toothId, "oclusal", e.clientX, e.clientY)
            }
          />

          {/* Vestibular (arriba) */}
          <polygon
            points={`${outerX},${outerY} ${outerX + outerW},${outerY} ${
              centerX + centerW
            },${centerY} ${centerX},${centerY}`}
            stroke="transparent"
            fill={
              data["vestibular"]
                ? CONDITION_COLORS[data["vestibular"]]
                : "transparent"
            }
            fillOpacity={data["vestibular"] ? 0.5 : 0}
            onClick={(e) =>
              onPartClick(toothId, "vestibular", e.clientX, e.clientY)
            }
          />

          {/* Lingual (abajo) */}
          <polygon
            points={`${outerX},${outerY + outerH} ${outerX + outerW},${
              outerY + outerH
            } ${centerX + centerW},${centerY + centerH} ${centerX},${
              centerY + centerH
            }`}
            stroke="transparent"
            fill={
              data["lingual"]
                ? CONDITION_COLORS[data["lingual"]]
                : "transparent"
            }
            fillOpacity={data["lingual"] ? 0.5 : 0}
            onClick={(e) =>
              onPartClick(toothId, "lingual", e.clientX, e.clientY)
            }
          />

          {/* Mesial (izquierda) */}
          <polygon
            points={`${outerX},${outerY} ${centerX},${centerY} ${centerX},${
              centerY + centerH
            } ${outerX},${outerY + outerH}`}
            stroke="transparent"
            fill={
              data["mesial"]
                ? CONDITION_COLORS[data["mesial"]]
                : "transparent"
            }
            fillOpacity={data["mesial"] ? 0.5 : 0}
            onClick={(e) =>
              onPartClick(toothId, "mesial", e.clientX, e.clientY)
            }
          />

          {/* Distal (derecha) */}
          <polygon
            points={`${outerX + outerW},${outerY} ${centerX + centerW},${centerY} ${
              centerX + centerW
            },${centerY + centerH} ${outerX + outerW},${outerY + outerH}`}
            stroke="transparent"
            fill={
              data["distal"]
                ? CONDITION_COLORS[data["distal"]]
                : "transparent"
            }
            fillOpacity={data["distal"] ? 0.5 : 0}
            onClick={(e) =>
              onPartClick(toothId, "distal", e.clientX, e.clientY)
            }
          />
        </svg>
      </div>
    </div>
  );
}

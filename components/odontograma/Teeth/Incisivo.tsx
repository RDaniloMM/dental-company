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

export default function Incisivo({ toothId, data, onPartClick, onNumberClick }: Props) {
  // Medidas de referencia para zonas clickeables
  const centerX = 56;
  const centerY = 155;
  const centerW = 100;
  const centerH = 60;

  const outerX = 20;
  const outerY = 126;
  const outerW = 170;
  const outerH = 114;

  return (
    <div style={{ display: "inline-block", textAlign: "center", margin: "0 2px" }}>
      {/* Número del diente */}
      <div
        style={{
          cursor: "pointer",
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
              IMAGEN BASE DEL INCISIVO
             ============================== */}
          <g transform="translate(27,0)">
            <path
              d="M 17.759998,125.74188 H 141.17349 L 79.466771,15.702328 Z"
              stroke="#000"
              fill="white"
              strokeWidth="2.48"
            />
            <rect
              x="16.535089"
              y="126.00148"
              width="125.64497"
              height="114.24808"
              stroke="#000"
              fill="white"
              strokeWidth="2.48"
            />
            <path
              d="M 49.749787,182.97792 109.20548,182.963 Z"
              stroke="#000"
              fill="none"
              strokeWidth="2.48"
            />
            <g transform="matrix(0.72,0,0,1.0019059,2.3709903,-0.24316737)">
              <path
                d="m 21.058566,127.02221 43.181765,55.77624 z"
                stroke="#000"
                fill="none"
                strokeWidth="2.48"
              />
              <path
                d="M 21.093536,238.98125 64.275301,183.20501 Z"
                stroke="#000"
                fill="none"
                strokeWidth="2.48"
              />
            </g>
            <g transform="matrix(-0.79,0,0,1,158.86666,-0.06326427)">
              <path
                d="m 21.058566,127.02221 43.181765,55.77624 z"
                stroke="#000"
                fill="none"
                strokeWidth="2.48"
              />
              <path
                d="M 21.093536,238.98125 64.275301,183.20501 Z"
                stroke="#000"
                fill="none"
                strokeWidth="2.48"
              />
            </g>
          </g>

          {/* ==============================
              ZONAS CLICKEABLES (overlays)
             ============================== */}
          <rect
            x={centerX}
            y={centerY}
            width={centerW}
            height={centerH}
            stroke="transparent"
            fill={data["oclusal"] ? CONDITION_COLORS[data["oclusal"]] : "transparent"}
            fillOpacity={data["oclusal"] ? 0.5 : 0}
            onClick={(e) => onPartClick(toothId, "oclusal", e.clientX, e.clientY)}
          />

          <polygon
            points={`${outerX},${outerY} ${outerX + outerW},${outerY} ${centerX + centerW},${centerY} ${centerX},${centerY}`}
            stroke="transparent"
            fill={data["vestibular"] ? CONDITION_COLORS[data["vestibular"]] : "transparent"}
            fillOpacity={data["vestibular"] ? 0.5 : 0}
            onClick={(e) => onPartClick(toothId, "vestibular", e.clientX, e.clientY)}
          />

          <polygon
            points={`${outerX},${outerY + outerH} ${outerX + outerW},${outerY + outerH} ${centerX + centerW},${centerY + centerH} ${centerX},${centerY + centerH}`}
            stroke="transparent"
            fill={data["lingual"] ? CONDITION_COLORS[data["lingual"]] : "transparent"}
            fillOpacity={data["lingual"] ? 0.5 : 0}
            onClick={(e) => onPartClick(toothId, "lingual", e.clientX, e.clientY)}
          />

          <polygon
            points={`${outerX},${outerY} ${centerX},${centerY} ${centerX},${centerY + centerH} ${outerX},${outerY + outerH}`}
            stroke="transparent"
            fill={data["mesial"] ? CONDITION_COLORS[data["mesial"]] : "transparent"}
            fillOpacity={data["mesial"] ? 0.5 : 0}
            onClick={(e) => onPartClick(toothId, "mesial", e.clientX, e.clientY)}
          />

          <polygon
            points={`${outerX + outerW},${outerY} ${centerX + centerW},${centerY} ${centerX + centerW},${centerY + centerH} ${outerX + outerW},${outerY + outerH}`}
            stroke="transparent"
            fill={data["distal"] ? CONDITION_COLORS[data["distal"]] : "transparent"}
            fillOpacity={data["distal"] ? 0.5 : 0}
            onClick={(e) => onPartClick(toothId, "distal", e.clientX, e.clientY)}
          />
        </svg>
      </div>
    </div>
  );
}

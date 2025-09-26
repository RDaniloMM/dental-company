"use client";
import React, { useState } from "react";

interface CaninoActiondProps {
  toothId: string;
  onZoneSelect: (zone: string) => void;
  zoneColors: Record<string, string>;
  hoverFill?: string;
  disabled?: boolean; 
}

const CaninoActiond: React.FC<CaninoActiondProps> = ({
  toothId,
  onZoneSelect,
  zoneColors,
  disabled = false,
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const getFillWithOpacity = (zone: string) => {
    const key = `${toothId}_${zone}`;
    const color = zoneColors[key];

    if (!color) {
      return hoveredPart === zone ? "rgba(173,216,230,0.4)" : "transparent";
    }

    if (color === "red")
      return hoveredPart === zone ? "rgba(255,0,0,0.7)" : "rgba(255,0,0,0.5)";
    if (color === "blue")
      return hoveredPart === zone ? "rgba(0,0,255,0.7)" : "rgba(0,0,255,0.5)";

    return "transparent";
  };

  const outerX = 19.642595;
  const outerY = 126.00449;
  const outerW = 174.24286;
  const outerH = 114.03075;

  const centerX = 55.995895;
  const centerY = 155.21916;
  const centerW = 102.11989;
  const centerH = 55.186192;

  const zones = [
    {
      name: "oclusal",
      type: "rect",
      x: centerX,
      y: centerY,
      width: centerW,
      height: centerH,
    },
    {
      name: "vestibular",
      type: "polygon",
      points: `${outerX},${outerY} ${outerX + outerW},${outerY} ${
        centerX + centerW
      },${centerY} ${centerX},${centerY}`,
    },
    {
      name: "lingual",
      type: "polygon",
      points: `${outerX},${outerY + outerH} ${outerX + outerW},${
        outerY + outerH
      } ${centerX + centerW},${centerY + centerH} ${centerX},${
        centerY + centerH
      }`,
    },
    {
      name: "mesial",
      type: "polygon",
      points: `${outerX},${outerY} ${centerX},${centerY} ${centerX},${
        centerY + centerH
      } ${outerX},${outerY + outerH}`,
    },
    {
      name: "distal",
      type: "polygon",
      points: `${outerX + outerW},${outerY} ${centerX + centerW},${centerY} ${
        centerX + centerW
      },${centerY + centerH} ${outerX + outerW},${outerY + outerH}`,
    },
  ];

  return (
    <svg
      viewBox="0 0 210 250"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paths decorativos base */}
      <path
        d="M 85.813647,126.34345 H 171.42454 L 128.61911,15.325288 Z"
        stroke="black"
        fill="white"
        strokeWidth="2.48"
      />
      <path
        d="M 41.813647,126.34358 H 127.42455 L 84.619116,15.32541 Z"
        stroke="black"
        fill="white"
        strokeWidth="2.48"
        strokeDasharray="9,9"
      />
      <rect
        x={outerX}
        y={outerY}
        width={outerW}
        height={outerH}
        stroke="#000"
        fill="white"
        strokeWidth="1.94"
        style={{ pointerEvents: "none" }}
      />

      {/* Zonas clickeables */}
      {zones.map((zone) =>
        zone.type === "rect" ? (
          <rect
            key={zone.name}
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            stroke="black"
            strokeWidth={1.5}
            fill={getFillWithOpacity(zone.name)}
            onMouseEnter={() => !disabled && setHoveredPart(zone.name)}
            onMouseLeave={() => !disabled && setHoveredPart(null)}
            onClick={() => !disabled && onZoneSelect(zone.name)}
            style={{ cursor: disabled ? "default" : "pointer" }}
          />
        ) : (
          <polygon
            key={zone.name}
            points={zone.points}
            stroke="black"
            strokeWidth={1.5}
            fill={getFillWithOpacity(zone.name)}
            onMouseEnter={() => !disabled && setHoveredPart(zone.name)}
            onMouseLeave={() => !disabled && setHoveredPart(null)}
            onClick={() => !disabled && onZoneSelect(zone.name)}
            style={{ cursor: disabled ? "default" : "pointer" }}
          />
        )
      )}
    </svg>
  );
};

export default CaninoActiond;

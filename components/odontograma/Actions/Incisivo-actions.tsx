"use client";
import React, { useState } from "react";

interface IncisivoActionProps {
  toothId: string;
  onZoneSelect: (zone: string) => void;
  zoneColors: Record<string, string>;
  hoverFill?: string;
  disabled?: boolean;
}

const IncisivoAction: React.FC<IncisivoActionProps> = ({
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

  const outerX = 41.642595;
  const outerY = 126.00449;
  const outerW = 129.24286;
  const outerH = 114.03075;

  const centerX = 76.02592;
  const centerY = 165.022706;
  const centerW = 60.059945;
  const centerH = 35.593096;

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
      <svg
        viewBox="0 0 210 250"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(27,0)">
          <path
            d="M 17.759998,125.74188 H 141.17349 L 79.466771,15.702328 Z"
            stroke="black"
            fill="white"
            strokeWidth="2.48"
          />
          <rect
            x="16.535089"
            y="126.00148"
            width="125.64497"
            height="114.24808"
            stroke="black"
            fill="white"
            strokeWidth="2.48"
          />
          <path
            d="M 49.749787,182.97792 109.20548,182.963 Z"
            stroke="black"
            fill="none"
            strokeWidth="2.48"
          />
          <g transform="matrix(0.72,0,0,1.0019059,2.3709903,-0.24316737)">
            <path
              d="m 21.058566,127.02221 43.181765,55.77624 z"
              stroke="black"
              fill="none"
              strokeWidth="2.48"
            />
            <path
              d="M 21.093536,238.98125 64.275301,183.20501 Z"
              stroke="black"
              fill="none"
              strokeWidth="2.48"
            />
          </g>
          <g transform="matrix(-0.79,0,0,1,158.86666,-0.06326427)">
            <path
              d="m 21.058566,127.02221 43.181765,55.77624 z"
              stroke="black"
              fill="none"
              strokeWidth="2.48"
            />
            <path
              d="M 21.093536,238.98125 64.275301,183.20501 Z"
              stroke="black"
              fill="none"
              strokeWidth="2.48"
            />
          </g>
        </g>
      </svg>

      {/* Zonas clickeables */}
      {zones.map((zone) =>
        zone.type === "rect" ? (
          <rect
            key={zone.name}
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            stroke="transparent"
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
            stroke="transparent"
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

export default IncisivoAction;

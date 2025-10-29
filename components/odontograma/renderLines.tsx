import React from "react";

interface ToothData {
  zonas: { zona: string; condicion: string; color: string }[];
  generales: {
    condicion: string;
    icon: string;
    label?: string;
    color?: string;
  }[];
}
const dientesSuperiores = [
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
];

const getOffsetY = (
  toothId: string,
  offsetSuperior: number,
  offsetInferior: number
) => (dientesSuperiores.includes(toothId) ? offsetSuperior : offsetInferior);

// Todas las funciones de renderizado de líneas
// ---------- Render líneas AOF ----------
export const renderAOF = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 15,
  offsetInferior = -15
) => {
  return Object.entries(odontograma).flatMap(([, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("aof_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const start = parts[1];
        const end = parts[2];
        const color = parts[3];

        const startEl = document.getElementById(`tooth-${start}`);
        const endEl = document.getElementById(`tooth-${end}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!startEl || !endEl || !containerEl) return null;

        const startBox = startEl.getBoundingClientRect();
        const endBox = endEl.getBoundingClientRect();

        const size = 12;
        const half = size / 2;
        const padding = 3;

        const lineOffsetYStart = getOffsetY(
          start,
          offsetSuperior,
          offsetInferior
        );
        const lineOffsetYEnd = getOffsetY(end, offsetSuperior, offsetInferior);

        const x1 = Math.max(half, startBox.left - containerEl.left);
        const y1 = Math.max(
          half,
          startBox.top +
            startBox.height / 2 +
            lineOffsetYStart -
            containerEl.top
        );
        const x2 = Math.min(
          containerEl.width - half,
          endBox.right - containerEl.left
        );
        const y2 = Math.min(
          containerEl.height - half,
          endBox.top + endBox.height / 2 + lineOffsetYEnd - containerEl.top
        );

        return (
          <g key={`aof-${start}-${end}-${idx}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={2}
            />

            <rect
              x={x1 - half}
              y={y1 - half}
              width={size}
              height={size}
              fill="white"
              stroke={color}
              strokeWidth={1}
            />
            <line
              x1={x1}
              y1={y1 - (half - padding)}
              x2={x1}
              y2={y1 + (half - padding)}
              stroke={color}
              strokeWidth={1.5}
            />
            <line
              x1={x1 - (half - padding)}
              y1={y1}
              x2={x1 + (half - padding)}
              y2={y1}
              stroke={color}
              strokeWidth={1.5}
            />

            <rect
              x={x2 - half}
              y={y2 - half}
              width={size}
              height={size}
              fill="white"
              stroke={color}
              strokeWidth={1}
            />
            <line
              x1={x2}
              y1={y2 - (half - padding)}
              x2={x2}
              y2={y2 + (half - padding)}
              stroke={color}
              strokeWidth={1.5}
            />
            <line
              x1={x2 - (half - padding)}
              y1={y2}
              x2={x2 + (half - padding)}
              y2={y2}
              stroke={color}
              strokeWidth={1.5}
            />
          </g>
        );
      })
  );
};

// ---------- Render zigzag AOR ----------
export const renderAOR = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 25,
  offsetInferior = -25
) => {
  return Object.entries(odontograma).flatMap(([, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("aor_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const start = parts[1];
        const end = parts[2];
        const color = parts[3];

        const startEl = document.getElementById(`tooth-${start}`);
        const endEl = document.getElementById(`tooth-${end}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!startEl || !endEl || !containerEl) return null;

        const startBox = startEl.getBoundingClientRect();
        const endBox = endEl.getBoundingClientRect();

        const x1 = startBox.left - containerEl.left;
        const x2 = endBox.right - containerEl.left;

        const isSuperior = dientesSuperiores.includes(start);
        const lineOffsetY = getOffsetY(start, offsetSuperior, offsetInferior);
        const y1 =
          startBox.top + startBox.height / 2 + lineOffsetY - containerEl.top;

        const teethOrder = [
          "18",
          "17",
          "16",
          "15",
          "14",
          "13",
          "12",
          "11",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "48",
          "47",
          "46",
          "45",
          "44",
          "43",
          "42",
          "41",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
        ];

        const startIndex = teethOrder.indexOf(start);
        const endIndex = teethOrder.indexOf(end);
        const numDientes = Math.abs(endIndex - startIndex) + 1;
        const segments = numDientes * 2;
        const amplitude = 7;
        const points: string[] = [];

        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const xi = x1 + (x2 - x1) * t;
          const yi =
            y1 + (i % 2 === 0 ? -1 : 1) * amplitude * (isSuperior ? -1 : 1);
          points.push(`${xi},${yi}`);
        }

        const pathData = `M ${points.join(" L ")}`;
        return (
          <path
            key={`zigzag-${start}-${end}-${idx}`}
            d={pathData}
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        );
      })
  );
};

// ---------- Render PDCs ----------
export const renderPDCS = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 18,
  offsetInferior = -18
) => {
  return Object.entries(odontograma).flatMap(([, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("pdcs_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const start = parts[1];
        const end = parts[2];
        const color = parts[3];

        const startEl = document.getElementById(`tooth-${start}`);
        const endEl = document.getElementById(`tooth-${end}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!startEl || !endEl || !containerEl) return null;

        const startBox = startEl.getBoundingClientRect();
        const endBox = endEl.getBoundingClientRect();

        const separation = 3;
        const lineOffsetYStart = getOffsetY(
          start,
          offsetSuperior,
          offsetInferior
        );
        const lineOffsetYEnd = getOffsetY(end, offsetSuperior, offsetInferior);

        const x1 = startBox.left - containerEl.left;
        const y1 =
          startBox.top +
          startBox.height / 2 +
          lineOffsetYStart -
          containerEl.top;
        const x2 = endBox.right - containerEl.left;
        const y2 =
          endBox.top + endBox.height / 2 + lineOffsetYEnd - containerEl.top;

        return (
          <g key={`pdcs-${start}-${end}-${idx}`}>
            <line
              x1={x1}
              y1={y1 - separation}
              x2={x2}
              y2={y2 - separation}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={x1}
              y1={y1 + separation}
              x2={x2}
              y2={y2 + separation}
              stroke={color}
              strokeWidth={2}
            />
          </g>
        );
      })
  );
};

// ---------- Render PDPR ----------
export const renderPDPR = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 18,
  offsetInferior = -18
) => {
  return Object.entries(odontograma).flatMap(([, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("pdpr_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const start = parts[1];
        const end = parts[2];
        const color = parts[3];

        const startEl = document.getElementById(`tooth-${start}`);
        const endEl = document.getElementById(`tooth-${end}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!startEl || !endEl || !containerEl) return null;

        const startBox = startEl.getBoundingClientRect();
        const endBox = endEl.getBoundingClientRect();

        const separation = 3;
        const lineOffsetYStart = getOffsetY(
          start,
          offsetSuperior,
          offsetInferior
        );
        const lineOffsetYEnd = getOffsetY(end, offsetSuperior, offsetInferior);

        const x1 = startBox.left - containerEl.left;
        const y1 =
          startBox.top +
          startBox.height / 2 +
          lineOffsetYStart -
          containerEl.top;
        const x2 = endBox.right - containerEl.left;
        const y2 =
          endBox.top + endBox.height / 2 + lineOffsetYEnd - containerEl.top;

        return (
          <g key={`pdpr-${start}-${end}-${idx}`}>
            <line
              x1={x1}
              y1={y1 - separation}
              x2={x2}
              y2={y2 - separation}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={x1}
              y1={y1 + separation}
              x2={x2}
              y2={y2 + separation}
              stroke={color}
              strokeWidth={2}
            />
          </g>
        );
      })
  );
};

// ---------- Render ETSI ----------
export const renderETSI = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 64,
  offsetInferior = -64
) => {
  return Object.entries(odontograma).flatMap(([, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("etsi_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const start = parts[1];
        const end = parts[2];
        const color = parts[3];

        const startEl = document.getElementById(`tooth-${start}`);
        const endEl = document.getElementById(`tooth-${end}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!startEl || !endEl || !containerEl) return null;

        const startBox = startEl.getBoundingClientRect();
        const endBox = endEl.getBoundingClientRect();

        const lineOffsetYStart = getOffsetY(
          start,
          offsetSuperior,
          offsetInferior
        );
        const lineOffsetYEnd = getOffsetY(end, offsetSuperior, offsetInferior);

        const x1 = startBox.left - containerEl.left + startBox.width / 2;
        const y1 =
          startBox.top -
          containerEl.top +
          startBox.height / 2 +
          lineOffsetYStart;

        const x2 = endBox.left - containerEl.left + endBox.width / 2;
        const y2 =
          endBox.top - containerEl.top + endBox.height / 2 + lineOffsetYEnd;

        return (
          <line
            key={`etsi-${start}-${end}-${idx}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={2}
          />
        );
      })
  );
};
// ---------- Render DIASTEMA ----------
export const renderDiastema = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 62,
  offsetInferior = -62,
  offsetX = 0
) => {
  const altura = 16;
  const ancho = 7;
  const separacion = 12;
  const acercamiento = -4;

  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("diastema_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const direccion = parts[1];
        const color = parts[2] || "blue";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const yBase =
          box.top +
          box.height / 2 -
          containerEl.top +
          getOffsetY(toothId, offsetSuperior, offsetInferior);

        const xCentro =
          direccion === "der"
            ? box.right -
              containerEl.left +
              separacion / 2 +
              acercamiento +
              offsetX
            : box.left -
              containerEl.left -
              separacion / 2 -
              acercamiento +
              offsetX;

        const curvaSuperior = dientesSuperiores.includes(toothId) ? -1 : 1;
        const pathDerecha = `M ${xCentro + separacion / 2} ${
          yBase - altura
        } Q ${xCentro + separacion / 2 - ancho} ${yBase} ${
          xCentro + separacion / 2
        } ${yBase + altura}`;

        const pathIzquierda = `M ${xCentro - separacion / 2} ${
          yBase - altura
        } Q ${xCentro - separacion / 2 + ancho} ${yBase} ${
          xCentro - separacion / 2
        } ${yBase + altura}`;

        return (
          <React.Fragment key={`diastema-group-${toothId}-${idx}`}>
            <path
              d={pathDerecha}
              stroke={color}
              strokeWidth={2}
              fill="none"
              transform={
                curvaSuperior === -1
                  ? `scale(1, -1) translate(0, ${-2 * yBase})`
                  : undefined
              }
            />
            <path
              d={pathIzquierda}
              stroke={color}
              strokeWidth={2}
              fill="none"
              transform={
                curvaSuperior === -1
                  ? `scale(1, -1) translate(0, ${-2 * yBase})`
                  : undefined
              }
            />
          </React.Fragment>
        );
      })
  );
};

// ---------- Render FUSIÓN ----------
export const renderFusion = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 2,
  offsetInferior = -2,
  offsetX = 0
) => {
  const rx = 25;
  const ry = 15;
  const separacion = -5;
  const desplazamiento = 2;

  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("fusion_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const direccion = parts[1];
        const color = parts[2] || "blue";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const yCentro =
          box.top +
          box.height / 2 -
          containerEl.top +
          getOffsetY(toothId, offsetSuperior, offsetInferior);

        const xBase =
          direccion === "der"
            ? box.right - containerEl.left + desplazamiento + offsetX
            : box.left - containerEl.left - desplazamiento + offsetX;

        const x1 = xBase - rx - separacion / 2;
        const x2 = xBase + rx + separacion / 2;

        return (
          <React.Fragment key={`fusion-${toothId}-${idx}`}>
            <ellipse
              cx={x1}
              cy={yCentro}
              rx={rx}
              ry={ry}
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            <ellipse
              cx={x2}
              cy={yCentro}
              rx={rx}
              ry={ry}
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
          </React.Fragment>
        );
      })
  );
};

// ---------- Render GEMINACIÓN ----------
export const renderGeminacion = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 0,
  offsetInferior = 0,
  offsetX = 0
) => {
  const rx = 25;
  const ry = 15;
  const desplazamiento = -30;

  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("geminacion_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const direccion = parts[1];
        const color = parts[2] || "blue";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();

        const esSuperior = parseInt(toothId) <= 28;
        const yCentro =
          box.top +
          box.height / 2 -
          containerEl.top +
          (esSuperior ? offsetSuperior : offsetInferior);

        const xBase =
          direccion === "der"
            ? box.right - containerEl.left + desplazamiento + offsetX
            : box.left - containerEl.left - desplazamiento + offsetX;

        return (
          <ellipse
            key={`geminacion-${toothId}-${idx}`}
            cx={xBase}
            cy={yCentro}
            rx={rx}
            ry={ry}
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        );
      })
  );
};

// ---------- Render GIROVERSIÓN ----------
export const renderGiroversion = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 85,
  offsetInferior = -85,
  spacing = 12
) => {
  const curveOffset = 10;
  const headSize = 5;

  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("giro_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const direccion = parts[1] as "izq" | "der";
        const color = parts[2] || "blue";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = parseInt(toothId) <= 28;

        const xCentro = box.left + box.width / 2 - containerEl.left;
        let yCentro =
          box.top +
          box.height / 2 -
          containerEl.top +
          (esSuperior ? offsetSuperior : offsetInferior);

        yCentro += idx * spacing * (esSuperior ? 1 : -1);

        const dirMultiplier = direccion === "der" ? 1 : -1;

        const pathD = `M ${-box.width / 2} 0 Q 0 ${
          -curveOffset * (esSuperior ? -1 : 1)
        } ${box.width / 2} 0`;

        return (
          <g
            key={`giro-${toothId}-${idx}`}
            transform={`translate(${xCentro}, ${yCentro}) scale(${dirMultiplier},1)`}
          >
            <defs>
              <marker
                id={`arrowhead-${toothId}-${idx}`}
                markerWidth={headSize}
                markerHeight={headSize}
                refX={headSize / 2}
                refY={headSize / 2}
                orient="auto"
              >
                <polyline
                  points={`0,0 ${headSize},${headSize / 2} 0,${headSize}`}
                  stroke={color}
                  fill="none"
                  strokeWidth={2}
                />
              </marker>
            </defs>

            <path
              d={pathD}
              stroke={color}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              markerEnd={`url(#arrowhead-${toothId}-${idx})`}
            />
          </g>
        );
      })
  );
};

// ---------- Render PIEZA AUSENTE ----------
export const renderPiezaAusente = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 60,
  offsetInferior = -60,
  offsetX = 0,
  size = 50
) => {
  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("ausente_"))

      .map((g, idx) => {
        const color = g.color || "blue";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = parseInt(toothId) <= 28;

        const yCentro =
          box.top +
          box.height / 2 -
          containerEl.top +
          (esSuperior ? offsetSuperior : offsetInferior);
        const xCentro = box.left - containerEl.left + box.width / 2 + offsetX;

        return (
          <g
            key={`ausente-${toothId}-${idx}`}
            transform={`translate(${xCentro}, ${yCentro})`}
          >
            <line
              x1={-size / 2}
              y1={-size / 2}
              x2={size / 2}
              y2={size / 2}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={size / 2}
              y1={-size / 2}
              x2={-size / 2}
              y2={size / 2}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        );
      })
  );
};

// ---------- Render PIEZA DENTARIA EN CLAVIJA----------
export const renderPiezaClavija = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 15,
  offsetInferior = -15,
  offsetX = 0,
  size = 15
) => {
  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon?.includes("clavija"))
      .map((g, idx) => {
        const color = g.color || "blue";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = dientesSuperiores.includes(toothId);

        const yCentro =
          box.top +
          box.height / 2 -
          containerEl.top +
          (esSuperior ? offsetSuperior : offsetInferior);
        const xCentro = box.left - containerEl.left + box.width / 2 + offsetX;

        const h = (Math.sqrt(3) / 2) * size;
        const pointsArray = esSuperior
          ? [
              [0, -h / 2],
              [-size / 2, h / 2],
              [size / 2, h / 2],
            ]
          : [
              [0, h / 2],
              [-size / 2, -h / 2],
              [size / 2, -h / 2],
            ];

        const pointsStr = pointsArray.map(([x, y]) => `${x},${y}`).join(" ");

        return (
          <g
            key={`clavija-${toothId}-${idx}`}
            transform={`translate(${xCentro}, ${yCentro})`}
          >
            <polygon
              points={pointsStr}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
            />
          </g>
        );
      })
  );
};

export const renderEspigaMunon = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 63,
  offsetInferior = -63,
  offsetX = 0,
  offsetY = 0,
  squareSize = 15
) => {
  // 🔹 Configuración para dientes superiores
  const superior = {
    lineLengthIzq: 35,
    angleIzq: 105,
    lineLengthDer: 35,
    angleDer: 75,
    lineLengthCen: 35,
    angleCen: 90,
  };

  // 🔹 Configuración para dientes inferiores
  const inferior = {
    lineLengthIzq: 35,
    angleIzq: -105,
    lineLengthDer: 35,
    angleDer: -75,
    lineLengthCen: 35,
    angleCen: -90,
  };

  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    (toothData.generales || [])
      .filter((g) => g.icon?.includes("espiga"))
      .map((g, idx) => {
        const color = g.color || "blue";
        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = parseInt(toothId) <= 28;

        // 🔸 Centro del cuadrado
        const xCentro = box.left - containerEl.left + box.width / 2 + offsetX;
        const yCentro =
          box.top -
          containerEl.top +
          box.height / 2 +
          (esSuperior ? offsetSuperior : offsetInferior) +
          offsetY;

        const half = squareSize / 2;
        const xLeft = xCentro - half;
        const yTop = yCentro - half;

        const cfg = esSuperior ? superior : inferior;

        const lines: JSX.Element[] = [];

        // 🧮 Calcula un punto en el borde del cuadrado en función del ángulo
        const calcBorde = (angleDeg: number) => {
          const angleRad = (angleDeg * Math.PI) / 180;
          const cos = Math.cos(angleRad);
          const sin = Math.sin(angleRad);
          // hallamos el borde del cuadrado en la dirección del ángulo
          const dx = (squareSize / 2) * cos;
          const dy = (squareSize / 2) * sin;
          return {
            x: xCentro + dx,
            y: yCentro - dy,
          };
        };

        // 🔹 Crea línea que parte del borde hacia afuera
        const drawLine = (angleDeg: number, length: number, key: string) => {
          const start = calcBorde(angleDeg);
          const angleRad = (angleDeg * Math.PI) / 180;
          const end = {
            x: start.x + length * Math.cos(angleRad),
            y: start.y - length * Math.sin(angleRad),
          };
          return (
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={color}
              strokeWidth={2}
              key={key}
            />
          );
        };

        // 🔸 Dibujar líneas según íconos
        if (g.icon.includes("izq"))
          lines.push(
            drawLine(
              cfg.angleIzq,
              cfg.lineLengthIzq,
              `espiga-${toothId}-izq-${idx}`
            )
          );
        if (g.icon.includes("der"))
          lines.push(
            drawLine(
              cfg.angleDer,
              cfg.lineLengthDer,
              `espiga-${toothId}-der-${idx}`
            )
          );
        if (g.icon.includes("cen"))
          lines.push(
            drawLine(
              cfg.angleCen,
              cfg.lineLengthCen,
              `espiga-${toothId}-cen-${idx}`
            )
          );

        // 🔷 Cuadrado + líneas
        return (
          <g key={`espiga-${toothId}-${idx}`}>
            <rect
              x={xLeft}
              y={yTop}
              width={squareSize}
              height={squareSize}
              stroke={color}
              fill="none"
              strokeWidth={2}
            />
            {lines}
          </g>
        );
      })
  );
};

// ---------- Render TRATAMIENTO DE CONDUCTO (solo línea) ----------
export const renderTratamientoConducto = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 25,
  offsetInferior = -25,
  offsetX = 0,
  lineLength = 40
) => {
  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon?.includes("conducto"))
      .map((g, idx) => {
        const color = g.color || "blue";
        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = parseInt(toothId) <= 28;

        const xCentro = box.left - containerEl.left + box.width / 2 + offsetX;
        const yInicio =
          box.top +
          box.height / 2 -
          containerEl.top +
          (esSuperior ? offsetSuperior : offsetInferior);

        const yFin = yInicio + (esSuperior ? lineLength : -lineLength);

        return (
          <g key={`conducto-${toothId}-${idx}`}>
            <line
              x1={xCentro}
              y1={yInicio}
              x2={xCentro}
              y2={yFin}
              stroke={color}
              strokeWidth={2}
            />
          </g>
        );
      })
  );
};

// ---------- Render PIEZA DENTARIA EN ERUPCION  ----------
export const renderPiezaErupcion = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 45,
  offsetInferior = -45,
  offsetX = 0,
  zigSize = 10,
  zigHeight = 8,
  numZigs = 5,
  arrowSize = 8
) => {
  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon?.includes("erupcion"))
      .map((g, idx) => {
        const color = g.color || "blue";
        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = dientesSuperiores.includes(toothId);

        const yCentro =
          box.top +
          box.height / 2 -
          containerEl.top +
          (esSuperior ? offsetSuperior : offsetInferior);
        const xCentro = box.left - containerEl.left + box.width / 2 + offsetX;

        const direction = esSuperior ? 1 : -1;

        const puntos: [number, number][] = [];
        for (let i = 0; i <= numZigs; i++) {
          const y = (i - numZigs / 2) * zigHeight;
          const x = i % 2 === 0 ? -zigSize / 2 : zigSize / 2;
          puntos.push([x, y * direction]);
        }
        const pointsStr = puntos.map(([x, y]) => `${x},${y}`).join(" ");

        const last = puntos[puntos.length - 1];
        const secondLast = puntos[puntos.length - 2];
        const dx = last[0] - secondLast[0];
        const dy = last[1] - secondLast[1];
        const angle = Math.atan2(dy, dx);

        const arrowLeft = [
          -arrowSize * Math.cos(Math.PI / 6),
          -arrowSize * Math.sin(Math.PI / 6),
        ];
        const arrowRight = [
          -arrowSize * Math.cos(Math.PI / 6),
          arrowSize * Math.sin(Math.PI / 6),
        ];

        const rotatePoint = ([x, y]: number[], angle: number) => [
          x * Math.cos(angle) - y * Math.sin(angle),
          x * Math.sin(angle) + y * Math.cos(angle),
        ];

        const leftRotated = rotatePoint(arrowLeft, angle);
        const rightRotated = rotatePoint(arrowRight, angle);

        return (
          <g
            key={`erupcion-${toothId}-${idx}`}
            transform={`translate(${xCentro}, ${yCentro})`}
          >
            <polyline
              points={pointsStr}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
            />
            <line
              x1={last[0]}
              y1={last[1]}
              x2={last[0] + leftRotated[0]}
              y2={last[1] + leftRotated[1]}
              stroke={color}
              strokeWidth={1.5}
            />
            <line
              x1={last[0]}
              y1={last[1]}
              x2={last[0] + rightRotated[0]}
              y2={last[1] + rightRotated[1]}
              stroke={color}
              strokeWidth={1.5}
            />
          </g>
        );
      })
  );
};
// ---------- Render PIEZA DENTARIA EXTRUIDA  ----------
export const renderPiezaExtruida = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 80,
  offsetInferior = -80,
  offsetX = 0,
  arrowLength = 15,
  headSize = 6
) => {
  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("extruida"))
      .map((g, idx) => {
        const color = g.color || "red";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = dientesSuperiores.includes(toothId);

        const yCentroBase = box.top + box.height / 2 - containerEl.top;
        const xCentroBase = box.left - containerEl.left + box.width / 2;

        const yCentro =
          yCentroBase +
          (esSuperior ? offsetSuperior : offsetInferior) +
          idx * 5;
        const xCentro = xCentroBase + offsetX;

        const direction = esSuperior ? 1 : -1;
        const yTip = direction * arrowLength;

        const leftHead = [-headSize / 2, yTip - direction * headSize];
        const rightHead = [headSize / 2, yTip - direction * headSize];

        return (
          <g
            key={`extruida-${toothId}-${idx}`}
            transform={`translate(${xCentro}, ${yCentro})`}
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={yTip}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={0}
              y1={yTip}
              x2={leftHead[0]}
              y2={leftHead[1]}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={0}
              y1={yTip}
              x2={rightHead[0]}
              y2={rightHead[1]}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        );
      })
  );
};

// ---------- Render PIEZA DENTARIA INTRUIDA ----------
export const renderPiezaIntruida = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 90,
  offsetInferior = -90,
  offsetX = 0,
  arrowLength = 15,
  headSize = 6
) => {
  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("intruida"))
      .map((g, idx) => {
        const color = g.color || "red";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = dientesSuperiores.includes(toothId);

        const yCentroBase = box.top + box.height / 2 - containerEl.top;
        const xCentroBase = box.left - containerEl.left + box.width / 2;

        const yCentro =
          yCentroBase +
          (esSuperior ? offsetSuperior : offsetInferior) +
          idx * 5;
        const xCentro = xCentroBase + offsetX;

        const direction = esSuperior ? -1 : 1;
        const yTip = direction * arrowLength;

        const leftHead = [-headSize / 2, yTip - direction * headSize];
        const rightHead = [headSize / 2, yTip - direction * headSize];

        return (
          <g
            key={`intruida-${toothId}-${idx}`}
            transform={`translate(${xCentro}, ${yCentro})`}
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={yTip}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={0}
              y1={yTip}
              x2={leftHead[0]}
              y2={leftHead[1]}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={0}
              y1={yTip}
              x2={rightHead[0]}
              y2={rightHead[1]}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        );
      })
  );
};

// ---------- Render PIEZA DENTARIA SUPERNUMERARIA ----------
export const renderSupernumeraria = (
  odontograma: Record<string, ToothData>,
  circleRadius = 10,
  textSize = 12,
  offsetSuperior = 50,
  offsetInferior = -50,
  lateralOffset = 30 // cuánto desplazar izquierda/derecha
) => {
  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("supernumeraria"))
      .map((g, idx) => {
        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = parseInt(toothId) <= 28;

        let xCentro = box.left + box.width / 2 - containerEl.left;
        const yCentro =
          box.top +
          box.height / 2 -
          containerEl.top +
          (esSuperior ? offsetSuperior : offsetInferior);

        // Extraer dirección y color
        const parts = g.icon.split("_");
        const direccion = parts[1]; // "izq" o "der"
        const color = parts[2] || "blue";

        // Ajuste lateral según dirección
        if (direccion === "izq") xCentro -= lateralOffset;
        else if (direccion === "der") xCentro += lateralOffset;

        return (
          <g key={`supernumerary-${toothId}-${idx}`}>
            <circle
              cx={xCentro}
              cy={yCentro}
              r={circleRadius}
              fill="white" // fondo blanco
              stroke={color} // contorno azul
              strokeWidth={2}
            />
            <text
              x={xCentro}
              y={yCentro + textSize / 3} // centrado vertical aproximado
              fontSize={textSize}
              fontWeight="bold"
              textAnchor="middle"
              fill={color} // letra azul
            >
              S
            </text>
          </g>
        );
      })
  );
};

// ---------- Render TRANSPOSICIÓN  ----------
export const renderTransposicion = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 20,
  offsetInferior = -20,
  curveOffset = 20,
  headSize = 5,
  spacing = 0,
  offsetFirst = 20,
  offsetSecond = -10
) => {
  return Object.entries(odontograma).flatMap(([toothId, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("trans_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const direccion = parts[1] as "izq" | "der";
        const color = parts[2] || "black";

        const toothEl = document.getElementById(`tooth-${toothId}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!toothEl || !containerEl) return null;

        const box = toothEl.getBoundingClientRect();
        const esSuperior = parseInt(toothId) <= 28;

        const yCentro =
          box.top +
          box.height / 2 -
          containerEl.top +
          (esSuperior ? offsetSuperior : offsetInferior);
        const xInicio = box.left - containerEl.left;
        const ancho = box.width;
        const curveDir = esSuperior ? -1 : 1;
        const isLeft = direccion === "izq";

        const pathD1 = `M 0 0 Q ${ancho / 2} ${
          curveOffset * curveDir
        } ${ancho} 0`;
        const xFirst = xInicio + (isLeft ? -offsetFirst : offsetFirst);

        const pathD2 = `M 0 0 Q ${ancho / 2} ${
          curveOffset * curveDir
        } ${ancho} 0`;
        const xSecondBase = isLeft
          ? xInicio - ancho - spacing
          : xInicio + ancho + spacing;
        const xSecond = xSecondBase + (isLeft ? -offsetSecond : offsetSecond);

        return (
          <g key={`transp-${toothId}-${idx}`}>
            <g transform={`translate(${xFirst}, ${yCentro})`}>
              <defs>
                <marker
                  id={`arrowhead1-${toothId}-${idx}`}
                  markerWidth={headSize}
                  markerHeight={headSize}
                  refX={headSize / 2}
                  refY={headSize / 2}
                  orient={isLeft ? "auto-start-reverse" : "auto"}
                >
                  <polyline
                    points={`0,0 ${headSize},${headSize / 2} 0,${headSize}`}
                    stroke={color}
                    fill="none"
                    strokeWidth={2}
                  />
                </marker>
              </defs>

              <path
                d={pathD1}
                stroke={color}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                markerStart={
                  isLeft ? `url(#arrowhead1-${toothId}-${idx})` : undefined
                }
                markerEnd={
                  !isLeft ? `url(#arrowhead1-${toothId}-${idx})` : undefined
                }
              />
            </g>

            <g transform={`translate(${xSecond}, ${yCentro})`}>
              <defs>
                <marker
                  id={`arrowhead2-${toothId}-${idx}`}
                  markerWidth={headSize}
                  markerHeight={headSize}
                  refX={headSize / 2}
                  refY={headSize / 2}
                  orient={!isLeft ? "auto-start-reverse" : "auto"}
                >
                  <polyline
                    points={`0,0 ${headSize},${headSize / 2} 0,${headSize}`}
                    stroke={color}
                    fill="none"
                    strokeWidth={2}
                  />
                </marker>
              </defs>

              <path
                d={pathD2}
                stroke={color}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                markerStart={
                  !isLeft ? `url(#arrowhead2-${toothId}-${idx})` : undefined
                }
                markerEnd={
                  isLeft ? `url(#arrowhead2-${toothId}-${idx})` : undefined
                }
              />
            </g>
          </g>
        );
      })
  );
};

// ---------- Render PROTESIS DENTAL PARCIAL FIJA ----------
export const renderProtesisParcialFija = (
  odontograma: Record<string, ToothData>,
  offsetSuperior = 15,
  offsetInferior = -12,
  verticalLength = 10
) => {
  return Object.entries(odontograma).flatMap(([, toothData]) =>
    toothData.generales
      .filter((g) => g.icon.startsWith("ppf_"))
      .map((g, idx) => {
        const parts = g.icon.split("_");
        const start = parts[1];
        const end = parts[2];
        const color = parts[3];

        const startEl = document.getElementById(`tooth-${start}`);
        const endEl = document.getElementById(`tooth-${end}`);
        const containerEl = document
          .querySelector(".odontograma-container")
          ?.getBoundingClientRect();
        if (!startEl || !endEl || !containerEl) return null;

        const startBox = startEl.getBoundingClientRect();
        const endBox = endEl.getBoundingClientRect();

        const lineOffsetYStart = getOffsetY(
          start,
          offsetSuperior,
          offsetInferior
        );
        const lineOffsetYEnd = getOffsetY(end, offsetSuperior, offsetInferior);

        const x1 = startBox.left + startBox.width / 2 - containerEl.left;
        const y1 =
          startBox.top +
          startBox.height / 2 +
          lineOffsetYStart -
          containerEl.top;
        const x2 = endBox.left + endBox.width / 2 - containerEl.left;
        const y2 =
          endBox.top + endBox.height / 2 + lineOffsetYEnd - containerEl.top;
        const esDienteSuperior = parseInt(start) < 30;
        return (
          <g key={`ppf-${start}-${end}-${idx}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={x1}
              y1={y1}
              x2={x1}
              y2={esDienteSuperior ? y1 + verticalLength : y1 - verticalLength}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={x2}
              y1={y2}
              x2={x2}
              y2={esDienteSuperior ? y2 + verticalLength : y2 - verticalLength}
              stroke={color}
              strokeWidth={2}
            />
          </g>
        );
      })
  );
};

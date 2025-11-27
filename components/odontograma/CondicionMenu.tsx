"use client";
import React, { useState, useEffect } from "react";

interface CondicionMenuProps {
  toothId: string;
  selectedCondition: string | null;
  setSelectedCondition: React.Dispatch<React.SetStateAction<string | null>>;
  selectedColor: "red" | "blue" | null;
  selectedZone: string | null;
  setSelectedColor: (c: "red" | "blue" | null) => void;
  setZoneColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  updateTooth: (
    toothId: string,
    data: {
      zonas?: { zona: string; condicion: string; color: string }[];
      generales?: {
        condicion: string;
        icon: string;
        label?: string;
        color?: string;
      }[];
    }
  ) => void;
  setBorderColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onClose: () => void;
}

/* ============================================================
   LISTA DE CONDICIONES Y HABILITADAS
   Define dos arrays:
   - condiciones: todas las condiciones dentales posibles
   - habilitadas: condiciones que están actualmente disponibles
============================================================ */
const condiciones = [
  "Aparato ortodóntico fijo",
  "Aparato ortodóntico removible",
  "Corona",
  "Corona temporal",
  "Defectos de desarrollo del esmalte (DDE)",
  "Diastema",
  "Edéntulo total superior/inferior",
  "Espigo - muñón",
  "Fosas y fisuras profundas",
  "Fractura dental",
  "Fusion",
  "Geminación",
  "Giroversión",
  "Impactación",
  "Implante dental",
  "Lesión de caries dental",
  "Macrodoncia",
  "Microdoncia",
  "Movilidad patológica",
  "Pieza dentaria ausente",
  "Pieza dentaria en clavija",
  "Pieza dentaria ectópica",
  "Pieza dentaria en erupción",
  "Pieza dentaria extruida",
  "Pieza dentaria intruida",
  "Pieza dentaria supernumeraria",
  "Pulpotomía",
  "Posición anormal dentaria",
  "Prótesis dental parcial fija",
  "Prótesis dental completa superior/inferior",
  "Prótesis dental parcial removible",
  "Remanente radicular",
  "Restauración definitiva",
  "Restauración temporal",
  "Sellantes",
  "Superficie desgastada",
  "Tratamiento de conducto (TC) / Pulpectomía (PC)",
  "Transposicion dentaria",
];

const habilitadas = [
  "Aparato ortodóntico fijo",
  "Aparato ortodóntico removible",
  "Corona",
  "Corona temporal",
  "Defectos de desarrollo del esmalte (DDE)",
  "Diastema",
  "Edéntulo total superior/inferior",
  "Fosas y fisuras profundas",
  "Fusion",
  "Geminación",
  "Giroversión",
  "Impactación",
  "Implante dental",
  "Lesión de caries dental",
  "Macrodoncia",
  "Microdoncia",
  "Movilidad patológica",
  "Pieza dentaria ausente",
  "Pieza dentaria en clavija",
  "Pieza dentaria en erupción",
  "Pieza dentaria extruida",
  "Pieza dentaria intruida",
  "Pieza dentaria ectópica",
  "Posición anormal dentaria",
  "Prótesis dental parcial fija",
  "Pulpotomía",
  "Restauración definitiva",
  "Pieza dentaria supernumeraria",
  "Tratamiento de conducto (TC) / Pulpectomía (PC)",
  "Prótesis dental completa superior/inferior",
  "Prótesis dental parcial removible",
  "Remanente radicular",
  "Transposicion dentaria",
  "Espigo - muñón",
  "Fractura dental",
  "Restauración temporal",
  "Sellantes",
  "Superficie desgastada",
];

/* ============================================================
   DIENTES
   Define arrays con la numeración de dientes superiores e inferiores
   siguiendo la nomenclatura dental internacional
============================================================ */
const dientesSuperiores = [
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
];
const dientesInferiores = [
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

/* ============================================================
   SIGLAS Y FORMAS
   Define objetos que mapean:
   - opcionesCondiciones: cada condición con sus siglas permitidas
   - formasPorCondicion: el tipo de forma visual para cada condición
============================================================ */
const opcionesCondiciones: Record<string, string[]> = {
  Corona: ["CM", "CF", "CMC", "CV", "CLM"],
  "Corona temporal": ["CT"],
  "Defectos de desarrollo del esmalte (DDE)": ["PE", "O", "Fluorosis"],
  "Fosas y fisuras profundas": ["FFP"],
  "Implante dental": ["IMP"],
  "Lesión de caries dental": ["MB", "CE", "CD", "CDP"],
  Macrodoncia: ["MAC"],
  Microdoncia: ["MIC"],
  "Movilidad patológica": ["M1", "M2", "M3"],
  "Pieza dentaria ausente": ["DNE", "DEX", "DAO"],
  "Pieza dentaria ectópica": ["E"],
  //"Pieza dentaria supernumeraria": ["S"],
  "Posición anormal dentaria": ["M", "D", "V", "P", "L"],
  Pulpotomía: ["PP"],
  "Remanente radicular": ["RR"],
  "Restauración definitiva": ["AM", "R", "IV", "IM", "IE", "C"],
  //"Superficie desgastada": ["DES"],
  "Tratamiento de conducto (TC) / Pulpectomía (PC)": ["TC", "PC"],
  Impactación: ["I"],
};

const formasPorCondicion: Record<
  string,
  "square" | "circle" | "triangle" | "ausente" | "tratamiento_conducto"
> = {
  Corona: "square",
  "Corona temporal": "circle",
  "Defectos de desarrollo del esmalte (DDE)": "triangle",
  "Fosas y fisuras profundas": "triangle",
  "Implante dental": "circle",
  "Lesión de caries dental": "triangle",
  Macrodoncia: "square",
  Microdoncia: "square",
  "Movilidad patológica": "circle",
  "Pieza dentaria ausente": "ausente",
  "Pieza dentaria ectópica": "triangle",
  //"Pieza dentaria supernumeraria": "triangle",
  "Posición anormal dentaria": "square",
  Pulpotomía: "circle",
  "Remanente radicular": "triangle",
  "Restauración definitiva": "square",
  //"Superficie desgastada": "circle",
  "Tratamiento de conducto (TC) / Pulpectomía (PC)": "tratamiento_conducto",
  Impactación: "triangle",
};

/* ============================================================
   FUNCIONES AUXILIARES
   buildSiglaIcon: Construye el nombre del ícono basado en la condición,
   sigla y color seleccionados
============================================================ */
const buildSiglaIcon = (
  condicion: string,
  sigla: string,
  color: "red" | "blue"
) => {
  const forma = formasPorCondicion[condicion] || "square";
  const colorShort = color === "red" ? "R" : "B";
  return `${forma}_${sigla}_${colorShort}`;
};

/* ============================================================
   COMPONENTE PRINCIPAL
   CondicionMenu: Maneja la UI para seleccionar y aplicar condiciones
   dentales. Incluye:
   - Estado local para modales y selecciones
   - Funciones para guardar diferentes tipos de condiciones
   - Lógica de renderizado condicional para diferentes tipos de opciones
============================================================ */

export default function CondicionMenu({
  toothId,
  selectedCondition,
  setSelectedCondition,
  selectedColor,
  selectedZone,
  setSelectedColor,
  setZoneColors,
  updateTooth,
  setBorderColors,
  onClose,
}: CondicionMenuProps) {
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [rangeEnd, setRangeEnd] = useState<string>("");
  const [showDiastemaDirection, setShowDiastemaDirection] = useState(false);
  const [showFusionDirection, setShowFusionDirection] = useState(false);
  const [, setShowEspigaMuñonDirection] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [, setShowDrawingModal] = useState(false);
  //const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    setShowRangeModal(false);
    setRangeEnd("");
    setSelectedColor(null);
    setSelectedCondition(null);
  }, [toothId, setSelectedColor, setSelectedCondition]);

  const esDienteSuperior = dientesSuperiores.includes(toothId);
  const dientesParaMostrar = esDienteSuperior
    ? dientesSuperiores
    : dientesInferiores;

  const saveGeneralCondition = (
    condicion: string,
    icon: string,
    label?: string,
    color?: "red" | "blue"
  ) => {
    updateTooth(toothId, { generales: [{ condicion, icon, label, color }] });
    if (condicion === "Corona") {
      setZoneColors((prev) => ({
        ...prev,
        [`${toothId}_corona`]: color || "red",
      }));
    }
    if (color === "red")
      setBorderColors((prev) => ({ ...prev, [toothId]: "#ef4444" }));
    if (color === "blue")
      setBorderColors((prev) => ({ ...prev, [toothId]: "#3b82f6" }));
    onClose();
  };

  const saveZoneCondition = (color: "red" | "blue") => {
    if (!selectedZone) return;
    const key = `${toothId}_${selectedZone}`;
    setZoneColors((prev) => ({ ...prev, [key]: color }));
    setBorderColors((prev) => ({
      ...prev,
      [toothId]: color === "red" ? "#ef4444" : "#3b82f6",
    }));
    onClose();
  };

  const saveRangeCondition = (color: "red" | "blue") => {
    if (selectedCondition === "Edéntulo total superior/inferior") {
      const first = esDienteSuperior ? "18" : "48";
      const last = esDienteSuperior ? "28" : "38";
      saveGeneralCondition("etsi", `etsi_${first}_${last}_${color}`);
      return;
    }
    if (selectedCondition === "Prótesis dental completa superior/inferior") {
      const first = esDienteSuperior ? "18" : "48";
      const last = esDienteSuperior ? "28" : "38";
      saveGeneralCondition("PDCS", `pdcs_${first}_${last}_${color}`);
      return;
    }

    if (!rangeEnd) return alert("Debes seleccionar el diente final.");

    if (selectedCondition === "Prótesis dental parcial fija") {
      const inicioIcon = `ppf_inicio_${color}`;
      const lineIcon = `ppf_${toothId}_${rangeEnd}_${color}`;
      const finIcon = `ppf_fin_${color}`;

      updateTooth(toothId, {
        generales: [
          {
            condicion: `Prótesis parcial fija - inicio`,
            icon: inicioIcon,
            color,
          },
          { condicion: `Línea PPF`, icon: lineIcon, color },
        ],
      });

      updateTooth(rangeEnd, {
        generales: [
          { condicion: `Prótesis parcial fija - fin`, icon: finIcon, color },
        ],
      });

      setShowRangeModal(false);
      onClose();
      return;
    }

    if (!rangeEnd) return alert("Debes seleccionar el diente final.");
    const isRemovible = selectedCondition === "Aparato ortodóntico removible";
    const isProtesisParcial =
      selectedCondition === "Prótesis dental parcial removible";
    const inicioIcon = isRemovible
      ? `aparato_remo_inicio_${color}`
      : isProtesisParcial
      ? `pdpr_inicio_${color}`
      : `aparato_inicio_${color}`;
    const finIcon = isRemovible
      ? `aparato_remo_fin_${color}`
      : isProtesisParcial
      ? `pdpr_fin_${color}`
      : `aparato_fin_${color}`;
    const lineIcon = isRemovible
      ? `aor_${toothId}_${rangeEnd}_${color}`
      : isProtesisParcial
      ? `pdpr_${toothId}_${rangeEnd}_${color}`
      : `aof_${toothId}_${rangeEnd}_${color}`;

    updateTooth(toothId, {
      generales: [{ condicion: `linea ${selectedCondition}`, icon: lineIcon }],
    });
    updateTooth(toothId, {
      generales: [
        { condicion: `${selectedCondition} - inicio`, icon: inicioIcon },
      ],
    });
    updateTooth(rangeEnd, {
      generales: [{ condicion: `${selectedCondition} - fin`, icon: finIcon }],
    });

    setShowRangeModal(false);
    onClose();
  };

  const handleSelect = (value: string | "red" | "blue") => {
    const acciones: Record<string, () => void> = {
      "Aparato ortodóntico fijo": () => {
        setSelectedColor(value as "red" | "blue");
        setShowRangeModal(true);
      },
      "Aparato ortodóntico removible": () => {
        setSelectedColor(value as "red" | "blue");
        setShowRangeModal(true);
      },
      "Prótesis dental parcial fija": () => {
        setSelectedColor(value as "red" | "blue");
        setShowRangeModal(true);
      },

      "Edéntulo total superior/inferior": () =>
        saveRangeCondition(value as "red" | "blue"),
      "Prótesis dental completa superior/inferior": () =>
        saveRangeCondition(value as "red" | "blue"),
      "Prótesis dental parcial removible": () => {
        setSelectedColor(value as "red" | "blue");
        setShowRangeModal(true);
      },
      Diastema: () => {
        setShowDiastemaDirection(true);
      },
      Fusion: () => {
        setShowFusionDirection(true);
      },

      Geminación: () => {
        updateTooth(toothId, {
          generales: [
            {
              condicion: "geminacion",
              icon: `geminacion_blue`,
              color: "blue",
            },
          ],
        });
        setBorderColors((prev) => ({
          ...prev,
          [toothId]: "#3b82f6",
        }));
        onClose();
        setSelectedCondition(null);
      },
      PiezaClavija: () => {
        updateTooth(toothId, {
          generales: [
            {
              condicion: "clavija",
              icon: `clavija_blue`,
              color: "blue",
            },
          ],
        });
        setBorderColors((prev) => ({
          ...prev,
          [toothId]: "#3b82f6",
        }));
        onClose();
        setSelectedCondition(null);
      },
    };

    if (
      selectedCondition &&
      opcionesCondiciones[selectedCondition] &&
      typeof value === "string"
    ) {
      saveGeneralCondition(
        selectedCondition,
        `${selectedCondition}_${value}`,
        value
      );
      return;
    }

    (
      acciones[selectedCondition!] ||
      (() => saveZoneCondition(value as "red" | "blue"))
    )();
  };

  return (
    <div className='bg-background rounded-2xl w-full h-full flex flex-col'>
      <h2 className='text-lg font-semibold text-primary p-4 border-b sticky top-0 bg-background z-10'>
        Condición del diente {toothId}
      </h2>
      {/* Campo de búsqueda */}
      <div className='p-4 sticky top-0 bg-background z-10 border-b'>
        <input
          type='text'
          placeholder='Buscar condición...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm bg-background text-foreground'
        />
      </div>
      <hr />
      {!selectedCondition ? (
        // ---------- Lista de condiciones ----------
        <ul className='flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-2'>
          {condiciones
            .filter((c) =>
              c.toLowerCase().startsWith(searchTerm.toLowerCase().trim())
            )
            .map((c) => (
              <li
                key={c}
                className={`p-2 border rounded-lg text-sm min-h-[40px] flex items-center ${
                  habilitadas.includes(c)
                    ? "cursor-pointer hover:bg-primary/10"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!habilitadas.includes(c)) return;

                  switch (c) {
                    case "Espigo - muñón":
                      setShowEspigaMuñonDirection(true);
                      setSelectedCondition(c);
                      break;
                    case "Fractura dental":
                    case "Restauración temporal":
                    case "Sellantes":
                    case "Superficie desgastada":
                      setSelectedCondition(c);
                      setShowDrawingModal(true);
                      break;

                    // ---------- Geminación ----------
                    case "Geminación":
                      updateTooth(toothId, {
                        generales: [
                          {
                            condicion: "geminacion",
                            icon: `geminacion_blue`,
                            color: "blue",
                          },
                        ],
                      });
                      setBorderColors((prev) => ({
                        ...prev,
                        [toothId]: "#3b82f6",
                      }));
                      onClose();
                      break;

                    // ---------- Diastema ----------
                    case "Diastema":
                      setSelectedCondition(c);
                      break;

                    // ---------- Fusión ----------
                    case "Fusion":
                      setSelectedCondition(c);
                      break;

                    // ---------- Giroversión ----------
                    case "Giroversión":
                      setSelectedCondition(c);
                      break;
                    case "Transposición dentaria":
                      setSelectedCondition(c);
                      break;
                    case "Pieza dentaria supernumeraria":
                      setSelectedCondition(c);
                      break;

                    case "Pieza dentaria en clavija":
                      updateTooth(toothId, {
                        generales: [
                          {
                            condicion: "clavija",
                            icon: `clavija_blue`,
                            color: "blue",
                          },
                        ],
                      });
                      setBorderColors((prev) => ({
                        ...prev,
                        [toothId]: "#3b82f6",
                      }));
                      onClose();
                      break;
                    case "Pieza dentaria en erupción":
                      updateTooth(toothId, {
                        generales: [
                          {
                            condicion: "erupcion",
                            icon: `erupcion_blue`,
                            color: "blue",
                          },
                        ],
                      });
                      setBorderColors((prev) => ({
                        ...prev,
                        [toothId]: "#3b82f6",
                      }));
                      onClose();
                      break;
                    case "Pieza dentaria extruida":
                      updateTooth(toothId, {
                        generales: [
                          {
                            condicion: "extruida",
                            icon: `extruida_blue`,
                            color: "blue",
                          },
                        ],
                      });
                      setBorderColors((prev) => ({
                        ...prev,
                        [toothId]: "#3b82f6",
                      }));
                      onClose();
                      break;
                    case "Pieza dentaria intruida":
                      updateTooth(toothId, {
                        generales: [
                          {
                            condicion: "intruida",
                            icon: `intruida_blue`,
                            color: "blue",
                          },
                        ],
                      });
                      setBorderColors((prev) => ({
                        ...prev,
                        [toothId]: "#3b82f6",
                      }));
                      onClose();
                      break;
                    case "Pieza dentaria ausente":
                      setSelectedCondition("Pieza dentaria ausente");
                      break;
                    case "Tratamiento de conducto (TC) / Pulpectomía (PC)":
                      setSelectedCondition(
                        "Tratamiento de conducto (TC) / Pulpectomía (PC)"
                      );
                      break;

                    // ---------- Otras condiciones ----------
                    default:
                      setSelectedCondition(c);
                  }
                }}
              >
                {c}
              </li>
            ))}
        </ul>
      ) : opcionesCondiciones[selectedCondition] ? (
        // ---------- Condiciones con opciones de color ----------
        <div className='flex flex-col items-center gap-4 p-4'>
          <p className='text-sm text-muted-foreground'>
            Selecciona tipo de {selectedCondition.toLowerCase()}:
          </p>
          <div className='flex flex-col gap-2'>
            {opcionesCondiciones[selectedCondition].map((opt) => {
              // Determinamos si la condición requiere zona + general
              const requiresZone = [
                "Lesión de caries dental",
                "Pulpotomía",
                "Restauración definitiva",
              ].includes(selectedCondition);
              // Determinamos si permite azul
              const allowBlue = [
                "Corona",
                "Pulpotomía",
                "Restauración definitiva",
                "Tratamiento de conducto (TC) / Pulpectomía (PC)",
                "Implante dental",
              ].includes(selectedCondition);
              const soloAzul = [
                "Impactación",
                "Macrodoncia",
                "Microdoncia",
                "Pieza dentaria ausente",
                "Pieza dentaria ectópica",
                "Posición anormal dentaria",
              ].includes(selectedCondition);

              // Función helper para actualizar diente
              const handleUpdate = (color: "red" | "blue") => {
                if (requiresZone && (!toothId || !selectedZone)) {
                  alert(
                    "Primero seleccione un diente y una zona antes de marcar esta condición."
                  );
                  return;
                }

                if (requiresZone) {
                  updateTooth(toothId, {
                    zonas: [
                      {
                        zona: selectedZone!,
                        condicion: selectedCondition!,
                        color,
                      },
                    ],
                    generales: [
                      {
                        condicion: selectedCondition!,
                        icon: buildSiglaIcon(selectedCondition!, opt, color),
                        label: opt,
                        color,
                      },
                    ],
                  });
                } else {
                  saveGeneralCondition(
                    selectedCondition!,
                    buildSiglaIcon(selectedCondition!, opt, color),
                    opt,
                    color
                  );
                }

                setSelectedCondition(null);
                onClose();
              };

              return (
                <div
                  key={opt}
                  className='flex gap-2'
                >
                  {/* 🔴 Botón rojo — se oculta si la condición es soloAzul */}
                  {!soloAzul && (
                    <button
                      className='bg-red-500 text-white px-4 py-2 rounded-lg'
                      onClick={() => handleUpdate("red")}
                    >
                      {opt}
                    </button>
                  )}

                  {/* 🔵 Botón azul — aparece si la condición lo permite o si es soloAzul */}
                  {(allowBlue || soloAzul) && (
                    <button
                      className='bg-blue-500 text-white px-4 py-2 rounded-lg'
                      onClick={() => handleUpdate("blue")}
                    >
                      {opt}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button
            className='bg-green-500 text-white px-4 py-2 rounded-lg mt-4'
            onClick={() => setSelectedCondition(null)}
          >
            Volver a condiciones
          </button>
        </div>
      ) : (
        // ---------- Otras condiciones que solo necesitan dirección o color ----------
        <div className='flex flex-col items-center justify-center flex-1 gap-4 p-4'>
          <p className='text-sm text-muted-foreground'>
            {selectedCondition === "Diastema"
              ? "Selecciona la dirección del diastema"
              : selectedCondition === "Fusion"
              ? "Selecciona la dirección de la fusión"
              : selectedCondition === "Giroversión"
              ? "Selecciona la dirección de la giroversión"
              : selectedCondition === "Transposicion dentaria"
              ? "Selecciona la dirección de la transposición dentaria"
              : selectedCondition === "Pieza dentaria supernumeraria"
              ? "Selecciona la dirección de la pieza dentaria supernumeraria"
              : selectedCondition === "Espiga - muñón"
              ? "Selecciona la dirección de la espiga - muñón"
              : selectedCondition === "Fractura dental"
              ? "Selecciona la dirección de la fractura dental"
              : `Elige un color para "${selectedCondition}"`}
          </p>

          {selectedCondition === "Diastema" ? (
            <div className='flex gap-4'>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "diastema",
                        icon: `diastema_izq_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  onClose();
                }}
              >
                Izquierda
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "diastema",
                        icon: `diastema_der_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  onClose();
                }}
              >
                Derecha
              </button>
            </div>
          ) : selectedCondition === "Fusion" ? (
            // Botones dirección Fusión
            <div className='flex gap-4'>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "fusion",
                        icon: `fusion_izq_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  onClose();
                }}
              >
                Izquierda
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "fusion",
                        icon: `fusion_der_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  onClose();
                }}
              >
                Derecha
              </button>
            </div>
          ) : selectedCondition === "Espigo - muñón" ? (
            <div className='flex flex-col gap-3'>
              {/* Botones azules */}
              <div className='flex gap-4'>
                {["izq", "cen", "der"].map((dir) => (
                  <button
                    key={`azul-${dir}`}
                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                    onClick={() => {
                      updateTooth(toothId, {
                        generales: [
                          {
                            condicion: "espiga-muñon",
                            icon: `espiga_${dir}_blue`,
                            color: "blue",
                          },
                        ],
                      });
                      setBorderColors((prev) => ({
                        ...prev,
                        [toothId]: "#3b82f6",
                      }));
                      setSelectedCondition(null);
                      onClose();
                    }}
                  >
                    {dir === "izq"
                      ? "Izquierda"
                      : dir === "cen"
                      ? "Centro"
                      : "Derecha"}
                  </button>
                ))}
              </div>

              {/* Botones rojos */}
              <div className='flex gap-4'>
                {["izq", "cen", "der"].map((dir) => (
                  <button
                    key={`rojo-${dir}`}
                    className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg'
                    onClick={() => {
                      updateTooth(toothId, {
                        generales: [
                          {
                            condicion: "espiga-muñon",
                            icon: `espiga_${dir}_red`,
                            color: "red",
                          },
                        ],
                      });
                      setBorderColors((prev) => ({
                        ...prev,
                        [toothId]: "#ef4444",
                      }));
                      setSelectedCondition(null);
                      onClose();
                    }}
                  >
                    {dir === "izq"
                      ? "Izquierda"
                      : dir === "cen"
                      ? "Centro"
                      : "Derecha"}
                  </button>
                ))}
              </div>
            </div>
          ) : selectedCondition === "Pieza dentaria en clavija" ? (
            <div className='flex gap-4'>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "clavija",
                        icon: `clavija_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  onClose();
                }}
              >
                Marcar pieza en clavija
              </button>
            </div>
          ) : selectedCondition === "Giroversión" ? (
            <div className='flex gap-4'>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "giro",
                        icon: `giro_izq_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  onClose();
                }}
              >
                Izquierda
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "giro",
                        icon: `giro_der_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  onClose();
                }}
              >
                Derecha
              </button>
            </div>
          ) : selectedCondition === "Pieza dentaria ausente" ? (
            <div className='flex flex-col gap-2'>
              {opcionesCondiciones["Pieza dentaria ausente"]?.map((sigla) => (
                <button
                  key={sigla}
                  className='bg-blue-500 text-white px-4 py-2 rounded-lg'
                  onClick={() => {
                    updateTooth(toothId, {
                      generales: [
                        {
                          condicion: "ausente",
                          icon: "ausente_blue",
                          label: sigla,
                          color: "blue",
                        },
                      ],
                    });
                    setBorderColors((prev) => ({
                      ...prev,
                      [toothId]: "#3b82f6",
                    }));
                    onClose();
                    setSelectedCondition(null);
                  }}
                >
                  {sigla}
                </button>
              ))}
            </div>
          ) : selectedCondition ===
            "Tratamiento de conducto (TC) / Pulpectomía (PC)" ? (
            <div className='flex flex-col gap-2'>
              {opcionesCondiciones[
                "Tratamiento de conducto (TC) / Pulpectomía (PC)"
              ]?.map((sigla) => (
                <button
                  key={sigla}
                  className='bg-blue-500 text-white px-4 py-2 rounded-lg'
                  onClick={() => {
                    updateTooth(toothId, {
                      generales: [
                        {
                          condicion: "tratamiento_conducto",
                          icon: "tratamiento_conducto_blue",
                          label: sigla,
                          color: "blue",
                        },
                      ],
                    });
                    setBorderColors((prev) => ({
                      ...prev,
                      [toothId]: "#3b82f6",
                    }));
                    onClose();
                    setSelectedCondition(null);
                  }}
                >
                  {sigla}
                </button>
              ))}
            </div>
          ) : selectedCondition === "Transposicion dentaria" ? (
            <div className='flex gap-4'>
              <button
                className='bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "transposicion",
                        icon: `trans_izq_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#22c55e",
                  }));
                  onClose();
                }}
              >
                Izquierda
              </button>
              <button
                className='bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "transposicion",
                        icon: `trans_der_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#0000ff",
                  }));
                  onClose();
                }}
              >
                Derecha
              </button>
            </div>
          ) : selectedCondition === "Pieza dentaria supernumeraria" ? (
            <div className='flex gap-4'>
              <button
                className='bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "supernumeraria",
                        icon: `supernumeraria_izq_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#22c55e",
                  }));
                  onClose();
                }}
              >
                Izquierda
              </button>
              <button
                className='bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "supernumeraria",
                        icon: `supernumeraria_der_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#0000ff",
                  }));
                  onClose();
                }}
              >
                Derecha
              </button>
            </div>
          ) : selectedCondition === "Fractura dental" ? (
            <div className='flex gap-4'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-lg'
                onClick={() => setSelectedColor("red")}
              >
                Rojo
              </button>
              {/* <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setSelectedColor("blue")}
              >
                Azul
              </button> */}
            </div>
          ) : selectedCondition === "Restauración temporal" ? (
            <div className='flex gap-4'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-lg'
                onClick={() => setSelectedColor("red")}
              >
                Rojo
              </button>
              {/* <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setSelectedColor("blue")}
              >
                Azul
              </button> */}
            </div>
          ) : selectedCondition === "Sellantes" ? (
            <div className='flex gap-4'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  setSelectedColor("red");
                  if (toothId) {
                    updateTooth(toothId, {
                      generales: [
                        {
                          condicion: "Sellantes",
                          icon: `path_${toothId}`,
                          color: "red",
                          label: "S", // <-- aquí pones "S"
                        },
                      ],
                    });
                  }
                }}
              >
                Rojo
              </button>

              <button
                className='bg-blue-500 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  setSelectedColor("blue");
                  if (toothId) {
                    updateTooth(toothId, {
                      generales: [
                        {
                          condicion: "Sellantes",
                          icon: `path_${toothId}`,
                          color: "blue",
                          label: "S", // <-- también "S" aquí
                        },
                      ],
                    });
                  }
                }}
              >
                Azul
              </button>
            </div>
          ) : selectedCondition === "Superficie desgastada" ? (
            <div className='flex gap-4'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "Superficie desgastada",
                        icon: `path_${toothId}`,
                        color: "red",
                        label: "DES", // solo agregamos el label extra
                      },
                    ],
                  });
                  setSelectedColor("red");
                }}
              >
                Rojo
              </button>
            </div>
          ) : (
            // Botones color general
            <div className='flex gap-4'>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-lg'
                onClick={() => handleSelect("red")}
              >
                Rojo
              </button>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded-lg'
                onClick={() => handleSelect("blue")}
              >
                Azul
              </button>
            </div>
          )}

          <button
            className='bg-green-500 text-white px-4 py-2 rounded-lg mt-4'
            onClick={() => setSelectedCondition(null)}
          >
            Volver a condiciones
          </button>
        </div>
      )}

      {showRangeModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-background p-6 rounded-xl shadow-lg w-full max-w-3xl flex flex-col gap-4'>
            <h3 className='text-lg font-semibold text-center'>
              Selecciona el diente final
            </h3>
            <p className='text-center text-sm text-muted-foreground'>
              Diente actual:{" "}
              <span className='font-bold text-primary'>{toothId}</span>
            </p>
            <div className='flex gap-2 overflow-x-auto py-1 px-1'>
              {dientesParaMostrar.map((d) => (
                <button
                  key={d}
                  onClick={() => setRangeEnd(d)}
                  className={`px-3 py-2 border rounded transition-colors ${
                    rangeEnd === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  } ${d === toothId ? "ring-2 ring-blue-400 font-bold" : ""}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className='flex gap-2'>
              <button
                className='flex-1 bg-gray-400 text-white py-2 rounded'
                onClick={() => setShowRangeModal(false)}
              >
                Cancelar
              </button>
              <button
                className='flex-1 bg-blue-600 text-white py-2 rounded'
                onClick={() => saveRangeCondition(selectedColor!)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDiastemaDirection && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-background rounded-xl p-6 shadow-lg w-80 flex flex-col items-center gap-4'>
            <h3 className='text-lg font-semibold text-primary'>
              Dirección del diastema
            </h3>
            <p className='text-sm text-muted-foreground'>
              Selecciona hacia dónde va el espacio
            </p>
            <div className='flex gap-4'>
              <button
                className='bg-primary/10 hover:bg-primary/20 text-primary font-medium px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "diastema",
                        icon: `diastema_izq_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  setShowDiastemaDirection(false);
                  onClose();
                }}
              >
                Izquierda
              </button>

              <button
                className='bg-primary/10 hover:bg-primary/20 text-primary font-medium px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "diastema",
                        icon: `diastema_der_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  setShowDiastemaDirection(false);
                  onClose();
                }}
              >
                Derecha
              </button>
            </div>

            <button
              className='mt-4 text-muted-foreground text-sm underline'
              onClick={() => setShowDiastemaDirection(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {/* ============================================================
     MODAL: Dirección de FUSIÓN
============================================================ */}
      {showFusionDirection && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-background rounded-xl p-6 shadow-lg w-80 flex flex-col items-center gap-4'>
            <h3 className='text-lg font-semibold text-primary'>
              Dirección de la fusión
            </h3>
            <p className='text-sm text-muted-foreground'>
              Selecciona hacia qué lado ocurre la fusión
            </p>

            <div className='flex gap-4'>
              <button
                className='bg-primary/10 hover:bg-primary/20 text-primary font-medium px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "fusion",
                        icon: `fusion_izq_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  setShowFusionDirection(false);
                  onClose();
                }}
              >
                Izquierda
              </button>

              <button
                className='bg-primary/10 hover:bg-primary/20 text-primary font-medium px-4 py-2 rounded-lg'
                onClick={() => {
                  updateTooth(toothId, {
                    generales: [
                      {
                        condicion: "fusion",
                        icon: `fusion_der_blue`,
                        color: "blue",
                      },
                    ],
                  });
                  setBorderColors((prev) => ({
                    ...prev,
                    [toothId]: "#3b82f6",
                  }));
                  setShowFusionDirection(false);
                  onClose();
                }}
              >
                Derecha
              </button>
            </div>

            <button
              className='mt-4 text-muted-foreground text-sm underline'
              onClick={() => setShowFusionDirection(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

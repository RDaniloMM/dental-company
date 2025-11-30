"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ToothCard from "./ToothCard";
import CondicionMenu from "./CondicionMenu";
import {
  renderAOF,
  renderAOR,
  renderPDCS,
  renderPDPR,
  renderETSI,
  renderDiastema,
  renderFusion,
  renderGeminacion,
  renderGiroversion,
  renderPiezaAusente,
  renderPiezaClavija,
  renderPiezaErupcion,
  renderPiezaExtruida,
  renderPiezaIntruida,
  renderTransposicion,
  renderProtesisParcialFija,
  renderSupernumeraria,
  renderTratamientoConducto,
  renderEspigaMunon,
} from "./renderLines";

interface ToothData {
  zonas: { zona: string; condicion: string; color: string }[];
  generales: {
    condicion: string;
    icon: string;
    drawPath?: string;
    label?: string;
    color?: string;
  }[];
}

interface Props {
  teethList: string[];
  odontograma: Record<string, ToothData>;
  setOdontograma: React.Dispatch<
    React.SetStateAction<Record<string, ToothData>>
  >;
  borderColors: Record<string, string>;
  setBorderColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isChild: boolean;
}

export default function OdontogramaSVG({
  teethList,
  odontograma,
  setOdontograma,
  borderColors,
  setBorderColors,
  isChild,
}: Props) {
  const [selectedTooth, setSelectedTooth] = useState<{
    id: string;
    isTop: boolean;
  } | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<"red" | "blue" | null>(
    null
  );
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [zoneColors, setZoneColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newZoneColors: Record<string, string> = {};
    const newBorderColors: Record<string, string> = {};

    Object.entries(odontograma).forEach(([toothId, toothData]) => {
      toothData.zonas.forEach((zona) => {
        newZoneColors[`${toothId}_${zona.zona}`] = zona.color;
      });

      toothData.generales.forEach((gen) => {
        if (gen.color) {
          if (gen.condicion.includes("Corona")) {
            newZoneColors[`${toothId}_corona`] = gen.color;
            newBorderColors[toothId] = gen.color;
          }
        }
      });
    });

    setZoneColors(newZoneColors);
    setBorderColors(newBorderColors);
  }, [odontograma, setBorderColors]);

  const updateTooth = (toothId: string, data: Partial<ToothData>) => {
    setOdontograma((prev) => ({
      ...prev,
      [toothId]: {
        zonas: [...(prev[toothId]?.zonas || []), ...(data.zonas || [])],
        generales: [
          ...(prev[toothId]?.generales || []),
          ...(data.generales || []),
        ],
      },
    }));
  };

  const midPoint = Math.ceil(teethList.length / 2);
  const topTeeth = teethList.slice(0, midPoint);
  const bottomTeeth = teethList.slice(midPoint);

  return (
    <div className='relative flex flex-col items-center gap-5 p-4 odontograma-container'>
      <div className='flex gap-1'>
        {topTeeth.map((id, index) =>
          id && id !== "-" ? (
            <ToothCard
              key={id}
              id={id}
              isTop
              odontograma={odontograma}
              zoneColors={zoneColors}
              setSelectedTooth={setSelectedTooth}
              onZoneSelect={(zone) => setSelectedZone(zone)}
              borderColor={"#ccc"}
            />
          ) : (
            <ToothCard
              key={`empty-top-${index}`}
              id="18" // Dummy ID for shape
              isTop
              odontograma={{}}
              zoneColors={{}}
              setSelectedTooth={() => { }}
              onZoneSelect={() => { }}
              borderColor="transparent"
              placeholder
            />
          )
        )}
      </div>
      <div className='flex gap-1'>
        {bottomTeeth.map((id, index) =>
          id && id !== "-" ? (
            <ToothCard
              key={id}
              id={id}
              isTop={false}
              odontograma={odontograma}
              zoneColors={zoneColors}
              setSelectedTooth={setSelectedTooth}
              onZoneSelect={(zone) => setSelectedZone(zone)}
              borderColor={borderColors[id] || "#ccc"}
            />
          ) : (
            <ToothCard
              key={`empty-bottom-${index}`}
              id="48" // Dummy ID for shape
              isTop={false}
              odontograma={{}}
              zoneColors={{}}
              setSelectedTooth={() => { }}
              onZoneSelect={() => { }}
              borderColor="transparent"
              placeholder
            />
          )
        )}
      </div>

      <svg className='absolute top-0 left-0 w-full h-full pointer-events-none'>
        {renderAOF(odontograma)}
        {renderAOR(odontograma)}
        {renderPDCS(odontograma)}
        {renderPDPR(odontograma)}
        {renderETSI(odontograma)}
        {renderDiastema(odontograma)}
        {renderFusion(odontograma)}
        {renderGeminacion(odontograma)}
        {renderGiroversion(odontograma)}
        {renderPiezaAusente(odontograma)}
        {renderPiezaClavija(odontograma)}
        {renderPiezaErupcion(odontograma)}
        {renderPiezaExtruida(odontograma)}
        {renderPiezaIntruida(odontograma)}
        {renderTransposicion(odontograma)}
        {renderProtesisParcialFija(odontograma)}
        {renderSupernumeraria(odontograma)}
        {renderTratamientoConducto(odontograma)}
        {renderEspigaMunon(odontograma)}
      </svg>

      <AnimatePresence>
        {selectedTooth && (
          <motion.div
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
            onClick={() => setSelectedTooth(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-background rounded-3xl shadow-xl p-6 max-w-[800px] w-full max-h-[90vh] flex flex-col overflow-hidden border border-border'
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className='text-2xl font-semibold mb-4 text-center text-primary'>
                Diente {selectedTooth.id}
              </h2>

              <div className='flex w-full gap-4'>
                <div className='flex-1 flex flex-col justify-center items-center bg-muted p-4 rounded-xl relative'>
                  {/* Diente base */}
                  <ToothCard
                    id={selectedTooth.id}
                    isTop={selectedTooth.isTop}
                    odontograma={odontograma}
                    zoneColors={zoneColors}
                    setSelectedTooth={() => { }}
                    onZoneSelect={(zone) => setSelectedZone(zone)}
                    borderColor={borderColors[selectedTooth.id] || "#ccc"}
                  />

                  {/* Overlay de dibujo para condiciones específicas */}
                  {[
                    "Fractura dental",
                    "Restauración temporal",
                    "Sellantes",
                    "Superficie desgastada",
                  ].includes(selectedCondition ?? "") && (
                      <DrawingOverlay
                        toothId={selectedTooth.id}
                        drawColor={selectedColor || "blue"} // color que viene de CondicionMenu
                        onSave={(newDraw) => {
                          // Solo agregar path si realmente hay dibujo
                          if (!newDraw.drawPath) return;

                          setOdontograma((prev) => {
                            const current = prev[selectedTooth.id] || {
                              zonas: [],
                              generales: [],
                            };

                            return {
                              ...prev,
                              [selectedTooth.id]: {
                                ...current,
                                generales: [
                                  ...current.generales,
                                  {
                                    condicion: selectedCondition!, // la condición seleccionada
                                    icon: `path_${selectedTooth.id}`,
                                    drawPath: newDraw.drawPath,
                                    color: newDraw.color,
                                  },
                                ],
                              },
                            };
                          });
                        }}
                        onClose={() => {
                          setSelectedTooth(null);
                          setSelectedZone(null);
                        }}
                      />
                    )}
                </div>

                <div className='flex-1 overflow-y-auto max-h-[65vh] p-2 border-l border-border'>
                  <CondicionMenu
                    toothId={selectedTooth.id}
                    selectedCondition={selectedCondition}
                    selectedColor={selectedColor}
                    selectedZone={selectedZone}
                    setSelectedCondition={setSelectedCondition}
                    setSelectedColor={setSelectedColor}
                    setZoneColors={setZoneColors}
                    updateTooth={updateTooth}
                    setBorderColors={setBorderColors}
                    onClose={() => {
                      setSelectedTooth(null);
                      setSelectedZone(null);
                    }}
                    isChild={isChild}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function DrawingOverlay({
  toothId,
  drawColor,
  onSave,
  onClose,
}: {
  toothId: string;
  drawColor: "red" | "blue" | string;
  onSave?: (newDraw: {
    toothId: string;
    drawPath: string;
    color: string;
  }) => void;
  onClose?: () => void;
}) {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [path, setPath] = React.useState<string[]>([]);
  const topCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const bottomCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 500;

  const startDraw = (e: React.MouseEvent, isTop: boolean) => {
    setIsDrawing(true);
    const canvas = isTop ? topCanvasRef.current : bottomCanvasRef.current;
    const rect = canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPath((prev) => [...prev, `M ${x} ${y}`]);
    const ctx = canvas!.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent, isTop: boolean) => {
    if (!isDrawing) return;
    const canvas = isTop ? topCanvasRef.current : bottomCanvasRef.current;
    const rect = canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPath((prev) => [...prev, `L ${x} ${y}`]);
    const ctx = canvas!.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDraw = () => setIsDrawing(false);

  const handleSave = () => {
    if (path.length > 0 && onSave) {
      const scaleX = 220 / CANVAS_WIDTH;
      const scaleY = 250 / CANVAS_HEIGHT;

      const scaledPath = path.map((seg) => {
        const [cmd, xStr, yStr] = seg.split(" ");
        const x = parseFloat(xStr) * scaleX;
        const y = parseFloat(yStr) * scaleY;
        return `${cmd} ${x} ${y}`;
      });

      onSave({ toothId, drawPath: scaledPath.join(" "), color: drawColor });
      setPath([]);
    }
    if (onClose) onClose();
  };

  return (
    <>
      {/* Canvas superior */}
      <canvas
        ref={topCanvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className='absolute inset-0 m-auto z-20 cursor-crosshair'
        style={{
          top: "100%",
          left: "50%",
          transform: "translate(-50%, -42%)",
        }}
        onMouseDown={(e) => startDraw(e, true)}
        onMouseMove={(e) => draw(e, true)}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />

      {/* Canvas inferior */}
      <canvas
        ref={bottomCanvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className='absolute inset-0 m-auto z-20 cursor-crosshair'
        style={{
          top: "100%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onMouseDown={(e) => startDraw(e, false)}
        onMouseMove={(e) => draw(e, false)}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />

      {/* Botón guardar */}
      <div className='absolute bottom-2 right-2 flex gap-2 z-30'>
        <button
          onClick={handleSave}
          className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
        >
          Guardar
        </button>
      </div>
    </>
  );
}

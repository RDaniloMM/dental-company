"use client";
import React, { useEffect, useRef } from "react";
import { X, Trash2, Smile, Droplet, HardDrive, Crown, Shield } from "lucide-react";

export type CondicionValue =
  | "sano"
  | "caries"
  | "resina"
  | "amalgama"
  | "extraccion_programada"
  | "diente_ausente"
  | "corona"
  | "sellante";

interface Props {
  x: number;
  y: number;
  onSelect: (val: CondicionValue) => void;
  onDeletePart: () => void;
  onClose: () => void;
}

const OPTIONS: { label: string; value: CondicionValue; colorClass: string; icon: React.ReactNode }[] = [
  { label: "Caries", value: "caries", colorClass: "text-red-600", icon: <Droplet className="w-4 h-4 inline mr-2" /> },
  { label: "Resina", value: "resina", colorClass: "text-blue-600", icon: <HardDrive className="w-4 h-4 inline mr-2" /> },
  { label: "Amalgama", value: "amalgama", colorClass: "text-gray-600", icon: <Shield className="w-4 h-4 inline mr-2" /> },
  { label: "Corona", value: "corona", colorClass: "text-yellow-600", icon: <Crown className="w-4 h-4 inline mr-2" /> },
  { label: "Sellante", value: "sellante", colorClass: "text-green-600", icon: <Smile className="w-4 h-4 inline mr-2" /> },
  { label: "Extracción programada", value: "extraccion_programada", colorClass: "text-purple-600", icon: <X className="w-4 h-4 inline mr-2" /> },
  { label: "Diente ausente", value: "diente_ausente", colorClass: "text-gray-400", icon: <X className="w-4 h-4 inline mr-2" /> },
];
const MENU_OFFSET_Y = 50; // distancia en píxeles hacia arriba

export default function CondicionMenu({ x, y, onSelect, onDeletePart, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (

<div
  ref={menuRef}
  role="dialog"
  aria-label="Menú de condición"
  className="fixed z-50 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden transition-transform duration-150 transform scale-95 opacity-0 animate-menuFade"
  style={{ top: y - MENU_OFFSET_Y, left: x }}
>
  <ul className="divide-y divide-gray-100">
    {OPTIONS.map((opt) => (
  <li
    key={opt.value}
    onClick={(e) => {
      e.stopPropagation();
      onSelect(opt.value);
    }}
    className={`px-4 py-3 cursor-pointer text-base flex items-center transition-all duration-200 ease-in-out rounded-lg
      ${opt.colorClass} hover:opacity-80 hover:bg-gray-100`}
  >
    {opt.icon} {opt.label}
  </li>
))}


    <li
      className="px-4 py-3 hover:bg-red-50 cursor-pointer text-base text-red-600 flex items-center transition-all duration-200 ease-in-out rounded-lg"
      onClick={onDeletePart}
    >
      <Trash2 className="w-4 h-4 inline mr-2" /> Eliminar condición
    </li>
  </ul>

  {/* Animación */}
  <style jsx>{`
    @keyframes menuFade {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }
    .animate-menuFade {
      animation: menuFade 0.15s ease-out forwards;
    }
  `}</style>
</div>

  );
}

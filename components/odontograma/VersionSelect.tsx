"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type VersionSelectProps = {
  versiones: number[];
  selectedVersion?: number | null;
  onSelectVersion: (v: number) => void;
  isLoading?: boolean;
};

export default function VersionSelect({
  versiones,
  selectedVersion,
  onSelectVersion,
  isLoading = false,
}: VersionSelectProps) {
  
  // Feedback visual de carga
  if (isLoading) {
    return (
      <div className="w-full h-8 border rounded-md flex items-center justify-center bg-muted/50 text-muted-foreground text-xs">
        <Loader2 className="h-3 w-3 animate-spin mr-2" /> Cargando...
      </div>
    );
  }

  // Feedback si no hay datos
  if (!versiones || versiones.length === 0) {
    return (
      <div className="w-full h-8 border rounded-md flex items-center px-3 bg-muted/20 text-muted-foreground text-xs italic">
        Sin versiones
      </div>
    );
  }

  // Convertimos a string de forma segura
  const stringValue = selectedVersion !== null && selectedVersion !== undefined 
    ? String(selectedVersion) 
    : undefined; // undefined permite que el placeholder se muestre si no hay selección

  return (
    <div className="w-full">
      <Select
        value={stringValue} 
        onValueChange={(val) => onSelectVersion(Number(val))}
      >
        <SelectTrigger className="w-full h-8 text-xs bg-background">
          <SelectValue placeholder="Seleccione versión" />
        </SelectTrigger>
        <SelectContent>
          {versiones.map((v) => (
            <SelectItem key={v} value={String(v)} className="text-xs">
              Versión {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
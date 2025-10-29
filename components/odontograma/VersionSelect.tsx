"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VersionSelectProps = {
  versiones: number[];
  selectedVersion?: number | null;
  onSelectVersion: (v: number) => void;
};

export default function VersionSelect({
  versiones,
  selectedVersion,
  onSelectVersion,
}: VersionSelectProps) {
  return (
    <div className="w-40">
      <Select
        value={selectedVersion?.toString() || ""}
        onValueChange={(v) => onSelectVersion(Number(v))}
      >
        <SelectTrigger className="border px-2 py-1 rounded w-full">
          <SelectValue placeholder="Seleccione versión..." />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-auto">
          {versiones.map((v) => (
            <SelectItem key={v} value={v.toString()}>
              Versión {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

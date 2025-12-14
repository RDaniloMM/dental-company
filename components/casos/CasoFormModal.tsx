"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

type CasoFormData = {
  nombre_caso: string;
  diagnostico_preliminar: string;
  descripcion: string;
  fecha_inicio: string;
  estado: "Abierto" | "En progreso" | "Cerrado";
};

type CasoFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CasoFormData) => void;
  initialData?: CasoFormData & { id?: string }; 
};

export default function CasoFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CasoFormProps) {
  const [nombreCaso, setNombreCaso] = useState(initialData?.nombre_caso || "");
  const [diagnosticoPreliminar, setDiagnosticoPreliminar] = useState(initialData?.diagnostico_preliminar || "");
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
  const [estado, setEstado] = useState(initialData?.estado || "Abierto");
  const [fechaInicio, setFechaInicio] = useState(
    initialData?.fecha_inicio
      ? format(new Date(initialData.fecha_inicio), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setNombreCaso(initialData.nombre_caso || "");
      setDiagnosticoPreliminar(initialData.diagnostico_preliminar || "");
      setDescripcion(initialData.descripcion || "");
      setEstado(initialData.estado || "Abierto");
      setFechaInicio(
        initialData.fecha_inicio
          ? format(new Date(initialData.fecha_inicio), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd")
      );
    } else {
      setNombreCaso("");
      setDiagnosticoPreliminar("");
      setDescripcion("");
      setEstado("Abierto");
      setFechaInicio(format(new Date(), "yyyy-MM-dd"));
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nombreCaso.trim()) {
      newErrors.nombreCaso = "El nombre del caso es obligatorio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        nombre_caso: nombreCaso,
        diagnostico_preliminar: diagnosticoPreliminar,
        descripcion: descripcion,
        estado: estado,
        fecha_inicio: fechaInicio,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Caso Clínico" : "Nuevo Caso Clínico"}</DialogTitle>
          <DialogDescription>
            Complete los datos del caso clínico. Los campos marcados son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombreCaso" className="text-right">
              Nombre del Caso
            </Label>
            <Input
              id="nombreCaso"
              value={nombreCaso}
              onChange={(e) => setNombreCaso(e.target.value)}
              className="col-span-3"
              autoComplete="off"
            />
            {errors.nombreCaso && (
              <p className="col-span-4 text-right text-red-500 text-sm">
                {errors.nombreCaso}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="diagnosticoPreliminar" className="text-right">
              Diagnóstico Preliminar
            </Label>
            <Textarea
              id="diagnosticoPreliminar"
              value={diagnosticoPreliminar}
              onChange={(e) => setDiagnosticoPreliminar(e.target.value)}
              className="col-span-3"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descripcion" className="text-right">
              Descripción General
            </Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="col-span-3"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fechaInicio" className="text-right">
              Fecha de Inicio
            </Label>
            <Input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="col-span-3"
              disabled={!!initialData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estado" className="text-right">
              Estado
            </Label>
            <Select
              value={estado}
              onValueChange={(value) =>
                setEstado(value as "Abierto" | "En progreso" | "Cerrado")
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Abierto">Abierto</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="Cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Guardar Cambios" : "Crear Caso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

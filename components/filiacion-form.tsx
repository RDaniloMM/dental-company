"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from 'sonner';

// Tipado para los datos del paciente que se manejarán en el formulario
type PatientData = {
  id: string;
  apellidos: string;
  nombres: string;
  fecha_nacimiento: string;
  dni: string;
  direccion: string;
  genero: string;
  estado_civil: string;
  ocupacion: string;
  grado_instruccion: string;
  telefono: string;
  email: string;
  pais: string;
  departamento: string;
  provincia: string;
  distrito: string;
  contacto_emergencia: {
    nombre: string;
    parentesco: string;
    domicilio: string;
    telefono: string;
  };
  recomendado_por: string;
  observaciones: string;
};

// Tipo para el paciente que puede venir con valores null desde la base de datos
type PatientInput = Partial<PatientData> & {
  id?: string;
  contacto_emergencia?: {
    nombre?: string;
    parentesco?: string;
    domicilio?: string;
    telefono?: string;
  } | null;
};

// Función para calcular la edad
const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age.toString();
};

export default function FiliacionForm({ patient }: { patient: PatientInput }) {
  const supabase = createClient();
  
  // Función para convertir valores null a cadenas vacías
  const sanitizePatientData = (data: PatientInput): PatientData => {
    return {
      id: data.id || "",
      apellidos: data.apellidos || "",
      nombres: data.nombres || "",
      fecha_nacimiento: data.fecha_nacimiento || "",
      dni: data.dni || "",
      direccion: data.direccion || "",
      genero: data.genero || "",
      estado_civil: data.estado_civil || "",
      ocupacion: data.ocupacion || "",
      grado_instruccion: data.grado_instruccion || "",
      telefono: data.telefono || "",
      email: data.email || "",
      pais: data.pais || "",
      departamento: data.departamento || "",
      provincia: data.provincia || "",
      distrito: data.distrito || "",
      contacto_emergencia: {
        nombre: data.contacto_emergencia?.nombre || "",
        parentesco: data.contacto_emergencia?.parentesco || "",
        domicilio: data.contacto_emergencia?.domicilio || "",
        telefono: data.contacto_emergencia?.telefono || "",
      },
      recomendado_por: data.recomendado_por || "",
      observaciones: data.observaciones || "",
    };
  };

  const [formData, setFormData] = useState<PatientData>(sanitizePatientData(patient));
  const [age, setAge] = useState("");

  useEffect(() => {
    setAge(calculateAge(formData.fecha_nacimiento));
  }, [formData.fecha_nacimiento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contacto_emergencia: {
        ...prev.contacto_emergencia,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("pacientes")
      .update(formData)
      .eq("id", formData.id);

    if (error) {
      toast.error("Error al guardar los datos.");
      console.error(error);
    } else {
      toast.success("Datos guardados con éxito.");
    }
  };

  return (
    <div className="w-full max-w-none">
      <Toaster />
      <h2 className="text-2xl font-semibold uppercase mb-4">Datos del Paciente</h2>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
          {/* Fila 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2"><Label>Apellidos</Label><Input name="apellidos" value={formData.apellidos} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Nombres</Label><Input name="nombres" value={formData.nombres} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Fecha de Nacimiento</Label><Input name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Edad</Label><Input value={age} readOnly disabled /></div>
          </div>
          <hr />
          {/* Fila 2 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2"><Label>Documento DNI</Label><Input name="dni" value={formData.dni} onChange={handleChange} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Dirección</Label><Input name="direccion" value={formData.direccion} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Sexo</Label>
              <Select name="genero" onValueChange={(v) => handleSelectChange("genero", v)} value={formData.genero}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Femenino">Femenino</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Estado Civil</Label>
              <Select name="estado_civil" onValueChange={(v) => handleSelectChange("estado_civil", v)} value={formData.estado_civil}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soltero(a)">Soltero(a)</SelectItem>
                  <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                  <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <hr />
          {/* Fila 3 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2"><Label>Ocupación</Label><Input name="ocupacion" value={formData.ocupacion} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Grado de Instrucción</Label>
              <Select name="grado_instruccion" onValueChange={(v) => handleSelectChange("grado_instruccion", v)} value={formData.grado_instruccion}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMARIA COMPLETA">Primaria Completa</SelectItem>
                  <SelectItem value="SECUNDARIA COMPLETA">Secundaria Completa</SelectItem>
                  <SelectItem value="TECNICA">Técnica</SelectItem>
                  <SelectItem value="SUPERIOR">Superior</SelectItem>
                  <SelectItem value="NO ESPECIFICA">No especifica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Teléfono</Label><Input name="telefono" value={formData.telefono} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" value={formData.email} onChange={handleChange} /></div>
          </div>
          <hr />
          {/* Fila 4 (Ubicación) - Simplificado por ahora */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="space-y-2"><Label>País</Label><Input name="pais" value={formData.pais} onChange={handleChange} /></div>
             <div className="space-y-2"><Label>Departamento</Label><Input name="departamento" value={formData.departamento} onChange={handleChange} /></div>
             <div className="space-y-2"><Label>Provincia</Label><Input name="provincia" value={formData.provincia} onChange={handleChange} /></div>
             <div className="space-y-2"><Label>Distrito</Label><Input name="distrito" value={formData.distrito} onChange={handleChange} /></div>
          </div>
          <hr />
          {/* Fila 5 (Emergencia) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2"><Label>En caso de emergencia</Label><Input name="nombre" value={formData.contacto_emergencia.nombre} onChange={handleEmergencyContactChange} /></div>
            <div className="space-y-2"><Label>Parentesco</Label><Input name="parentesco" value={formData.contacto_emergencia.parentesco} onChange={handleEmergencyContactChange} /></div>
            <div className="space-y-2"><Label>Domicilio</Label><Input name="domicilio" value={formData.contacto_emergencia.domicilio} onChange={handleEmergencyContactChange} /></div>
            <div className="space-y-2"><Label>Teléfono</Label><Input name="telefono" value={formData.contacto_emergencia.telefono} onChange={handleEmergencyContactChange} /></div>
          </div>
          <hr />
          {/* Fila 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Referido por</Label><Input name="recomendado_por" value={formData.recomendado_por} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Observación</Label><Input name="observaciones" value={formData.observaciones} onChange={handleChange} /></div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Guardar Cambios</Button>
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

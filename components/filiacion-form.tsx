"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import LoadingDots from "@/components/ui/LoadingDots";

type EmergencyContact = {
  nombre: string;
  parentesco: string;
  domicilio: string;
  telefono: string;
};

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
  contacto_emergencia: EmergencyContact;
  recomendado_por: string;
  observaciones: string;
};

export default function FiliacionForm({ patient }: { patient: Partial<PatientData> }) {
  const supabase = createClient();

  const sanitizePatientData = (data: Partial<PatientData>): PatientData => ({
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
  });

  const [formData, setFormData] = useState<PatientData>(sanitizePatientData(patient));
  const [age, setAge] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (formData.fecha_nacimiento) {
      const birthDateObj = new Date(formData.fecha_nacimiento + "T00:00:00");
      const today = new Date();
      let years = today.getFullYear() - birthDateObj.getFullYear();
      const m = today.getMonth() - birthDateObj.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) years--;
      setAge(years >= 0 ? String(years) : "");
    } else {
      setAge("");
    }
  }, [formData.fecha_nacimiento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as PatientData));
  };

  const handleSelectChange = (name: keyof PatientData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as PatientData));
  };

  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contacto_emergencia: {
        ...prev.contacto_emergencia,
        [name]: value,
      },
    } as PatientData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const upperFields: Array<keyof PatientData> = [
      "apellidos",
      "nombres",
      "direccion",
      "recomendado_por",
      "observaciones",
    ];

    const payload: Partial<PatientData> = { ...formData };
    upperFields.forEach((k) => {
      const v = payload[k];
      if (typeof v === "string") {
        (payload as Record<string, string>)[k as string] = v.toUpperCase();
      }
    });
    payload.contacto_emergencia = {
      nombre: payload.contacto_emergencia?.nombre?.toUpperCase() || "",
      parentesco: payload.contacto_emergencia?.parentesco?.toUpperCase() || "",
      domicilio: payload.contacto_emergencia?.domicilio?.toUpperCase() || "",
      telefono: payload.contacto_emergencia?.telefono || "",
    };

    try {
      const requiredFields: Array<keyof PatientData | `contacto_emergencia.${keyof EmergencyContact}`> = [
        "apellidos",
        "nombres",
        "fecha_nacimiento",
        "dni",
        "contacto_emergencia.nombre",
        "contacto_emergencia.parentesco",
        "contacto_emergencia.domicilio",
        "contacto_emergencia.telefono",
      ];

      let hasValidationErrors = false;
      const errorMessages: string[] = [];
      
      for (const field of requiredFields) {
        if (field.startsWith("contacto_emergencia.")) {
          const subField = field.split(".")[1] as keyof EmergencyContact;
          if (!payload.contacto_emergencia?.[subField]) {
            errorMessages.push(`En caso de emergencia • ${subField}: se olvidó completar este campo`);
            hasValidationErrors = true;
          }
        } else {
          if (!payload[field as keyof PatientData]) {
            errorMessages.push(`${field}: se olvidó completar este campo`);
            hasValidationErrors = true;
          }
        }
      }

      if (hasValidationErrors) {
        // Mostrar cada error como una notificación individual
        errorMessages.forEach((error) => {
          toast.error(error, { 
            style: { backgroundColor: '#FF0000', color: 'white' },
            duration: 4000
          });
        });
        return;
      }

      const { data, error } = await supabase.from("pacientes").upsert(payload);
      if (error) throw error;

      const saved = (data && data[0]) || payload;
      try {
        window.dispatchEvent(new CustomEvent("paciente-updated", { detail: saved }));
      } catch {
        // ignore if running in restricted env
      }

      setFormData(sanitizePatientData(saved as Partial<PatientData>));
      toast.success("Datos guardados con éxito.", { style: { backgroundColor: '#008000', color: 'white' } });
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los datos.", { style: { backgroundColor: '#FF0000', color: 'white' } });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-none">
      <div className="rounded-lg border border-border bg-card">
        <div className="bg-blue-500 dark:bg-blue-800 p-4 rounded-t-lg text-center">
          <h2 className="text-2xl font-bold text-white">Datos del Paciente</h2>
        </div>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Apellidos<span className="text-red-500 text-xs ml-1">*</span></Label>
                <Input name="apellidos" value={formData.apellidos} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Nombres<span className="text-red-500 text-xs ml-1">*</span></Label>
                <Input name="nombres" value={formData.nombres} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Fecha de Nacimiento<span className="text-red-500 text-xs ml-1">*</span></Label>
                <Input name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} className="h-7 px-2 py-1 text-sm" />
              </div>
              <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Edad</Label><Input value={age} readOnly disabled className="h-7 px-2 py-1 text-sm" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Documento de Identidad<span className="text-red-500 text-xs ml-1">*</span></Label>
                <Input name="dni" value={formData.dni} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" />
              </div>
              <div className="space-y-2 md:col-span-2"><Label className="text-gray-900 dark:text-gray-100">Dirección</Label><Input name="direccion" value={formData.direccion} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Sexo</Label>
                <Select name="genero" onValueChange={(v) => handleSelectChange("genero", v)} value={formData.genero}>
                  <SelectTrigger className="h-7 px-2 py-1 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenico</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Estado Civil</Label>
                <Select name="estado_civil" onValueChange={(v) => handleSelectChange("estado_civil", v)} value={formData.estado_civil}>
                  <SelectTrigger className="h-7 px-2 py-1 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Soltero(a)">Soltero(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Ocupación</Label><Input name="ocupacion" value={formData.ocupacion} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
              <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Grado de Instrucción</Label>
                <Select name="grado_instruccion" onValueChange={(v) => handleSelectChange("grado_instruccion", v)} value={formData.grado_instruccion}>
                  <SelectTrigger className="h-7 px-2 py-1 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARIA COMPLETA">Primaria Completa</SelectItem>
                    <SelectItem value="SECUNDARIA COMPLETA">Secundaria Completa</SelectItem>
                    <SelectItem value="TECNICA">Técnica</SelectItem>
                    <SelectItem value="SUPERIOR">Superior</SelectItem>
                    <SelectItem value="NO ESPECIFICA">No especifica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Teléfono</Label><Input name="telefono" value={formData.telefono} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
              <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Email</Label><Input name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">País</Label><Input name="pais" value={formData.pais} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
               <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Departamento</Label><Input name="departamento" value={formData.departamento} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
               <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Provincia</Label><Input name="provincia" value={formData.provincia} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
               <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Distrito</Label><Input name="distrito" value={formData.distrito} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">En caso de emergencia<span className="text-red-500 text-xs ml-1">*</span></Label>
                <Input name="nombre" value={formData.contacto_emergencia.nombre} onChange={handleEmergencyContactChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Parentesco<span className="text-red-500 text-xs ml-1">*</span></Label>
                <Input name="parentesco" value={formData.contacto_emergencia.parentesco} onChange={handleEmergencyContactChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Domicilio<span className="text-red-500 text-xs ml-1">*</span></Label>
                <Input name="domicilio" value={formData.contacto_emergencia.domicilio} onChange={handleEmergencyContactChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Teléfono<span className="text-red-500 text-xs ml-1">*</span></Label>
                <Input name="telefono" value={formData.contacto_emergencia.telefono} onChange={handleEmergencyContactChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Referido por</Label><Input name="recomendado_por" value={formData.recomendado_por} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
              <div className="space-y-2"><Label className="text-gray-900 dark:text-gray-100">Observación</Label><Input name="observaciones" value={formData.observaciones} onChange={handleChange} autoComplete="off" className="h-7 px-2 py-1 text-sm" /></div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <LoadingDots /> : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
      {isSaving && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="bg-transparent p-2 rounded-md">
            <LoadingDots />
          </div>
        </div>
      )}
    </div>
  );
}

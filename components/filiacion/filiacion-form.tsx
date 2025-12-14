"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import LoadingDots from "@/components/ui/LoadingDots";
import { PatientData } from "./types";
import {
  NACIONALIDADES_COMMON,
  GENERO_OPTIONS,
  ESTADO_CIVIL_OPTIONS,
  GRADO_INSTRUCCION_OPTIONS,
  UPPERCASE_FIELDS,
} from "./constants";

interface FiliacionFormProps {
  patient: Partial<PatientData>;
}

export default function FiliacionForm({ patient }: FiliacionFormProps) {
  const supabase = createClient();

  const sanitizePatientData = useCallback((data: Partial<PatientData>): PatientData => ({
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
    pais: data.pais || "Peruano",
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
  }), []);

  const [formData, setFormData] = useState<PatientData>(() =>
    sanitizePatientData(patient)
  );
  const [age, setAge] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [showCustomNacionalidad, setShowCustomNacionalidad] = useState(() => {
    return !NACIONALIDADES_COMMON.includes(patient.pais || "") && patient.pais !== "";
  });

  useEffect(() => {
    if (formData.fecha_nacimiento) {
      const birthDateObj = new Date(formData.fecha_nacimiento + "T00:00:00");
      const today = new Date();
      let years = today.getFullYear() - birthDateObj.getFullYear();
      const m = today.getMonth() - birthDateObj.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        years--;
      }
      setAge(years >= 0 ? String(years) : "");
    } else {
      setAge("");
    }
  }, [formData.fecha_nacimiento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof PatientData, value: string) => {
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
    setIsSaving(true);

    const payload: PatientData = { ...formData };
    
    UPPERCASE_FIELDS.forEach((key) => {
      const val = payload[key as keyof PatientData];
      if (typeof val === "string") {
        (payload as unknown as Record<string, string>)[key as string] = val.toUpperCase();
      }
    });

    payload.contacto_emergencia = {
      nombre: payload.contacto_emergencia.nombre.toUpperCase(),
      parentesco: payload.contacto_emergencia.parentesco.toUpperCase(),
      domicilio: payload.contacto_emergencia.domicilio.toUpperCase(),
      telefono: payload.contacto_emergencia.telefono,
    };

    try {
      const requiredFields: (keyof PatientData)[] = [
        "apellidos",
        "nombres",
        "fecha_nacimiento",
      ];

      const errorMessages: string[] = [];

      requiredFields.forEach((field) => {
        if (!payload[field]) {
          const label = field.replace('_', ' ');
          errorMessages.push(`${label}: se olvidó completar este campo`);
        }
      });

      if (errorMessages.length > 0) {
        errorMessages.forEach((msg) => toast.error(msg, {
          style: { backgroundColor: "#FF0000", color: "white" },
          duration: 4000,
        }));
        setIsSaving(false);
        return;
      }

      const { data, error } = await supabase.from("pacientes").upsert(payload).select();
      
      if (error) throw error;

      const savedData = data?.[0] as PatientData;

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("paciente-updated", { detail: savedData })
        );
      }

      setFormData(sanitizePatientData(savedData));
      toast.success("Datos guardados con éxito.", {
        style: { backgroundColor: "#008000", color: "white" },
      });

    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los datos.", {
        style: { backgroundColor: "#FF0000", color: "white" },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='w-full max-w-none'>
      <div className='rounded-lg border border-border bg-card'>
        <div className='bg-blue-500 dark:bg-blue-800 p-4 rounded-t-lg text-center'>
          <h2 className='text-2xl font-bold text-white'>Datos del Paciente</h2>
        </div>
        <CardContent className='pt-6'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='space-y-2'>
                <Label className='text-foreground'>
                  Apellidos<span className='text-red-500 text-xs ml-1'>*</span>
                </Label>
                <Input
                  name='apellidos'
                  value={formData.apellidos}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>
                  Nombres<span className='text-red-500 text-xs ml-1'>*</span>
                </Label>
                <Input
                  name='nombres'
                  value={formData.nombres}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>
                  Fecha de Nacimiento<span className='text-red-500 text-xs ml-1'>*</span>
                </Label>
                <Input
                  name='fecha_nacimiento'
                  type='date'
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Edad</Label>
                <Input
                  value={age}
                  readOnly
                  disabled
                  className='h-8 text-sm bg-muted'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
              <div className='space-y-2'>
                <Label className='text-foreground'>Documento de Identidad</Label>
                <Input
                  name='dni'
                  value={formData.dni}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2 md:col-span-2'>
                <Label className='text-foreground'>Dirección</Label>
                <Input
                  name='direccion'
                  value={formData.direccion}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Sexo</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(v) => handleSelectChange("genero", v)}
                >
                  <SelectTrigger className='h-8 text-sm'>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENERO_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Estado Civil</Label>
                <Select
                  value={formData.estado_civil}
                  onValueChange={(v) => handleSelectChange("estado_civil", v)}
                >
                  <SelectTrigger className='h-8 text-sm'>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADO_CIVIL_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='space-y-2'>
                <Label className='text-foreground'>Ocupación</Label>
                <Input
                  name='ocupacion'
                  value={formData.ocupacion}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Grado de Instrucción</Label>
                <Select
                  value={formData.grado_instruccion}
                  onValueChange={(v) => handleSelectChange("grado_instruccion", v)}
                >
                  <SelectTrigger className='h-8 text-sm'>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADO_INSTRUCCION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Teléfono</Label>
                <Input
                  name='telefono'
                  value={formData.telefono}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Email</Label>
                <Input
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='space-y-2'>
                <Label className='text-foreground'>Nacionalidad</Label>
                {!showCustomNacionalidad ? (
                  <Select
                    value={formData.pais || "Peruano"}
                    onValueChange={(v) => {
                      if (v === "Otro") {
                        setShowCustomNacionalidad(true);
                        handleSelectChange("pais", "");
                      } else {
                        handleSelectChange("pais", v);
                      }
                    }}
                  >
                    <SelectTrigger className='h-8 text-sm'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NACIONALIDADES_COMMON.map((nac) => (
                        <SelectItem key={nac} value={nac}>{nac}</SelectItem>
                      ))}
                      <SelectItem value='Otro'>Otro...</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className='flex gap-1'>
                    <Input
                      name='pais'
                      value={formData.pais}
                      onChange={handleChange}
                      placeholder='Escriba nacionalidad'
                      autoComplete='off'
                      className='h-8 text-sm flex-1'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='h-8 px-2'
                      onClick={() => {
                        setShowCustomNacionalidad(false);
                        handleSelectChange("pais", "Peruano");
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Departamento</Label>
                <Input
                  name='departamento'
                  value={formData.departamento}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Provincia</Label>
                <Input
                  name='provincia'
                  value={formData.provincia}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Distrito</Label>
                <Input
                  name='distrito'
                  value={formData.distrito}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='space-y-2'>
                <Label className='text-foreground'>Contacto de emergencia</Label>
                <Input
                  name='nombre'
                  value={formData.contacto_emergencia.nombre}
                  onChange={handleEmergencyContactChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                  placeholder='Nombre completo'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Parentesco</Label>
                <Input
                  name='parentesco'
                  value={formData.contacto_emergencia.parentesco}
                  onChange={handleEmergencyContactChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Domicilio</Label>
                <Input
                  name='domicilio'
                  value={formData.contacto_emergencia.domicilio}
                  onChange={handleEmergencyContactChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Teléfono de contacto</Label>
                <Input
                  name='telefono'
                  value={formData.contacto_emergencia.telefono}
                  onChange={handleEmergencyContactChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-foreground'>Referido por</Label>
                <Input
                  name='recomendado_por'
                  value={formData.recomendado_por}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-foreground'>Observación</Label>
                <Input
                  name='observaciones'
                  value={formData.observaciones}
                  onChange={handleChange}
                  autoComplete='off'
                  className='h-8 text-sm'
                />
              </div>
            </div>

            <div className='flex justify-end'>
              <Button type='submit' disabled={isSaving} className="min-w-[140px]">
                {isSaving ? <LoadingDots /> : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
      {isSaving && (
        <div className='fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none'>
          <div className='bg-background/80 backdrop-blur-sm p-2 rounded-md border shadow-sm'></div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define la estructura del estado del formulario
type FormData = {
  nombres: string;
  apellidos: string;
  sexo: 'masculino' | 'femenino' | 'otro' | 'no_especifica';
  fecha_nacimiento: string;
  ocupacion: string;
  estado_civil: string;
  telefono: string;
  email: string;
  antecedentes: { //revisar tipos, fix temporal
    [key: string]: boolean | string;
  };
  alergias: {
    [key: string]: boolean | string;
  };
  habitos: {
    [key: string]: string;
  };
};

export function FichaOdontologicaForm() {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    sexo: "no_especifica" as const,
    fecha_nacimiento: "",
    ocupacion: "",
    estado_civil: "",
    telefono: "",
    email: "",
    antecedentes: {
      cardio_hipertension: false,
      cardio_arritmias: false,
      cardio_anticoagulantes: false,
      cardio_anticoagulantes_detalle: "",
      resp_asma: false,
      resp_tuberculosis: false,
      otros_cancer: false,
      otros_cancer_tipo: "",
      otros_embarazo: false,
      otros_embarazo_semanas: "",
      otros_protesis: false,
      otros_protesis_fecha: "",
    },
    alergias: {
      penicilina: false,
      sulfas: false,
      anestesicos_locales: false,
      anestesicos_locales_detalle: "",
      latex: false,
      alimentos: false,
      alimentos_detalle: "",
    },
    habitos: {
      tabaco: "",
      alcohol: "",
      drogas: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked, name } = e.target;
    
    if (name) {
      const [section, field] = name.split('.') as [keyof FormData, string];
      if (typeof formData[section] === 'object' && formData[section] !== null) {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [field]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    const [section, field] = name.split('.') as [keyof FormData, string];
     if (typeof formData[section] === 'object' && formData[section] !== null) {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [field]: checked
          }
        }));
      }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: pacienteData, error: pacienteError } = await supabase
      .from('paciente')
      .insert({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        sexo: formData.sexo,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        ocupacion: formData.ocupacion,
        estado_civil: formData.estado_civil,
      })
      .select('id')
      .single();

    if (pacienteError) {
      console.error("Error creating patient:", pacienteError);
      alert(`Error al crear el paciente: ${pacienteError.message}`);
      return;
    }

    const pacienteId = pacienteData.id;

    const { error: fichaError } = await supabase
      .from('ficha_odontologica')
      .insert({
        paciente_id: pacienteId,
        antecedentes_personales: formData.antecedentes,
        alergias: formData.alergias,
        habitos: formData.habitos,
      });

    if (fichaError) {
      console.error("Error creating ficha:", fichaError);
      alert(`Error al crear la ficha: ${fichaError.message}`);
      return;
    }
    
    alert("Paciente y Ficha Odontológica creados con éxito!");
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <Card>
        <CardHeader><CardTitle>1. Filiación del Paciente</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nombres">Nombres</Label>
            <Input id="nombres" value={formData.nombres} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input id="apellidos" value={formData.apellidos} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
            <Input id="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ocupacion">Ocupación</Label>
            <Input id="ocupacion" value={formData.ocupacion} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>2. Antecedentes Patológicos</CardTitle></CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-4">
            <h4 className="font-semibold">a. Cardiovascular</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Checkbox id="antecedentes.cardio_hipertension" checked={formData.antecedentes.cardio_hipertension} onCheckedChange={(c) => handleCheckboxChange('antecedentes.cardio_hipertension', !!c)} />
                <Label htmlFor="antecedentes.cardio_hipertension">Hipertensión</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="antecedentes.cardio_arritmias" checked={formData.antecedentes.cardio_arritmias} onCheckedChange={(c) => handleCheckboxChange('antecedentes.cardio_arritmias', !!c)} />
                <Label htmlFor="antecedentes.cardio_arritmias">Arritmias / Cardiopatía</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="antecedentes.cardio_anticoagulantes" checked={formData.antecedentes.cardio_anticoagulantes} onCheckedChange={(c) => handleCheckboxChange('antecedentes.cardio_anticoagulantes', !!c)} />
                <Label htmlFor="antecedentes.cardio_anticoagulantes">Anticoagulantes</Label>
              </div>
              <Input name="antecedentes.cardio_anticoagulantes_detalle" value={formData.antecedentes.cardio_anticoagulantes_detalle} onChange={handleChange} placeholder="Detalle..." />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>3. Hábitos</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label htmlFor="habitos.tabaco">Tabaco</Label>
                <Input name="habitos.tabaco" value={formData.habitos.tabaco} onChange={handleChange} placeholder="Nunca/Ex/Actual"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="habitos.alcohol">Alcohol</Label>
                <Input name="habitos.alcohol" value={formData.habitos.alcohol} onChange={handleChange} placeholder="Ocasional/Frecuente"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="habitos.drogas">Drogas</Label>
                <Input name="habitos.drogas" value={formData.habitos.drogas} onChange={handleChange} placeholder="Tipo o 'No'"/>
            </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">Guardar Paciente y Ficha</Button>
    </form>
  );
}

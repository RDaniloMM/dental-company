"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  User,
  HeartPulse,
  Cigarette,
  Stethoscope,
  ListChecks,
  FileDown,
  Trash2,
} from "lucide-react";
import { CheckboxWithInputVertical } from "./ui/checkbox-with-input-vertical";
import { cn } from "@/lib/utils";
import {
  FormData,
  SeguimientoRow,
  AntecedentesData,
} from "@/lib/supabase/ficha";
import Odontograma from "@/components/odontograma/OdontoPage";

const initialState: FormData = {
  filiacion: {
    nombres: "",
    apellidos: "",
    sexo: "no_especifica",
    fecha_nacimiento: "",
    ocupacion: "",
    estado_civil: "",
    telefono: "",
    email: "",
    direccion: "",
    lugar_procedencia: "",
    recomendado_por: "",
    alerta_medica: "",
  },
  antecedentes: {
    cardiovascular: {
      no_refiere: false,
      hipertension: false,
      hipertension_tratamiento: "",
      arritmias: false,
      cardiopatia_isquemica: false,
      marcapasos: false,
      anticoagulantes: false,
      anticoagulantes_cuales: { warfarina: false, aas: false, otro: false },
      anticoagulantes_otro_detalle: "",
    },
    respiratorio: {
      no_refiere: false,
      asma: false,
      epoc: false,
      apnea_sueno: false,
      tuberculosis: false,
    },
    endocrino_metabolico: {
      no_refiere: false,
      diabetes_tipo: "",
      hba1c: "",
      tiroides_hipo: false,
      tiroides_hiper: false,
      osteoporosis: false,
      osteoporosis_tratamiento: "",
    },
    neurologico_psiquiatrico: {
      no_refiere: false,
      epilepsia: false,
      alzheimer: false,
      ansiedad_depresion: false,
      medicamentos_psiquiatricos: false,
      medicamentos_psiquiatricos_detalle: "",
    },
    hematologico_inmunologico: {
      no_refiere: false,
      anemia: false,
      hemofilia: false,
      vih_sida: false,
      enfermedades_autoinmunes: false,
    },
    digestivo_hepatico: {
      no_refiere: false,
      reflujo: false,
      ulcera_gastrica: false,
      hepatitis: false,
      hepatitis_tipo: "",
    },
    renal: {
      no_refiere: false,
      insuficiencia_renal: false,
      insuficiencia_renal_etapa: "",
      dialisis: false,
    },
    alergias: {
      no_refiere: false,
      penicilina: false,
      sulfas: false,
      anestesicos_locales: false,
      anestesicos_locales_detalle: "",
      latex: false,
      alimentos: false,
      alimentos_detalle: "",
    },
    otros_relevantes: {
      no_refiere: false,
      cancer: false,
      cancer_tipo: "",
      embarazo_actual: false,
      embarazo_semanas: "",
      protesis_articulares: false,
      protesis_fecha_colocacion: "",
    },
  },
  habitos: {
    tabaco: "",
    tabaco_actual_detalle: "",
    alcohol: "",
    alcohol_frecuente_detalle: "",
    drogas_recreacionales: false,
    drogas_tipo: "",
  },
  examen_clinico: { talla: "", peso: "", imc: "", pa: "" },
  seguimiento: [],
};

// Componente reutilizable para un campo con checkbox y un input condicional
const CheckboxWithInput = ({
  label,
  checkboxName,
  checkboxValue,
  inputName,
  inputValue,
  placeholder,
  onCheckboxChange,
  onInputChange,
}: {
  label: string;
  checkboxName: string;
  checkboxValue: boolean;
  inputName: string;
  inputValue: string;
  placeholder: string;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className='flex items-center space-x-2'>
    <Checkbox
      id={checkboxName}
      name={checkboxName}
      checked={checkboxValue}
      onCheckedChange={(c) => onCheckboxChange(checkboxName, !!c)}
    />
    <Label
      htmlFor={checkboxName}
      className='flex-shrink-0'
    >
      {label}
    </Label>
    {checkboxValue && (
      <Input
        name={inputName}
        value={inputValue}
        onChange={onInputChange}
        placeholder={placeholder}
        className='h-8'
      />
    )}
  </div>
);

interface FichaOdontologicaFormProps {
  numero_historia: string;
}

export function FichaOdontologicaForm({
  numero_historia,
}: FichaOdontologicaFormProps) {
  // TODO: Usar numero_historia para cargar datos específicos del paciente
  console.log('Historia:', numero_historia); // Temporary usage to avoid warning
  const supabase = createClient();
  const [formData, setFormData] = useState<FormData>(initialState);
  const [imcClassification, setImcClassification] = useState({
    classification: "",
    color: "",
  });
  const [isPrinting, setIsPrinting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // --- Lógica de handlers ---
  const handleFormChange = (name: string, value: string | boolean | number) => {
    const keys = name.split(".");
    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    handleFormChange(name, type === "checkbox" ? checked! : value);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    handleFormChange(name, checked);
  };

  const handleSelectChange = (name: string, value: string) => {
    handleFormChange(name, value);
  };

  const handleNoRefiereChange = (
    seccion: keyof AntecedentesData,
    checked: boolean
  ) => {
    const seccionInitialState = initialState.antecedentes[seccion];

    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      if (checked) {
        // Resetea la sección a su estado inicial y marca "no_refiere"
        newState.antecedentes[seccion] = {
          ...seccionInitialState,
          no_refiere: true,
        };
      } else {
        // Simplemente desmarca "no_refiere"
        newState.antecedentes[seccion].no_refiere = false;
      }
      return newState;
    });
  };

  // --- Lógica de IMC ---
  const getImcClassification = (
    imc: number
  ): { classification: string; color: string } => {
    if (imc < 18.5)
      return { classification: "Bajo Peso", color: "text-blue-500" };
    if (imc >= 18.5 && imc <= 24.9)
      return { classification: "Peso Normal", color: "text-green-500" };
    if (imc >= 25 && imc <= 29.9)
      return { classification: "Sobrepeso", color: "text-orange-500" };
    if (imc >= 30 && imc <= 34.9)
      return { classification: "Obesidad I", color: "text-orange-700" };
    if (imc >= 35 && imc <= 39.9)
      return { classification: "Obesidad II", color: "text-red-500" };
    if (imc >= 40)
      return { classification: "Obesidad III", color: "text-red-700" };
    return { classification: "", color: "" };
  };

  useEffect(() => {
    const talla = parseFloat(formData.examen_clinico.talla);
    const peso = parseFloat(formData.examen_clinico.peso);
    if (talla > 0 && peso > 0) {
      const imc = peso / (talla * talla);
      handleFormChange("examen_clinico.imc", imc.toFixed(2));
      setImcClassification(getImcClassification(imc));
    } else {
      handleFormChange("examen_clinico.imc", "");
      setImcClassification({ classification: "", color: "" });
    }
  }, [formData.examen_clinico.talla, formData.examen_clinico.peso]);

  // --- Lógica de Seguimiento ---
  const addSeguimientoRow = () => {
    const newRow: SeguimientoRow = {
      id: Date.now(),
      fecha: "",
      procedimiento_realizado: "",
      observaciones: "",
      proxima_cita: "",
    };
    setFormData((prev) => ({
      ...prev,
      seguimiento: [...prev.seguimiento, newRow],
    }));
  };

  const removeSeguimientoRow = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      seguimiento: prev.seguimiento.filter((row) => row.id !== id),
    }));
  };

  const handleSeguimientoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      seguimiento: prev.seguimiento.map((row) =>
        row.id === id ? { ...row, [name]: value } : row
      ),
    }));
  };

  const handleCancel = () => {
    setFormData(initialState);
    window.scrollTo(0, 0);
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Error en el servidor al generar el PDF"
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const patientName =
        `${formData.filiacion.nombres}_${formData.filiacion.apellidos}`.replace(
          / /g,
          "_"
        ) || "ficha_odontologica";
      a.download = `${patientName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error desconocido.";
      alert(`Hubo un error al generar el PDF: ${errorMessage}`);
    } finally {
      setIsPrinting(false);
    }
  };

  // --- Lógica de Envío ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { filiacion, ...fichaData } = formData;

    // 1. Crear el paciente
    const { data: pacienteData, error: pacienteError } = await supabase
      .from("paciente")
      .insert({
        nombres: filiacion.nombres.toUpperCase(),
        apellidos: filiacion.apellidos.toUpperCase(),
        sexo: filiacion.sexo,
        fecha_nacimiento: filiacion.fecha_nacimiento || null,
        ocupacion: filiacion.ocupacion,
        estado_civil: filiacion.estado_civil,
        observaciones: filiacion.alerta_medica,
        lugar_procedencia: filiacion.lugar_procedencia,
        recomendado_por: filiacion.recomendado_por,
        direccion: filiacion.direccion,
      })
      .select("id")
      .single();

    if (pacienteError) {
      //console.error("Error creating patient:", pacienteError);
      //alert(`Error al crear el paciente: ${pacienteError.message}`);
      return;
    }
    const pacienteId = pacienteData.id;

    // 2. Insertar datos de contacto (si existen)
    const contactInserts = [];
    if (filiacion.telefono) {
      contactInserts.push(
        supabase.from("paciente_contacto").insert({
          paciente_id: pacienteId,
          tipo: "telefono",
          valor: filiacion.telefono,
          es_principal: true,
        })
      );
    }
    if (filiacion.email) {
      contactInserts.push(
        supabase.from("paciente_contacto").insert({
          paciente_id: pacienteId,
          tipo: "email",
          valor: filiacion.email,
          es_principal: true,
        })
      );
    }

    const contactResults = await Promise.all(contactInserts);
    const contactErrorResult = contactResults.find((res) => res.error);
    if (contactErrorResult && contactErrorResult.error) {
      console.error("Error creating contact info:", contactErrorResult.error);
      alert(
        `Error al guardar la información de contacto: ${contactErrorResult.error.message}`
      );
      // Considerar rollback o manejo de error más robusto aquí
      return;
    }

    // 3. Crear la ficha odontológica
    const { error: fichaError } = await supabase
      .from("ficha_odontologica")
      .insert({
        paciente_id: pacienteId,
        antecedentes_personales: fichaData.antecedentes,
        habitos: fichaData.habitos,
        examen_extraoral: fichaData.examen_clinico,
        seguimiento: fichaData.seguimiento,
      });

    if (fichaError) {
      console.error("Error creating ficha:", fichaError);
      alert(`Error al crear la ficha: ${fichaError.message}`);
      return;
    }

    alert("Paciente y Ficha Odontológica creados con éxito!");
    setFormData(initialState);
    window.scrollTo(0, 0);
  };

  return (
    <form
      className='space-y-8'
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {/* SECCIÓN 1: FILIACIÓN */}
      <Card className='shadow-md hover:shadow-lg transition-shadow'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3 text-xl'>
            <User className='text-blue-600' />
            1. Filiación del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <Label>Nombres</Label>
            <Input
              name='filiacion.nombres'
              value={formData.filiacion.nombres}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label>Apellidos</Label>
            <Input
              name='filiacion.apellidos'
              value={formData.filiacion.apellidos}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label>Fecha de Nacimiento</Label>
            <Input
              name='filiacion.fecha_nacimiento'
              type='date'
              value={formData.filiacion.fecha_nacimiento}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label>Ocupación</Label>
            <Input
              name='filiacion.ocupacion'
              value={formData.filiacion.ocupacion}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label>Estado Civil</Label>
            <Input
              name='filiacion.estado_civil'
              value={formData.filiacion.estado_civil}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label>Teléfono</Label>
            <Input
              name='filiacion.telefono'
              value={formData.filiacion.telefono}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label>Email</Label>
            <Input
              name='filiacion.email'
              type='email'
              value={formData.filiacion.email}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label>Dirección</Label>
            <Input
              name='filiacion.direccion'
              value={formData.filiacion.direccion}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label>Lugar de Procedencia</Label>
            <Input
              name='filiacion.lugar_procedencia'
              value={formData.filiacion.lugar_procedencia}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2 md:col-span-3'>
            <Label>Alerta Médica</Label>
            <Input
              name='filiacion.alerta_medica'
              value={formData.filiacion.alerta_medica}
              onChange={handleChange}
              placeholder='Ej: Alergia a la penicilina, Hipertenso, etc.'
              className='bg-yellow-100 dark:bg-yellow-900'
            />
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2: ANTECEDENTES PATOLÓGICOS */}
      <Card className='shadow-md hover:shadow-lg transition-shadow'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3 text-xl'>
            <HeartPulse className='text-red-500' />
            2. Antecedentes Patológicos
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* a. Cardiovascular */}
          <div
            className={cn(
              "space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              { "opacity-50": formData.antecedentes.cardiovascular.no_refiere }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>a. Cardiovascular</h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='ac.no_refiere'
                  checked={formData.antecedentes.cardiovascular.no_refiere}
                  onCheckedChange={(c) =>
                    handleNoRefiereChange("cardiovascular", !!c)
                  }
                />
                <Label
                  htmlFor='ac.no_refiere'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={formData.antecedentes.cardiovascular.no_refiere}
              className='grid grid-cols-1 gap-y-4 pt-4'
            >
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ac.arritmias'
                  checked={formData.antecedentes.cardiovascular.arritmias}
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.cardiovascular.arritmias",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ac.arritmias'>Arritmias</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ac.isquemica'
                  checked={
                    formData.antecedentes.cardiovascular.cardiopatia_isquemica
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.cardiovascular.cardiopatia_isquemica",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ac.isquemica'>Cardiopatía Isquémica</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ac.marcapasos'
                  checked={formData.antecedentes.cardiovascular.marcapasos}
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.cardiovascular.marcapasos",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ac.marcapasos'>Marcapasos</Label>
              </div>
              <CheckboxWithInput
                label='Hipertensión'
                checkboxName='antecedentes.cardiovascular.hipertension'
                checkboxValue={
                  formData.antecedentes.cardiovascular.hipertension
                }
                inputName='antecedentes.cardiovascular.hipertension_tratamiento'
                inputValue={
                  formData.antecedentes.cardiovascular.hipertension_tratamiento
                }
                placeholder='Tratamiento...'
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleChange}
              />
              <div className='col-span-full space-y-3'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='ac.anticoagulantes'
                    checked={
                      formData.antecedentes.cardiovascular.anticoagulantes
                    }
                    onCheckedChange={(c) =>
                      handleCheckboxChange(
                        "antecedentes.cardiovascular.anticoagulantes",
                        !!c
                      )
                    }
                  />
                  <Label htmlFor='ac.anticoagulantes'>
                    Toma Anticoagulantes
                  </Label>
                </div>
                {formData.antecedentes.cardiovascular.anticoagulantes && (
                  <div className='pl-6 grid grid-cols-1 gap-4'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='ac.warfarina'
                        checked={
                          formData.antecedentes.cardiovascular
                            .anticoagulantes_cuales.warfarina
                        }
                        onCheckedChange={(c) =>
                          handleCheckboxChange(
                            "antecedentes.cardiovascular.anticoagulantes_cuales.warfarina",
                            !!c
                          )
                        }
                      />
                      <Label htmlFor='ac.warfarina'>Warfarina</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='ac.aas'
                        checked={
                          formData.antecedentes.cardiovascular
                            .anticoagulantes_cuales.aas
                        }
                        onCheckedChange={(c) =>
                          handleCheckboxChange(
                            "antecedentes.cardiovascular.anticoagulantes_cuales.aas",
                            !!c
                          )
                        }
                      />
                      <Label htmlFor='ac.aas'>AAS</Label>
                    </div>
                    <CheckboxWithInput
                      label='Otro'
                      checkboxName='antecedentes.cardiovascular.anticoagulantes_cuales.otro'
                      checkboxValue={
                        formData.antecedentes.cardiovascular
                          .anticoagulantes_cuales.otro
                      }
                      inputName='antecedentes.cardiovascular.anticoagulantes_otro_detalle'
                      inputValue={
                        formData.antecedentes.cardiovascular
                          .anticoagulantes_otro_detalle
                      }
                      placeholder='Especifique...'
                      onCheckboxChange={handleCheckboxChange}
                      onInputChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </fieldset>
          </div>
          {/* b. Respiratorio */}
          <div
            className={cn(
              "space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              { "opacity-50": formData.antecedentes.respiratorio.no_refiere }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>b. Respiratorio</h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='ar.no_refiere'
                  checked={formData.antecedentes.respiratorio.no_refiere}
                  onCheckedChange={(c) =>
                    handleNoRefiereChange("respiratorio", !!c)
                  }
                />
                <Label
                  htmlFor='ar.no_refiere'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={formData.antecedentes.respiratorio.no_refiere}
              className='grid grid-cols-1 gap-4 pt-4'
            >
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ar.asma'
                  checked={formData.antecedentes.respiratorio.asma}
                  onCheckedChange={(c) =>
                    handleCheckboxChange("antecedentes.respiratorio.asma", !!c)
                  }
                />
                <Label htmlFor='ar.asma'>Asma</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ar.epoc'
                  checked={formData.antecedentes.respiratorio.epoc}
                  onCheckedChange={(c) =>
                    handleCheckboxChange("antecedentes.respiratorio.epoc", !!c)
                  }
                />
                <Label htmlFor='ar.epoc'>EPOC</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ar.apnea'
                  checked={formData.antecedentes.respiratorio.apnea_sueno}
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.respiratorio.apnea_sueno",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ar.apnea'>Apnea del sueño</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ar.tuberculosis'
                  checked={formData.antecedentes.respiratorio.tuberculosis}
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.respiratorio.tuberculosis",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ar.tuberculosis'>Tuberculosis</Label>
              </div>
            </fieldset>
          </div>
          {/* c. Endocrino/Metabólico */}
          <div
            className={cn(
              "space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              {
                "opacity-50":
                  formData.antecedentes.endocrino_metabolico.no_refiere,
              }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>
                c. Endocrino/Metabólico
              </h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='ae.no_refiere'
                  checked={
                    formData.antecedentes.endocrino_metabolico.no_refiere
                  }
                  onCheckedChange={(c) =>
                    handleNoRefiereChange("endocrino_metabolico", !!c)
                  }
                />
                <Label
                  htmlFor='ae.no_refiere'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={formData.antecedentes.endocrino_metabolico.no_refiere}
              className='grid grid-cols-1 gap-y-4 pt-4'
            >
              <div className='flex items-center gap-2 flex-wrap'>
                <Label>Diabetes tipo:</Label>
                <Input
                  className='w-20 h-8'
                  name='antecedentes.endocrino_metabolico.diabetes_tipo'
                  value={
                    formData.antecedentes.endocrino_metabolico.diabetes_tipo
                  }
                  onChange={handleChange}
                />
                <Label>(HbA1c:</Label>
                <Input
                  className='w-20 h-8'
                  name='antecedentes.endocrino_metabolico.hba1c'
                  value={formData.antecedentes.endocrino_metabolico.hba1c}
                  onChange={handleChange}
                />
                <Label>%)</Label>
              </div>
              <div className='flex items-center space-x-4'>
                <Label>Tiroides:</Label>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='ae.hipo'
                    checked={
                      formData.antecedentes.endocrino_metabolico.tiroides_hipo
                    }
                    onCheckedChange={(c) =>
                      handleCheckboxChange(
                        "antecedentes.endocrino_metabolico.tiroides_hipo",
                        !!c
                      )
                    }
                  />
                  <Label htmlFor='ae.hipo'>Hipo</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='ae.hiper'
                    checked={
                      formData.antecedentes.endocrino_metabolico.tiroides_hiper
                    }
                    onCheckedChange={(c) =>
                      handleCheckboxChange(
                        "antecedentes.endocrino_metabolico.tiroides_hiper",
                        !!c
                      )
                    }
                  />
                  <Label htmlFor='ae.hiper'>Hiper</Label>
                </div>
              </div>
              <CheckboxWithInput
                label='Osteoporosis'
                checkboxName='antecedentes.endocrino_metabolico.osteoporosis'
                checkboxValue={
                  formData.antecedentes.endocrino_metabolico.osteoporosis
                }
                inputName='antecedentes.endocrino_metabolico.osteoporosis_tratamiento'
                inputValue={
                  formData.antecedentes.endocrino_metabolico
                    .osteoporosis_tratamiento
                }
                placeholder='Tratamiento...'
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleChange}
              />
            </fieldset>
          </div>
          {/* d. Neurológico/Psiquiátrico */}
          <div
            className={cn(
              "space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              {
                "opacity-50":
                  formData.antecedentes.neurologico_psiquiatrico.no_refiere,
              }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>
                d. Neurológico/Psiquiátrico
              </h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='an.no_refiere'
                  checked={
                    formData.antecedentes.neurologico_psiquiatrico.no_refiere
                  }
                  onCheckedChange={(c) =>
                    handleNoRefiereChange("neurologico_psiquiatrico", !!c)
                  }
                />
                <Label
                  htmlFor='an.no_refiere'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={
                formData.antecedentes.neurologico_psiquiatrico.no_refiere
              }
              className='grid grid-cols-1 gap-y-4 pt-4'
            >
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='an.epilepsia'
                  checked={
                    formData.antecedentes.neurologico_psiquiatrico.epilepsia
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.neurologico_psiquiatrico.epilepsia",
                      !!c
                    )
                  }
                />
                <Label htmlFor='an.epilepsia'>Epilepsia</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='an.alzheimer'
                  checked={
                    formData.antecedentes.neurologico_psiquiatrico.alzheimer
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.neurologico_psiquiatrico.alzheimer",
                      !!c
                    )
                  }
                />
                <Label htmlFor='an.alzheimer'>Alzheimer</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='an.ansiedad'
                  checked={
                    formData.antecedentes.neurologico_psiquiatrico
                      .ansiedad_depresion
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.neurologico_psiquiatrico.ansiedad_depresion",
                      !!c
                    )
                  }
                />
                <Label htmlFor='an.ansiedad'>Ansiedad/Depresión</Label>
              </div>
              <div className='col-span-full'>
                <CheckboxWithInput
                  label='Medicamentos Psiquiátricos'
                  checkboxName='antecedentes.neurologico_psiquiatrico.medicamentos_psiquiatricos'
                  checkboxValue={
                    formData.antecedentes.neurologico_psiquiatrico
                      .medicamentos_psiquiatricos
                  }
                  inputName='antecedentes.neurologico_psiquiatrico.medicamentos_psiquiatricos_detalle'
                  inputValue={
                    formData.antecedentes.neurologico_psiquiatrico
                      .medicamentos_psiquiatricos_detalle
                  }
                  placeholder='¿Cuáles?'
                  onCheckboxChange={handleCheckboxChange}
                  onInputChange={handleChange}
                />
              </div>
            </fieldset>
          </div>
          {/* e. Hematológico/Inmunológico */}
          <div
            className={cn(
              "space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              {
                "opacity-50":
                  formData.antecedentes.hematologico_inmunologico.no_refiere,
              }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>
                e. Hematológico/Inmunológico
              </h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='ah.no_refiere'
                  checked={
                    formData.antecedentes.hematologico_inmunologico.no_refiere
                  }
                  onCheckedChange={(c) =>
                    handleNoRefiereChange("hematologico_inmunologico", !!c)
                  }
                />
                <Label
                  htmlFor='ah.no_refiere'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={
                formData.antecedentes.hematologico_inmunologico.no_refiere
              }
              className='grid grid-cols-1 gap-4 pt-4'
            >
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ah.anemia'
                  checked={
                    formData.antecedentes.hematologico_inmunologico.anemia
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.hematologico_inmunologico.anemia",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ah.anemia'>Anemia</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ah.hemofilia'
                  checked={
                    formData.antecedentes.hematologico_inmunologico.hemofilia
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.hematologico_inmunologico.hemofilia",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ah.hemofilia'>Hemofilia</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ah.vih'
                  checked={
                    formData.antecedentes.hematologico_inmunologico.vih_sida
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.hematologico_inmunologico.vih_sida",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ah.vih'>VIH/SIDA</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ah.autoinmunes'
                  checked={
                    formData.antecedentes.hematologico_inmunologico
                      .enfermedades_autoinmunes
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.hematologico_inmunologico.enfermedades_autoinmunes",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ah.autoinmunes'>Enf. Autoinmunes</Label>
              </div>
            </fieldset>
          </div>
          {/* f. Digestivo/Hepático */}
          <div
            className={cn(
              "space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              {
                "opacity-50":
                  formData.antecedentes.digestivo_hepatico.no_refiere,
              }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>f. Digestivo/Hepático</h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='ad.no_refiere'
                  checked={formData.antecedentes.digestivo_hepatico.no_refiere}
                  onCheckedChange={(c) =>
                    handleNoRefiereChange("digestivo_hepatico", !!c)
                  }
                />
                <Label
                  htmlFor='ad.no_refiere'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={formData.antecedentes.digestivo_hepatico.no_refiere}
              className='grid grid-cols-1 gap-y-4 pt-4'
            >
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ad.reflujo'
                  checked={formData.antecedentes.digestivo_hepatico.reflujo}
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.digestivo_hepatico.reflujo",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ad.reflujo'>Reflujo</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ad.ulcera'
                  checked={
                    formData.antecedentes.digestivo_hepatico.ulcera_gastrica
                  }
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.digestivo_hepatico.ulcera_gastrica",
                      !!c
                    )
                  }
                />
                <Label htmlFor='ad.ulcera'>Úlcera Gástrica</Label>
              </div>
              <CheckboxWithInput
                label='Hepatitis'
                checkboxName='antecedentes.digestivo_hepatico.hepatitis'
                checkboxValue={
                  formData.antecedentes.digestivo_hepatico.hepatitis
                }
                inputName='antecedentes.digestivo_hepatico.hepatitis_tipo'
                inputValue={
                  formData.antecedentes.digestivo_hepatico.hepatitis_tipo
                }
                placeholder='Tipo...'
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleChange}
              />
            </fieldset>
          </div>
          {/* g. Renal */}
          <div
            className={cn(
              "space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              { "opacity-50": formData.antecedentes.renal.no_refiere }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>g. Renal</h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='ar.no_refiere_renal'
                  checked={formData.antecedentes.renal.no_refiere}
                  onCheckedChange={(c) => handleNoRefiereChange("renal", !!c)}
                />
                <Label
                  htmlFor='ar.no_refiere_renal'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={formData.antecedentes.renal.no_refiere}
              className='grid grid-cols-1 gap-y-4 pt-4'
            >
              <CheckboxWithInput
                label='Insuficiencia Renal'
                checkboxName='antecedentes.renal.insuficiencia_renal'
                checkboxValue={formData.antecedentes.renal.insuficiencia_renal}
                inputName='antecedentes.renal.insuficiencia_renal_etapa'
                inputValue={
                  formData.antecedentes.renal.insuficiencia_renal_etapa
                }
                placeholder='Etapa...'
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleChange}
              />
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='ar.dialisis'
                  checked={formData.antecedentes.renal.dialisis}
                  onCheckedChange={(c) =>
                    handleCheckboxChange("antecedentes.renal.dialisis", !!c)
                  }
                />
                <Label htmlFor='ar.dialisis'>Diálisis</Label>
              </div>
            </fieldset>
          </div>
          {/* h. Alergias */}
          <div
            className={cn(
              "space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              { "opacity-50": formData.antecedentes.alergias.no_refiere }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>h. Alergias</h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='al.no_refiere'
                  checked={formData.antecedentes.alergias.no_refiere}
                  onCheckedChange={(c) =>
                    handleNoRefiereChange("alergias", !!c)
                  }
                />
                <Label
                  htmlFor='al.no_refiere'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={formData.antecedentes.alergias.no_refiere}
              className='grid grid-cols-1 gap-y-4 pt-4'
            >
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='al.penicilina'
                  checked={formData.antecedentes.alergias.penicilina}
                  onCheckedChange={(c) =>
                    handleCheckboxChange(
                      "antecedentes.alergias.penicilina",
                      !!c
                    )
                  }
                />
                <Label htmlFor='al.penicilina'>Penicilina</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='al.sulfas'
                  checked={formData.antecedentes.alergias.sulfas}
                  onCheckedChange={(c) =>
                    handleCheckboxChange("antecedentes.alergias.sulfas", !!c)
                  }
                />
                <Label htmlFor='al.sulfas'>Sulfas</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='al.latex'
                  checked={formData.antecedentes.alergias.latex}
                  onCheckedChange={(c) =>
                    handleCheckboxChange("antecedentes.alergias.latex", !!c)
                  }
                />
                <Label htmlFor='al.latex'>Látex</Label>
              </div>
              <div className='col-span-full'>
                <CheckboxWithInput
                  label='Anestésicos locales'
                  checkboxName='antecedentes.alergias.anestesicos_locales'
                  checkboxValue={
                    formData.antecedentes.alergias.anestesicos_locales
                  }
                  inputName='antecedentes.alergias.anestesicos_locales_detalle'
                  inputValue={
                    formData.antecedentes.alergias.anestesicos_locales_detalle
                  }
                  placeholder='Especificar...'
                  onCheckboxChange={handleCheckboxChange}
                  onInputChange={handleChange}
                />
              </div>
              <div className='col-span-full'>
                <CheckboxWithInput
                  label='Alimentos'
                  checkboxName='antecedentes.alergias.alimentos'
                  checkboxValue={formData.antecedentes.alergias.alimentos}
                  inputName='antecedentes.alergias.alimentos_detalle'
                  inputValue={formData.antecedentes.alergias.alimentos_detalle}
                  placeholder='Especificar...'
                  onCheckboxChange={handleCheckboxChange}
                  onInputChange={handleChange}
                />
              </div>
            </fieldset>
          </div>
          {/* i. Otros Relevantes */}
          <div
            className={cn(
              "md:col-span-2 space-y-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-800/50 relative transition-opacity",
              {
                "opacity-50": formData.antecedentes.otros_relevantes.no_refiere,
              }
            )}
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-base'>i. Otros Relevantes</h4>
              <div className='flex items-center space-x-2 absolute top-2 right-2'>
                <Checkbox
                  id='ao.no_refiere'
                  checked={formData.antecedentes.otros_relevantes.no_refiere}
                  onCheckedChange={(c) =>
                    handleNoRefiereChange("otros_relevantes", !!c)
                  }
                />
                <Label
                  htmlFor='ao.no_refiere'
                  className='text-xs'
                >
                  No Refiere
                </Label>
              </div>
            </div>
            <fieldset
              disabled={formData.antecedentes.otros_relevantes.no_refiere}
              className='grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 pt-4'
            >
              <CheckboxWithInputVertical
                label='Cáncer'
                checkboxName='antecedentes.otros_relevantes.cancer'
                checkboxValue={formData.antecedentes.otros_relevantes.cancer}
                inputName='antecedentes.otros_relevantes.cancer_tipo'
                inputValue={formData.antecedentes.otros_relevantes.cancer_tipo}
                placeholder='Tipo...'
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleChange}
              />
              <CheckboxWithInputVertical
                label='Embarazo actual'
                checkboxName='antecedentes.otros_relevantes.embarazo_actual'
                checkboxValue={
                  formData.antecedentes.otros_relevantes.embarazo_actual
                }
                inputName='antecedentes.otros_relevantes.embarazo_semanas'
                inputValue={
                  formData.antecedentes.otros_relevantes.embarazo_semanas
                }
                placeholder='Semanas...'
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleChange}
              />
              <CheckboxWithInputVertical
                label='Prótesis articulares'
                checkboxName='antecedentes.otros_relevantes.protesis_articulares'
                checkboxValue={
                  formData.antecedentes.otros_relevantes.protesis_articulares
                }
                inputName='antecedentes.otros_relevantes.protesis_fecha_colocacion'
                inputValue={
                  formData.antecedentes.otros_relevantes
                    .protesis_fecha_colocacion
                }
                placeholder='Fecha de colocación...'
                onCheckboxChange={handleCheckboxChange}
                onInputChange={handleChange}
              />
            </fieldset>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 3: HÁBITOS */}
      <Card className='shadow-md hover:shadow-lg transition-shadow'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3 text-xl'>
            <Cigarette className='text-amber-600' />
            3. Hábitos
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label>Tabaco</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("habitos.tabaco", value)
              }
              value={formData.habitos.tabaco}
            >
              <SelectTrigger>
                <SelectValue placeholder='Seleccione...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='nunca'>Nunca</SelectItem>
                <SelectItem value='ex_fumador'>Ex-fumador</SelectItem>
                <SelectItem value='actual'>Actual</SelectItem>
              </SelectContent>
            </Select>
            {formData.habitos.tabaco === "actual" && (
              <Input
                name='habitos.tabaco_actual_detalle'
                value={formData.habitos.tabaco_actual_detalle}
                onChange={handleChange}
                placeholder='Cigarrillos/día'
              />
            )}
          </div>
          <div className='space-y-2'>
            <Label>Alcohol</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("habitos.alcohol", value)
              }
              value={formData.habitos.alcohol}
            >
              <SelectTrigger>
                <SelectValue placeholder='Seleccione...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='no'>No</SelectItem>
                <SelectItem value='ocasional'>Ocasional</SelectItem>
                <SelectItem value='frecuente'>Frecuente</SelectItem>
              </SelectContent>
            </Select>
            {formData.habitos.alcohol === "frecuente" && (
              <Input
                name='habitos.alcohol_frecuente_detalle'
                value={formData.habitos.alcohol_frecuente_detalle}
                onChange={handleChange}
                placeholder='Veces/semana'
              />
            )}
          </div>
          <div className='md:col-span-2'>
            <CheckboxWithInput
              label='Consume drogas recreacionales'
              checkboxName='habitos.drogas_recreacionales'
              checkboxValue={formData.habitos.drogas_recreacionales}
              inputName='habitos.drogas_tipo'
              inputValue={formData.habitos.drogas_tipo}
              placeholder='Tipo...'
              onCheckboxChange={handleCheckboxChange}
              onInputChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 4: EXAMEN CLÍNICO */}
      <Card className='shadow-md hover:shadow-lg transition-shadow'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3 text-xl'>
            <Stethoscope className='text-teal-500' />
            4. Examen Clínico
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 items-end'>
            <div className='space-y-2'>
              <Label>Talla (m)</Label>
              <Input
                name='examen_clinico.talla'
                value={formData.examen_clinico.talla}
                onChange={handleChange}
                type='number'
                step='0.01'
              />
            </div>
            <div className='space-y-2'>
              <Label>Peso (kg)</Label>
              <Input
                name='examen_clinico.peso'
                value={formData.examen_clinico.peso}
                onChange={handleChange}
                type='number'
                step='0.1'
              />
            </div>
            <div className='space-y-2'>
              <Label>IMC</Label>
              <div className='flex items-center space-x-2 p-2 border rounded-md bg-gray-100 dark:bg-gray-800 min-h-[40px]'>
                <span className='font-mono w-16'>
                  {formData.examen_clinico.imc}
                </span>
                {imcClassification.classification && (
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      imcClassification.color
                    )}
                  >
                    {imcClassification.classification}
                  </span>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Presión Arterial (P.A.)</Label>
              <Input
                name='examen_clinico.pa'
                value={formData.examen_clinico.pa}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <Odontograma />
      </Card>

      {/* SECCIÓN 5: SEGUIMIENTO */}
      <Card className='shadow-md hover:shadow-lg transition-shadow'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className='flex items-center gap-3 text-xl'>
              <ListChecks className='text-purple-500' />
              5. Seguimiento
            </CardTitle>
            <Button
              type='button'
              onClick={addSeguimientoRow}
            >
              Añadir Fila
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Encabezados de la tabla */}
            {formData.seguimiento.length > 0 && (
              <div className='grid grid-cols-[1fr,2fr,2fr,1fr,1fr,auto] gap-2 items-center px-1 pb-2 border-b'>
                <Label className='text-xs font-semibold text-center'>
                  Fecha
                </Label>
                <Label className='text-xs font-semibold text-center'>
                  Procedimiento Realizado
                </Label>
                <Label className='text-xs font-semibold text-center'>
                  Observaciones
                </Label>
                <Label className='text-xs font-semibold text-center'>
                  Próxima Cita
                </Label>
                <Label className='text-xs font-semibold text-center'>
                  Imagen Ref.
                </Label>
                <div /> {/* Espacio para el botón de eliminar */}
              </div>
            )}

            {formData.seguimiento.map((row) => (
              <div
                key={row.id}
                className='grid grid-cols-[1fr,2fr,2fr,1fr,1fr,auto] gap-2 items-center'
              >
                <Input
                  type='date'
                  name='fecha'
                  value={row.fecha}
                  onChange={(e) => handleSeguimientoChange(e, row.id)}
                  className='text-center'
                />
                <Input
                  name='procedimiento_realizado'
                  placeholder='Procedimiento realizado'
                  value={row.procedimiento_realizado}
                  onChange={(e) => handleSeguimientoChange(e, row.id)}
                  className='text-center'
                />
                <Input
                  name='observaciones'
                  placeholder='Observaciones'
                  value={row.observaciones}
                  onChange={(e) => handleSeguimientoChange(e, row.id)}
                  className='text-center'
                />
                <Input
                  type='date'
                  name='proxima_cita'
                  value={row.proxima_cita}
                  onChange={(e) => handleSeguimientoChange(e, row.id)}
                  className='text-center'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  disabled
                >
                  {" "}
                  {/* Deshabilitado por ahora */}
                  Subir
                </Button>
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  onClick={() => removeSeguimientoRow(row.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
            {formData.seguimiento.length === 0 && (
              <p className='text-sm text-muted-foreground text-center'>
                No hay seguimientos registrados.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN DE ACCIONES */}
      <div className='flex justify-end items-center space-x-4 mt-10 p-4 bg-slate-50 dark:bg-gray-800 rounded-lg shadow-md'>
        <Button
          type='button'
          variant='outline'
          onClick={handleCancel}
          className='text-base px-6 py-5'
        >
          Cancelar
        </Button>
        <Button
          type='button'
          variant='secondary'
          onClick={handlePrint}
          disabled={isPrinting}
          className='text-base px-6 py-5 flex items-center gap-2'
        >
          <FileDown className='w-5 h-5' />
          {isPrinting ? "Generando PDF..." : "Imprimir Ficha"}
        </Button>
        <Button
          type='submit'
          className='text-base px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white'
        >
          Guardar Ficha
        </Button>
      </div>
    </form>
  );
}

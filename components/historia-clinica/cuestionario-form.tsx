"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type PreguntaValor =
  | string
  | { respuesta?: string; detalle?: string; opciones?: string[] };

type CuestionarioData = {
  [seccion: string]: {
    [pregunta: string]: PreguntaValor;
  };
};

export default function CuestionarioForm({
  initialData,
  onChange,
}: {
  initialData?: CuestionarioData;
  onChange: (data: CuestionarioData) => void;
}) {
  const [formData, setFormData] = useState<CuestionarioData>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    seccion: string,
    pregunta: string,
    valor: PreguntaValor
  ) => {
    const newData = {
      ...formData,
      [seccion]: {
        ...formData[seccion],
        [pregunta]: valor,
      },
    };
    setFormData(newData);
    onChange(newData);
  };

    const renderPregunta = (
      seccion: string,
      pregunta: string,
      tipo: "si-no-cual" | "texto" | "checkbox-especifique" | "si-no",
      opciones?: string[]
    ) => {
      const id = `${seccion}-${pregunta.replace(/\s+/g, "-")}`;
      switch (tipo) {
        case "si-no-cual":
          return (
            <div className="mb-4 rounded-md border p-4">
              <Label className="font-semibold">{pregunta}</Label>
              <RadioGroup
                value={(formData[seccion]?.[pregunta] as { respuesta?: string })?.respuesta}
                onValueChange={(value: string) => {
                  const currentState = formData[seccion]?.[pregunta];
                  const detalle = typeof currentState === "object" ? currentState.detalle : "";
                  handleChange(seccion, pregunta, { respuesta: value, detalle });
                }}
                className="mt-2 flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id={`${id}-si`} />
                  <Label htmlFor={`${id}-si`}>Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${id}-no`} />
                  <Label htmlFor={`${id}-no`}>No</Label>
                </div>
              </RadioGroup>
              {(formData[seccion]?.[pregunta] as { respuesta?: string })?.respuesta === "si" && (
                <Input
                  placeholder="¿Cuál?"
                  className="mt-2"
                  value={(formData[seccion]?.[pregunta] as { detalle?: string })?.detalle || ""}
                  onChange={(e) =>
                    handleChange(seccion, pregunta, {
                      respuesta: "si",
                      detalle: e.target.value,
                    })
                  }
                />
              )}
            </div>
          );
        case "si-no":
          return (
            <div className="mb-4 rounded-md border p-4">
              <Label className="font-semibold">{pregunta}</Label>
              <RadioGroup
                value={formData[seccion]?.[pregunta] as string}
                onValueChange={(value: string) => handleChange(seccion, pregunta, { respuesta: value })}
                className="mt-2 flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id={`${id}-si`} />
                  <Label htmlFor={`${id}-si`}>Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${id}-no`} />
                  <Label htmlFor={`${id}-no`}>No</Label>
                </div>
              </RadioGroup>
            </div>
          );
        case "texto":
          return (
            <div className="mb-4 rounded-md border p-4">
              <Label htmlFor={id} className="font-semibold">{pregunta}</Label>
              <Textarea
                id={id}
                className="mt-2"
                value={formData[seccion]?.[pregunta] as string || ""}
                onChange={(e) => handleChange(seccion, pregunta, e.target.value)}
              />
            </div>
          );
        case "checkbox-especifique":
          return (
            <div className="mb-4 rounded-md border p-4">
              <Label className="font-semibold">{pregunta}</Label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {opciones?.map((opcion) => (
                  <div key={opcion} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${id}-${opcion}`}
                      checked={((formData[seccion]?.[pregunta] as { opciones?: string[] })?.opciones || []).includes(opcion)}
                      onCheckedChange={(checked: boolean) => {
                        const currentState = formData[seccion]?.[pregunta];
                        const actuales = (typeof currentState === 'object' && currentState.opciones) ? currentState.opciones : [];
                        const nuevos = checked
                          ? [...actuales, opcion]
                          : actuales.filter((item: string) => item !== opcion);
                        const detalle = (typeof currentState === 'object' && currentState.detalle) ? currentState.detalle : '';
                        handleChange(seccion, pregunta, { opciones: nuevos, detalle });
                      }}
                    />
                    <Label htmlFor={`${id}-${opcion}`}>{opcion}</Label>
                  </div>
                ))}
              </div>
              <Input
                placeholder="Especifique"
                className="mt-2"
                value={(formData[seccion]?.[pregunta] as { detalle?: string })?.detalle || ''}
                onChange={(e) => {
                  const currentState = formData[seccion]?.[pregunta];
                  const opciones = (typeof currentState === 'object' && currentState.opciones) ? currentState.opciones : [];
                  handleChange(seccion, pregunta, {
                    opciones,
                    detalle: e.target.value,
                  });
                }}
              />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-xl font-bold">I. ANTECEDENTES GENERALES</h3>
          {renderPregunta("generales", "¿Está usted bajo tratamiento médico?", "si-no-cual")}
          {renderPregunta("generales", "¿Toma algún medicamento de forma habitual?", "si-no-cual")}
          {renderPregunta("generales", "¿Ha sido hospitalizado(a) o intervenido(a) quirúrgicamente? ¿Por qué motivo y cuándo?", "si-no-cual")}
          {renderPregunta("generales", "¿Ha tenido transfusiones de sangre?", "si-no")}
          {renderPregunta("generales", "¿Tiene alergias?", "checkbox-especifique", ["Medicamentos", "Alimentos", "Otros"]) }
          {renderPregunta("generales", "¿Ha tenido alguna reacción adversa a la anestesia local o general?", "si-no")}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">II. SISTEMA CARDIOVASCULAR</h3>
          {renderPregunta("cardiovascular", "¿Tiene o ha tenido alguna de las siguientes enfermedades?", "checkbox-especifique", ["Hipertensión arterial", "Infarto al miocardio", "Arritmias", "Insuficiencia cardiaca", "Problemas valvulares", "Marcapasos", "Soplos cardiacos", "Otros"]) }
          {renderPregunta("cardiovascular", "¿Siente dolor o presión en el pecho con el esfuerzo?", "texto")}
          {renderPregunta("cardiovascular", "¿Toma medicamentos para el corazón?", "texto")}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">III. SISTEMA RESPIRATORIO</h3>
          {renderPregunta("respiratorio", "¿Padece alguna de estas enfermedades respiratorias?", "checkbox-especifique", ["Asma", "Bronquitis crónica", "EPOC", "Tuberculosis", "Apnea del sueño", "Rinitis o sinusitis crónica"]) }
          {renderPregunta("respiratorio", "¿Tiene dificultad para respirar o se cansa con facilidad?", "texto")}
          {renderPregunta("respiratorio", "¿Utiliza inhaladores o medicamentos respiratorios?", "texto")}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">IV. SISTEMA HEMATOLÓGICO</h3>
          {renderPregunta("hematologico", "¿Sangra con facilidad por encías, nariz o heridas pequeñas?", "texto")}
          {renderPregunta("hematologico", "¿Presenta moretones frecuentes sin causa aparente?", "texto")}
          {renderPregunta("hematologico", "¿Tiene diagnóstico de trastornos hemorrágicos (Hemofilia, púrpura, etc.)?", "texto")}
          {renderPregunta("hematologico", "¿Está tomando anticoagulantes o antiplaquetarios?", "texto")}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">V. SISTEMA ENDOCRINO</h3>
          {renderPregunta("endocrino", "¿Tiene o ha tenido alguna de las siguientes condiciones?", "checkbox-especifique", ["Diabetes", "Hipoglucemia", "Hipertiroidismo", "Hipotiroidismo", "Trastornos hormonales"]) }
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">VI. SISTEMA DIGESTIVO</h3>
          {renderPregunta("digestivo", "¿Sufre de problemas gástricos o intestinales?", "checkbox-especifique", ["Gastritis", "Úlceras", "Reflujo", "Enfermedad hepática", "Estreñimiento o diarreas crónicas"]) }
          {renderPregunta("digestivo", "¿Tiene diagnóstico de hepatitis?", "checkbox-especifique", ["A", "B", "C", "No sabe"]) }
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">VII. SISTEMA URINARIO</h3>
          {renderPregunta("urinario", "¿Tiene enfermedad renal crónica o insuficiencia renal?", "texto")}
          {renderPregunta("urinario", "¿Orina con dificultad, dolor o sangre?", "texto")}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">VIII. SISTEMA MUSCULOESQUELÉTICO</h3>
          {renderPregunta("musculoesqueletico", "¿Tiene alguna limitación de movimientos o alteraciones óseas/articulares?", "checkbox-especifique", ["Artritis", "Osteoporosis", "Artrosis", "Otros"]) }
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">IX. SISTEMA NERVIOSO</h3>
          {renderPregunta("nervioso", "¿Padece de algunas de estas condiciones?", "checkbox-especifique", ["Epilepsia", "Accidente cerebrovascular", "Parálisis"]) }
          {renderPregunta("nervioso", "¿Toma medicamentos psiquiátricos o neurológicos?", "texto")}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">X. SISTEMA INMUNOLÓGICO</h3>
          {renderPregunta("inmunologico", "¿Tiene VIH/SIDA?", "texto")}
          {renderPregunta("inmunologico", "¿Ha recibido trasplante de órgano?", "texto")}
          {renderPregunta("inmunologico", "¿Recibe tratamiento inmunosupresor?", "texto")}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">XI. SISTEMA REPRODUCTOR</h3>
          {renderPregunta("reproductor", "¿Está embarazada o sospecha estarlo?", "texto")}
          {renderPregunta("reproductor", "¿Está lactando actualmente?", "texto")}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">XII. HÁBITOS Y ESTILO DE VIDA</h3>
          {renderPregunta("habitos", "¿Fuma?", "si-no-cual")}
          {renderPregunta("habitos", "¿Consume alcohol?", "si-no-cual")}
          {renderPregunta("habitos", "¿Consume drogas recreativas?", "si-no-cual")}
          {renderPregunta("habitos", "¿Ha sido vacunado contra la hepatitis B?", "checkbox-especifique", ["Sí", "No", "No recuerda"]) }
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">XIII. ANTECEDENTES ODONTOLÓGICOS RELEVANTES</h3>
          {renderPregunta("odontologicos", "¿Ha tenido infecciones bucales recurrentes?", "texto")}
          {renderPregunta("odontologicos", "¿Ha tenido complicaciones con extracciones previas?", "texto")}
        </div>
      </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AntecedenteItem from "./antecedente-item";
import CuestionarioForm from "./cuestionario-form";
import { saveHistoriaClinica } from "@/app/admin/(protected)/ficha-odontologica/[numero_historia]/actions";

// Definiciones de tipos locales para evitar importaciones rotas
type Antecedente = {
  opciones: string[];
  otros: string;
  noRefiere: boolean;
};

type AntecedentesData = {
  [key: string]: Antecedente;
};

type PreguntaValor =
  | string
  | { respuesta?: string; detalle?: string; opciones?: string[] };

type CuestionarioData = {
  [seccion: string]: {
    [pregunta: string]: PreguntaValor;
  };
};

// Tipos específicos para los datos que se enviarán a la API
type PreguntaValorForApi =
  | string
  | { respuesta?: boolean; detalle?: string; opciones?: string[] };

type CuestionarioDataForApi = {
  [seccion: string]: {
    [pregunta: string]: PreguntaValorForApi;
  };
};

export default function HistoriaClinicaForm({ pacienteId }: { pacienteId: string }) {
  const [activeTab, setActiveTab] = useState("antecedentes");
  const [antecedentesData, setAntecedentesData] = useState<AntecedentesData>({});
  const [cuestionarioData, setCuestionarioData] = useState<CuestionarioData>({});

  const handleCuestionarioChange = (data: CuestionarioData) => {
    setCuestionarioData(data);
  };

  const handleAntecedenteChange = (
    categoria: keyof AntecedentesData,
    data: Antecedente
  ) => {
    setAntecedentesData((prev) => ({
      ...prev,
      [categoria]: data,
    }));
  };

  const handleSave = async () => {
    const cuestionarioDataForApi: CuestionarioDataForApi = Object.entries(
      cuestionarioData
    ).reduce((acc, [seccion, preguntas]) => {
      const nuevasPreguntas = Object.entries(preguntas).reduce(
        (pregAcc, [pregunta, valor]) => {
          if (
            typeof valor === "object" &&
            valor !== null &&
            "respuesta" in valor &&
            typeof valor.respuesta === "string"
          ) {
            pregAcc[pregunta] = {
              ...valor,
              respuesta: valor.respuesta === "si",
            };
          } else {
            pregAcc[pregunta] = valor as PreguntaValorForApi;
          }
          return pregAcc;
        },
        {} as { [pregunta: string]: PreguntaValorForApi }
      );
      acc[seccion] = nuevasPreguntas;
      return acc;
    }, {} as CuestionarioDataForApi);

    const { error } = await saveHistoriaClinica(
      pacienteId,
      antecedentesData,
      cuestionarioDataForApi
    );

    if (error) {
      // Manejar el error (por ejemplo, mostrar una notificación)
      console.error("Error al guardar la historia clínica:", error);
    } else {
      // Manejar el éxito (por ejemplo, mostrar una notificación de éxito)
      console.log("Historia clínica guardada con éxito");
    }
  };

  const antecedentesPatologicos = [
    {
      key: "alergias",
      titulo: "Alergias",
      opciones: ["Medicamentos", "Anestésicos", "Alimentos"],
    },
    {
      key: "cardiopatias",
      titulo: "Cardiopatías",
      opciones: ["Hipertensión", "Hipotensión", "Angina de Pecho", "Infarto", "Arritmias", "Valvulopatías", "Fiebre Reumática"],
    },
    {
      key: "enfermedadesRespiratorias",
      titulo: "Enfermedades Respiratorias",
      opciones: ["Asma", "Bronquitis", "Tuberculosis", "Enfisema", "Sinusitis"],
    },
    {
      key: "enfermedadesGastrointestinales",
      titulo: "Enfermedades Gastrointestinales",
      opciones: ["Úlcera", "Gastritis", "Hepatitis", "Cirrosis"],
    },
    {
      key: "enfermedadesNeurologicas",
      titulo: "Enfermedades Neurológicas",
      opciones: ["Epilepsia", "Convulsiones", "Vértigo", "Desmayos", "ACV"],
    },
    {
      key: "enfermedadesInfecciosas",
      titulo: "Enfermedades Infecciosas",
      opciones: ["VIH/SIDA", "Tuberculosis", "Sífilis", "Gonorrea"],
    },
    {
      key: "enfermedadesEndocrinas",
      titulo: "Enfermedades Endocrinas",
      opciones: ["Diabetes", "Hipotiroidismo", "Hipertiroidismo"],
    },
    {
      key: "enfermedadesHematicas",
      titulo: "Enfermedades Hemáticas",
      opciones: ["Anemia", "Hemofilia", "Leucemia"],
    },
    { key: "cirugias", titulo: "Cirugías", opciones: [] },
    { key: "hospitalizaciones", titulo: "Hospitalizaciones", opciones: [] },
    { key: "medicamentos", titulo: "Medicamentos", opciones: [] },
    { key: "habitos", titulo: "Hábitos", opciones: ["Fuma", "Bebe", "Drogas"] },
    {
      key: "antecedentesFamiliares",
      titulo: "Antecedentes Familiares",
      opciones: ["Diabetes", "Hipertensión", "Cáncer", "Cardiopatías"],
    },
    { key: "otros", titulo: "Otros", opciones: [] },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historia Clínica</CardTitle>
        <div className="flex border-b">
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === "antecedentes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("antecedentes")}
          >
            Antecedentes
          </button>
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === "cuestionario"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("cuestionario")}
          >
            Cuestionario
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "antecedentes" && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">Antecedentes Patológicos</h3>
            {antecedentesPatologicos.map(({ key, titulo, opciones }) => (
              <AntecedenteItem
                key={key}
                titulo={titulo}
                opciones={opciones}
                onChange={(data) => handleAntecedenteChange(key, data)}
              />
            ))}
          </div>
        )}
        {activeTab === "cuestionario" && (
          <div>
            <CuestionarioForm onChange={handleCuestionarioChange} />
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Guardar Historia Clínica</Button>
        </div>
      </CardContent>
    </Card>
  );
}

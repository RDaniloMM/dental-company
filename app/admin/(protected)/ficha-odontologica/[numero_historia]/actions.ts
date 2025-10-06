"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type Antecedente = {
  opciones: string[];
  otros: string;
  noRefiere: boolean;
};

type AntecedentesData = {
  [key: string]: Antecedente;
};

type CuestionarioPreguntaValor =
  | string
  | {
      respuesta?: boolean;
      detalle?: string;
      opciones?: string[];
    };

type CuestionarioData = {
  [key: string]: {
    [key: string]: CuestionarioPreguntaValor;
  };
};

export async function saveHistoriaClinica(
  pacienteId: string,
  antecedentes: AntecedentesData,
  cuestionario: CuestionarioData
) {
  const supabase = await createClient();

  // 1. Obtener o crear la historia clínica
  const { data: initialHistoria, error: historiaError } = await supabase
    .from("historias_clinicas")
    .select("id")
    .eq("paciente_id", pacienteId)
    .single();

  let historia = initialHistoria;

  if (historiaError && historiaError.code === "PGRST116") {
    // No existe, la creamos
    const { data: newHistoria, error: newHistoriaError } = await supabase
      .from("historias_clinicas")
      .insert({ paciente_id: pacienteId })
      .select("id")
      .single();

    if (newHistoriaError) {
      console.error("Error creando la historia clínica:", newHistoriaError);
      return { error: newHistoriaError };
    }
    historia = newHistoria;
  } else if (historiaError) {
    console.error("Error obteniendo la historia clínica:", historiaError);
    return { error: historiaError };
  }

  if (!historia) {
    const error = new Error("No se pudo obtener o crear la historia clínica.");
    console.error(error);
    return { error };
  }

  const historiaId = historia.id;

  // 2. Guardar antecedentes
  const antecedentesPromises = Object.entries(antecedentes).map(
    ([categoria, data]) =>
      supabase.from("antecedentes").upsert(
        {
          historia_id: historiaId,
          categoria,
          opciones: data.opciones,
          otros: data.otros,
          no_refiere: data.noRefiere,
        },
        { onConflict: "historia_id,categoria" }
      )
  );

  // 3. Guardar cuestionario
  const cuestionarioPromises = Object.entries(cuestionario).flatMap(
    ([seccion, preguntas]) =>
      Object.entries(preguntas).map(([pregunta, valor]) => {
        const payload: {
          historia_id: number;
          seccion: string;
          pregunta: string;
          respuesta_si_no?: boolean | null;
          respuesta_texto?: string | null;
          respuesta_opciones?: string[] | null;
          detalle?: string | null;
        } = {
          historia_id: historiaId,
          seccion,
          pregunta,
        };

        if (typeof valor === "string") {
          payload.respuesta_texto = valor;
        } else if (typeof valor === "object" && valor !== null) {
          payload.respuesta_si_no =
            typeof valor.respuesta === "boolean" ? valor.respuesta : null;
          payload.respuesta_opciones = valor.opciones || null;
          payload.detalle = valor.detalle || null;
        }

        return supabase
          .from("cuestionario_respuestas")
          .upsert(payload, { onConflict: "historia_id,seccion,pregunta" });
      })
  );

  const results = await Promise.all([
    ...antecedentesPromises,
    ...cuestionarioPromises,
  ]);

  const errors = results.map((res) => res.error).filter(Boolean);

  if (errors.length > 0) {
    console.error("Errores al guardar la historia clínica:", errors);
    return { error: errors };
  }

  revalidatePath(`/admin/ficha-odontologica/${pacienteId}`);
  return { data: "Historia clínica guardada con éxito." };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AnswerValue =
  | boolean
  | {
      respuesta?: boolean;
      texto?: string;
      opciones?: string[];
      subFields?: { [key: string]: string | number };
      noRefiere?: boolean;
    };

export type CategoryState = {
  questions: { [questionId: string]: AnswerValue };
  noRefiereCategoria: boolean;
};

export type AntecedentesFormData = {
  [category: string]: CategoryState;
};

export async function saveAntecedentes(
  pacienteId: string,
  formData: AntecedentesFormData
) {
  const supabase = await createClient();

  const { data: initialHistoria, error: historiaError } = await supabase
    .from("historias_clinicas")
    .select("id")
    .eq("paciente_id", pacienteId)
    .single();

  let historia = initialHistoria;

  if (historiaError && historiaError.code === "PGRST116") {
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

  const upsertPromises = Object.entries(formData).map(
    ([categoria, categoryState]) =>
      supabase.from("antecedentes").upsert(
        {
          historia_id: historiaId,
          categoria: categoria,
          datos: categoryState.questions,
          no_refiere: categoryState.noRefiereCategoria,
        },
        { onConflict: "historia_id,categoria" }
      )
  );

  const results = await Promise.all(upsertPromises);

  const errors = results.map((res) => res.error).filter(Boolean);

  if (errors.length > 0) {
    console.error("Errores al guardar los antecedentes:", errors);
    return { error: errors };
  }

  revalidatePath(`/admin/ficha-odontologica/${pacienteId}/historia-clinica`);
  return { data: "Antecedentes guardados con éxito." };
}

export async function getAntecedentes(pacienteId: string): Promise<{ data?: AntecedentesFormData; error?: unknown }> {
  const supabase = await createClient();

  const { data: historia, error: historiaError } = await supabase
    .from("historias_clinicas")
    .select("id")
    .eq("paciente_id", pacienteId)
    .single();

  if (historiaError || !historia) {
    if (historiaError && historiaError.code !== "PGRST116") {
      console.error("Error fetching historia clinica:", historiaError);
    }
    return { data: {} };
  }

  const historiaId = historia.id;
  const { data: antecedentesData, error: antecedentesError } = await supabase
    .from("antecedentes")
    .select("categoria, datos, no_refiere")
    .eq("historia_id", historiaId);

  if (antecedentesError) {
    console.error("Error fetching antecedentes:", antecedentesError);
    return { error: antecedentesError };
  }

  const processedFormData: AntecedentesFormData = (antecedentesData || []).reduce(
    (acc, item) => {
      acc[item.categoria] = {
        questions: item.datos || {},
        noRefiereCategoria: item.no_refiere || false,
      };
      return acc;
    },
    {} as AntecedentesFormData
  );

  return { data: processedFormData };
}

export async function getAntecedentesClient(pacienteId: string) {
  "use server";
  return getAntecedentes(pacienteId);
}


"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AntecedentesData, AnnotationItem, CategoryState } from "@/components/historia-clinica/types";

export async function saveAntecedentes(
  pacienteId: string,
  formData: AntecedentesData
) {
  const supabase = await createClient();

  let { data: historia, error: historiaError } = await supabase
    .from("historias_clinicas")
    .select("id")
    .eq("paciente_id", pacienteId)
    .single();

  if (historiaError && historiaError.code === "PGRST116") {
    const { data: newHistoria, error: newHistoriaError } = await supabase
      .from("historias_clinicas")
      .insert({ paciente_id: pacienteId })
      .select("id")
      .single();

    if (newHistoriaError) return { error: newHistoriaError.message };
    historia = newHistoria;
  } else if (historiaError) {
    return { error: historiaError.message };
  }

  if (!historia) return { error: "No se pudo obtener la historia clínica." };

  const upsertPromises = Object.entries(formData).map(
    ([categoria, categoryState]) =>
      supabase.from("antecedentes").upsert(
        {
          historia_id: historia.id,
          categoria: categoria,
          datos: {
            questions: categoryState.questions,
            annotationsEnabled: categoryState.annotationsEnabled,
            annotations: categoryState.annotations,
          },
          no_refiere: !categoryState.refiere, 
        },
        { onConflict: "historia_id,categoria" }
      )
  );

  const results = await Promise.all(upsertPromises);
  const errors = results.map((res) => res.error).filter(Boolean);

  if (errors.length > 0) {
    return { error: "Hubo errores al guardar algunas categorías." };
  }

  revalidatePath(`/admin/ficha-odontologica/${pacienteId}/historia-clinica`);
  return { data: "Exito" };
}

export async function getAntecedentes(pacienteId: string): Promise<{ data?: AntecedentesData; error?: string }> {
  const supabase = await createClient();

  const { data: historia, error: historiaError } = await supabase
    .from("historias_clinicas")
    .select("id")
    .eq("paciente_id", pacienteId)
    .single();

  if (historiaError || !historia) {
    return { data: {} };
  }

  const { data: antecedentesData, error: antecedentesError } = await supabase
    .from("antecedentes")
    .select("categoria, datos, no_refiere")
    .eq("historia_id", historia.id);

  if (antecedentesError) {
    return { error: antecedentesError.message };
  }

  const processedFormData: AntecedentesData = (antecedentesData || []).reduce(
    (acc, item) => {
      const storedData = item.datos || {};
      
      acc[item.categoria] = {
        questions: storedData.questions || {},
        refiere: !item.no_refiere, 
        annotationsEnabled: storedData.annotationsEnabled || false,
        annotations: (storedData.annotations as AnnotationItem[]) || [],
      } as CategoryState;
      
      return acc;
    },
    {} as AntecedentesData
  );

  return { data: processedFormData };
}

export async function getAntecedentesClient(pacienteId: string) {
  return getAntecedentes(pacienteId);
}
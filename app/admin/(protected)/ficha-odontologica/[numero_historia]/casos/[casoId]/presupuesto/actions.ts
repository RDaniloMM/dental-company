"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const presupuestoSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  caso_id: z.string().uuid(),
  paciente_id: z.string().uuid(),
  diagnostico_ids: z.array(z.string().uuid()).min(1, "Debe seleccionar al menos un diagnóstico."),
  nombre: z.string().optional(), 
  medico_id: z.string().uuid().optional().nullable(),
  observacion: z.string().optional().nullable(),
  especialidad: z.string().optional().nullable(),
  costo_total: z.number().positive('El costo debe ser mayor a 0'),
  moneda_id: z.string().uuid({ message: "Debe seleccionar una moneda válida" }),
  estado: z.string().default("Por Cobrar"),
});

const planItemSchema = z.object({
  procedimiento_id: z.string().uuid(),
  procedimiento_nombre: z.string().min(1),
  moneda_id: z.string().uuid().optional().nullable(),
  costo: z.number().nonnegative(),
  cantidad: z.number().int().positive("Cantidad debe ser mayor a 0"),
  pieza_dental: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
  orden_ejecucion: z.number().optional().nullable(),
});

interface PersonalRow {
  id: string;
  nombre_completo: string;
  rol: string;
}

interface PresupuestoRow {
  correlativo: number;
  creador_personal_id?: string | null;
  creador_nombre?: string | null;
  creador_rol?: string | null;
}

interface DiagnosticoCie10Row {
  cie10_catalogo: { descripcion: string } | null;
}

interface PagoRow {
  monto: number;
}

interface PresupuestoWithRelations {
  id: string;
  nombre: string;
  medico_id: string | null;
  observacion: string | null;
  especialidad: string | null;
  costo_total: number | null;
  moneda_id: string | null;
  estado: string;
  fecha_creacion: string;
  items_json: unknown;
  presupuesto_diagnosticos: { diagnostico_id: string }[];
}

export async function upsertPresupuesto(formData: unknown, items: unknown) {
  const supabase = await createClient();

  const parsedData = presupuestoSchema.safeParse(formData);
  if (!parsedData.success) {
    return {
      error: {
        message: "Datos del presupuesto inválidos.",
        issues: parsedData.error.issues,
      },
    };
  }

  const parsedItems = z.array(planItemSchema).safeParse(items);
  if (!parsedItems.success) {
    return {
      error: {
        message: "Datos de procedimientos inválidos.",
        issues: parsedItems.error.issues,
      },
    };
  }

  if (parsedItems.data.length === 0) {
    return { error: { message: "Debe agregar al menos un procedimiento." } };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: "No autorizado." } };
  }

  try {
    const presupuestoId = parsedData.data.id || crypto.randomUUID();
    const isUpdate = !!parsedData.data.id;
    
    let creador_personal_id: string | null = null;
    let creador_nombre: string | null = null;
    let creador_rol: string | null = null;
    let correlativoFinal: number | undefined = undefined;

    if (user.email) {
      const { data: personalMatch } = await supabase
        .from("personal")
        .select("id, nombre_completo, rol")
        .ilike("email", user.email)
        .limit(1)
        .maybeSingle();

      if (personalMatch) {
        const personal = personalMatch as PersonalRow;
        creador_personal_id = personal.id;
        creador_nombre = personal.nombre_completo;
        creador_rol = personal.rol;
      }
    }

    if (!isUpdate) {
        const { data: lastBudget } = await supabase
            .from('presupuestos')
            .select('correlativo')
            .eq('caso_id', parsedData.data.caso_id)
            .is('deleted_at', null)
            .order('correlativo', { ascending: false })
            .limit(1)
            .maybeSingle();

        const lastVal = lastBudget as { correlativo: number } | null;
        correlativoFinal = (lastVal?.correlativo || 0) + 1;
    } else {
        const { data: existing } = await supabase
            .from("presupuestos")
            .select("creador_personal_id, creador_nombre, creador_rol, correlativo")
            .eq("id", presupuestoId)
            .single();
            
        if (existing) {
            const row = existing as PresupuestoRow;
            creador_personal_id = creador_personal_id || row.creador_personal_id || null;
            creador_nombre = creador_nombre || row.creador_nombre || null;
            creador_rol = creador_rol || row.creador_rol || null;
            correlativoFinal = row.correlativo;
        }
    }

    const itemsJson = parsedItems.data.map((item, index) => ({
      procedimiento_id: item.procedimiento_id,
      procedimiento_nombre: item.procedimiento_nombre,
      moneda_id: item.moneda_id || parsedData.data.moneda_id || null,
      costo: item.costo,
      cantidad: item.cantidad,
      pieza_dental: item.pieza_dental || null,
      notas: item.notas || null,
      orden_ejecucion: item.orden_ejecucion || index + 1,
    }));

    const { data: diagInfos } = await supabase
        .from('diagnosticos')
        .select('cie10_catalogo(descripcion)')
        .in('id', parsedData.data.diagnostico_ids);
    
    const diagRows = (diagInfos || []) as unknown as DiagnosticoCie10Row[];
    const titulos = diagRows
        .map((d) => d.cie10_catalogo?.descripcion)
        .filter((desc): desc is string => !!desc);

    const nombreGenerado = titulos.length > 0 
        ? titulos.join(" + ").slice(0, 150) + (titulos.join(" + ").length > 150 ? "..." : "")
        : "Presupuesto General";

    const presupuestoPayload: Record<string, unknown> = {
      id: presupuestoId,
      caso_id: parsedData.data.caso_id,
      paciente_id: parsedData.data.paciente_id,
      nombre: nombreGenerado,
      medico_id: parsedData.data.medico_id || null,
      observacion: parsedData.data.observacion || null,
      especialidad: parsedData.data.especialidad || null,
      costo_total: parsedData.data.costo_total,
      estado: parsedData.data.estado,
      moneda_id: parsedData.data.moneda_id || null,
      items_json: itemsJson,
      creador_personal_id,
      creador_nombre,
      creador_rol
    };

    if (correlativoFinal !== undefined) {
        presupuestoPayload.correlativo = correlativoFinal;
    }

    const { error: presupuestoError } = await supabase
      .from("presupuestos")
      .upsert(presupuestoPayload, { onConflict: "id" });

    if (presupuestoError) throw presupuestoError;

    await supabase
        .from("presupuesto_diagnosticos")
        .delete()
        .eq("presupuesto_id", presupuestoId);

    if (parsedData.data.diagnostico_ids.length > 0) {
        const relaciones = parsedData.data.diagnostico_ids.map(diagId => ({
            presupuesto_id: presupuestoId,
            diagnostico_id: diagId
        }));
        
        const { error: relError } = await supabase
            .from("presupuesto_diagnosticos")
            .insert(relaciones);
            
        if (relError) throw relError;
    }

    revalidatePath("/admin/ficha-odontologica", "layout");
    revalidatePath("/admin/ficha-odontologica/[numero_historia]/casos/[casoId]", "layout");
    return { success: true, planId: presupuestoId };

  } catch (error) {
    console.error("[presupuesto] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido";
    return { error: { message: `Error al guardar el presupuesto: ${errorMessage}` } };
  }
}

export async function deletePresupuesto(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: { message: "No autorizado." } };

  const { count } = await supabase
    .from('seguimientos')
    .select('id', { count: 'exact', head: true })
    .eq('presupuesto_id', id)
    .is('deleted_at', null)
  
  if (count && count > 0) {
    return { error: { message: 'No se puede eliminar: El presupuesto está en uso en seguimientos' } }
  }

  const { error } = await supabase
    .from("presupuestos")
    .update({ deleted_at: new Date().toISOString(), deleted_by: user.id })
    .eq('id', id);

  if (error) return { error: { message: error.message } };

  revalidatePath("/admin/ficha-odontologica/", "layout");
  revalidatePath("/admin/ficha-odontologica/[numero_historia]/casos/[casoId]", "layout");
  return { success: true };
}

export async function getPresupuestoById(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("presupuestos")
      .select(`
        *,
        presupuesto_diagnosticos (
            diagnostico_id
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    
    const presupuesto = data as unknown as PresupuestoWithRelations;
    const diagIds = presupuesto.presupuesto_diagnosticos?.map((pd) => pd.diagnostico_id) || [];
    
    return { 
        success: true, 
        data: { 
            ...data, 
            diagnostico_ids: diagIds 
        } 
    };
  } catch (error) {
    console.error(error);
    return { error: { message: "Error al obtener el presupuesto" } };
  }
}

export async function updatePresupuestoTotals(presupuestoId: string) {
  const supabase = await createClient();

  try {
    const { data: pagos, error: pagosError } = await supabase
      .from('pagos')
      .select('monto')
      .eq('presupuesto_id', presupuestoId)
      .is('deleted_at', null);

    if (pagosError) throw pagosError;

    const pagosRows = (pagos || []) as PagoRow[];
    const totalPagado = pagosRows.reduce((sum, p) => sum + Number(p.monto || 0), 0);

    const { data: presupuesto, error: presupuestoError } = await supabase
      .from('presupuestos')
      .select('costo_total')
      .eq('id', presupuestoId)
      .is('deleted_at', null)
      .single();

    if (presupuestoError || !presupuesto) {
      throw presupuestoError || new Error('Presupuesto no encontrado');
    }

    const costoTotal = Number(presupuesto.costo_total || 0);
    const saldoPendiente = Math.max(0, costoTotal - totalPagado);

    let estado = 'Por Cobrar';
    if (totalPagado > 0 && totalPagado < costoTotal) {
      estado = 'Parcial';
    } else if (totalPagado >= costoTotal && costoTotal > 0) {
      estado = 'Pagado';
    }

    const { error: updateError } = await supabase
      .from('presupuestos')
      .update({
        total_pagado: totalPagado,
        estado,
        updated_at: new Date().toISOString(),
      })
      .eq('id', presupuestoId);

    if (updateError) throw updateError;

    revalidatePath('/admin/ficha-odontologica');

    return { success: true, totalPagado, saldoPendiente, estado };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { error: { message: `Error actualizando totales: ${errorMessage}` } };
  }
}

export async function checkPresupuestoUso(presupuestoId: string) {
  const supabase = await createClient()
  try {
    const { count, error } = await supabase
      .from('seguimientos')
      .select('id', { count: 'exact', head: true })
      .eq('presupuesto_id', presupuestoId)
      .is('deleted_at', null)

    if (error) return { count: 0, error: error.message }
    return { count: count || 0 }
  } catch (err) {
    return { count: 0, error: 'Error desconocido' }
  }
}
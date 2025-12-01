"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const presupuestoSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  caso_id: z.string().uuid(),
  paciente_id: z.string().uuid(),
  nombre: z.string().min(1, "El asunto es requerido."),
  medico_id: z.string().uuid().optional().nullable(),
  observacion: z.string().optional().nullable(),
  especialidad: z.string().optional().nullable(),
  costo_total: z.number().positive('El costo debe ser mayor a 0'),
  moneda_id: z.string().uuid().optional().nullable(),
  estado: z.string().default("Propuesto"),
});

const planItemSchema = z.object({
  procedimiento_id: z.string().uuid(),
  procedimiento_nombre: z.string().min(1),
  moneda_id: z.string().uuid().optional().nullable(),
  costo: z.number().positive("El costo debe ser mayor a 0"),
  cantidad: z.number().int().positive("Cantidad debe ser mayor a 0"),
  pieza_dental: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
  orden_ejecucion: z.number().optional().nullable(),
});

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: "No autorizado." } };
  }

  try {
    const presupuestoId = parsedData.data.id || crypto.randomUUID();
    const isUpdate = !!parsedData.data.id;

    // Resolver posible personal/creador desde usuario actual
    let creador_personal_id: string | null = null;
    let creador_nombre: string | null = null;
    let creador_rol: string | null = null;

    if (user?.email) {
      const { data: personalMatch } = await supabase
        .from("personal")
        .select("id, nombre_completo, rol")
        .ilike("email", user.email)
        .limit(1);

      if (personalMatch && personalMatch.length > 0) {
        creador_personal_id = personalMatch[0].id;
        creador_nombre = personalMatch[0].nombre_completo;
        creador_rol = personalMatch[0].rol;
      }
    }

    // Si es edición, preservar creador existente
    if (isUpdate) {
      const { data: existing } = await supabase
        .from("presupuestos")
        .select("creador_personal_id, creador_nombre, creador_rol")
        .eq("id", presupuestoId)
        .single();
      if (existing) {
        creador_personal_id =
          creador_personal_id || existing.creador_personal_id || null;
        creador_nombre = creador_nombre || existing.creador_nombre || null;
        creador_rol = creador_rol || existing.creador_rol || null;
      }
    }

    // Construir items JSON (incluye moneda seleccionada si viene desde frontend)
    const itemsJson = parsedItems.data.map((item, index) => ({
      procedimiento_id: item.procedimiento_id,
      procedimiento_nombre: item.procedimiento_nombre,
      moneda_id: (item as { moneda_id?: string }).moneda_id || parsedData.data.moneda_id || null,
      costo: item.costo,
      cantidad: item.cantidad,
      pieza_dental: item.pieza_dental || null,
      notas: item.notas || null,
      orden_ejecucion: item.orden_ejecucion || index + 1,
    }));

    // Build payload without creator fields to keep compatibility when DB columns are absent
    const presupuestoPayload: Record<string, unknown> = {
      id: presupuestoId,
      caso_id: parsedData.data.caso_id,
      paciente_id: parsedData.data.paciente_id,
      nombre: parsedData.data.nombre,
      medico_id: parsedData.data.medico_id || null,
      observacion: parsedData.data.observacion || null,
      especialidad: parsedData.data.especialidad || null,
      costo_total: parsedData.data.costo_total,
      estado: parsedData.data.estado,
      moneda_id: parsedData.data.moneda_id || null,
      items_json: itemsJson,
    };

    // Añadir info de creador (las columnas ya fueron añadidas en la BD según confirmación)
    presupuestoPayload["creador_personal_id"] = creador_personal_id;
    presupuestoPayload["creador_nombre"] = creador_nombre;
    presupuestoPayload["creador_rol"] = creador_rol;

    // If you want to persist creator info, run the migration to add columns in the DB.

    const { error: presupuestoError } = await supabase
      .from("presupuestos")
      .upsert(presupuestoPayload, { onConflict: "id" });

    if (presupuestoError) {
      console.error(
        "[presupuesto] Error upserting presupuestos:",
        presupuestoError
      );
      throw presupuestoError;
    }

    console.log(
      "[presupuesto] ✓ SUCCESS - Presupuesto guardado con ID:",
      presupuestoId
    );

    // Revalidar la ruta de presupuestos para refrescar datos en la tabla
    revalidatePath(
      "/admin/ficha-odontologica/[numero_historia]/casos/[casoId]/presupuesto",
      "layout"
    );
    return { success: true, planId: presupuestoId };
  } catch (error) {
    console.error("[presupuesto] ✗ FATAL Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Ocurrió un error desconocido";
    return {
      error: { message: `Error al guardar el presupuesto: ${errorMessage}` },
    };
  }
}

export async function deletePresupuesto(id: string) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: { message: "No autorizado." } };
    }

    // Obtener presupuesto para verificar permisos
    const { data: presupuesto, error: fetchError } = await supabase
      .from("presupuestos")
      .select("creador_personal_id, creador_rol, creador_nombre")
      .eq("id", id)
      .single();
    if (fetchError) {
      return { error: { message: "No se encontró el presupuesto." } };
    }

    // Resolver personal del usuario actual
    let currentPersonal: { id: string; nombre_completo: string; rol?: string } | null = null
    if (user.email) {
      const { data: personalMatch } = await supabase
        .from("personal")
        .select("id, nombre_completo, rol")
        .ilike("email", user.email)
        .limit(1);
      if (personalMatch && personalMatch.length > 0)
        currentPersonal = personalMatch[0];
    }

    const isAdmin = currentPersonal?.rol === "Admin";
    const isCreator =
      currentPersonal?.id &&
      presupuesto?.creador_personal_id &&
      currentPersonal.id === presupuesto.creador_personal_id;

    if (!isAdmin && !isCreator) {
      return {
        error: { message: "No autorizado para eliminar este presupuesto." },
      };
    }

    const { error } = await supabase.from("presupuestos").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/ficha-odontologica/");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Ocurrió un error desconocido";
    return {
      error: { message: `Error al eliminar el presupuesto: ${errorMessage}` },
    };
  }
}

export async function getPresupuestoById(id: string) {
  const supabase = await createClient();

  try {
    const { data: presupuesto, error } = await supabase
      .from("presupuestos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: presupuesto };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return {
      error: { message: `Error al obtener el presupuesto: ${errorMessage}` },
    };
  }
}

/**
 * Actualiza los totales (total_pagado, saldo_pendiente, estado) del presupuesto
 * basándose en los pagos registrados. Se llama automáticamente después de crear/eliminar pagos.
 */
export async function updatePresupuestoTotals(presupuestoId: string) {
  const supabase = await createClient()

  try {
    // 1. Obtener todos los pagos del presupuesto
    const { data: pagos, error: pagosError } = await supabase
      .from('pagos')
      .select('monto')
      .eq('presupuesto_id', presupuestoId)
      .is('deleted_at', null)

    if (pagosError) throw pagosError

    // 2. Sumar total pagado
    const totalPagado = (pagos || []).reduce((sum, p) => sum + Number(p.monto || 0), 0)

    // 3. Obtener costo_total del presupuesto
    const { data: presupuesto, error: presupuestoError } = await supabase
      .from('presupuestos')
      .select('costo_total')
      .eq('id', presupuestoId)
      .is('deleted_at', null)
      .single()

    if (presupuestoError || !presupuesto) {
      throw presupuestoError || new Error('Presupuesto no encontrado')
    }

    // 4. Calcular saldo pendiente
    const saldoPendiente = Math.max(0, Number(presupuesto.costo_total || 0) - totalPagado)

    // 5. Determinar estado basado en pagos
    let estado = 'Por Cobrar'
    if (totalPagado > 0 && totalPagado < Number(presupuesto.costo_total || 0)) {
      estado = 'Abonado'
    } else if (totalPagado >= Number(presupuesto.costo_total || 0)) {
      estado = 'Pagado'
    }

    // 6. Actualizar presupuesto con nuevos valores
    const { error: updateError } = await supabase
      .from('presupuestos')
      .update({
        total_pagado: totalPagado,
        saldo_pendiente: saldoPendiente,
        estado,
        updated_at: new Date().toISOString(),
      })
      .eq('id', presupuestoId)

    if (updateError) throw updateError

    console.log(`[updatePresupuestoTotals] ✓ Presupuesto ${presupuestoId} actualizado: total_pagado=${totalPagado}, saldo=${saldoPendiente}, estado=${estado}`)

    // 7. Revalidar rutas relevantes
    revalidatePath('/admin/ficha-odontologica')

    return { success: true, totalPagado, saldoPendiente, estado }
  } catch (error) {
    console.error('[updatePresupuestoTotals] ✗ Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return { error: { message: `Error actualizando totales: ${errorMessage}` } }
  }
}
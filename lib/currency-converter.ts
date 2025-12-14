// lib/currency-converter.ts
import type { SupabaseClient } from "@supabase/supabase-js";

interface PagoConMoneda {
  monto: number;
  moneda_id: string;
  codigo_moneda: string;
}

const EXCHANGE_RATES: Record<string, number> = {
  "PEN": 1.0,
  "USD": 3.80,
  "MXN": 0.20,
  "CLP": 0.0041,
};

/**
 * Convierte un monto de una moneda a PEN usando tasas de cambio
 * @param monto - Cantidad a convertir
 * @param monedaCodigo - Código de moneda (PEN, USD, MXN, etc.)
 * @returns Monto convertido a PEN
 */
export function convertToPEN(monto: number, monedaCodigo: string): number {
  const tasa = EXCHANGE_RATES[monedaCodigo] || 1.0;
  return monto * tasa;
}

/**
 * Convierte múltiples pagos a PEN y retorna el total
 * @param pagos - Array de pagos con moneda_id
 * @param supabase - Cliente de Supabase
 * @returns Total en PEN
 */
export async function convertirPagosAPEN(
  pagos: PagoConMoneda[],
  _supabase?: SupabaseClient
): Promise<number> {
  let totalPEN = 0;

  for (const pago of pagos) {
    const tasa = EXCHANGE_RATES[pago.codigo_moneda] || 1.0;
    const montoPEN = Number(pago.monto) * tasa;
    totalPEN += montoPEN;
  }

  return totalPEN;
}

/**
 * Obtiene las tasas de cambio desde la BD
 */
export async function obtenerTasasCambio(supabase: SupabaseClient) {
  try {
    const { data: tasas } = await supabase
      .from("tasas_cambio")
      .select(
        `
        moneda_origen_id,
        moneda_destino_id,
        tasa,
        monedas_origen:moneda_origen_id(codigo),
        monedas_destino:moneda_destino_id(codigo)
      `
      )
      .eq("monedas_destino.codigo", "PEN");

    return tasas || [];
  } catch (error) {
    console.error("Error obteniendo tasas de cambio:", error);
    return [];
  }
}

/**
 * Utilidades para manejar los ajustes de la aplicación desde Supabase
 */

import { createClient } from "./server";

export type TipoAjuste =
  | "color"
  | "texto"
  | "textarea"
  | "numero"
  | "booleano"
  | "imagen"
  | "email"
  | "telefono"
  | "url";

export interface Ajuste {
  id: string;
  clave: string;
  valor: string;
  grupo: string;
  tipo: TipoAjuste;
  descripcion: string | null;
  orden: number;
  updated_at: string;
  created_at: string;
}

// Cache en memoria para los ajustes (se actualiza cada request en server-side)
let ajustesCache: Map<string, string> | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene todos los ajustes de la aplicación desde Supabase
 */
export async function obtenerTodosLosAjustes(): Promise<Ajuste[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ajustes_aplicacion")
    .select("*")
    .order("grupo")
    .order("orden");

  if (error) {
    console.error("Error al obtener ajustes:", error);
    return [];
  }

  return data || [];
}

/**
 * Obtiene los ajustes de un grupo específico
 */
export async function obtenerAjustesPorGrupo(grupo: string): Promise<Ajuste[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ajustes_aplicacion")
    .select("*")
    .eq("grupo", grupo)
    .order("orden");

  if (error) {
    console.error(`Error al obtener ajustes del grupo ${grupo}:`, error);
    return [];
  }

  return data || [];
}

/**
 * Obtiene el valor de un ajuste específico por su clave
 * Si no existe, devuelve el valor por defecto
 */
export async function obtenerAjuste(
  clave: string,
  valorPorDefecto: string = ""
): Promise<string> {
  // Intentar usar cache si está disponible y fresco
  const now = Date.now();
  if (ajustesCache && now - lastCacheTime < CACHE_TTL) {
    const valorCacheado = ajustesCache.get(clave);
    if (valorCacheado !== undefined) {
      return valorCacheado;
    }
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ajustes_aplicacion")
    .select("valor")
    .eq("clave", clave)
    .single();

  if (error || !data) {
    return valorPorDefecto;
  }

  return data.valor || valorPorDefecto;
}

/**
 * Obtiene múltiples ajustes de una vez (más eficiente que llamadas individuales)
 */
export async function obtenerAjustesMultiples(
  claves: string[]
): Promise<Record<string, string>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ajustes_aplicacion")
    .select("clave, valor")
    .in("clave", claves);

  if (error) {
    console.error("Error al obtener ajustes múltiples:", error);
    return {};
  }

  const resultado: Record<string, string> = {};
  data?.forEach((ajuste) => {
    resultado[ajuste.clave] = ajuste.valor || "";
  });

  return resultado;
}

/**
 * Carga todos los ajustes en el cache
 * Útil para mejorar el rendimiento en páginas que usan muchos ajustes
 */
export async function cargarCacheAjustes(): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ajustes_aplicacion")
    .select("clave, valor");

  if (error) {
    console.error("Error al cargar cache de ajustes:", error);
    return;
  }

  ajustesCache = new Map();
  data?.forEach((ajuste) => {
    ajustesCache!.set(ajuste.clave, ajuste.valor || "");
  });

  lastCacheTime = Date.now();
}

/**
 * Actualiza un ajuste específico
 * Solo para usuarios con permisos de admin
 */
export async function actualizarAjuste(
  clave: string,
  nuevoValor: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ajustes_aplicacion")
    .update({ valor: nuevoValor })
    .eq("clave", clave);

  if (error) {
    console.error(`Error al actualizar ajuste ${clave}:`, error);
    return { success: false, error: error.message };
  }

  // Invalidar cache
  ajustesCache = null;

  return { success: true };
}

/**
 * Crea un nuevo ajuste
 * Solo para usuarios con permisos de admin
 */
export async function crearAjuste(
  ajuste: Omit<Ajuste, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("ajustes_aplicacion").insert([ajuste]);

  if (error) {
    console.error("Error al crear ajuste:", error);
    return { success: false, error: error.message };
  }

  // Invalidar cache
  ajustesCache = null;

  return { success: true };
}

/**
 * Elimina un ajuste
 * Solo para usuarios con permisos de admin
 */
export async function eliminarAjuste(
  clave: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ajustes_aplicacion")
    .delete()
    .eq("clave", clave);

  if (error) {
    console.error(`Error al eliminar ajuste ${clave}:`, error);
    return { success: false, error: error.message };
  }

  // Invalidar cache
  ajustesCache = null;

  return { success: true };
}

// ============================================
// FUNCIONES HELPER PARA TIPOS ESPECÍFICOS
// ============================================

/**
 * Obtiene un ajuste de tipo color y lo convierte al formato CSS
 */
export async function obtenerColor(
  clave: string,
  valorPorDefecto: string = "0 0 0"
): Promise<string> {
  const valor = await obtenerAjuste(clave, valorPorDefecto);
  // Si el valor contiene espacios, asumimos que es RGB sin prefijo
  // Si contiene #, es hexadecimal
  return valor;
}

/**
 * Obtiene un ajuste de tipo booleano
 */
export async function obtenerBooleano(
  clave: string,
  valorPorDefecto: boolean = false
): Promise<boolean> {
  const valor = await obtenerAjuste(clave, valorPorDefecto.toString());
  return valor === "true" || valor === "1";
}

/**
 * Obtiene un ajuste de tipo número
 */
export async function obtenerNumero(
  clave: string,
  valorPorDefecto: number = 0
): Promise<number> {
  const valor = await obtenerAjuste(clave, valorPorDefecto.toString());
  const numero = parseFloat(valor);
  return isNaN(numero) ? valorPorDefecto : numero;
}

/**
 * Obtiene todos los ajustes como objeto con tipado fuerte
 * Útil para pasar configuración completa a componentes cliente
 */
export async function obtenerConfiguracionCompleta() {
  const ajustes = await obtenerTodosLosAjustes();

  const config: Record<string, unknown> = {};

  ajustes.forEach((ajuste) => {
    // Convertir la clave con puntos en objeto anidado
    const claves = ajuste.clave.split(".");
    let actual = config;

    for (let i = 0; i < claves.length - 1; i++) {
      if (!actual[claves[i]]) {
        actual[claves[i]] = {};
      }
      actual = actual[claves[i]] as Record<string, unknown>;
    }

    // Convertir el valor según el tipo
    let valorConvertido: string | number | boolean = ajuste.valor;
    if (ajuste.tipo === "booleano") {
      valorConvertido = ajuste.valor === "true" || ajuste.valor === "1";
    } else if (ajuste.tipo === "numero") {
      valorConvertido = parseFloat(ajuste.valor || "0");
    }

    actual[claves[claves.length - 1]] = valorConvertido;
  });

  return config;
}

/**
 * Hook para usar en componentes de servidor
 * Obtiene los ajustes más comunes de la landing page
 */
export async function obtenerAjustesLanding() {
  const claves = [
    // Header
    "header.logo.url",
    "header.logo.alt",
    "header.menu.inicio",
    "header.menu.nosotros",
    "header.menu.servicios",
    "header.menu.reservas",

    // Hero
    "hero.titulo",
    "hero.subtitulo",
    "hero.descripcion",
    "hero.boton.texto",
    "hero.boton.url",
    "hero.imagen.principal",

    // Contacto
    "contacto.whatsapp",
    "contacto.telefono",
    "contacto.email",
    "contacto.direccion",

    // Theme
    "theme.color.primary",
    "theme.color.secondary",
    "theme.color.accent",

    // Chatbot
    "chatbot.activado",
    "chatbot.titulo",
    "chatbot.mensaje_bienvenida",
  ];

  return await obtenerAjustesMultiples(claves);
}

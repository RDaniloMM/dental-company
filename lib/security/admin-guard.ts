import type { SupabaseClient } from "@supabase/supabase-js";

export async function requireAuthenticatedUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false as const, status: 401, error: "No autorizado" };
  }

  return { ok: true as const, user };
}

export async function requireActiveAdmin(supabase: SupabaseClient) {
  const auth = await requireAuthenticatedUser(supabase);
  if (!auth.ok) {
    return auth;
  }

  const { data: personal, error } = await supabase
    .from("personal")
    .select("rol, activo")
    .eq("id", auth.user.id)
    .single();

  if (error || !personal) {
    return { ok: false as const, status: 403, error: "Acceso denegado" };
  }

  const isAdmin =
    personal.rol === "Admin" || personal.rol === "Administrador";
  const isActive = personal.activo !== false;

  if (!isAdmin || !isActive) {
    return { ok: false as const, status: 403, error: "Acceso denegado" };
  }

  return { ok: true as const, user: auth.user, personal };
}

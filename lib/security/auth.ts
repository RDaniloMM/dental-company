import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export const ADMIN_ROLES = new Set(["Admin", "Administrador"]);

export type AdminCheck =
  | { ok: true; user: User; role: string }
  | { ok: false; response: NextResponse };

export async function requireAdmin(supabase: SupabaseClient): Promise<AdminCheck> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }

  const { data: personal, error: personalError } = await supabase
    .from("personal")
    .select("rol, activo")
    .eq("id", user.id)
    .single();

  if (
    personalError ||
    !personal?.activo ||
    !ADMIN_ROLES.has(String(personal.rol))
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Solo los administradores pueden realizar esta acción" },
        { status: 403 }
      ),
    };
  }

  return { ok: true, user, role: String(personal.rol) };
}

export function normalizeRole(role: unknown) {
  return role === "Administrador" ? "Admin" : role === "Admin" ? "Admin" : "Odontólogo";
}

export function isStrongPassword(password: string) {
  return (
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function isValidUsername(username: string) {
  return /^[a-z0-9._-]{3,40}$/.test(username);
}

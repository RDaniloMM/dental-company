import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/dashboard";
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Si es una recuperación de contraseña, redirigir a update-password
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/admin/update-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si hay error o no hay código, redirigir a la página de error o login
  return NextResponse.redirect(
    `${origin}/admin/login?error=auth_callback_error`
  );
}

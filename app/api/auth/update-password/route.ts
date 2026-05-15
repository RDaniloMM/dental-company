import { NextRequest, NextResponse } from "next/server";

import { isStrongPassword } from "@/lib/security/auth";
import { recordSecurityEvent } from "@/lib/security/events";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const sameOriginError = requireSameOrigin(request);
    if (sameOriginError) return sameOriginError;

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const password = String(body.password ?? "");

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "La contrasena debe tener 12+ caracteres e incluir minuscula, mayuscula, numero y simbolo.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await recordSecurityEvent({
      eventType: "auth.password.updated",
      request,
      userId: user.id,
      severity: "warning",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error actualizando contrasena:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

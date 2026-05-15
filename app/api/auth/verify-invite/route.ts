import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, recordSecurityEvent } from "@/lib/security/events";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const supabase = createAdminClient();
    const rate = await checkRateLimit(supabase, "verify-invite-ip", ip, {
      limit: 20,
      windowMinutes: 15,
      blockMinutes: 30,
    });

    if (rate.allowed === false) {
      const retryAfterSeconds = rate.retryAfterSeconds;
      await recordSecurityEvent({
        eventType: "auth.invite.verify_rate_limited",
        request: req,
        severity: "warning",
        metadata: { retryAfterSeconds },
      });
      return NextResponse.json(
        { valid: false, error: "Demasiados intentos. Intenta más tarde." },
        { status: 429 }
      );
    }

    const { codigo } = await req.json();

    if (!codigo || typeof codigo !== "string" || codigo.length > 64) {
      return NextResponse.json(
        { valid: false, error: "Código requerido" },
        { status: 400 }
      );
    }

    const { data: inviteCode, error } = await supabase
      .from("codigos_invitacion")
      .select("rol_asignado, expira_at, usos_maximos, usos_actuales")
      .eq("codigo", codigo.trim().toUpperCase())
      .eq("activo", true)
      .single();

    if (error || !inviteCode) {
      return NextResponse.json(
        { valid: false, error: "Código inválido o expirado" },
        { status: 400 }
      );
    }

    if (inviteCode.expira_at && new Date(inviteCode.expira_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: "El código ha expirado" },
        { status: 400 }
      );
    }

    if (
      inviteCode.usos_maximos !== null &&
      inviteCode.usos_actuales >= inviteCode.usos_maximos
    ) {
      return NextResponse.json(
        { valid: false, error: "El código ya ha sido utilizado" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      rol: inviteCode.rol_asignado,
    });
  } catch (error) {
    console.error("Error verificando código:", error);
    return NextResponse.json(
      { valid: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

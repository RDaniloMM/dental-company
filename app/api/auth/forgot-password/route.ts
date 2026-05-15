import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { isValidUsername } from "@/lib/security/auth";
import { getClientIp, recordSecurityEvent } from "@/lib/security/events";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { createAdminClient } from "@/lib/supabase/admin";

function getAppBaseUrl() {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://dental-company-tacna.vercel.app";
}

async function sendRecoveryEmail(to: string, username: string, actionLink: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no configurada");
  }

  const resend = new Resend(apiKey);
  const clinicName = "Dental Company";

  const { error } = await resend.emails.send({
    from: `${clinicName} <onboarding@resend.dev>`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
        <h2>Restablece tu contrasena</h2>
        <p>Hola ${username}, recibimos una solicitud para restablecer tu contrasena.</p>
        <p>
          <a href="${actionLink}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;">Crear nueva contrasena</a>
        </p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      </div>
    `,
    subject: "Recuperacion de contrasena",
    to: [to],
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(request: NextRequest) {
  const genericResponse = NextResponse.json({
    success: true,
    message: "Si la cuenta existe, recibiras un correo de recuperacion.",
  });

  try {
    const sameOriginError = requireSameOrigin(request);
    if (sameOriginError) return sameOriginError;

    const ip = getClientIp(request);
    const body = await request.json();
    const username = String(body.username ?? "").trim().toLowerCase();

    if (!isValidUsername(username)) {
      return genericResponse;
    }

    const supabaseAdmin = createAdminClient();
    const [ipRate, userRate] = await Promise.all([
      checkRateLimit(supabaseAdmin, "forgot-password-ip", ip, {
        limit: 5,
        windowMinutes: 30,
        blockMinutes: 60,
      }),
      checkRateLimit(supabaseAdmin, "forgot-password-user", username, {
        limit: 3,
        windowMinutes: 30,
        blockMinutes: 60,
      }),
    ]);

    const blocked = [ipRate, userRate].find(
      (result): result is Extract<typeof result, { allowed: false }> => !result.allowed
    );
    if (blocked) {
      await recordSecurityEvent({
        eventType: "auth.forgot_password.rate_limited",
        request,
        identifier: username,
        severity: "warning",
        metadata: { retryAfterSeconds: blocked.retryAfterSeconds },
      });

      return NextResponse.json(
        { error: "Demasiados intentos. Intenta nuevamente mas tarde." },
        { status: 429 }
      );
    }

    const { data: personal, error: personalError } = await supabaseAdmin
      .from("personal")
      .select("id, email, activo")
      .eq("nombre_completo", username)
      .maybeSingle();

    if (personalError || !personal?.id || !personal?.email || personal.activo === false) {
      await recordSecurityEvent({
        eventType: "auth.forgot_password.user_not_found",
        request,
        identifier: username,
        severity: "warning",
      });

      return genericResponse;
    }

    const authEmail = `${username}@dental.company`;
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      email: authEmail,
      options: {
        redirectTo: `${getAppBaseUrl()}/auth/callback?type=recovery`,
      },
      type: "recovery",
    });

    const actionLink = data?.properties?.action_link;
    if (error || !actionLink) {
      throw new Error(error?.message || "No se pudo generar el enlace de recuperacion");
    }

    await sendRecoveryEmail(personal.email, username, actionLink);

    await recordSecurityEvent({
      eventType: "auth.forgot_password.requested",
      request,
      userId: personal.id,
      identifier: username,
      severity: "info",
    });

    return genericResponse;
  } catch (error) {
    console.error("Error en forgot-password:", error);
    await recordSecurityEvent({
      eventType: "auth.forgot_password.error",
      request,
      severity: "critical",
      metadata: { message: error instanceof Error ? error.message : String(error) },
    });

    return genericResponse;
  }
}

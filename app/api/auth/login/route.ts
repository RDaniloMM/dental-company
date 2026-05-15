import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { getClientIp, recordSecurityEvent } from "@/lib/security/events";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, resetRateLimit } from "@/lib/security/rate-limit";

const DEFAULT_IP_LIMIT = 5;
const DEFAULT_USER_LIMIT = 4;
const DEFAULT_BLOCK_MINUTES = 60;

async function getLoginRateLimitConfig(supabaseAdmin: ReturnType<typeof createAdminClient>) {
  const { data } = await supabaseAdmin
    .from("config_seguridad")
    .select("clave, valor")
    .in("clave", ["max_intentos_login", "duracion_bloqueo_login_minutos"]);

  const values = new Map(data?.map((item) => [String(item.clave), String(item.valor)]) ?? []);
  const maxAttempts = Number(values.get("max_intentos_login")) || DEFAULT_USER_LIMIT;
  const blockMinutes =
    Number(values.get("duracion_bloqueo_login_minutos")) || DEFAULT_BLOCK_MINUTES;

  return {
    blockMinutes,
    ipLimit: Math.max(DEFAULT_IP_LIMIT, maxAttempts + 1),
    userLimit: maxAttempts,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const supabaseAdmin = createAdminClient();
    const rateLimitConfig = await getLoginRateLimitConfig(supabaseAdmin);

    const { data: targetPersonal } = await supabaseAdmin
      .from("personal")
      .select("id, activo")
      .eq("nombre_completo", username)
      .maybeSingle();

    if (targetPersonal && targetPersonal.activo === false) {
      await recordSecurityEvent({
        eventType: "auth.login.disabled_user_precheck",
        request,
        userId: targetPersonal.id,
        identifier: username,
        severity: "warning",
      });

      return NextResponse.json(
        { error: "Acceso deshabilitado. Contacta al administrador." },
        { status: 403 }
      );
    }

    const [ipLimit, userLimit] = await Promise.all([
      checkRateLimit(supabaseAdmin, "login-ip", ip, {
        limit: rateLimitConfig.ipLimit,
        windowMinutes: 15,
        blockMinutes: rateLimitConfig.blockMinutes,
      }),
      checkRateLimit(supabaseAdmin, "login-user", username, {
        limit: rateLimitConfig.userLimit,
        windowMinutes: 15,
        blockMinutes: rateLimitConfig.blockMinutes,
      }),
    ]);

    const blocked = [ipLimit, userLimit].find(
      (item): item is Extract<typeof item, { allowed: false }> => !item.allowed
    );
    if (blocked) {
      await recordSecurityEvent({
        eventType: "auth.login.rate_limited",
        request,
        identifier: username,
        severity: "warning",
        metadata: { retryAfterSeconds: blocked.retryAfterSeconds },
      });

      return NextResponse.json(
        {
          error:
            "Demasiados intentos fallidos. Intenta nuevamente en unos minutos.",
          retryAfterSeconds: blocked.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const email = `${username}@dental.company`;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      await recordSecurityEvent({
        eventType: "auth.login.failed",
        request,
        identifier: username,
        severity: "warning",
      });

      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const { data: personal, error: personalError } = await supabaseAdmin
      .from("personal")
      .select("activo, rol")
      .eq("id", data.user.id)
      .single();

    if (personalError || !personal || personal.activo === false) {
      await recordSecurityEvent({
        eventType: "auth.login.disabled_user",
        request,
        userId: data.user.id,
        identifier: username,
        severity: "warning",
      });

      return NextResponse.json(
        { error: "Acceso deshabilitado. Contacta al administrador." },
        { status: 403 }
      );
    }

    await Promise.all([
      resetRateLimit(supabaseAdmin, "login-ip", ip),
      resetRateLimit(supabaseAdmin, "login-user", username),
    ]);

    await recordSecurityEvent({
      eventType: "auth.login.succeeded",
      request,
      userId: data.user.id,
      identifier: username,
      severity: "info",
      metadata: { role: personal.rol },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
      personal: {
        rol: personal.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

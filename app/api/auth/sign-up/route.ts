import { checkRateLimit } from "@/lib/security/rate-limit";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIp, recordSecurityEvent } from "@/lib/security/events";
import { isStrongPassword, isValidUsername, normalizeRole } from "@/lib/security/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let username = "";

  try {
    const sameOriginError = requireSameOrigin(request);
    if (sameOriginError) return sameOriginError;

    const ip = getClientIp(request);
    const supabaseAdmin = createAdminClient();

    const body = await request.json();
    username = String(body.username ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const inviteCode = String(body.inviteCode ?? "").trim().toUpperCase();

    const [ipRate, userRate] = await Promise.all([
      checkRateLimit(supabaseAdmin, "signup-ip", ip, {
        limit: Number(process.env.SIGNUP_MAX_ATTEMPTS ?? 5),
        windowMinutes: 60,
        blockMinutes: 60,
      }),
      checkRateLimit(supabaseAdmin, "signup-user", username || ip, {
        limit: 3,
        windowMinutes: 60,
        blockMinutes: 60,
      }),
    ]);

    const blocked = [ipRate, userRate].find(
      (result): result is Extract<typeof result, { allowed: false }> => !result.allowed
    );
    if (blocked) {
      await recordSecurityEvent({
        eventType: "auth.signup.rate_limited",
        request,
        severity: "warning",
        metadata: { retryAfterSeconds: blocked.retryAfterSeconds },
      });

      return NextResponse.json(
        { error: "Demasiados intentos de registro. Intenta más tarde." },
        { status: 429 }
      );
    }

    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: "El usuario solo puede usar minúsculas, números, punto, guion y guion bajo (3-40 caracteres)." },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: "La contraseña debe tener 12+ caracteres e incluir minúscula, mayúscula, número y símbolo." },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Registro no disponible: falta configurar SUPABASE_SERVICE_ROLE_KEY." },
        { status: 500 }
      );
    }

    const { data: securityConfig } = await supabaseAdmin
      .from("config_seguridad")
      .select("clave, valor")
      .in("clave", ["registro_publico_habilitado", "requiere_aprobacion_admin"]);

    const config = new Map(
      securityConfig?.map((item) => [String(item.clave), String(item.valor)]) ?? []
    );
    const publicRegistration = config.get("registro_publico_habilitado") === "true";

    let role = "Odontólogo";
    let inviteId: string | null = null;
    let inviteUses = 0;

    if (!publicRegistration) {
      if (!inviteCode) {
        return NextResponse.json(
          { error: "Se requiere un código de invitación válido." },
          { status: 400 }
        );
      }

      const { data: invite, error: inviteError } = await supabaseAdmin
        .from("codigos_invitacion")
        .select("id, rol_asignado, usos_actuales, usos_maximos, expira_at, activo")
        .eq("codigo", inviteCode)
        .eq("activo", true)
        .single();

      const expired = invite?.expira_at && new Date(invite.expira_at) < new Date();
      const exhausted =
        invite?.usos_maximos !== null &&
        invite?.usos_maximos !== undefined &&
        Number(invite.usos_actuales ?? 0) >= Number(invite.usos_maximos);

      if (inviteError || !invite || expired || exhausted) {
        await recordSecurityEvent({
          eventType: "auth.signup.invalid_invite",
          request,
          identifier: username,
          severity: "warning",
          metadata: { inviteCodeHashOnly: true },
        });

        return NextResponse.json(
          { error: "Código inválido, expirado o ya utilizado." },
          { status: 400 }
        );
      }

      role = normalizeRole(invite.rol_asignado);
      inviteId = invite.id;
      inviteUses = Number(invite.usos_actuales ?? 0);
    }

    const authEmail = `${username}@dental.company`;
    const { data: createdUser, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email: authEmail,
        password,
        email_confirm: true,
        user_metadata: { username },
      });

    if (createUserError || !createdUser.user) {
      await recordSecurityEvent({
        eventType: "auth.signup.create_user_failed",
        request,
        identifier: username,
        severity: "warning",
        metadata: { supabaseError: createUserError?.message },
      });

      return NextResponse.json(
        { error: "No se pudo crear la cuenta. Verifica los datos o contacta al administrador." },
        { status: 400 }
      );
    }

    const { error: personalError } = await supabaseAdmin.from("personal").insert({
      id: createdUser.user.id,
      nombre_completo: username,
      rol: role,
      email: authEmail,
      activo: true,
    });

    if (personalError) {
      await supabaseAdmin.auth.admin.deleteUser(createdUser.user.id);
      await recordSecurityEvent({
        eventType: "auth.signup.personal_insert_failed",
        request,
        userId: createdUser.user.id,
        identifier: username,
        severity: "critical",
        metadata: { supabaseError: personalError.message },
      });

      return NextResponse.json(
        { error: "No se pudo completar el registro. Contacta al administrador." },
        { status: 500 }
      );
    }

    if (inviteId) {
      await supabaseAdmin
        .from("codigos_invitacion")
        .update({
          usos_actuales: inviteUses + 1,
          usado_por: createdUser.user.id,
          used_at: new Date().toISOString(),
        })
        .eq("id", inviteId);
    }

    await recordSecurityEvent({
      eventType: "auth.signup.succeeded",
      request,
      userId: createdUser.user.id,
      identifier: username,
      severity: "info",
      metadata: { role, inviteUsed: Boolean(inviteId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en registro seguro:", error);
    await recordSecurityEvent({
      eventType: "auth.signup.error",
      request,
      identifier: username || null,
      severity: "critical",
    });

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

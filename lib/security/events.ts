import { createClient as createServiceClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export type SecurityEvent = {
  eventType: string;
  request?: NextRequest | Request;
  userId?: string | null;
  identifier?: string | null;
  severity?: "info" | "warning" | "critical";
  metadata?: Record<string, unknown>;
};

export function getClientIp(request: NextRequest | Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function hashForSecurityLog(value?: string | null): string | null {
  if (!value) return null;

  const salt = process.env.SECURITY_LOG_SALT || "dental-company-security-log";

  return crypto.createHmac("sha256", salt).update(value).digest("hex");
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return createServiceClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function ensureSecurityLogsBucket(supabase: NonNullable<ReturnType<typeof getServiceClient>>) {
  const bucketName = process.env.SECURITY_LOGS_BUCKET || "security-logs";
  const { error } = await supabase.storage.createBucket(bucketName, {
    public: false,
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw error;
  }

  return bucketName;
}

async function writeSecurityEventToStorage(
  supabase: NonNullable<ReturnType<typeof getServiceClient>>,
  payload: Record<string, unknown>
) {
  const bucketName = await ensureSecurityLogsBucket(supabase);
  const occurredAt = String(payload.occurred_at || new Date().toISOString());
  const path = `events/${occurredAt.slice(0, 10).replace(/-/g, "/")}/${occurredAt.replace(/[.:]/g, "-")}-${crypto.randomUUID()}.json`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(path, Buffer.from(JSON.stringify(payload, null, 2)), {
      contentType: "application/json",
      upsert: false,
    });

  if (error) {
    throw error;
  }
}

export async function recordSecurityEvent(event: SecurityEvent) {
  const supabase = getServiceClient();
  if (!supabase) return;

  const ip = event.request ? getClientIp(event.request) : null;
  const userAgent = event.request?.headers.get("user-agent") || null;
  const requestPath = event.request ? new URL(event.request.url).pathname : null;
  const requestMethod = event.request?.method || null;
  const requestHost = event.request?.headers.get("host") || null;
  const payload = {
    event_type: event.eventType,
    actor_user_id: event.userId ?? null,
    identifier_hash: hashForSecurityLog(event.identifier),
    ip_hash: hashForSecurityLog(ip),
    user_agent: userAgent?.slice(0, 512) ?? null,
    severity: event.severity ?? "info",
    metadata: {
      ...event.metadata,
      clinic_context: {
        host: requestHost,
        method: requestMethod,
        path: requestPath,
      },
    },
    occurred_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from("security_event_logs").insert(payload);
    if (error) throw error;
  } catch (error) {
    try {
      await writeSecurityEventToStorage(supabase, payload);
    } catch (storageError) {
      // Security logging must never break auth or business flows.
      console.warn("Security event logging failed", { error, storageError });
    }
  }
}

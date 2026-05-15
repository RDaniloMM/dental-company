import crypto from "node:crypto";

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; blockedUntil?: string };

type LocalRateLimitEntry = {
  blockedUntil: number;
  firstRequestAt: number;
  requestsCount: number;
};

type SupabaseLike = {
  from: (table: string) => {
    select: (columns?: string) => any;
    upsert: (values: Record<string, unknown>, options?: { onConflict?: string }) => any;
  };
};

const TABLE_NAME = "chatbot_rate_limit";
const localRateLimitStore = new Map<string, LocalRateLimitEntry>();

function hashIdentifier(scope: string, identifier: string) {
  return crypto.createHash("sha256").update(`${scope}:${identifier}`).digest("hex");
}

export async function checkRateLimit(
  supabase: SupabaseLike,
  scope: string,
  identifier: string,
  options: {
    limit: number;
    windowMinutes: number;
    blockMinutes: number;
  }
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - options.windowMinutes * 60 * 1000);
  const blockUntilThreshold = new Date(
    now.getTime() + options.blockMinutes * 60 * 1000
  );
  const ipHash = hashIdentifier(scope, identifier);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("ip_hash, requests_count, first_request_at, last_request_at, blocked_until")
    .eq("ip_hash", ipHash)
    .single?.();

  if (error && !data) {
    // Fall through to create a fresh counter record.
  }

  const existing = data as
    | {
        requests_count: number | null;
        first_request_at: string | null;
        last_request_at: string | null;
        blocked_until: string | null;
      }
    | undefined;

  if (existing?.blocked_until) {
    const blockedUntil = new Date(existing.blocked_until);
    if (blockedUntil > now) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000)
        ),
        blockedUntil: blockedUntil.toISOString(),
      };
    }
  }

  const requestCount = existing?.requests_count ?? 0;
  const firstRequestAt = existing?.first_request_at
    ? new Date(existing.first_request_at)
    : now;

  const withinWindow = firstRequestAt >= windowStart;
  const nextCount = withinWindow ? requestCount + 1 : 1;
  const shouldBlock = nextCount > options.limit;
  const blockedUntil = shouldBlock ? blockUntilThreshold.toISOString() : null;

  await supabase.from(TABLE_NAME).upsert(
    {
      ip_hash: ipHash,
      requests_count: shouldBlock ? 0 : nextCount,
      first_request_at: withinWindow ? firstRequestAt.toISOString() : now.toISOString(),
      last_request_at: now.toISOString(),
      blocked_until: blockedUntil,
    },
    { onConflict: "ip_hash" }
  );

  if (shouldBlock) {
    return {
      allowed: false,
      retryAfterSeconds: options.blockMinutes * 60,
      blockedUntil: blockedUntil ?? undefined,
    };
  }

  return { allowed: true };
}

export async function resetRateLimit(
  supabase: SupabaseLike,
  scope: string,
  identifier: string
) {
  const ipHash = hashIdentifier(scope, identifier);
  await supabase.from(TABLE_NAME).upsert(
    {
      ip_hash: ipHash,
      requests_count: 0,
      first_request_at: new Date().toISOString(),
      last_request_at: new Date().toISOString(),
      blocked_until: null,
    },
    { onConflict: "ip_hash" }
  );
}

export function consumeRateLimit(
  identifier: string,
  options: {
    lockoutMs: number;
    maxAttempts: number;
    windowMs: number;
  }
): RateLimitResult {
  const now = Date.now();
  const existing = localRateLimitStore.get(identifier);

  if (existing?.blockedUntil && existing.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.blockedUntil - now) / 1000)),
      blockedUntil: new Date(existing.blockedUntil).toISOString(),
    };
  }

  const isWithinWindow =
    existing && now - existing.firstRequestAt <= options.windowMs;

  const nextCount = isWithinWindow ? existing.requestsCount + 1 : 1;
  const firstRequestAt = isWithinWindow ? existing.firstRequestAt : now;
  const shouldBlock = nextCount > options.maxAttempts;
  const blockedUntil = shouldBlock ? now + options.lockoutMs : 0;

  localRateLimitStore.set(identifier, {
    blockedUntil,
    firstRequestAt,
    requestsCount: shouldBlock ? 0 : nextCount,
  });

  if (shouldBlock) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(options.lockoutMs / 1000)),
      blockedUntil: new Date(blockedUntil).toISOString(),
    };
  }

  return { allowed: true };
}

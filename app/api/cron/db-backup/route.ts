import { NextRequest, NextResponse } from "next/server";

import { runDatabaseBackup } from "@/lib/security/db-backup";
import { recordSecurityEvent } from "@/lib/security/events";

export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorizedCron(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) return false;
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const result = await runDatabaseBackup();

    await recordSecurityEvent({
      eventType: "security.db_backup.succeeded",
      request,
      severity: "info",
      metadata: {
        bucket: result.bucket,
        bytes: result.bytes,
        path: result.path,
        tables: result.tableCounts,
      },
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    await recordSecurityEvent({
      eventType: "security.db_backup.failed",
      request,
      severity: "critical",
      metadata: {
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return NextResponse.json(
      {
        error: "No se pudo generar el backup automático",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

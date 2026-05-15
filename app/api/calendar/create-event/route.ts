import { NextResponse } from "next/server";
import { createGoogleCalendarEvent, checkCalendarConnection } from "@/lib/googleCalendar";
import { requireAdmin } from "@/lib/security/auth";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const sameOriginError = requireSameOrigin(req);
    if (sameOriginError) return sameOriginError;

    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (admin.ok === false) return admin.response;

    const body = await req.json();
    const { summary, description, start, end } = body;

    if (!summary || !start || !end) {
      return NextResponse.json({ success: false, error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const result = await createGoogleCalendarEvent({ summary, description, start, end });

    return NextResponse.json({
      success: true,
      eventLink: result.htmlLink,
      eventId: result.eventId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (admin.ok === false) return admin.response;

  const status = await checkCalendarConnection();
  if (status.connected) {
    return NextResponse.json({ connected: true, message: "Conectado" });
  } else {
    const msg = status.error instanceof Error ? status.error.message : String(status.error);
    return NextResponse.json({ connected: false, error: msg }, { status: 500 });
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 204 });
}

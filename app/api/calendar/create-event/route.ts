import { NextResponse } from "next/server";
import { createGoogleCalendarEvent, checkCalendarConnection } from "@/lib/googleCalendar";

export async function POST(req: Request) {
  try {
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
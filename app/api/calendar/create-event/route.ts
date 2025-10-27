import { google } from "googleapis";
import { NextResponse } from "next/server";
const SERVICE_ACCOUNT = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT!,
  private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
};

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
// ------------------ CREAR EVENTO ---------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { summary, description, start, end } = body;
    if (!summary || !start || !end) {
      return NextResponse.json({
        success: false,
        error: "Faltan campos obligatorios: summary, start o end",
      });
    }

    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT.client_email,
      key: SERVICE_ACCOUNT.private_key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary,
      description: description || "Evento sin descripción",
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: "America/Lima",
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: "America/Lima",
      },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    return NextResponse.json({
      success: true,
      eventLink: response.data.htmlLink,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("❌ Error creando evento:", message);
    return NextResponse.json({ success: false, error: message });
  }
}

// ------------------ VERIFICAR CONEXIÓN ---------------------
export async function GET() {
  try {
    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT.client_email,
      key: SERVICE_ACCOUNT.private_key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const calendar = google.calendar({ version: "v3", auth });
    await calendar.calendarList.list();

    return NextResponse.json({
      connected: true,
      message: "✅ Conectado a Google Calendar",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ connected: false, error: message });
  }
}

// Agrego handler HEAD para healthcheck (204) — útil si el cliente hace fetch HEAD
export async function HEAD() {
  return new NextResponse(null, { status: 204 });
}

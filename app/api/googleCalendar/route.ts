import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID!;
  const accessToken = process.env.GOOGLE_ACCESS_TOKEN!; // 🔐 Token OAuth2

  const event = {
    summary: `Cita odontológica`,
    description: body.descripcion,
    start: { dateTime: body.fecha_inicio, timeZone: "America/Lima" },
    end: { dateTime: body.fecha_fin, timeZone: "America/Lima" },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  const data = await res.json();
  return NextResponse.json({ status: res.status, data });
}

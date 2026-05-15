import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/security/auth";
import { requireSameOrigin } from "@/lib/security/request-origin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const sameOriginError = requireSameOrigin(req);
  if (sameOriginError) return sameOriginError;

  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (admin.ok === false) return admin.response;

  const body = await req.json();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID!;
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

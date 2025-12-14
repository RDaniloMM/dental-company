import { google } from "googleapis";

const SERVICE_ACCOUNT = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT!,
  private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
};
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

function getCalendarClient() {
  if (!SERVICE_ACCOUNT.client_email || !SERVICE_ACCOUNT.private_key) {
    throw new Error("Faltan las credenciales de Google Service Account en .env");
  }

  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT.client_email,
    key: SERVICE_ACCOUNT.private_key,
    scopes: SCOPES,
  });

  return google.calendar({ version: "v3", auth });
}

export interface CalendarEventInput {
  summary: string;
  description?: string;
  start: string | Date;
  end: string | Date;
  timeZone?: string;
}

export async function createGoogleCalendarEvent(eventData: CalendarEventInput) {
  try {
    const calendar = getCalendarClient();
    
    const event = {
      summary: eventData.summary,
      description: eventData.description || "Evento generado automáticamente",
      start: {
        dateTime: new Date(eventData.start).toISOString(),
        timeZone: eventData.timeZone || "America/Lima",
      },
      end: {
        dateTime: new Date(eventData.end).toISOString(),
        timeZone: eventData.timeZone || "America/Lima",
      },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido al conectar con Google";
    console.error("[GoogleCalendar Lib] Error creating event:", message);
    throw new Error(message);
  }
}

export async function checkCalendarConnection() {
  try {
    const calendar = getCalendarClient();
    await calendar.calendarList.list();
    return { connected: true };
  } catch (error) {
    console.error("[GoogleCalendar Lib] Connection check failed:", error);
    return { connected: false, error };
  }
}

export async function deleteGoogleCalendarEvent(eventId: string) {
  try {
    const calendar = getCalendarClient();
    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: eventId,
    });
    return { success: true };
  } catch (error) {
    console.warn("[GoogleCalendar Lib] Error deleting event (might not exist):", error);
    return { success: false, error };
  }
}
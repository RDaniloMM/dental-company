import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBirthdayEmail } from "@/app/admin/(protected)/notificaciones/actions";

export async function GET(req: NextRequest) {
    // Verificar autenticación del Cron Job (opcional pero recomendado)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Si no hay CRON_SECRET configurado, permitimos la ejecución (para pruebas iniciales)
        // PERO en producción debería ser obligatorio.
        if (process.env.CRON_SECRET) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
    }

    const supabase = await createClient();

    // Obtener pacientes con fecha de nacimiento
    const { data: patients, error } = await supabase
        .from("pacientes")
        .select("id, nombres, apellidos, email, fecha_nacimiento")
        .not("fecha_nacimiento", "is", null)
        .not("email", "is", null);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Filtrar los que cumplen años HOY
    const birthdaysToday = patients?.filter((p) => {
        if (!p.fecha_nacimiento) return false;
        const [, month, day] = p.fecha_nacimiento.split("-").map(Number);
        // Mes en JS es 0-11, en string suele ser 1-12
        return month - 1 === currentMonth && day === currentDay;
    }) || [];

    if (birthdaysToday.length === 0) {
        return NextResponse.json({ message: "No birthdays today" });
    }

    // Enviar correos
    const results = await Promise.all(
        birthdaysToday.map(async (p) => {
            if (!p.email) return { id: p.id, status: "skipped_no_email" };

            const result = await sendBirthdayEmail(p.email, p.nombres);
            return {
                id: p.id,
                email: p.email,
                status: result.success ? "sent" : "failed",
                error: result.error,
            };
        })
    );

    return NextResponse.json({
        message: `Processed ${birthdaysToday.length} birthdays`,
        results,
    });
}

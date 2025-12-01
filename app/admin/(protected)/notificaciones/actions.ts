"use server";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

export async function sendBirthdayEmail(
    email: string,
    name: string
) {
    try {
        // Obtener credenciales de la base de datos (solo nombre)
        const supabase = await createClient();
        const { data: settings } = await supabase
            .from("ajustes_aplicacion")
            .select("email_origen")
            .single();

        // API Key desde variable de entorno
        const apiKey = process.env.RESEND_API_KEY;
        console.log("Debug: API Key present?", !!apiKey);

        // Si no hay configuración en BD, usar "Dental Company" por defecto
        const fromName = settings?.email_origen || "Dental Company";

        if (!apiKey) {
            console.error("Error: Falta Resend API Key");
            return {
                success: false,
                error: "Falta configurar la variable de entorno RESEND_API_KEY",
            };
        }

        const resend = new Resend(apiKey);

        console.log(`Debug: Intentando enviar a ${email} desde ${fromName}`);

        const { data, error } = await resend.emails.send({
            from: `${fromName} <onboarding@resend.dev>`, // Forzado para pruebas
            to: [email],
            subject: `¡Feliz Cumpleaños ${name}! Te desea Dental Company Tacna`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/djmyixye6/image/upload/v1764554761/4a0acaf3-c7ce-491c-b95d-753be0dd7b8a_i3e9r7.jpg" alt="Feliz Cumpleaños" style="max-width: 100%; height: auto; border-radius: 8px;" />
          </div>
        </div>
      `,
        });

        if (error) {
            console.error("Error Resend:", error);
            return { success: false, error: error.message };
        }

        console.log("Exito Resend:", data);
        return { success: true, data };
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Error desconocido";
        console.error("Error enviando email de cumpleaños:", error);
        return { success: false, error: errorMessage };
    }
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendBirthdayEmail } from "./actions";

interface SendButtonProps {
    email: string;
    name: string;
}

export function SendButton({ email, name }: SendButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!email) return;

        setIsLoading(true);
        try {
            const result = await sendBirthdayEmail(email, name);

            if (result.success) {
                toast.success("Email enviado", {
                    description: `Se ha enviado el saludo a ${name} correctamente.`,
                });
            } else {
                let errorMessage = result.error || "Ocurrió un error desconocido.";
                let errorTitle = "Error al enviar";

                // Detectar restricción de modo prueba de Resend
                if (errorMessage.includes("only send testing emails")) {
                    errorTitle = "Restricción de Modo Prueba";
                    errorMessage =
                        "En modo prueba, Resend solo permite enviar correos a tu propia dirección verificada.";
                }

                toast.error(errorTitle, {
                    description: errorMessage,
                });
            }
        } catch {
            toast.error("Error", {
                description: "Falló la comunicación con el servidor.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="outline"
            disabled={!email || isLoading}
            onClick={handleSend}
            title={!email ? "Sin email registrado" : "Enviar saludo"}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
                <Mail className="h-4 w-4 mr-2" />
            )}
            Enviar Saludo
        </Button>
    );
}

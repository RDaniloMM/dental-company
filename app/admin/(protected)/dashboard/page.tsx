import HomePage from "@/components/HomePage/page";
import { createClient } from "@/lib/supabase/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Cake, PartyPopper } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const supabase = await createClient();
  const { data: patients } = await supabase
    .from("pacientes")
    .select("id, nombres, apellidos, fecha_nacimiento")
    .not("fecha_nacimiento", "is", null);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const birthdaysToday =
    patients?.filter((p) => {
      if (!p.fecha_nacimiento) return false;
      const [, month, day] = p.fecha_nacimiento.split("-").map(Number);
      // Mes en JS es 0-11, en string suele ser 1-12. Asumiendo formato YYYY-MM-DD
      return month - 1 === currentMonth && day === currentDay;
    }) || [];

  return (
    <div className="space-y-4">
      {birthdaysToday.length > 0 && (
        <Alert className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <Cake className="h-5 w-5 text-pink-500" />
          <AlertTitle className="text-pink-700 font-semibold flex items-center gap-2">
            ¡Hay {birthdaysToday.length} Cumpleaños Hoy! <PartyPopper className="h-4 w-4" />
          </AlertTitle>
          <AlertDescription className="text-pink-600 mt-1">
            <span className="font-medium">
              {birthdaysToday.map((p) => `${p.nombres} ${p.apellidos}`).join(", ")}
            </span>{" "}
            están celebrando hoy.{" "}
            <Link
              href="/admin/notificaciones"
              className="underline hover:text-pink-800 font-bold ml-1"
            >
              Enviar saludos &rarr;
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <HomePage />
    </div>
  );
}

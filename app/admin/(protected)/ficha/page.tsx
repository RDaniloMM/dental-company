// Force re-evaluation by TypeScript server
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export default async function FichaOdontologicaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Ficha Odontológica</h1>
        <p>
          Seleccione un paciente para ver o crear su ficha odontológica.
        </p>
      </div>
    </div>
  );
}

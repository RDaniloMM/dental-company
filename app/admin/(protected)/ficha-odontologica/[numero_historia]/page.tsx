// Force re-evaluation by TypeScript server
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FichaOdontologicaForm } from "@/components/ficha-odontologica-form";

export default async function FichaOdontologicaPage({
  params,
}: {
  params: { numero_historia: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin/login");
  }

  return (
    <div className='flex-1 w-full flex flex-col items-center px-4'>
      <div className='w-full max-w-4xl'>
        <h1 className='text-2xl font-bold mb-6'>Ficha Odontológica</h1>
        <FichaOdontologicaForm />
      </div>
    </div>
  );
}

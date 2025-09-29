import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

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
    <div className='flex-1 w-full flex flex-col items-center justify-center h-full'>
      <div className='text-center'>
        <Image
          src="/logo.png"
          alt="Logo de la clínica dental"
          width={200}
          height={200}
          className="mx-auto mb-4"
        />
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Tu sonrisa es nuestra sonrisa
        </p>
      </div>
    </div>
  );
}

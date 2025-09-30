
  import { redirect } from "next/navigation";
  import { createClient } from "@/lib/supabase/server";
  import FichaSidebar from "@/components/ficha-sidebar";
  import Image from "next/image";

  type Props = {
    params: Promise<{ numero_historia: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  };

  export default async function FichaOdontologicaPage({ params }: Props) {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/admin/login");
    }
    const {numero_historia} = await params;

    return (
      <div className='flex min-h-screen w-full bg-muted/40'>
        <FichaSidebar patientId={user.id} numeroHistoria={numero_historia} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">
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
          </div>
        </main>
      </div>
    );
  }

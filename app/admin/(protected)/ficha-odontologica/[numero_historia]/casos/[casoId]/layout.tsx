import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import CasoTabsNav from "@/components/casos/CasoTabsNav";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CasoKPIs from "@/components/casos/CasoKPIs";
interface CasoDetalleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ numero_historia: string; casoId: string; }>;
}

export default async function CasoDetalleLayout({
  children,
  params: paramsPromise,
}: CasoDetalleLayoutProps) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: caso, error: casoError } = await supabase
    .from("casos_clinicos")
    .select("*")
    .eq("id", params.casoId) 
    .single();

  if (casoError || !caso) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudo encontrar el caso clínico.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="overflow-hidden mb-4 border-0 bg-blue-600 dark:bg-slate-800">
        <CardHeader className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3">
          <div className="text-left">
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-white dark:text-slate-50">
              <span className="truncate">Caso: {caso.nombre_caso}</span>
              <Badge className="bg-blue-700 dark:bg-slate-700 text-white px-2 py-0.5 border-0">{caso.estado}</Badge>
              <Badge className="bg-blue-700 dark:bg-slate-700 text-white px-2 py-0.5 border-0">
                {caso.fecha_inicio ? format(new Date(caso.fecha_inicio), "dd/MM/yyyy", { locale: es }) : "-"}
              </Badge>
            </h1>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href={`/admin/ficha-odontologica/${params.numero_historia}/casos`}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm bg-blue-700 dark:bg-slate-700 text-white hover:bg-blue-800 dark:hover:bg-slate-600"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              <span className="whitespace-nowrap">Volver a Casos</span>
            </Link>
          </div>
        </CardHeader>
      </Card>

      <CasoKPIs casoId={params.casoId} />

      <CasoTabsNav numeroHistoria={params.numero_historia} casoId={params.casoId} />
      <div className="flex-1">{children}</div>
      <Toaster />
    </div>
  );
}

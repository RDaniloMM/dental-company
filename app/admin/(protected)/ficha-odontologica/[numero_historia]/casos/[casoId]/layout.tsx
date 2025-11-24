import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import CasoTabsNav from "@/components/casos/CasoTabsNav";
import CasoDetailActions from "@/components/casos/CasoDetailActions";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
      <Card className="overflow-hidden mb-4">
        <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 bg-blue-600 text-white">
          <div className="text-left">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <span className="truncate">Caso: {caso.nombre_caso}</span>
              <Badge className="bg-white text-blue-600 px-2 py-0.5">{caso.estado}</Badge>
            </h1>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href={`/admin/ficha-odontologica/${params.numero_historia}/casos`}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm bg-white text-blue-600 hover:opacity-90"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              <span className="whitespace-nowrap">Volver a Casos</span>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="bg-white border-t border-gray-200 p-3">
          <div className="flex justify-end mb-2">
            <CasoDetailActions caso={caso} numeroHistoria={params.numero_historia} showBack={false} />
          </div>
          <p className="text-sm text-muted-foreground leading-tight">
            <span className="font-medium">Fecha de inicio:</span>{" "}
            {format(new Date(caso.fecha_inicio), "dd/MM/yyyy", { locale: es })}
            {caso.fecha_cierre && (
              <span> - Fecha de cierre: {format(new Date(caso.fecha_cierre), "dd/MM/yyyy", { locale: es })}</span>
            )}
          </p>
          <p className="text-sm mt-1 text-gray-700 leading-tight">{caso.diagnostico_preliminar}</p>
        </CardContent>
      </Card>

      <CasoTabsNav numeroHistoria={params.numero_historia} casoId={params.casoId} />
      <div className="flex-1">{children}</div>
      <Toaster />
    </div>
  );
}

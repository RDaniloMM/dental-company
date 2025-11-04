import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import CasoTabsNav from "@/components/casos/CasoTabsNav";
import CasoDetailActions from "@/components/casos/CasoDetailActions";
import { Toaster } from "@/components/ui/toaster";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// --- INICIO DE LA CORRECCIÓN PARA NEXT.JS 15 ---

// 1. Define el tipo de las props del layout.
//    Fíjate cómo 'params' ahora es una 'Promise' que se resuelve
//    al objeto que contiene tus parámetros de ruta.
interface CasoDetalleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ numero_historia: string; casoId: string; }>;
}

export default async function CasoDetalleLayout({
  children,
  params: paramsPromise, // Renombramos la prop para evitar conflictos de nombres
}: CasoDetalleLayoutProps) {
  // 2. Usa 'await' para obtener el objeto de parámetros resuelto de la promesa.
  const params = await paramsPromise;

  // --- FIN DE LA CORRECCIÓN ---

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
    .eq("id", params.casoId) // 'params' ahora es el objeto resuelto
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
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href={`/admin/ficha-odontologica/${params.numero_historia}/filiacion`} className="hover:underline">
          Paciente {params.numero_historia}
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href={`/admin/ficha-odontologica/${params.numero_historia}/casos`} className="hover:underline">
          Casos Clínicos
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold">{caso.nombre_caso}</span>
      </nav>

      {/* Encabezado del caso */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {caso.nombre_caso}
            <Badge
              variant={
                caso.estado === "Abierto"
                  ? "default"
                  : caso.estado === "En progreso"
                  ? "secondary"
                  : "outline"
              }
            >
              {caso.estado}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fecha de inicio:{" "}
            {format(new Date(caso.fecha_inicio), "dd/MM/yyyy", { locale: es })}
            {caso.fecha_cierre &&
              ` - Fecha de cierre: ${format(new Date(caso.fecha_cierre), "dd/MM/yyyy", { locale: es })}`}
          </p>
          <p className="text-md mt-2">{caso.diagnostico_preliminar}</p>
        </div>
        <CasoDetailActions caso={caso} numeroHistoria={params.numero_historia} />
      </div>

      {/* Navegación de pestañas */}
      <CasoTabsNav numeroHistoria={params.numero_historia} casoId={params.casoId} />

      <div className="flex-1">{children}</div>
      <Toaster />
    </div>
  );
}
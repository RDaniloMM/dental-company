import { redirect } from "next/navigation";

export default function CitasCasoPage({
  params,
}: {
  params: { numero_historia: string; casoId: string };
}) {
  // Redirigir a la página principal del caso
  redirect(
    `/admin/ficha-odontologica/${params.numero_historia}/casos/${params.casoId}`
  );
}

import { redirect } from "next/navigation";

export default async function ImagenesPage({
  params,
}: {
  params: Promise<{ numero_historia: string }>;
}) {
  const { numero_historia } = await params;
  // Redirigir a la página principal de la ficha odontológica con el parámetro de vista
  redirect(`/admin/ficha-odontologica/${numero_historia}?view=imagenes`);
}

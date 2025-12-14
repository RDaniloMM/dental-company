import { redirect } from "next/navigation";

export default function ImagenesPage({
  params,
}: {
  params: { numero_historia: string };
}) {
  // Redirigir a la página principal de la ficha odontológica
  redirect(`/admin/ficha-odontologica/${params.numero_historia}`);
}

import { redirect } from "next/navigation";

interface CasoIdPageProps {
  params: Promise<{
    numero_historia: string;
    casoId: string;
  }>;
}

export default async function CasoIdPage({ params: paramsPromise }: CasoIdPageProps) {
  const params = await paramsPromise;
  redirect(
    `/admin/ficha-odontologica/${params.numero_historia}/casos/${params.casoId}/diagnostico`
  );
}
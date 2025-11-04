import { redirect } from "next/navigation";

// --- INICIO DE LA CORRECCIÓN ---

// 1. Define la interfaz de props con 'params' como una Promise.
interface CasoIdPageProps {
  params: Promise<{
    numero_historia: string;
    casoId: string;
  }>;
}

// 2. Convierte el componente en 'async' y usa la nueva interfaz.
export default async function CasoIdPage({ params: paramsPromise }: CasoIdPageProps) {
  // 3. Espera la resolución de la promesa para obtener los parámetros.
  const params = await paramsPromise;

  // --- FIN DE LA CORRECCIÓN ---

  redirect(
    `/admin/ficha-odontologica/${params.numero_historia}/casos/${params.casoId}/diagnostico`
  );

  // Un componente que redirige no necesita devolver JSX,
  // pero TypeScript puede quejarse si no hay un return explícito.
  // Next.js se encarga de esto, pero si tienes problemas de linting,
  // puedes añadir 'return null;' al final.
}
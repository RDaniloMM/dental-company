import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ImageManager from '@/components/imagenes/ImageManager';

interface ImagenesPageProps {
  params: {
    numero_historia: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ImagenesPage(props: any) {
  const { params } = props as ImagenesPageProps;
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const { data: paciente, error } = await supabase
    .from('pacientes')
    .select('id')
    .eq('numero_historia', params.numero_historia)
    .single();

  if (error || !paciente) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudo encontrar al paciente con el número de historia proporcionado.
      </div>
    );
  }

  return <ImageManager pacienteId={paciente.id} />;
}

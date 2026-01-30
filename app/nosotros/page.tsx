import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Award,
  GraduationCap,
  Briefcase,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Users,
  Target,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nosotros - Conócenos | Dental Company Tacna",
  description:
    "Dental Company: centro odontológico en Tacna con +17 años de experiencia. Conoce nuestro equipo de especialistas y nuestra historia.",
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    title: "Nosotros - Conócenos | Dental Company Tacna",
    description:
      "Conoce a Dental Company, centro odontológico en Tacna con más de 17 años de experiencia. Nuestro equipo de especialistas.",
    url: "https://dental-company-tacna.com/nosotros",
    siteName: "Dental Company",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dental Company - Equipo de Especialistas",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Datos del curriculum de odontólogos (fallback)
const curriculumData: Record<
  string,
  {
    formacion: string[];
    experiencia: string[];
    especialidades: string[];
    filosofia: string;
  }
> = {
  "Dr. Ulises Peñaloza": {
    formacion: [
      "Doctorado en Odontología",
      "Maestría en Odontología con mención en patología",
      "Maestría en Investigación e innovación científica",
      "Segunda Especialidad en Periodoncia e implantología",
      "Cirujano dentista",
    ],
    experiencia: [
      "17 años de experiencia profesional",
      "16 años como docente Universitario",
      "Investigador Renacyt",
      "Miembro de la Asociación Peruana de Periodoncia y osteointegración",
      "Ganador del concurso Nacional de Invenciones - INDECOPI (Patente frente al COVID)",
      "Diversas publicaciones en revistas científicas indexadas",
    ],
    especialidades: [
      "Implantes dentales post extracción",
      "Regeneración ósea guiada",
      "Prótesis sobre implantes",
      "Injertos de encía",
      "Tratamiento de periodontitis",
    ],
    filosofia:
      "Mi objetivo es devolverle no solo la funcionalidad a la sonrisa de mis pacientes, sino también la confianza para reír sin preocupaciones.",
  },
  "Dra. Gabriela Condori": {
    formacion: [
      "Maestría en Investigación e innovación científica",
      "Segunda Especialidad en Ortodoncia e ortopedia maxilar",
      "Cirujano dentista",
    ],
    experiencia: [
      "10 años de experiencia profesional",
      "Más de 100 casos tratados con ortodoncia",
      "Diversas publicaciones en revistas científicas indexadas",
    ],
    especialidades: [
      "Ortodoncia interceptiva en niños",
      "Ortodoncia con Brackets estéticos",
      "Disyunción maxilar",
    ],
    filosofia:
      "Cada sonrisa cuenta una historia única. Mi misión es crear tratamientos personalizados que se adapten al estilo de vida de cada paciente.",
  },
  "Dra. Paola Peñaloza": {
    formacion: [
      "Maestría en Odontología con mención de patología",
      "Diplomado en Políticas Públicas para el Acceso Universal a Salud Oral",
      "Cirujano dentista",
    ],
    experiencia: [
      "17 años de experiencia profesional",
      "10 años como odontóloga asistencial del Centro de Salud Leoncio Prado",
      "Responsable del servicio de odontología del centro de salud",
    ],
    especialidades: [
      "Epidemiología en salud bucal",
      "Planificación y evaluación de programas sanitarios",
      "Prevención y promoción de salud oral comunitaria",
    ],
    filosofia:
      "Creo firmemente que la salud bucal es un derecho fundamental, no un privilegio.",
  },
};

interface Curriculum {
  formacion: string[];
  experiencia: string[];
  especialidades: string[];
  filosofia: string;
}

interface EquipoMember {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  foto_url: string;
  curriculum?: Curriculum | null;
}

interface CMSTema {
  nombre_clinica?: string;
  slogan?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  horario_semana?: string;
  horario_sabado?: string;
}

async function getCMSData() {
  try {
    const supabase = await createClient();

    // Obtener equipo
    const { data: equipo } = await supabase
      .from("cms_equipo")
      .select("*")
      .order("orden", { ascending: true });

    // Obtener tema/configuración
    const { data: temaData } = await supabase
      .from("cms_tema")
      .select("clave, valor");

    const tema: CMSTema = {};
    temaData?.forEach((item: { clave: string; valor: string }) => {
      tema[item.clave as keyof CMSTema] = item.valor;
    });

    return {
      equipo: equipo || [],
      tema,
    };
  } catch {
    return {
      equipo: [],
      tema: {},
    };
  }
}

export default async function NosotrosPage() {
  const { equipo, tema } = await getCMSData();

  const nombreClinica = tema.nombre_clinica || "Dental Company";
  const slogan = tema.slogan || "Tu sonrisa es nuestra sonrisa";

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm sticky top-0 z-50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <Link
              href='/'
              className='flex items-center gap-2'
            >
              <Image
                src='/logo.png'
                alt='Dental Company Logo'
                width={140}
                height={50}
                priority
                className='h-12 w-auto'
              />
            </Link>
            <nav className='hidden md:flex items-center gap-6'>
              <Link
                href='/'
                className='text-gray-600 hover:text-blue-600 font-medium transition-colors'
              >
                Inicio
              </Link>
              <Link
                href='/#servicios'
                className='text-gray-600 hover:text-blue-600 font-medium transition-colors'
              >
                Servicios
              </Link>
              <Link
                href='/nosotros'
                className='text-blue-600 font-medium'
              >
                Nosotros
              </Link>
              <Link
                href='/#contacto'
                className='text-gray-600 hover:text-blue-600 font-medium transition-colors'
              >
                Contacto
              </Link>
            </nav>
            <Link
              href='/'
              className='md:hidden inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors'
            >
              <ArrowLeft className='h-4 w-4' />
              Volver
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-20 overflow-hidden'>
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2' />
            <div className='absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2' />
          </div>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative'>
            <div className='max-w-4xl mx-auto text-center'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-8'>
                <Users className='h-10 w-10 text-white' />
              </div>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6'>
                Conócenos
              </h1>
              <p className='text-xl sm:text-2xl text-blue-100 mb-4'>
                {nombreClinica}
              </p>
              <p className='text-lg text-blue-200 italic'>
                &ldquo;{slogan}&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section className='py-16 sm:py-20'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid lg:grid-cols-2 gap-12 items-center'>
              <div>
                <span className='inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6'>
                  Nuestra Historia
                </span>
                <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-6'>
                  Más de 17 años cuidando sonrisas en Tacna
                </h2>
                <div className='space-y-4 text-gray-600 leading-relaxed'>
                  <p>
                    <strong className='text-gray-900'>Dental Company</strong>{" "}
                    nació con una visión clara: ofrecer atención odontológica de
                    alta calidad en la ciudad de Tacna, combinando tecnología de
                    vanguardia con un trato humano y cercano.
                  </p>
                  <p>
                    Fundada por profesionales con amplia experiencia y formación
                    especializada, nuestra clínica se ha convertido en un
                    referente de la odontología en el sur del Perú, atendiendo a
                    miles de pacientes que confían en nosotros para el cuidado
                    de su salud bucal.
                  </p>
                  <p>
                    Nos encontramos en el corazón de Tacna, ciudad fronteriza
                    conocida por su rica historia, su gastronomía y su gente
                    acogedora. Tacna, la &ldquo;Ciudad Heroica&rdquo;, nos
                    inspira con su espíritu de perseverancia y excelencia que
                    reflejamos en cada tratamiento.
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div className='relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg'>
                    <Image
                      src='/foto_interior_2.jpeg'
                      alt='Interior de Dental Company'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='relative aspect-square rounded-2xl overflow-hidden shadow-lg'>
                    <Image
                      src='/foto_interior_4.jpeg'
                      alt='Equipos modernos'
                      fill
                      className='object-cover'
                    />
                  </div>
                </div>
                <div className='space-y-4 pt-8'>
                  <div className='relative aspect-square rounded-2xl overflow-hidden shadow-lg'>
                    <Image
                      src='/foto_interior_3.jpeg'
                      alt='Área de atención'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg'>
                    <Image
                      src='/foto_interior_1.jpeg'
                      alt='Recepción Dental Company'
                      fill
                      className='object-cover'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión, Visión, Valores */}
        <section className='py-16 bg-white'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid md:grid-cols-3 gap-8'>
              {/* Misión */}
              <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8'>
                <div className='w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6'>
                  <Target className='h-7 w-7 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-4'>
                  Nuestra Misión
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Brindar atención odontológica integral de alta calidad,
                  utilizando tecnología avanzada y un enfoque humano, para
                  mejorar la salud bucal y la calidad de vida de nuestros
                  pacientes en Tacna y el sur del Perú.
                </p>
              </div>

              {/* Visión */}
              <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8'>
                <div className='w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6'>
                  <Star className='h-7 w-7 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-4'>
                  Nuestra Visión
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Ser el centro odontológico líder en la región sur del Perú,
                  reconocido por la excelencia en tratamientos especializados,
                  la innovación constante y el compromiso con la satisfacción
                  total de nuestros pacientes.
                </p>
              </div>

              {/* Valores */}
              <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8'>
                <div className='w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6'>
                  <Heart className='h-7 w-7 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-4'>
                  Nuestros Valores
                </h3>
                <ul className='text-gray-600 space-y-2'>
                  <li className='flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                    Excelencia profesional
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                    Ética y transparencia
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                    Calidez humana
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                    Innovación continua
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='w-1.5 h-1.5 bg-purple-500 rounded-full' />
                    Compromiso social
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Por qué elegirnos */}
        <section className='py-16 bg-gray-50'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
                ¿Por qué elegir Dental Company?
              </h2>
              <p className='text-gray-600 max-w-2xl mx-auto'>
                Combinamos experiencia, tecnología y calidez para ofrecerte la
                mejor experiencia dental.
              </p>
            </div>
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[
                {
                  icon: GraduationCap,
                  title: "Especialistas Certificados",
                  description:
                    "Nuestros profesionales cuentan con postgrados y especializaciones en las mejores instituciones.",
                },
                {
                  icon: Shield,
                  title: "Tecnología Avanzada",
                  description:
                    "Equipos de última generación para diagnósticos precisos y tratamientos efectivos.",
                },
                {
                  icon: Award,
                  title: "17+ Años de Experiencia",
                  description:
                    "Miles de pacientes satisfechos avalan nuestra trayectoria y compromiso.",
                },
                {
                  icon: Heart,
                  title: "Trato Humano",
                  description:
                    "Cada paciente es único. Brindamos atención personalizada y un ambiente acogedor.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow'
                >
                  <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4'>
                    <item.icon className='h-6 w-6 text-blue-600' />
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 mb-2'>
                    {item.title}
                  </h3>
                  <p className='text-gray-600 text-sm'>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipo Profesional */}
        <section className='py-16 sm:py-20 bg-white'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <span className='inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4'>
                Nuestro Equipo
              </span>
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
                Profesionales comprometidos con tu sonrisa
              </h2>
              <p className='text-gray-600 max-w-2xl mx-auto'>
                Conoce a los especialistas que harán de tu visita una
                experiencia segura y confortable.
              </p>
            </div>

            <div className='space-y-16'>
              {(equipo.length > 0
                ? equipo
                : [
                    {
                      id: "1",
                      nombre: "Dr. Ulises Peñaloza",
                      cargo: "Director",
                      especialidad: "Periodoncista e Implantólogo",
                      foto_url: "/dr-ulises.jpg",
                    },
                    {
                      id: "2",
                      nombre: "Dra. Gabriela Condori",
                      cargo: "Especialista",
                      especialidad: "Ortodoncista",
                      foto_url: "/dra-gabriela.jpg",
                    },
                    {
                      id: "3",
                      nombre: "Dra. Paola Peñaloza",
                      cargo: "Especialista",
                      especialidad: "Odontóloga General y Salud Pública",
                      foto_url: "/dra-paola.jpg",
                    },
                  ]
              ).map((member: EquipoMember, index: number) => {
                const curriculum =
                  member.curriculum || curriculumData[member.nombre] || null;

                return (
                  <article
                    key={member.id}
                    className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
                      index % 2 === 1 ? "lg:grid-flow-dense" : ""
                    }`}
                    itemScope
                    itemType='https://schema.org/Dentist'
                  >
                    {/* Foto */}
                    <div
                      className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}
                    >
                      <div className='relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl'>
                        <Image
                          src={member.foto_url || "/placeholder-doctor.jpg"}
                          alt={`${member.nombre} - ${member.especialidad}`}
                          fill
                          className='object-cover'
                          itemProp='image'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                        <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                          <p
                            className='text-2xl font-bold'
                            itemProp='name'
                          >
                            {member.nombre}
                          </p>
                          <p
                            className='text-blue-200'
                            itemProp='jobTitle'
                          >
                            {member.especialidad}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className='space-y-6'>
                      <div>
                        <span className='inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3'>
                          {member.cargo}
                        </span>
                        <h3 className='text-2xl sm:text-3xl font-bold text-gray-900'>
                          {member.nombre}
                        </h3>
                        <p className='text-lg text-blue-600 font-medium'>
                          {member.especialidad}
                        </p>
                      </div>

                      {curriculum && (
                        <>
                          {/* Formación */}
                          <div>
                            <div className='flex items-center gap-2 mb-3'>
                              <GraduationCap className='h-5 w-5 text-blue-600' />
                              <h4 className='font-semibold text-gray-900'>
                                Formación Académica
                              </h4>
                            </div>
                            <ul className='space-y-2'>
                              {curriculum.formacion.map(
                                (item: string, i: number) => (
                                  <li
                                    key={i}
                                    className='flex items-start gap-2 text-gray-600'
                                    itemProp='hasCredential'
                                  >
                                    <span className='w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0' />
                                    {item}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>

                          {/* Experiencia */}
                          <div>
                            <div className='flex items-center gap-2 mb-3'>
                              <Briefcase className='h-5 w-5 text-green-600' />
                              <h4 className='font-semibold text-gray-900'>
                                Experiencia
                              </h4>
                            </div>
                            <ul className='space-y-2'>
                              {curriculum.experiencia.map(
                                (item: string, i: number) => (
                                  <li
                                    key={i}
                                    className='flex items-start gap-2 text-gray-600'
                                  >
                                    <span className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0' />
                                    {item}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>

                          {/* Especialidades */}
                          <div>
                            <div className='flex items-center gap-2 mb-3'>
                              <Award className='h-5 w-5 text-purple-600' />
                              <h4 className='font-semibold text-gray-900'>
                                Áreas de Especialización
                              </h4>
                            </div>
                            <div
                              className='flex flex-wrap gap-2'
                              itemProp='knowsAbout'
                            >
                              {curriculum.especialidades.map(
                                (item: string, i: number) => (
                                  <span
                                    key={i}
                                    className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm'
                                  >
                                    {item}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>

                          <blockquote className='border-l-4 border-blue-500 pl-4 italic text-gray-600'>
                            &ldquo;{curriculum.filosofia}&rdquo;
                          </blockquote>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ubicación y Contacto */}
        <section className='py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
                  Visítanos en Tacna
                </h2>
                <p className='text-gray-300 mb-8 leading-relaxed'>
                  Estamos ubicados en el centro de Tacna, la &ldquo;Ciudad
                  Heroica&rdquo; del Perú, con fácil acceso y estacionamiento
                  cercano. Ven a conocer nuestras instalaciones modernas y
                  acogedoras.
                </p>
                <div className='space-y-4'>
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <MapPin className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-semibold'>Dirección</p>
                      <p className='text-gray-300'>
                        {tema.direccion || "Calle Zela 716, Tacna, Perú"}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <Phone className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-semibold'>Teléfono</p>
                      <p className='text-gray-300'>
                        {tema.telefono || "+51 952 864 972"}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <Mail className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-semibold'>Email</p>
                      <p className='text-gray-300'>
                        {tema.email || "d.c.com@hotmail.com"}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <Clock className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-semibold'>Horarios</p>
                      <p className='text-gray-300'>
                        {tema.horario_semana ||
                          "Lunes a Viernes: 9:00 AM - 8:00 PM"}
                      </p>
                      <p className='text-gray-300'>
                        {tema.horario_sabado || "Sábados: 9:00 AM - 1:00 PM"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-8'>
                  <Link
                    href='/#contacto'
                    className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors'
                  >
                    Agendar una cita
                  </Link>
                </div>
              </div>
              <div className='aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.2145713407194!2d-70.2482761889066!3d-18.015242982912067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915acf7e65086b5d%3A0x8f6c0cc6e1e00105!2sDENTAL%20COMPANY%20TACNA!5e0!3m2!1ses!2spe!4v1756918317841!5m2!1ses!2spe'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title='Ubicación de Dental Company Tacna'
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='bg-gray-900 py-8 border-t border-gray-800'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-sm'>
              © {new Date().getFullYear()} {nombreClinica}. Todos los derechos
              reservados.
            </p>
            <div className='flex items-center gap-6'>
              <Link
                href='/privacidad'
                className='text-gray-400 hover:text-white text-sm transition-colors'
              >
                Política de Privacidad
              </Link>
              <Link
                href='/'
                className='text-gray-400 hover:text-white text-sm transition-colors'
              >
                Inicio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

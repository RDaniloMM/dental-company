/* import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Next.js Supabase Starter</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">Next steps</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
} */

// app/(public)/page.tsx

"use client"; // Necesario para el carrusel interactivo

import Link from "next/link";
import Image from "next/image";
import { Smile, Bone, MessageSquareQuote } from "lucide-react";

// Dependencias del carrusel
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

// --- Componente Header ---
const Header = () => (
  <header className='bg-white shadow-md fixed top-0 left-0 right-0 z-50'>
    <div className='container mx-auto px-6 py-2 flex justify-between items-center'>
      <Link
        href='/'
        className='text-2xl font-bold text-blue-600'
      >
        {/* Reemplaza con tu logo */}
        <Image
          src='/logo.png'
          alt='Dental Company Logo'
          width={160}
          height={40}
        />
      </Link>
      <nav className='hidden md:flex space-x-8 items-center'>
        <Link
          href='#inicio'
          className='text-gray-600 hover:text-blue-500 transition-colors'
        >
          Inicio
        </Link>
        <Link
          href='#nosotros'
          className='text-gray-600 hover:text-blue-500 transition-colors'
        >
          Nosotros
        </Link>
        <Link
          href='#servicios'
          className='text-gray-600 hover:text-blue-500 transition-colors'
        >
          Servicios
        </Link>
        <Link
          href='#reservas'
          className='bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-transform duration-300 ease-in-out hover:scale-105'
        >
          Reservas
        </Link>
      </nav>
      {/* Aquí podrías agregar un botón de menú para móviles */}
    </div>
  </header>
);

// --- Componente Carrusel (Embla) ---
// --- Componente Carrusel (Embla) ---
type EmblaCarouselProps = EmblaOptionsType;

const Carousel = (options: EmblaCarouselProps) => {
  const [emblaRef] = useEmblaCarousel(options);
  const images = [
    "/foto_interior_2.jpeg",
    "/foto_interior_3.jpeg",
    "/foto_interior_4.jpeg",
  ];

  return (
    <div
      className='overflow-hidden'
      ref={emblaRef}
    >
      <div className='flex'>
        {images.map((src, index) => (
          <div
            className='relative flex-[0_0_100%]'
            key={index}
            style={{ height: "60vh" }}
          >
            <Image
              src={src}
              alt={`Imagen de la clínica ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

import {
  Stethoscope,
  Sparkles,
  Syringe,
  Microscope,
  ShieldCheck,
  Baby,
  Puzzle,
  FileSearch,
} from "lucide-react";

// --- Array de Datos de Servicios (NUEVO Y ACTUALIZADO) ---
const servicesData = [
  {
    icon: Stethoscope,
    title: "Odontología General",
    description:
      "Consultas, diagnósticos, limpiezas profesionales y tratamiento de caries para un mantenimiento integral de tu salud bucal.",
  },
  {
    icon: Sparkles,
    title: "Estética Dental",
    description:
      "Desde blanqueamientos y carillas hasta coronas estéticas para un diseño de sonrisa perfecto y radiante.",
  },
  {
    icon: Smile,
    title: "Ortodoncia",
    description:
      "Corrección de la posición dental con brackets metálicos, estéticos y tratamientos interceptivos para niños.",
  },
  {
    icon: Bone,
    title: "Implantes Dentales",
    description:
      "Soluciones permanentes para la pérdida de dientes, incluyendo implantes unitarios, múltiples y prótesis fijas.",
  },
  {
    icon: Syringe,
    title: "Cirugía Bucal",
    description:
      "Procedimientos quirúrgicos como extracciones de cordales, cirugía periodontal e injertos de hueso y encía.",
  },
  {
    icon: Microscope,
    title: "Endodoncia",
    description:
      "Tratamiento de conductos radiculares para salvar dientes afectados por caries profundas o traumatismos.",
  },
  {
    icon: ShieldCheck,
    title: "Periodoncia",
    description:
      "Tratamiento especializado de encías, incluyendo manejo de gingivitis, periodontitis y cirugía regenerativa.",
  },
  {
    icon: Baby,
    title: "Odontopediatría",
    description:
      "Atención dental especializada y amigable para los más pequeños, enfocada en la prevención y el manejo de conducta.",
  },
  {
    icon: Puzzle,
    title: "Prótesis Dental",
    description:
      "Restauración de la función y estética con coronas, puentes fijos y prótesis removibles o totales.",
  },
  {
    icon: FileSearch,
    title: "Diagnóstico de Patologías Bucales",
    description:
      "Detección temprana y diagnóstico de lesiones, infecciones y otras patologías de la mucosa oral para tu tranquilidad.",
  },
];

// --- Componente Principal de la Página ---
export default function LandingPage() {
  return (
    <>
      <Header />
      <main className='pt-20'>
        {" "}
        {/* Padding top para compensar el header fijo */}
        {/* 1. Título y Hero Section */}
        <section
          id='inicio'
          className='relative text-center bg-gray-100 py-20 md:py-32 flex flex-col items-center justify-center'
        >
          <div className='absolute inset-0 bg-blue-500 opacity-10'></div>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-800 z-10'>
            Clínica Dental <span className='text-blue-600'>Company</span>
          </h1>
          <p className='mt-4 text-lg md:text-xl text-gray-600 z-10 max-w-2xl'>
            Tu sonrisa es nuestra sonrisa.
          </p>
          <Link
            href='#reservas'
            className='mt-8 bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-transform duration-300 ease-in-out hover:scale-105 z-10'
          >
            Agenda tu Cita
          </Link>
        </section>
        {/* 2. Carrusel de Fotos */}
        <section>
          <Carousel loop />
        </section>
        {/* 3. Servicios*/}
        <section
          id='servicios'
          className='py-20 bg-white'
        >
          <div className='container mx-auto px-6 text-center'>
            <h2 className='text-3xl font-bold mb-2'>Nuestros Servicios</h2>
            <p className='text-gray-600 mb-12 max-w-3xl mx-auto'>
              Desde revisiones de rutina hasta procedimientos especializados,
              ofrecemos una gama completa de tratamientos para asegurar tu
              bienestar dental.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {servicesData.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className='bg-gray-50 p-8 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center'
                  >
                    <Icon className='h-12 w-12 text-blue-500 mb-4' />
                    <h3 className='text-xl font-semibold mb-2'>
                      {service.title}
                    </h3>
                    <p className='text-gray-600'>{service.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* 4. Equipo de Dentistas */}
        <section
          id='nosotros'
          className='py-20 bg-blue-50'
        >
          <div className='container mx-auto px-6 text-center'>
            <h2 className='text-3xl font-bold mb-12'>
              Conoce a Nuestros Especialistas
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
              {/* Dentista 1 */}
              <div className='text-center'>
                <Image
                  src='/ulises_penaloza.jpeg'
                  alt='Dr. Ulises Peñaloza'
                  width={150}
                  height={150}
                  className='rounded-full mx-auto mb-4 border-4 border-white shadow-md'
                />
                <h3 className='text-xl font-bold'>Dr. Ulises Peñaloza</h3>
                <p className='text-blue-600 font-medium'>
                  Especialista en Periodoncia e Implantología
                </p>
              </div>
              {/* Dentista 2 */}
              <div className='text-center'>
                <Image
                  src='/dentista.png'
                  alt='Dra. Gabriela Condori'
                  width={150}
                  height={150}
                  className='rounded-full mx-auto mb-4 border-4 border-white shadow-md'
                />
                <h3 className='text-xl font-bold'>Dra. Gabriela Condori</h3>
                <p className='text-blue-600 font-medium'>
                  Especialista en Ortodoncia y Ortopedia Maxilar
                </p>
              </div>
              {/* Dentista 3 */}
              <div className='text-center'>
                <Image
                  src='/dentista.png'
                  alt='Dra. Paola Peñaloza'
                  width={150}
                  height={150}
                  className='rounded-full mx-auto mb-4 border-4 border-white shadow-md'
                />
                <h3 className='text-xl font-bold'>Dra. Paola Peñaloza</h3>
                <p className='text-blue-600 font-medium'>
                  Cirujano dentista con experiencia en salud pública
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* 5. Espacio para Chatbot IA */}
        <section
          id='reservas'
          className='py-20 bg-white'
        >
          <div className='container mx-auto px-6 text-center'>
            <div className='max-w-2xl mx-auto bg-gray-100 p-10 rounded-lg shadow-inner'>
              <MessageSquareQuote className='h-16 w-16 mx-auto text-blue-500 mb-4' />
              <h2 className='text-3xl font-bold mb-4'>
                ¿Tienes una consulta rápida?
              </h2>
              <p className='text-gray-600 mb-6'>
                Nuestro asistente virtual con IA puede ayudarte a resolver dudas
                frecuentes y agendar tu próxima cita al instante.
              </p>
              <button className='bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-black transition-colors'>
                Pregúntale a nuestro Asistente (Próximamente)
              </button>
            </div>
          </div>
        </section>
        {/* 6. Footer */}
        <footer className='bg-gray-800 text-white'>
          <div className='container mx-auto px-6 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {/* Columna 1: Información */}
              <div>
                <h3 className='text-xl font-bold mb-4 mt-10'>Dental Company</h3>
                <p className='text-gray-400'>
                  DENTAL COMPANY es un centro odontológico integral de última
                  generación que combina excelencia clínica, tecnología avanzada
                  y calidez humana. Nos dedicamos a proporcionar tratamientos
                  dentales de la más alta calidad con un enfoque preventivo,
                  personalizado y multidisciplinario.
                </p>
              </div>
              {/* Columna 2: Contacto */}
              <div>
                <h3 className='text-xl font-bold mb-4'>Contacto</h3>
                <ul className='space-y-2 text-gray-400'>
                  <li>
                    <strong>Dirección:</strong> Av. General Suarez N° 312,
                    Tacna, Perú
                  </li>
                  <li>
                    <strong>Teléfono:</strong> +51 952 864 883
                  </li>
                  <li>
                    <strong>Email:</strong> d.c.com@hotmail.com
                  </li>
                  <li>
                    <strong>Horario:</strong> Lun - Vie: 9am - 7pm, Sábados 9am
                    - 1pm
                  </li>
                </ul>
              </div>
              {/* Columna 3: Mapa */}
              <div>
                <h3 className='text-xl font-bold mb-4'>Ubicación</h3>
                <div className='aspect-w-16 aspect-h-9 rounded-lg overflow-hidden'>
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.2145713407194!2d-70.2482761889066!3d-18.015242982912067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915acf7e65086b5d%3A0x8f6c0cc6e1e00105!2sDENTAL%20COMPANY%20TACNA!5e0!3m2!1ses!2spe!4v1756918317841!5m2!1ses!2spe'
                    width='100%'
                    height='100%'
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                  ></iframe>
                </div>
              </div>
            </div>
            <div className='text-center text-gray-500 mt-10 border-t border-gray-700 pt-6'>
              © {new Date().getFullYear()} Dental Company. Todos los derechos
              reservados.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

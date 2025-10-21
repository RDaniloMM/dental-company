"use client";
import Link from "next/link";
import Image from "next/image";
import { Smile, Bone } from "lucide-react";

import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { FloatingChatbot } from "@/components/floating-chatbot";

// --- Componente Header ---
const WHATSAPP_NUMBER = "51914340074";
const Header = () => (
  <header className='bg-white shadow-md fixed top-0 left-0 right-0 z-50'>
    <div className='container mx-auto px-4 sm:px-6 py-3 sm:py-4 lg:py-6 flex justify-between items-center'>
      <Link
        href='/'
        className='text-xl sm:text-2xl font-bold text-blue-600'
      >
        <Image
          src='/logo.png'
          alt='Dental Company Logo'
          width={150}
          height={180}
          className=''
        />
      </Link>
      <nav className='hidden md:flex space-x-4 lg:space-x-8 items-center'>
        <Link
          href='#inicio'
          className='text-gray-600 hover:text-blue-500 transition-colors text-sm lg:text-base'
        >
          Inicio
        </Link>
        <Link
          href='#nosotros'
          className='text-gray-600 hover:text-blue-500 transition-colors text-sm lg:text-base'
        >
          Nosotros
        </Link>
        <Link
          href='#servicios'
          className='text-gray-600 hover:text-blue-500 transition-colors text-sm lg:text-base'
        >
          Servicios
        </Link>
        <Link
          href='#reservas'
          className='bg-blue-500 text-white px-4 lg:px-5 py-2 rounded-full hover:bg-blue-600 transition-transform duration-300 ease-in-out hover:scale-105 text-sm lg:text-base'
        >
          Reservas
        </Link>
      </nav>
    </div>
  </header>
);

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
            style={{ height: "40vh" }}
            // Responsive heights
            data-height='sm:h-[50vh] md:h-[60vh] lg:h-[70vh]'
          >
            <Image
              src={src}
              alt={`Imagen de la clínica ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
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

// --- Array de Datos de Servicios ---
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
      <main className='pt-16 sm:pt-20'>
        <section
          id='inicio'
          className='relative text-center bg-gray-100 py-12 sm:py-16 md:py-20 lg:py-32 flex flex-col items-center justify-center px-4 sm:px-6'
        >
          <div className='absolute inset-0 bg-sky-800 opacity-20'></div>
          <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 z-10 max-w-4xl'>
            Clínica Dental <span className='text-blue-600'>Company</span>
          </h1>
          <p className='mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 z-10 max-w-2xl px-4'>
            Tu sonrisa es nuestra sonrisa.
          </p>
          <Link
            href='#reservas'
            className='mt-6 sm:mt-8 bg-blue-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-600 transition-transform duration-300 ease-in-out hover:scale-105 z-10'
          >
            Agenda tu Cita
          </Link>
        </section>
        <section>
          <Carousel loop />
        </section>
        <section
          id='servicios'
          className='py-12 sm:py-16 md:py-20 bg-white'
        >
          <div className='container mx-auto px-4 sm:px-6 text-center'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-2 text-black'>
              Nuestros Servicios
            </h2>
            <p className='text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto text-sm sm:text-base px-4'>
              Desde revisiones de rutina hasta procedimientos especializados,
              ofrecemos una gama completa de tratamientos para asegurar tu
              bienestar dental.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-black'>
              {servicesData.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className='bg-gray-50 p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center'
                  >
                    <Icon className='h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mb-3 sm:mb-4' />
                    <h3 className='text-lg sm:text-xl font-semibold mb-2'>
                      {service.title}
                    </h3>
                    <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section
          id='nosotros'
          className='py-12 sm:py-16 md:py-20 bg-blue-50'
        >
          <div className='container mx-auto px-4 sm:px-6 text-center'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-black'>
              Conoce a Nuestros Especialistas
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 text-black'>
              <div className='text-center'>
                <Image
                  src='/ulises_penaloza.jpeg'
                  alt='Dr. Ulises Peñaloza'
                  width={120}
                  height={120}
                  className='sm:w-[150px] sm:h-[150px] rounded-full mx-auto mb-4 border-4 border-white shadow-md'
                />
                <h3 className='text-lg sm:text-xl font-bold'>
                  Dr. Ulises Peñaloza
                </h3>
                <p className='text-blue-600 font-medium text-sm sm:text-base'>
                  Especialista en Periodoncia e Implantología
                </p>
              </div>
              <div className='text-center'>
                <Image
                  src='/dentista.png'
                  alt='Dra. Gabriela Condori'
                  width={120}
                  height={120}
                  className='sm:w-[150px] sm:h-[150px] rounded-full mx-auto mb-4 border-4 border-white shadow-md'
                />
                <h3 className='text-lg sm:text-xl font-bold'>
                  Dra. Gabriela Condori
                </h3>
                <p className='text-blue-600 font-medium text-sm sm:text-base'>
                  Especialista en Ortodoncia y Ortopedia Maxilar
                </p>
              </div>
              <div className='text-center sm:col-span-2 lg:col-span-1'>
                <Image
                  src='/dentista.png'
                  alt='Dra. Paola Peñaloza'
                  width={120}
                  height={120}
                  className='sm:w-[150px] sm:h-[150px] rounded-full mx-auto mb-4 border-4 border-white shadow-md'
                />
                <h3 className='text-lg sm:text-xl font-bold'>
                  Dra. Paola Peñaloza
                </h3>
                <p className='text-blue-600 font-medium text-sm sm:text-base'>
                  Cirujano dentista con experiencia en salud pública
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id='reservas'
          className='py-12 sm:py-16 bg-blue-100'
        >
          <div className='container mx-auto px-4 sm:px-6 max-w-xl'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-blue-800'>
              Contáctanos
            </h2>

            <form
              className='bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-4 sm:space-y-5'
              onSubmit={(e) => {
                e.preventDefault();
                const nombre = (e.currentTarget.nombre as HTMLInputElement)
                  .value;
                const motivo = (e.currentTarget.motivo as HTMLInputElement)
                  .value;
                const mensaje = (e.currentTarget.mensaje as HTMLTextAreaElement)
                  .value;
                const texto = encodeURIComponent(
                  `Hola doctor, soy ${nombre}.\n*Motivo de la consulta:* ${motivo}\n\n${mensaje}`
                );
                window.open(
                  `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`,
                  "_blank"
                );
              }}
            >
              <div>
                <label
                  htmlFor='nombre'
                  className='block text-gray-700 font-medium mb-1'
                >
                  Nombre
                </label>
                <input
                  type='text'
                  id='nombre'
                  name='nombre'
                  className='w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 text-sm sm:text-base'
                  placeholder='Tu nombre'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='motivo'
                  className='block text-gray-700 font-medium mb-1'
                >
                  Motivo
                </label>
                <input
                  type='text'
                  id='motivo'
                  name='motivo'
                  className='w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 text-sm sm:text-base'
                  placeholder='Motivo de consulta'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='mensaje'
                  className='block text-gray-700 font-medium mb-1'
                >
                  Mensaje
                </label>
                <textarea
                  id='mensaje'
                  name='mensaje'
                  className='w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 text-sm sm:text-base'
                  rows={4}
                  placeholder='¿En qué podemos ayudarte?'
                  required
                />
              </div>
              <button
                type='submit'
                className='w-full bg-green-600 text-white font-semibold py-2.5 sm:py-3 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base'
              >
                <Image
                  src='/whatsapp.png'
                  alt='WhatsApp'
                  width={24}
                  height={24}
                  className='invert'
                />
                Enviar mensaje
              </button>
            </form>
          </div>
        </section>

        <footer className='bg-gray-800 text-white'>
          <div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'>
              <div className='text-center md:text-left'>
                <h3 className='text-lg sm:text-xl font-bold mb-3 sm:mb-4'>
                  Dental Company
                </h3>
                <p className='text-gray-400 text-sm sm:text-base leading-relaxed'>
                  DENTAL COMPANY es un centro odontológico integral de última
                  generación que combina excelencia clínica, tecnología avanzada
                  y calidez humana. Nos dedicamos a proporcionar tratamientos
                  dentales de la más alta calidad con un enfoque preventivo,
                  personalizado y multidisciplinario.
                </p>
              </div>

              <div className='text-center md:text-left'>
                <h3 className='text-lg sm:text-xl font-bold mb-3 sm:mb-4'>
                  Contacto
                </h3>
                <ul className='space-y-2 text-gray-400 text-sm sm:text-base'>
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

              <div className='text-center md:text-left'>
                <h3 className='text-lg sm:text-xl font-bold mb-3 sm:mb-4'>
                  Ubicación
                </h3>
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
            <div className='text-center text-gray-500 mt-6 sm:mt-10 border-t border-gray-700 pt-4 sm:pt-6 text-sm sm:text-base'>
              © {new Date().getFullYear()} Dental Company. Todos los derechos
              reservados.
            </div>
          </div>
        </footer>
      </main>

      {/* Chatbot flotante con FAQ */}
      <FloatingChatbot />
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { createClient } from "@/lib/supabase/client";
import { FloatingChatbot } from "@/components/floating-chatbot";
import {
  Stethoscope,
  Sparkles,
  Smile,
  Bone,
  Syringe,
  Microscope,
  ShieldCheck,
  Baby,
  Puzzle,
  FileSearch,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Menu,
  X,
  Star,
  GraduationCap,
  Briefcase,
  Award,
  Quote,
  Heart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Mapeo de iconos
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  Sparkles,
  Smile,
  Bone,
  Syringe,
  Microscope,
  ShieldCheck,
  Baby,
  Puzzle,
  FileSearch,
};

// Datos del curriculum de odontólogos
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
      "Mi objetivo es devolverle no solo la funcionalidad a la sonrisa de mis pacientes, sino también la confianza para reír sin preocupaciones. Utilizo tecnología de vanguardia para planificar cada caso de manera precisa y predecible con un enfoque en la salud integral de mis pacientes.",
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
      "Cada sonrisa cuenta una historia única. Mi misión es crear tratamientos personalizados que se adapten al estilo de vida de cada paciente, utilizando los avances más modernos en ortodoncia.",
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
      "Creo firmemente que la salud bucal es un derecho fundamental, no un privilegio. Mi trabajo se centra en reducir las brechas de acceso y desarrollar políticas públicas que garanticen atención odontológica de calidad para todos los segmentos de la población, especialmente los más vulnerables.",
  },
};

// Tipos
interface Curriculum {
  formacion: string[];
  experiencia: string[];
  especialidades: string[];
  filosofia: string;
}

interface CMSData {
  secciones: Array<{
    id: string;
    seccion: string;
    titulo: string;
    subtitulo: string;
    contenido: Record<string, string>;
  }>;
  servicios: Array<{
    id: string;
    nombre: string;
    descripcion: string;
    icono: string;
    orden: number;
    detalle_completo?: string;
    beneficios?: string[];
    duracion?: string;
    recomendaciones?: string;
  }>;
  equipo: Array<{
    id: string;
    nombre: string;
    cargo: string;
    especialidad: string;
    foto_url: string;
    curriculum?: Curriculum | null;
  }>;
  carrusel: Array<{
    id: string;
    imagen_url: string;
    alt_text: string;
  }>;
  tema: Record<string, string>;
}

// Default data (fallback)
const defaultData: CMSData = {
  secciones: [],
  servicios: [],
  equipo: [],
  carrusel: [
    { id: "1", imagen_url: "/foto_interior_2.jpeg", alt_text: "Interior 1" },
    { id: "2", imagen_url: "/foto_interior_3.jpeg", alt_text: "Interior 2" },
    { id: "3", imagen_url: "/foto_interior_4.jpeg", alt_text: "Interior 3" },
  ],
  tema: {
    nombre_clinica: "Dental Company",
    slogan: "Tu sonrisa es nuestra sonrisa",
    whatsapp_numero: "51952864883",
    telefono: "+51 952 864 883",
    email: "d.c.com@hotmail.com",
    direccion: "Av. General Suarez N° 312, Tacna, Perú",
    horario_semana: "Lunes a Viernes: 9:00 AM - 7:00 PM",
    horario_sabado: "Sábados: 9:00 AM - 1:00 PM",
  },
};

// --- Header Moderno ---
const Header = ({ isScrolled }: { isScrolled: boolean }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
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
              className='h-12 w-auto'
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center gap-8'>
            {[
              { href: "#inicio", label: "Inicio" },
              { href: "#servicios", label: "Servicios" },
              { href: "#nosotros", label: "Nosotros" },
              { href: "#contacto", label: "Contacto" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isScrolled ? "text-gray-700" : "text-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`#contacto`}
              className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
            >
              Agendar Cita
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className='h-6 w-6 text-gray-700' />
            ) : (
              <Menu className='h-6 w-6 text-gray-700' />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className='md:hidden bg-white rounded-2xl shadow-xl mb-4 p-6 space-y-4 animate-in slide-in-from-top-5'>
            {[
              { href: "#inicio", label: "Inicio" },
              { href: "#servicios", label: "Servicios" },
              { href: "#nosotros", label: "Nosotros" },
              { href: "#contacto", label: "Contacto" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className='block text-gray-700 font-medium py-2 hover:text-blue-600'
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`#contacto`}
              className='block bg-blue-600 text-white text-center px-6 py-3 rounded-full font-semibold'
            >
              Agendar Cita
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

// --- Hero Section con Carrusel ---
const HeroSection = ({
  carrusel,
  tema,
}: {
  carrusel: CMSData["carrusel"];
  tema: Record<string, string>;
}) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const images = carrusel.length > 0 ? carrusel : defaultData.carrusel;

  const infoCards = [
    {
      icon: Clock,
      title: "Horario",
      lines: [
        tema.horario_semana || "Lun - Vie: 9:00 AM - 7:00 PM",
        tema.horario_sabado || "Sábados: 9:00 AM - 1:00 PM",
      ],
    },
    {
      icon: MapPin,
      title: "Ubicación",
      lines: [tema.direccion || "Av. General Suarez N° 312", "Tacna, Perú"],
    },
    {
      icon: Phone,
      title: "Contacto",
      lines: [
        tema.telefono || "+51 952 864 883",
        tema.email || "d.c.com@hotmail.com",
      ],
    },
  ];

  return (
    <section
      id='inicio'
      className='relative min-h-screen flex items-center'
    >
      {/* Carrusel de fondo */}
      <div
        className='absolute inset-0 overflow-hidden'
        ref={emblaRef}
      >
        <div className='flex h-full'>
          {images.map((img, index) => (
            <div
              key={img.id || index}
              className='relative flex-[0_0_100%] h-screen'
            >
              <Image
                src={img.imagen_url}
                alt={img.alt_text || `Imagen ${index + 1}`}
                fill
                className='object-cover'
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay gradiente */}
      <div className='absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/75 to-blue-900/40' />

      {/* Contenido principal */}
      <div className='relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center'>
          {/* Lado izquierdo - Título y CTA */}
          <div>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-blue-200 text-sm mb-6'>
              <Star className='h-4 w-4 text-yellow-400 fill-yellow-400' />
              Más de 10 años de experiencia
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6'>
              {tema.nombre_clinica || "Dental Company"}
            </h1>
            <p className='text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed'>
              {tema.slogan || "Tu sonrisa es nuestra sonrisa"}
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                href='#contacto'
                className='inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl'
              >
                <Image
                  src='/whatsapp.png'
                  alt='WhatsApp'
                  width={24}
                  height={24}
                />
                Agenda tu Cita
              </Link>
              <Link
                href='#servicios'
                className='inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300'
              >
                Conoce más
                <ChevronDown className='h-5 w-5' />
              </Link>
            </div>
          </div>

          {/* Lado derecho - Cards de información */}
          <div className='hidden lg:flex flex-col gap-3 max-w-sm ml-auto'>
            {infoCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className='group bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] shadow-lg'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-11 h-11 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md'>
                      <Icon className='h-5 w-5 text-white' />
                    </div>
                    <div>
                      <h3 className='text-base font-bold text-white leading-tight'>
                        {card.title}
                      </h3>
                      {card.lines.map((line, i) => (
                        <p
                          key={i}
                          className='text-white/90 text-sm leading-snug'
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cards móviles - versión compacta horizontal */}
        <div className='lg:hidden mt-8 flex flex-wrap justify-center gap-3'>
          {infoCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className='bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg px-4 py-2.5 flex items-center gap-2.5 shadow-md'
              >
                <div className='w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0'>
                  <Icon className='h-4 w-4 text-white' />
                </div>
                <span className='text-white text-sm font-medium'>
                  {card.lines[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'>
        <ChevronDown className='h-8 w-8 text-white/60' />
      </div>
    </section>
  );
};

// --- Servicios Section ---
interface ServiceDetail {
  nombre: string;
  descripcion: string;
  icono: string;
  detalleCompleto: string;
  beneficios: string[];
  duracion?: string;
  recomendaciones?: string;
}

const serviciosDetallados: ServiceDetail[] = [
  {
    nombre: "Odontología General",
    descripcion:
      "Consultas, diagnósticos completos, limpiezas dentales profesionales (profilaxis), tratamiento de caries y revisiones periódicas.",
    icono: "Stethoscope",
    detalleCompleto:
      "La odontología general es la base de una buena salud bucal. Realizamos evaluaciones completas de tu boca, detectando problemas en etapas tempranas para un tratamiento más efectivo y menos invasivo. Incluye radiografías digitales, examen de encías, evaluación de mordida y un plan de tratamiento personalizado según tus necesidades.",
    beneficios: [
      "Prevención de enfermedades bucales",
      "Detección temprana de caries y problemas en las encías",
      "Limpieza profunda que elimina sarro y manchas",
      "Consejos personalizados para tu higiene diaria",
      "Seguimiento continuo de tu salud dental",
    ],
    duracion: "30-60 minutos por consulta",
    recomendaciones:
      "Te sugerimos visitarnos cada 6 meses para mantener tu sonrisa saludable. Recuerda cepillarte después de cada comida y usar hilo dental diariamente.",
  },
  {
    nombre: "Estética Dental",
    descripcion:
      "Blanqueamiento dental profesional, carillas de porcelana y composite, coronas estéticas libres de metal y diseño digital de sonrisa.",
    icono: "Sparkles",
    detalleCompleto:
      "Transformamos tu sonrisa con tratamientos estéticos de última generación. Utilizamos tecnología digital para diseñar tu sonrisa ideal antes del tratamiento, permitiéndote ver cómo lucirás al finalizar. Trabajamos con materiales de alta calidad que garantizan resultados naturales y duraderos.",
    beneficios: [
      "Sonrisa más blanca y brillante",
      "Corrección de forma, tamaño y color de dientes",
      "Resultados naturales que lucen como tus propios dientes",
      "Aumento de la autoestima y confianza",
      "Materiales seguros y de larga duración",
    ],
    duracion: "1-3 citas según el tratamiento",
    recomendaciones:
      "Después del blanqueamiento, evita por 48 horas café, té, vino tinto y alimentos con colorantes. Mantén una buena higiene para que los resultados duren más tiempo.",
  },
  {
    nombre: "Ortodoncia",
    descripcion:
      "Brackets metálicos y estéticos, tratamientos interceptivos en niños para corregir problemas de mordida y alineación dental.",
    icono: "Smile",
    detalleCompleto:
      "Corregimos la posición de tus dientes y mejoramos tu mordida con tratamientos ortodónticos personalizados. Ofrecemos brackets tradicionales, estéticos (de cerámica transparente) y tratamientos especiales para niños que previenen problemas mayores en el futuro. La Dra. Gabriela Condori, especialista en ortodoncia con más de 10 años de experiencia, evaluará tu caso individualmente.",
    beneficios: [
      "Dientes perfectamente alineados",
      "Mejora de la mordida para masticar mejor",
      "Prevención de desgaste dental",
      "Mayor facilidad para cepillarte y usar hilo dental",
      "Mejora notable de tu perfil facial",
    ],
    duracion: "12-24 meses promedio",
    recomendaciones:
      "Asiste puntualmente a tus controles mensuales. Evita alimentos duros o pegajosos que puedan dañar los brackets. Usa los cepillos especiales que te proporcionamos para limpiar alrededor de los brackets.",
  },
  {
    nombre: "Implantes Dentales",
    descripcion:
      "Implantes unitarios y múltiples, carga inmediata, prótesis sobre implantes y regeneración ósea guiada.",
    icono: "Bone",
    detalleCompleto:
      "Los implantes dentales son la solución más avanzada y duradera para reemplazar dientes perdidos. Utilizamos implantes de titanio de alta calidad que se integran perfectamente con el hueso. El Dr. Ulises Peñaloza, especialista en implantología con 17 años de experiencia, ofrece técnicas de carga inmediata que permiten colocar dientes provisionales el mismo día de la cirugía.",
    beneficios: [
      "Solución permanente para dientes perdidos",
      "Lucen y funcionan como dientes naturales",
      "Mantienen saludable el hueso de tu mandíbula",
      "No dañan los dientes vecinos",
      "Pueden durar toda la vida con el cuidado adecuado",
    ],
    duracion: "3-6 meses para integración completa",
    recomendaciones:
      "Durante los primeros días después de la cirugía, consume alimentos blandos y fríos. No fumes, ya que afecta la cicatrización. Sigue todas las indicaciones que te daremos para asegurar el éxito del implante.",
  },
  {
    nombre: "Cirugía Bucal",
    descripcion:
      "Extracciones simples y complejas, extracción de muelas del juicio, cirugía de encías e injertos de hueso y tejido.",
    icono: "Syringe",
    detalleCompleto:
      "Realizamos procedimientos quirúrgicos con técnicas modernas y mínimamente invasivas para reducir molestias y acelerar tu recuperación. Nuestro equipo está especializado en extracciones complejas, incluyendo muelas del juicio que no han salido correctamente, y cirugías de regeneración para preparar tu boca para implantes.",
    beneficios: [
      "Procedimientos con mínimas molestias",
      "Recuperación más rápida que con técnicas tradicionales",
      "Anestesia efectiva para un procedimiento sin dolor",
      "Seguimiento incluido después de la cirugía",
      "Prevención de complicaciones a futuro",
    ],
    duracion: "30-90 minutos según el procedimiento",
    recomendaciones:
      "Después de la cirugía, descansa el resto del día y aplica hielo en la zona por intervalos de 15 minutos. Come alimentos blandos y fríos. Evita enjuagues fuertes las primeras 24 horas. Te daremos medicación para controlar cualquier molestia.",
  },
  {
    nombre: "Endodoncia",
    descripcion:
      "Tratamiento de conductos (conocido como 'matar el nervio'), retratamientos y procedimientos para salvar dientes muy dañados.",
    icono: "Microscope",
    detalleCompleto:
      "La endodoncia permite salvar dientes que de otra manera tendrían que ser extraídos. Este tratamiento, conocido popularmente como 'matar el nervio', elimina la infección interna del diente, limpia completamente los conductos y los sella para prevenir futuras infecciones. Con las técnicas modernas que utilizamos, el procedimiento es prácticamente indoloro.",
    beneficios: [
      "Salva dientes que parecían perdidos",
      "Elimina el dolor intenso causado por la infección",
      "Procedimiento prácticamente sin dolor",
      "Conserva tu diente natural en lugar de reemplazarlo",
      "Evita la necesidad de implantes o prótesis",
    ],
    duracion: "1-2 citas de 60-90 minutos",
    recomendaciones:
      "Es normal sentir sensibilidad los primeros días; esto pasará gradualmente. Evita masticar con ese diente hasta que te coloquemos la corona definitiva. Toma los medicamentos según las indicaciones para una recuperación cómoda.",
  },
  {
    nombre: "Periodoncia",
    descripcion:
      "Tratamiento de encías inflamadas (gingivitis) y enfermedad periodontal, limpieza profunda, cirugía regenerativa y mantenimiento.",
    icono: "ShieldCheck",
    detalleCompleto:
      "Tratamos las enfermedades de las encías, desde inflamación leve hasta casos avanzados donde hay pérdida de hueso. El Dr. Ulises Peñaloza, especialista en periodoncia, puede detener la progresión de la enfermedad y en muchos casos regenerar los tejidos perdidos. Las encías sanas son fundamentales porque la enfermedad de las encías es la principal causa de pérdida de dientes en adultos.",
    beneficios: [
      "Encías saludables que no sangran al cepillarte",
      "Prevención de pérdida de dientes",
      "Eliminación del mal aliento causado por bacterias",
      "Posibilidad de recuperar hueso perdido",
      "Mejor salud general (las encías enfermas afectan el corazón y otros órganos)",
    ],
    duracion: "Varias sesiones según la severidad",
    recomendaciones:
      "Después del tratamiento, tus encías pueden estar sensibles por unos días. Usa el enjuague especial que te recetaremos. Es muy importante que asistas a tus citas de mantenimiento cada 3-4 meses para evitar que la enfermedad regrese.",
  },
  {
    nombre: "Odontopediatría",
    descripcion:
      "Atención dental especializada para niños, sellantes protectores, aplicación de flúor y técnicas especiales para que los pequeños no tengan miedo.",
    icono: "Baby",
    detalleCompleto:
      "Brindamos atención dental especializada para los más pequeños de la casa en un ambiente amigable y libre de miedo. Utilizamos técnicas especiales de comunicación para que los niños tengan experiencias positivas en el dentista desde temprana edad. Nos enfocamos en la prevención para asegurar que sus dientes crezcan sanos y fuertes.",
    beneficios: [
      "Ambiente diseñado para que los niños se sientan cómodos",
      "Prevención de caries desde los primeros dientes",
      "Enseñamos higiene oral de forma divertida",
      "Sellantes que protegen las muelitas de las caries",
      "Detección temprana si necesitarán ortodoncia",
    ],
    duracion: "20-40 minutos por sesión",
    recomendaciones:
      "La primera visita al dentista debe ser al cumplir el primer año o cuando salga el primer diente. Supervisa el cepillado de tu hijo hasta los 7-8 años. Limita los dulces y jugos azucarados, especialmente antes de dormir.",
  },
  {
    nombre: "Prótesis Dental",
    descripcion:
      "Coronas y puentes fijos, dentaduras removibles, prótesis totales y sobredentaduras sobre implantes para casos sin dientes.",
    icono: "Puzzle",
    detalleCompleto:
      "Restauramos la función y belleza de tu sonrisa con prótesis dentales hechas a tu medida. Trabajamos con materiales modernos como el zirconio que lucen completamente naturales. Ofrecemos desde coronas individuales para un solo diente hasta rehabilitaciones completas para quienes han perdido todos sus dientes.",
    beneficios: [
      "Vuelve a masticar todos tus alimentos favoritos",
      "Sonrisa restaurada con apariencia natural",
      "Materiales resistentes que duran muchos años",
      "Ajuste cómodo y preciso",
      "Mejora de la pronunciación al hablar",
    ],
    duracion: "2-4 citas según el tipo de prótesis",
    recomendaciones:
      "Si tienes prótesis removible, retírala para dormir y mantenla limpia. Las prótesis fijas se cuidan igual que los dientes naturales. Visítanos regularmente para verificar el ajuste y hacer mantenimiento.",
  },
  {
    nombre: "Diagnóstico de Patologías",
    descripcion:
      "Detección temprana de cáncer oral, evaluación de llagas que no sanan, manchas sospechosas y otras alteraciones de la boca.",
    icono: "FileSearch",
    detalleCompleto:
      "Realizamos exámenes completos de toda tu boca para detectar cualquier lesión que requiera atención. La detección temprana de problemas serios, incluyendo lesiones pre-cancerosas y cáncer oral, es crucial para un tratamiento exitoso. Si encontramos algo que necesite evaluación especializada, te guiaremos en los siguientes pasos.",
    beneficios: [
      "La detección temprana puede salvar tu vida",
      "Diagnóstico preciso de cualquier lesión en la boca",
      "Seguimiento de manchas o llagas sospechosas",
      "Coordinación con especialistas si es necesario",
      "Tranquilidad de saber que todo está bien",
    ],
    duracion: "30-45 minutos de evaluación",
    recomendaciones:
      "Revisa tu boca mensualmente frente al espejo. Consulta de inmediato si notas llagas que no sanan en 2 semanas, manchas blancas o rojas, bultos, o cualquier cambio inusual. No te alarmes, la mayoría de las lesiones son benignas, pero es mejor verificar.",
  },
];

// Modal de Servicio
const ServicioModal = ({
  isOpen,
  onClose,
  servicio,
}: {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServiceDetail | null;
}) => {
  if (!isOpen || !servicio) return null;

  const Icon = iconMap[servicio.icono] || Stethoscope;

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center p-4'
      onClick={onClose}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' />

      {/* Modal Content */}
      <div
        className='relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-8 rounded-t-3xl'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors'
          >
            <X className='h-5 w-5 text-white' />
          </button>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center'>
              <Icon className='h-8 w-8 text-white' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-white'>
                {servicio.nombre}
              </h2>
              {servicio.duracion && (
                <p className='text-blue-200 text-sm mt-1'>
                  <Clock className='inline h-4 w-4 mr-1' />
                  {servicio.duracion}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className='p-8 space-y-6'>
          {/* Descripción completa */}
          <div>
            <h3 className='text-lg font-bold text-gray-900 mb-3'>
              ¿En qué consiste?
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              {servicio.detalleCompleto}
            </p>
          </div>

          {/* Beneficios */}
          <div className='bg-blue-50 rounded-2xl p-6'>
            <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-blue-600' />
              Beneficios
            </h3>
            <ul className='space-y-3'>
              {servicio.beneficios.map((beneficio, index) => (
                <li
                  key={index}
                  className='flex items-start gap-3 text-gray-700'
                >
                  <span className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0' />
                  {beneficio}
                </li>
              ))}
            </ul>
          </div>

          {/* Recomendaciones */}
          {servicio.recomendaciones && (
            <div className='bg-amber-50 rounded-2xl p-6'>
              <h3 className='text-lg font-bold text-gray-900 mb-3 flex items-center gap-2'>
                <AlertCircle className='h-5 w-5 text-amber-600' />
                Recomendaciones
              </h3>
              <p className='text-gray-700'>{servicio.recomendaciones}</p>
            </div>
          )}

          {/* CTA */}
          <div className='pt-4'>
            <a
              href='#contacto'
              onClick={onClose}
              className='block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25'
            >
              Agendar una cita
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiciosSection = ({
  servicios,
}: {
  servicios: CMSData["servicios"];
}) => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(
    null
  );

  // Usar servicios del CMS si existen, sino usar los hardcodeados como fallback
  const displayServices =
    servicios.length > 0
      ? servicios
      : serviciosDetallados.map((s, i) => ({ ...s, id: String(i), orden: i }));

  // Función para obtener los detalles del servicio (del CMS o hardcodeado)
  const getServiceDetails = (
    service: CMSData["servicios"][0]
  ): ServiceDetail => {
    // Si el servicio del CMS tiene detalles, usarlos
    if (service.detalle_completo) {
      return {
        nombre: service.nombre,
        descripcion: service.descripcion,
        icono: service.icono,
        detalleCompleto: service.detalle_completo,
        beneficios: service.beneficios || [],
        duracion: service.duracion,
        recomendaciones: service.recomendaciones,
      };
    }
    // Sino, buscar en los datos hardcodeados
    const hardcodedService = serviciosDetallados.find(
      (s) => s.nombre === service.nombre
    );
    if (hardcodedService) {
      return hardcodedService;
    }
    // Si no hay datos, retornar uno básico
    return {
      nombre: service.nombre,
      descripcion: service.descripcion,
      icono: service.icono,
      detalleCompleto: service.descripcion,
      beneficios: [],
    };
  };

  return (
    <section
      id='servicios'
      className='py-24 bg-gradient-to-b from-gray-50 to-white'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <span className='text-blue-600 font-semibold text-sm uppercase tracking-wider'>
            Nuestros Servicios
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6'>
            Cuidamos tu Sonrisa
          </h2>
          <p className='text-gray-600 text-lg leading-relaxed'>
            Ofrecemos una amplia gama de tratamientos dentales con la más alta
            calidad y tecnología de vanguardia.
          </p>
        </div>

        <div
          className={`grid gap-6 ${
            displayServices.length === 1
              ? "grid-cols-1 max-w-sm mx-auto"
              : displayServices.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
              : displayServices.length === 3
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto"
              : displayServices.length === 4
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          }`}
        >
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icono] || Stethoscope;
            const servicioDetallado = getServiceDetails(service);
            return (
              <div
                key={service.id || index}
                onClick={() => setSelectedService(servicioDetallado)}
                className='group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-100 hover:-translate-y-1 cursor-pointer'
              >
                <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300'>
                  <Icon className='h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300' />
                </div>
                <h3 className='text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
                  {service.nombre}
                </h3>
                <p className='text-gray-600 text-sm leading-relaxed mb-3'>
                  {service.descripcion}
                </p>
                <span className='inline-flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity'>
                  Ver más información
                  <ChevronDown className='h-4 w-4 rotate-[-90deg]' />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Servicio */}
      <ServicioModal
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        servicio={selectedService}
      />
    </section>
  );
};

// --- Modal de Curriculum ---
const CurriculumModal = ({
  isOpen,
  onClose,
  member,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: CMSData["equipo"][0] | null;
}) => {
  if (!isOpen || !member) return null;

  // Usar curriculum de la BD, con fallback al hardcodeado para compatibilidad
  const curriculum = member.curriculum || curriculumData[member.nombre];

  if (!curriculum) return null;

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center p-4'
      onClick={onClose}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' />

      {/* Modal Content */}
      <div
        className='relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con foto */}
        <div className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-8 pb-24 rounded-t-3xl'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors'
          >
            <X className='h-5 w-5 text-white' />
          </button>
          <div className='text-center'>
            <span className='text-blue-200 text-sm font-medium uppercase tracking-wider'>
              Curriculum Vitae
            </span>
          </div>
        </div>

        {/* Foto centrada superpuesta */}
        <div className='flex justify-center -mt-16 mb-4'>
          <div className='relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl'>
            <Image
              src={member.foto_url || "/dentista.png"}
              alt={member.nombre}
              fill
              className='object-cover'
            />
          </div>
        </div>

        {/* Info del doctor */}
        <div className='text-center px-8 pb-4'>
          <h2 className='text-2xl font-bold text-gray-900'>{member.nombre}</h2>
          <p className='text-blue-600 font-medium'>{member.cargo}</p>
          <p className='text-gray-500 text-sm'>{member.especialidad}</p>
        </div>

        {/* Contenido del CV */}
        <div className='px-8 pb-8 space-y-6'>
          {/* Formación Académica */}
          <div className='bg-gray-50 rounded-2xl p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                <GraduationCap className='h-5 w-5 text-blue-600' />
              </div>
              <h3 className='text-lg font-bold text-gray-900'>
                Formación Académica
              </h3>
            </div>
            <ul className='space-y-2'>
              {curriculum.formacion.map((item, index) => (
                <li
                  key={index}
                  className='flex items-start gap-2 text-gray-600'
                >
                  <span className='w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Experiencia */}
          <div className='bg-gray-50 rounded-2xl p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center'>
                <Briefcase className='h-5 w-5 text-emerald-600' />
              </div>
              <h3 className='text-lg font-bold text-gray-900'>Experiencia</h3>
            </div>
            <ul className='space-y-2'>
              {curriculum.experiencia.map((item, index) => (
                <li
                  key={index}
                  className='flex items-start gap-2 text-gray-600'
                >
                  <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Especialidades */}
          <div className='bg-gray-50 rounded-2xl p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center'>
                <Award className='h-5 w-5 text-violet-600' />
              </div>
              <h3 className='text-lg font-bold text-gray-900'>
                Especialidades
              </h3>
            </div>
            <div className='flex flex-wrap gap-2'>
              {curriculum.especialidades.map((item, index) => (
                <span
                  key={index}
                  className='bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 border border-gray-200'
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Filosofía */}
          <div className='bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center'>
                <Heart className='h-5 w-5 text-blue-600' />
              </div>
              <h3 className='text-lg font-bold text-gray-900'>
                Filosofía de Tratamiento
              </h3>
            </div>
            <div className='relative'>
              <Quote className='absolute -top-2 -left-1 h-8 w-8 text-blue-200' />
              <p className='text-gray-700 italic leading-relaxed pl-6'>
                {curriculum.filosofia}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Equipo Section ---
const EquipoSection = ({ equipo }: { equipo: CMSData["equipo"] }) => {
  const [selectedMember, setSelectedMember] = useState<
    CMSData["equipo"][0] | null
  >(null);

  const defaultEquipo: CMSData["equipo"] = [
    {
      id: "1",
      nombre: "Dr. Ulises Peñaloza",
      cargo: "Director Médico",
      especialidad: "Periodoncia e Implantología",
      foto_url: "/ulises_penaloza.jpeg",
      curriculum: null, // Se usará el fallback hardcodeado
    },
    {
      id: "2",
      nombre: "Dra. Gabriela Condori",
      cargo: "Ortodoncista",
      especialidad: "Ortodoncia y Ortopedia Maxilar",
      foto_url: "/dentista.png",
      curriculum: null,
    },
    {
      id: "3",
      nombre: "Dra. Paola Peñaloza",
      cargo: "Odontóloga General",
      especialidad: "Salud Pública",
      foto_url: "/dentista.png",
      curriculum: null,
    },
  ];

  const displayEquipo = equipo.length > 0 ? equipo : defaultEquipo;

  return (
    <>
      <section
        id='nosotros'
        className='py-24 bg-white'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <span className='text-blue-600 font-semibold text-sm uppercase tracking-wider'>
              Nuestro Equipo
            </span>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6'>
              Conoce a Nuestros Especialistas
            </h2>
            <p className='text-gray-600 text-lg leading-relaxed'>
              Profesionales altamente calificados comprometidos con tu bienestar
              dental. Haz clic en cada especialista para ver su hoja de vida.
            </p>
          </div>

          <div
            className={`grid gap-8 ${
              displayEquipo.length === 1
                ? "grid-cols-1 max-w-xs mx-auto"
                : displayEquipo.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
                : displayEquipo.length === 3
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto"
                : displayEquipo.length === 4
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
            }`}
          >
            {displayEquipo.map((member) => {
              // Verificar curriculum en BD o en datos hardcodeados (fallback)
              const hasCurriculum =
                member.curriculum || curriculumData[member.nombre];
              return (
                <div
                  key={member.id}
                  className={`group text-center ${
                    hasCurriculum ? "cursor-pointer" : ""
                  }`}
                  onClick={() => hasCurriculum && setSelectedMember(member)}
                >
                  <div className='relative mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-400 group-hover:shadow-xl transition-all duration-300'>
                    <Image
                      src={member.foto_url || "/dentista.png"}
                      alt={member.nombre}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                    {hasCurriculum && (
                      <div className='absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors duration-300 flex items-center justify-center'>
                        <span className='opacity-0 group-hover:opacity-100 text-white font-medium text-sm bg-blue-600/80 px-4 py-2 rounded-full transition-opacity duration-300'>
                          Ver CV
                        </span>
                      </div>
                    )}
                  </div>
                  <h3
                    className={`text-xl font-bold text-gray-900 mb-1 ${
                      hasCurriculum
                        ? "group-hover:text-blue-600 transition-colors"
                        : ""
                    }`}
                  >
                    {member.nombre}
                  </h3>
                  <p className='text-blue-600 font-medium mb-2'>
                    {member.cargo}
                  </p>
                  <p className='text-gray-500 text-sm'>{member.especialidad}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de Curriculum */}
      <CurriculumModal
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </>
  );
};

// --- Contacto Section ---
const ContactoSection = ({ tema }: { tema: Record<string, string> }) => {
  const whatsappNumber = tema.whatsapp_numero || "51952864883";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre") as string;
    const motivo = formData.get("motivo") as string;
    const mensaje = formData.get("mensaje") as string;

    const texto = encodeURIComponent(
      `Hola doctor, soy ${nombre}.\n*Motivo de la consulta:* ${motivo}\n\n${mensaje}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${texto}`, "_blank");
  };

  return (
    <section
      id='contacto'
      className='py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Info */}
          <div className='text-white'>
            <span className='text-blue-200 font-semibold text-sm uppercase tracking-wider'>
              Contáctanos
            </span>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6'>
              ¿Listo para tu nueva sonrisa?
            </h2>
            <p className='text-blue-100 text-lg mb-8 leading-relaxed'>
              Agenda tu cita y descubre por qué somos la clínica dental de
              confianza en Tacna.
            </p>

            <div className='space-y-6'>
              {[
                { icon: Phone, label: tema.telefono || "+51 952 864 883" },
                { icon: Mail, label: tema.email || "d.c.com@hotmail.com" },
                {
                  icon: MapPin,
                  label: tema.direccion || "Av. General Suarez N° 312, Tacna",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className='flex items-center gap-4'
                  >
                    <div className='w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center'>
                      <Icon className='h-5 w-5 text-blue-200' />
                    </div>
                    <span className='text-white'>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className='bg-white rounded-3xl shadow-2xl p-8 sm:p-10'>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>
              Envíanos un mensaje
            </h3>
            <form
              onSubmit={handleSubmit}
              className='space-y-5'
            >
              <div>
                <label
                  htmlFor='nombre'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Nombre
                </label>
                <input
                  type='text'
                  id='nombre'
                  name='nombre'
                  required
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 text-gray-900'
                  placeholder='Tu nombre completo'
                />
              </div>
              <div>
                <label
                  htmlFor='motivo'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Motivo de consulta
                </label>
                <input
                  type='text'
                  id='motivo'
                  name='motivo'
                  required
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 text-gray-900'
                  placeholder='Ej: Limpieza dental, dolor de muela...'
                />
              </div>
              <div>
                <label
                  htmlFor='mensaje'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Mensaje
                </label>
                <textarea
                  id='mensaje'
                  name='mensaje'
                  rows={4}
                  required
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-gray-50 text-gray-900'
                  placeholder='Cuéntanos más sobre tu consulta...'
                />
              </div>
              <button
                type='submit'
                className='w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg shadow-green-500/25'
              >
                <Image
                  src='/whatsapp.png'
                  alt='WhatsApp'
                  width={24}
                  height={24}
                  className='invert'
                />
                Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = ({ tema }: { tema: Record<string, string> }) => (
  <footer className='bg-gray-900 text-white'>
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
        {/* Logo y descripción */}
        <div className='lg:col-span-2 text-center md:text-left'>
          <Image
            src='/logo.png'
            alt='Dental Company'
            width={150}
            height={50}
            className='mb-6 brightness-0 invert mx-auto md:mx-0'
          />
          <p className='text-gray-400 leading-relaxed max-w-md mx-auto md:mx-0'>
            DENTAL COMPANY es un centro odontológico integral que combina
            excelencia clínica, tecnología avanzada y calidez humana para
            brindarte la mejor atención dental.
          </p>
        </div>

        {/* Links rápidos */}
        <div className='text-center md:text-left'>
          <h4 className='text-lg font-bold mb-6'>Enlaces</h4>
          <ul className='space-y-3'>
            {["Inicio", "Servicios", "Nosotros", "Contacto"].map((link) => (
              <li key={link}>
                <Link
                  href={`#${link.toLowerCase()}`}
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mapa */}
        <div className='text-center md:text-left'>
          <h4 className='text-lg font-bold mb-6'>Ubicación</h4>
          <div className='aspect-video rounded-xl overflow-hidden'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.2145713407194!2d-70.2482761889066!3d-18.015242982912067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915acf7e65086b5d%3A0x8f6c0cc6e1e00105!2sDENTAL%20COMPANY%20TACNA!5e0!3m2!1ses!2spe!4v1756918317841!5m2!1ses!2spe'
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen={false}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            />
          </div>
        </div>
      </div>

      <div className='border-t border-gray-800 mt-12 pt-8 text-center text-gray-500'>
        <p>
          © {new Date().getFullYear()} {tema.nombre_clinica || "Dental Company"}
          . Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

// --- Componente Principal ---
export default function LandingPage() {
  const [cmsData, setCmsData] = useState<CMSData>(defaultData);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Detectar token de recuperación de contraseña en la URL
  useEffect(() => {
    const checkRecoveryToken = async () => {
      const hash = window.location.hash;

      if (hash && hash.includes("type=recovery")) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const supabase = createClient();
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            router.push("/admin/update-password");
            return;
          }
        }
      }
    };

    checkRecoveryToken();
  }, [router]);

  // Cargar datos del CMS
  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await fetch("/api/cms");
        if (res.ok) {
          const data = await res.json();
          setCmsData({
            ...defaultData,
            ...data,
            tema: { ...defaultData.tema, ...data.tema },
          });
        }
      } catch (error) {
        console.error("Error cargando CMS:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCMS();
  }, []);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header isScrolled={isScrolled} />

      <main>
        <HeroSection
          carrusel={cmsData.carrusel}
          tema={cmsData.tema}
        />

        <ServiciosSection servicios={cmsData.servicios} />
        <EquipoSection equipo={cmsData.equipo} />
        <ContactoSection tema={cmsData.tema} />
      </main>

      <Footer tema={cmsData.tema} />

      <FloatingChatbot />

      {/* Loading overlay */}
      {isLoading && (
        <div className='fixed inset-0 bg-white z-[100] flex items-center justify-center'>
          <div className='text-center'>
            <Image
              src='/logo.png'
              alt='Loading'
              width={200}
              height={80}
              className='animate-pulse'
            />
          </div>
        </div>
      )}
    </>
  );
}

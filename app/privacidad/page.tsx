import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  FileText,
  Mail,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad | Dental Company",
  description:
    "Conoce cómo Dental Company protege tus datos personales. Política de privacidad conforme a la Ley de Protección de Datos del Perú.",
  alternates: {
    canonical: "/privacidad",
  },
  openGraph: {
    title: "Política de Privacidad | Dental Company",
    description:
      "Conoce cómo Dental Company protege tus datos personales. Política de privacidad conforme a la Ley de Protección de Datos del Perú.",
    url: "https://dental-company-tacna.com/privacidad",
    siteName: "Dental Company",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dental Company - Política de Privacidad",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PoliticaPrivacidad() {
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
            <Link
              href='/'
              className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors'
            >
              <ArrowLeft className='h-4 w-4' />
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className='bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6'>
            <Shield className='h-8 w-8 text-white' />
          </div>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4'>
            Política de Privacidad
          </h1>
          <p className='text-blue-100 text-lg max-w-2xl mx-auto'>
            En Dental Company nos comprometemos a proteger tu información
            personal con los más altos estándares de seguridad.
          </p>
          <p className='text-blue-200 text-sm mt-4'>
            Última actualización: Enero 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-lg p-8 sm:p-12 space-y-10'>
            {/* Introducción */}
            <section>
              <p className='text-gray-600 leading-relaxed'>
                Dental Company (en adelante, &quot;la Clínica&quot;), con
                domicilio en Calle Zela 716, Tacna, Perú, es responsable del
                tratamiento de los datos personales que nos proporciones. Esta
                Política de Privacidad explica cómo recopilamos, utilizamos,
                compartimos y protegemos tu información personal, de conformidad
                con la Ley N° 29733, Ley de Protección de Datos Personales del
                Perú, y su Reglamento.
              </p>
            </section>

            {/* Sección 1 */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <FileText className='h-5 w-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold text-gray-900'>
                  1. Datos Personales que Recopilamos
                </h2>
              </div>
              <div className='pl-13 space-y-4 text-gray-600'>
                <p>Recopilamos los siguientes tipos de datos personales:</p>
                <div className='bg-gray-50 rounded-xl p-6 space-y-3'>
                  <h3 className='font-semibold text-gray-900'>
                    Datos de identificación:
                  </h3>
                  <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>Nombre completo</li>
                    <li>Documento Nacional de Identidad (DNI)</li>
                    <li>Fecha de nacimiento</li>
                    <li>Género</li>
                    <li>Estado civil</li>
                    <li>Dirección domiciliaria</li>
                  </ul>
                </div>
                <div className='bg-gray-50 rounded-xl p-6 space-y-3'>
                  <h3 className='font-semibold text-gray-900'>
                    Datos de contacto:
                  </h3>
                  <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>Número de teléfono</li>
                    <li>Correo electrónico</li>
                    <li>Dirección de domicilio</li>
                  </ul>
                </div>
                <div className='bg-blue-50 rounded-xl p-6 space-y-3 border border-blue-100'>
                  <h3 className='font-semibold text-gray-900'>
                    Datos de salud (datos sensibles):
                  </h3>
                  <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>Historia clínica odontológica</li>
                    <li>Antecedentes médicos y patológicos</li>
                    <li>Alergias y medicamentos</li>
                    <li>Radiografías e imágenes diagnósticas</li>
                    <li>Odontogramas y planes de tratamiento</li>
                    <li>Registro de citas y tratamientos realizados</li>
                  </ul>
                  <p className='text-sm text-blue-700 mt-2'>
                    <strong>Nota:</strong> Los datos de salud son considerados
                    datos sensibles según la legislación peruana y reciben
                    protección especial.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 2 */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <Eye className='h-5 w-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold text-gray-900'>
                  2. Finalidad del Tratamiento de Datos
                </h2>
              </div>
              <div className='pl-13 space-y-4 text-gray-600'>
                <p>
                  Utilizamos tus datos personales para las siguientes
                  finalidades:
                </p>
                <ul className='space-y-3'>
                  <li className='flex items-start gap-3'>
                    <span className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5'>
                      1
                    </span>
                    <span>
                      <strong>Atención médica:</strong> Brindar servicios
                      odontológicos, diagnósticos, tratamientos y seguimiento de
                      tu salud bucal.
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5'>
                      2
                    </span>
                    <span>
                      <strong>Gestión de citas:</strong> Programar, confirmar y
                      recordarte tus citas médicas.
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5'>
                      3
                    </span>
                    <span>
                      <strong>Comunicación:</strong> Enviarte información sobre
                      tu tratamiento, recordatorios de citas y comunicaciones
                      importantes.
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5'>
                      4
                    </span>
                    <span>
                      <strong>Facturación:</strong> Emitir comprobantes de pago
                      y gestionar los pagos de servicios.
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5'>
                      5
                    </span>
                    <span>
                      <strong>Obligaciones legales:</strong> Cumplir con las
                      normativas de salud y fiscales vigentes en Perú.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Sección 3 */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <Lock className='h-5 w-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold text-gray-900'>
                  3. Protección y Seguridad de Datos
                </h2>
              </div>
              <div className='pl-13 space-y-4 text-gray-600'>
                <p>
                  Implementamos medidas técnicas, organizativas y legales para
                  proteger tus datos personales contra acceso no autorizado,
                  pérdida o alteración:
                </p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>Cifrado de datos en tránsito y en reposo</li>
                  <li>Acceso restringido solo a personal autorizado</li>
                  <li>Sistemas de respaldo y recuperación de información</li>
                  <li>Capacitación al personal sobre protección de datos</li>
                  <li>Auditorías periódicas de seguridad</li>
                </ul>
              </div>
            </section>

            {/* Sección 4 */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <Shield className='h-5 w-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold text-gray-900'>
                  4. Derechos del Titular de Datos
                </h2>
              </div>
              <div className='pl-13 space-y-4 text-gray-600'>
                <p>
                  De acuerdo con la Ley N° 29733, tienes los siguientes derechos
                  sobre tus datos personales:
                </p>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div className='bg-gray-50 rounded-xl p-4'>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Derecho de Acceso
                    </h3>
                    <p className='text-sm'>
                      Conocer qué datos personales tenemos sobre ti y cómo los
                      utilizamos.
                    </p>
                  </div>
                  <div className='bg-gray-50 rounded-xl p-4'>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Derecho de Rectificación
                    </h3>
                    <p className='text-sm'>
                      Solicitar la corrección de datos inexactos o incompletos.
                    </p>
                  </div>
                  <div className='bg-gray-50 rounded-xl p-4'>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Derecho de Cancelación
                    </h3>
                    <p className='text-sm'>
                      Solicitar la eliminación de tus datos cuando ya no sean
                      necesarios.
                    </p>
                  </div>
                  <div className='bg-gray-50 rounded-xl p-4'>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Derecho de Oposición
                    </h3>
                    <p className='text-sm'>
                      Oponerte al tratamiento de tus datos para fines
                      específicos.
                    </p>
                  </div>
                </div>
                <p className='text-sm bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
                  <strong>Importante:</strong> Según la normativa sanitaria
                  peruana, estamos obligados a conservar tu historia clínica por
                  un período mínimo de 15 años, por lo que el derecho de
                  cancelación no aplica a estos registros durante dicho período.
                </p>
              </div>
            </section>

            {/* Sección 5 */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <FileText className='h-5 w-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold text-gray-900'>
                  5. Conservación de Datos
                </h2>
              </div>
              <div className='pl-13 space-y-4 text-gray-600'>
                <p>
                  Conservamos tus datos personales durante el tiempo necesario
                  para cumplir con las finalidades para las que fueron
                  recopilados:
                </p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>
                    <strong>Historia clínica:</strong> 15 años desde la última
                    atención (según normativa del MINSA)
                  </li>
                  <li>
                    <strong>Datos de facturación:</strong> 5 años (según
                    normativa tributaria de SUNAT)
                  </li>
                  <li>
                    <strong>Datos de contacto para comunicaciones:</strong>{" "}
                    Hasta que solicites su eliminación
                  </li>
                </ul>
              </div>
            </section>

            {/* Sección 6 */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <Eye className='h-5 w-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold text-gray-900'>
                  6. Cookies y Tecnologías de Seguimiento
                </h2>
              </div>
              <div className='pl-13 space-y-4 text-gray-600'>
                <p>
                  Nuestro sitio web utiliza cookies y tecnologías similares para
                  mejorar tu experiencia:
                </p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>
                    <strong>Cookies esenciales:</strong> Necesarias para el
                    funcionamiento del sitio
                  </li>
                  <li>
                    <strong>Cookies de análisis:</strong> Para entender cómo
                    usas nuestro sitio y mejorarlo
                  </li>
                </ul>
                <p>
                  Puedes configurar tu navegador para rechazar cookies, aunque
                  esto podría afectar algunas funcionalidades del sitio.
                </p>
              </div>
            </section>

            {/* Sección 7 - Contacto */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <Mail className='h-5 w-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold text-gray-900'>
                  7. Contacto para Ejercer tus Derechos
                </h2>
              </div>
              <div className='pl-13 space-y-4 text-gray-600'>
                <p>
                  Para ejercer tus derechos o realizar consultas sobre el
                  tratamiento de tus datos personales, puedes contactarnos a
                  través de:
                </p>
                <div className='bg-blue-50 rounded-xl p-6 space-y-4'>
                  <div className='flex items-center gap-3'>
                    <Mail className='h-5 w-5 text-blue-600' />
                    <span>
                      <strong>Correo:</strong> d.c.com@hotmail.com
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Phone className='h-5 w-5 text-blue-600' />
                    <span>
                      <strong>Teléfono:</strong> +51 952 864 972
                    </span>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Shield className='h-5 w-5 text-blue-600 mt-0.5' />
                    <span>
                      <strong>Dirección:</strong> Calle Zela 716, Tacna, Perú
                    </span>
                  </div>
                </div>
                <p className='text-sm text-gray-500'>
                  Responderemos a tu solicitud en un plazo máximo de 20 días
                  hábiles, conforme a lo establecido en la Ley N° 29733.
                </p>
              </div>
            </section>

            {/* Sección 8 */}
            <section>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <FileText className='h-5 w-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-bold text-gray-900'>
                  8. Modificaciones a esta Política
                </h2>
              </div>
              <div className='pl-13 space-y-4 text-gray-600'>
                <p>
                  Nos reservamos el derecho de actualizar esta Política de
                  Privacidad en cualquier momento. Cualquier cambio será
                  publicado en esta página con la fecha de la última
                  actualización. Te recomendamos revisar periódicamente esta
                  política.
                </p>
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className='text-center mt-10'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors'
            >
              <ArrowLeft className='h-5 w-5' />
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-gray-900 text-gray-400 py-8'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm'>
              © {new Date().getFullYear()} Dental Company. Todos los derechos
              reservados.
            </p>
            <div className='flex items-center gap-6'>
              <Link
                href='/nosotros'
                className='text-gray-400 hover:text-white text-sm transition-colors'
              >
                Nosotros
              </Link>
              <Link
                href='/#contacto'
                className='text-gray-400 hover:text-white text-sm transition-colors'
              >
                Contacto
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

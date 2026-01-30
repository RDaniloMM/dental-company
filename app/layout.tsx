import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dental Company - Tu Sonrisa es nuestra sonrisa.",
  metadataBase: new URL(defaultUrl),
  description:
    "Centro odontológico en Tacna con tecnología avanzada. Implantes, ortodoncia, periodoncia y más. Más de 10 años de experiencia.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dental Company - Tu Sonrisa es nuestra sonrisa.",
    description:
      "Centro odontológico en Tacna con tecnología avanzada. Implantes, ortodoncia, periodoncia y más.",
    url: defaultUrl,
    siteName: "Dental Company",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dental Company - Centro Odontológico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dental Company - Tu Sonrisa es nuestra sonrisa.",
    description: "Centro odontológico en Tacna con tecnología avanzada.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='es'
      suppressHydrationWarning
    >
      <head>
        {/* Schema.org JSON-LD para E-E-A-T */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dentist",
              "@id": "https://dental-company-tacna.com/#organization",
              name: "Dental Company",
              description:
                "Centro odontológico en Tacna con tecnología avanzada. Implantes, ortodoncia, periodoncia y más.",
              url: "https://dental-company-tacna.com",
              logo: {
                "@type": "ImageObject",
                url: "https://dental-company-tacna.com/logo.png",
                width: 200,
                height: 60,
              },
              image: {
                "@type": "ImageObject",
                url: "https://dental-company-tacna.com/og-image.png",
                width: 1200,
                height: 630,
              },
              telephone: "+51-952-864-972",
              email: "d.c.com@hotmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Calle Zela 716",
                addressLocality: "Tacna",
                addressRegion: "Tacna",
                postalCode: "23001",
                addressCountry: "PE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -18.0146,
                longitude: -70.2536,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "09:00",
                  closes: "13:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "15:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "13:00",
                },
              ],
              priceRange: "$$",
              medicalSpecialty: [
                "Periodontics",
                "Orthodontics",
                "Dental Implants",
                "Oral Surgery",
              ],
              employee: [
                {
                  "@type": "Dentist",
                  "@id": "https://dental-company-tacna.com/#ulises-penaloza",
                  name: "Dr. Ulises Peñaloza",
                  jobTitle: "Periodoncista e Implantólogo",
                  description:
                    "Especialista en periodoncia e implantología con 17 años de experiencia. Doctor en Odontología, Investigador Renacyt.",
                  worksFor: {
                    "@id": "https://dental-company-tacna.com/#organization",
                  },
                  knowsAbout: [
                    "Implantes dentales",
                    "Regeneración ósea guiada",
                    "Periodoncia",
                    "Prótesis sobre implantes",
                  ],
                  hasCredential: [
                    {
                      "@type": "EducationalOccupationalCredential",
                      credentialCategory: "degree",
                      name: "Doctorado en Odontología",
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      credentialCategory: "degree",
                      name: "Maestría en Odontología con mención en patología",
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      credentialCategory: "certification",
                      name: "Segunda Especialidad en Periodoncia e Implantología",
                    },
                  ],
                  memberOf: {
                    "@type": "Organization",
                    name: "Asociación Peruana de Periodoncia y Osteointegración",
                  },
                },
                {
                  "@type": "Dentist",
                  "@id": "https://dental-company-tacna.com/#gabriela-condori",
                  name: "Dra. Gabriela Condori",
                  jobTitle: "Ortodoncista",
                  description:
                    "Especialista en ortodoncia con 10 años de experiencia. Más de 100 casos tratados exitosamente.",
                  worksFor: {
                    "@id": "https://dental-company-tacna.com/#organization",
                  },
                  knowsAbout: [
                    "Ortodoncia",
                    "Brackets estéticos",
                    "Ortopedia maxilar",
                    "Ortodoncia interceptiva",
                  ],
                  hasCredential: [
                    {
                      "@type": "EducationalOccupationalCredential",
                      credentialCategory: "degree",
                      name: "Maestría en Investigación e innovación científica",
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      credentialCategory: "certification",
                      name: "Segunda Especialidad en Ortodoncia y Ortopedia Maxilar",
                    },
                  ],
                },
                {
                  "@type": "Dentist",
                  "@id": "https://dental-company-tacna.com/#paola-penaloza",
                  name: "Dra. Paola Peñaloza",
                  jobTitle:
                    "Odontóloga General y Especialista en Salud Pública",
                  description:
                    "17 años de experiencia en odontología general y salud pública bucal.",
                  worksFor: {
                    "@id": "https://dental-company-tacna.com/#organization",
                  },
                  knowsAbout: [
                    "Odontología general",
                    "Salud pública bucal",
                    "Epidemiología dental",
                    "Prevención dental",
                  ],
                  hasCredential: [
                    {
                      "@type": "EducationalOccupationalCredential",
                      credentialCategory: "degree",
                      name: "Maestría en Odontología con mención en patología",
                    },
                    {
                      "@type": "EducationalOccupationalCredential",
                      credentialCategory: "certification",
                      name: "Diplomado en Políticas Públicas para el Acceso Universal a Salud Oral",
                    },
                  ],
                },
              ],
              sameAs: ["https://www.facebook.com/dentalcompanytacna"],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            richColors
            position='top-right'
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

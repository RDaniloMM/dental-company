/* import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
 */

// app/(public)/layout.tsx

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css"; // Asegúrate que la ruta a tus estilos globales sea correcta

// Configuración de la fuente
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dental Company - Tu Sonrisa, Nuestra Pasión",
  description:
    "Clínica odontológica líder en Tacna. Ofrecemos servicios de ortodoncia, implantes, estética dental y más.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={poppins.className}>
        {/* El Header y Footer se colocarán directamente en la page.tsx 
            para este ejemplo, pero podrían ir aquí si fueran compartidos 
            por MÁS páginas públicas (ej. /nosotros, /servicios). */}
        {children}
      </body>
    </html>
  );
}

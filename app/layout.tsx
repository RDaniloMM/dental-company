import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
    "Centro odontológico integral de última generación que combina excelencia clínica, tecnología avanzada y calidez humana. Nos dedicamos a proporcionar tratamientos dentales de la más alta calidad con un enfoque preventivo, personalizado y multidisciplinario.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
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


// app/(public)/layout.tsx
/* 
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Configuración de la fuente
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
 */
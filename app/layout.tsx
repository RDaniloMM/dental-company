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

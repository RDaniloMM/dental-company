// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";

// import { ToasterClient } from "@/components/ui/toasteClient"; // 👈 Importa el wrapper cliente

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
// import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {/* <DynamicBreadcrumb /> */}

          <div className="flex items-center gap-4 ml-auto">
            {/* {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />} */}
            <ThemeSwitcher />
          </div>
        </header>
        <main className="min-h-[88vh] flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-5">
            <div className="flex-1 flex flex-col gap-20 p-4 w-full">
              {children}
            </div>
          </div>
        </main>
        <footer className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark: bg-transparent">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-2">
            <span className="text-sm text-gray-500">
              © 2025 Glorious. Todos los derechos reservados.
            </span>
            {/* <div className="flex gap-4 text-sm text-gray-500">
              <a
                href="/privacy"
                className="hover:text-gray-700 transition-colors"
              >
                Privacidad
              </a>
              <a
                href="/terms"
                className="hover:text-gray-700 transition-colors"
              >
                Términos
              </a>
              <a href="/help" className="hover:text-gray-700 transition-colors">
                Ayuda
              </a>
            </div> */}
          </div>
        </footer>
        {/* <ToasterClient /> */}
      </SidebarInset>
    </SidebarProvider>
  );
}

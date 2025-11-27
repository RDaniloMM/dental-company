"use client";

import * as React from "react";
import {
  Home,
  Users,
  Settings,
  GalleryVerticalEnd,
  LayoutDashboard,
  Bot,
  CalendarDays,
  Stethoscope,
  BarChart3,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const teams = [
  {
    name: "Clínica Dental",
    logo: GalleryVerticalEnd,
    plan: "Dental Company",
  },
];

const navMain = [
  {
    title: "Inicio",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Pacientes",
    url: "/admin/pacientes",
    icon: Users,
    items: [
      { title: "Lista de Pacientes", url: "/admin/pacientes" },
      { title: "Buscar Paciente", url: "/admin/dashboard" },
    ],
  },
  {
    title: "Citas",
    url: "/admin/citas",
    icon: CalendarDays,
    items: [{ title: "Calendario", url: "/admin/citas" }],
  },
  {
    title: "Tratamientos",
    url: "/admin/tratamientos",
    icon: Stethoscope,
    items: [{ title: "Procedimientos", url: "/admin/tratamientos" }],
  },
  {
    title: "Reportes",
    url: "/admin/reportes",
    icon: BarChart3,
    items: [{ title: "Reportes de Pacientes", url: "/admin/reportes" }],
  },
  {
    title: "Gestor CMS",
    url: "/admin/cms",
    icon: LayoutDashboard,
    items: [{ title: "Contenido Web", url: "/admin/cms" }],
  },
  {
    title: "Chatbot",
    url: "/admin/chatbot",
    icon: Bot,
    items: [{ title: "FAQs y Contexto", url: "/admin/chatbot" }],
  },
  {
    title: "Configuración",
    url: "/admin/ajustes",
    icon: Settings,
    items: [{ title: "Ajustes", url: "/admin/ajustes" }],
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "Usuario",
    email: "",
    avatar: "",
  });
  const { toggleSidebar, isMobile } = useSidebar();

  React.useEffect(() => {
    setMounted(true);

    // Obtener usuario real de Supabase
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          name:
            authUser.user_metadata?.full_name ||
            authUser.email?.split("@")[0] ||
            "Usuario",
          email: authUser.email || "",
          avatar: authUser.user_metadata?.avatar_url || "",
        });
      }
    };

    fetchUser();
  }, []);

  if (!mounted) {
    return null;
  }

  // Cierra sidebar solo si estamos en móvil
  const handleNavClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={navMain}
          onItemClick={handleNavClick}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

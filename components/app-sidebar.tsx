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

const data = {
  user: {
    name: "Administrador",
    email: "admin@gmail.com",
    avatar: "",
  },
  teams: [
    {
      name: "Clínica Dental",
      logo: GalleryVerticalEnd,
      plan: "Premium",
    },
  ],
  navMain: [
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
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  const { toggleSidebar } = useSidebar(); // 👈 usamos el hook del sidebar

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  // 👇 función: cierra sidebar solo si estamos en móvil
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        {/* pasamos handleNavClick a NavMain */}
        <NavMain
          items={data.navMain}
          onItemClick={handleNavClick}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

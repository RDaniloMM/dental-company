"use client";

import * as React from "react";
import {
  Home,
  Users,
  Calendar,
  ClipboardList,
  // Album,
  Settings,
  // FileText,
  BarChart3,
  // UserCog,
  GalleryVerticalEnd,
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
  useSidebar, // 👈 importante
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
      url: "/pacientes",
      icon: Users,
      items: [
        { title: "Lista de pacientes", url: "/pacientes/lista" },
        { title: "Registrar paciente", url: "/pacientes/nuevo" },
        // { title: "Historial clínico", url: "/pacientes/historial" },
      ],
    },
    {
      title: "Citas",
      url: "/citas",
      icon: Calendar,
      items: [
        { title: "Calendario", url: "/citas/calendario" },
        // { title: "Agendar cita", url: "/citas/nueva" },
        { title: "Citas pasadas", url: "/citas/historial" },
      ],
    },
    // {
    //   title: "Odontograma",
    //   url: "/odontograma",
    //   icon: Album,
    //   items: [
    //     { title: "Odontograma actual", url: "/odontograma/actual" },
    //     { title: "Historial de tratamientos", url: "/odontograma/historial" },
    //   ],
    // },
    {
      title: "Tratamientos",
      url: "/tratamientos",
      icon: ClipboardList,
      items: [
        { title: "Lista de tratamientos", url: "/tratamientos/lista" },
        // { title: "Nuevo tratamiento", url: "/tratamientos/nuevo" },
      ],
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: BarChart3,
      items: [
        { title: "Financieros", url: "/reportes/financieros" },
        // { title: "Pacientes atendidos", url: "/reportes/pacientes" },
      ],
    },
    {
      title: "Configuración",
      url: "/configuracion",
      icon: Settings,
      items: [
        { title: "Usuarios y roles", url: "/configuracion/usuarios" },
        { title: "Perfil del doctor", url: "/configuracion/perfil" },
      ],
    },
    // {
    //   title: "Administración",
    //   url: "/admin",
    //   icon: UserCog,
    //   items: [
    //     { title: "Gestión de personal", url: "/admin/personal" },
    //     { title: "Logs del sistema", url: "/admin/logs" },
    //   ],
    // },
    // {
    //   title: "Documentos",
    //   url: "/documentos",
    //   icon: FileText,
    //   items: [
    //     {
    //       title: "Consentimientos informados",
    //       url: "/documentos/consentimientos",
    //     },
    //     { title: "Recetas y certificados", url: "/documentos/recetas" },
    //   ],
    // },
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

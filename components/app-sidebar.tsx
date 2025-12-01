"use client";

import * as React from "react";
import {
  Home,
  Settings,
  GalleryVerticalEnd,
  LayoutDashboard,
  Bot,
  CalendarDays,
  Stethoscope,
  BarChart3,
  FolderOpen,
  UserCog,
  HelpCircle,
  Bell,
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

// Navegación base (para todos los usuarios)
const navBase = [
  {
    title: "Inicio",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Historias Clínicas",
    url: "/admin/pacientes",
    icon: FolderOpen,
  },
  {
    title: "Citas",
    url: "/admin/citas",
    icon: CalendarDays,
  },
  {
    title: "Tratamientos",
    url: "/admin/tratamientos",
    icon: Stethoscope,
  },
  {
    title: "Reportes",
    url: "/admin/reportes",
    icon: BarChart3,
  },
  {
    title: "Notificaciones",
    url: "/admin/notificaciones",
    icon: Bell,
  },
];

// Navegación al final (Mi Cuenta y Ayuda)
const navFooter = [
  {
    title: "Mi Cuenta",
    url: "/admin/ajustes",
    icon: Settings,
  },
  {
    title: "Ayuda",
    url: "/admin/ayuda",
    icon: HelpCircle,
  },
];

// Navegación solo para administradores
const navAdmin = [
  {
    title: "Personal de la Clínica",
    url: "/admin/personal",
    icon: UserCog,
  },
  {
    title: "Gestor CMS",
    url: "/admin/cms",
    icon: LayoutDashboard,
  },
  {
    title: "Chatbot",
    url: "/admin/chatbot",
    icon: Bot,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "Usuario",
    email: "",
    avatar: "",
  });
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const { toggleSidebar, isMobile } = useSidebar();

  React.useEffect(() => {
    setMounted(true);

    // Obtener usuario real de Supabase y su rol
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

        // Obtener rol del usuario desde la tabla personal
        const { data: personalData } = await supabase
          .from("personal")
          .select("rol")
          .eq("id", authUser.id)
          .single();

        if (personalData) {
          setUserRole(personalData.rol);
        }
      }
    };

    fetchUser();
  }, []);

  // Construir navegación basada en el rol
  const navMain = React.useMemo(() => {
    const isAdmin = userRole === "Admin" || userRole === "Administrador";
    const adminItems = isAdmin ? navAdmin : [];
    return [...navBase, ...adminItems, ...navFooter];
  }, [userRole]);

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

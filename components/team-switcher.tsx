"use client";

import * as React from "react";
import Image from "next/image";
// import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  // DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { state } = useSidebar();
  const [activeTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  const isExpanded = state === "expanded";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              {isExpanded ? (
                <div className='flex items-center gap-2'>
                  <Image
                    src='/logo.png'
                    alt='Dental Company'
                    width={90}
                    height={26}
                    className='object-contain'
                    priority
                  />
                </div>
              ) : (
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <activeTeam.logo className='size-4' />
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

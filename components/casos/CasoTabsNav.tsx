"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type CasoTabsNavProps = {
  numeroHistoria: string;
  casoId: string;
};

export default function CasoTabsNav({
  numeroHistoria,
  casoId,
}: CasoTabsNavProps) {
  const pathname = usePathname();

  const navTabs = [
    { href: "diagnostico", label: "Diagnóstico" },
    { href: "presupuesto", label: "Presupuesto" },
    { href: "citas", label: "Citas / Evolución" },
    { href: "imagenes", label: "Imágenes del caso" },
    { href: "consentimientos", label: "Consentimientos" },
    { href: "recetas", label: "Recetas" },
  ];

  return (
    <nav className="flex space-x-4 border-b mb-6">
      {navTabs.map((tab) => (
        <Link
          key={tab.href}
          href={`/admin/ficha-odontologica/${numeroHistoria}/casos/${casoId}/${tab.href}`}
          className={`py-2 px-4 -mb-px border-b-2 text-sm font-medium ${
            pathname.includes(tab.href)
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-primary hover:border-primary"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

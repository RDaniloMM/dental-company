"use client";
import FichaSidebar from "@/components/ficha-sidebar";
import React from "react";

export default function HistoriaLayoutClient({
  children,
  patientId,
}: {
  children: React.ReactNode;
  patientId: string;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <FichaSidebar patientId={patientId} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}

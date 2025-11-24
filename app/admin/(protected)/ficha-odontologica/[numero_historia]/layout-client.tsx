"use client";
import FichaSidebar from "@/components/ficha-sidebar";
import React, { useState, useEffect } from "react";

export default function HistoriaLayoutClient({
  children,
  patientId,
}: {
  children: React.ReactNode;
  patientId: string;
}) {
  const [sidebarKey, setSidebarKey] = useState(Date.now());

  useEffect(() => {
    const handlePatientUpdate = () => {
      setSidebarKey(Date.now());
    };

    window.addEventListener("paciente-updated", handlePatientUpdate);

    return () => {
      window.removeEventListener("paciente-updated", handlePatientUpdate);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <FichaSidebar key={sidebarKey} patientId={patientId} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}

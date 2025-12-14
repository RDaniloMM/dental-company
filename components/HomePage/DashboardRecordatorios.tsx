"use client";

import dynamic from "next/dynamic";

const CitasRecordatorio = dynamic(
  () => import("@/components/citas/CitasRecordatorio"),
  { ssr: false }
);

export function DashboardRecordatorios() {
  return <CitasRecordatorio />;
}

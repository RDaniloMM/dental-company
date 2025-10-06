"use client";

import React from "react";

export default function HistoriaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}

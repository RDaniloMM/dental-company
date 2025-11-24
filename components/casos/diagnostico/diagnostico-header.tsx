'use client';

export function DiagnosticoHeader() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostico-modal'))}
      className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
    >
      + Nuevo Diagnóstico
    </button>
  );
}

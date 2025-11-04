export default function CitasPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pestaña Citas / Evolución</h2>
      <p className="text-muted-foreground mb-4">
        Implementación pendiente. Aquí se mostrarán las citas vinculadas a este caso clínico.
      </p>
      {/* CTA + Nuevo (disabled o que abra modal vacío) */}
      <button className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-not-allowed opacity-50">
        + Nueva Cita (próximamente)
      </button>
    </div>
  );
}

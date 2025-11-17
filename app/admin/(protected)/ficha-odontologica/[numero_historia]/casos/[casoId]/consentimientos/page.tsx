export default function ConsentimientosPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pestaña Consentimientos</h2>
      <p className="text-muted-foreground">
        Implementación pendiente. Aquí se gestionarán los consentimientos informados vinculados a caso_id.
      </p>
      {/* CTA + Nuevo (disabled o que abra modal vacío) */}
      <button className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-not-allowed opacity-50">
        + Nuevo Consentimiento (próximamente)
      </button>
    </div>
  );
}

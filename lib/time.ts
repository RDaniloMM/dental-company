export const getClinicDate = () => {
    // Usamos una zona horaria fija (UTC-5) para asegurar consistencia
    // entre el servidor (Vercel UTC) y el cliente.
    // America/Bogota cubre Colombia/Perú/Ecuador (UTC-5)
    const now = new Date();
    const clinicTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
    return clinicTime;
};

// Convierte una cadena YYYY-MM-DD a un ISO anclado al mediodía en Lima (UTC-5)
// para evitar que la conversión a UTC desplace el día visualizado.
export const toPeruIsoNoon = (dateStr?: string | null) => {
    if (!dateStr || dateStr.length < 10) return undefined;
    const ymd = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    // Validación básica YYYY-MM-DD
    const m = /^\d{4}-\d{2}-\d{2}$/.exec(ymd);
    if (!m) return undefined;
    return `${ymd}T12:00:00-05:00`;
};

// Formatea de manera segura una fecha que puede venir como YYYY-MM-DD o ISO
// sin introducir desfase por zona horaria. Si es YYYY-MM-DD, retorna DD/MM/YYYY.
export const formatDateSafeDMY = (value?: string | null) => {
    if (!value) return '';
    const v = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const [y, m, d] = v.split('-');
        return `${d}/${m}/${y}`;
    }
    // Caso frecuente: ISO de medianoche UTC -> tratar como fecha suelta
    if (/^\d{4}-\d{2}-\d{2}T00:00(?::00(?:\.\d{3})?)?Z$/.test(v)) {
        const ymd = v.split('T')[0];
        const [y, m, d] = ymd.split('-');
        return `${d}/${m}/${y}`;
    }
    try {
        const d = new Date(v);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    } catch {
        return '';
    }
};

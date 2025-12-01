export const getClinicDate = () => {
    // Usamos una zona horaria fija (UTC-5) para asegurar consistencia
    // entre el servidor (Vercel UTC) y el cliente.
    // America/Bogota cubre Colombia/Perú/Ecuador (UTC-5)
    const now = new Date();
    const clinicTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
    return clinicTime;
};

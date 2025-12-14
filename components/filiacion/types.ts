export type EmergencyContact = {
  nombre: string;
  parentesco: string;
  domicilio: string;
  telefono: string;
};

export type PatientData = {
  id: string;
  apellidos: string;
  nombres: string;
  fecha_nacimiento: string;
  dni: string;
  direccion: string;
  genero: string;
  estado_civil: string;
  ocupacion: string;
  grado_instruccion: string;
  telefono: string;
  email: string;
  pais: string;
  departamento: string;
  provincia: string;
  distrito: string;
  contacto_emergencia: EmergencyContact;
  recomendado_por: string;
  observaciones: string;
};
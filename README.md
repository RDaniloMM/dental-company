# Dental Company Web App

Sistema de gestión integral para clínicas odontológicas desarrollado con tecnologías modernas.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)

## 🌐 Demo en Producción

**URL:** [https://dental-company-tacna.com](https://dental-company-tacna.com)

## 👥 Equipo de Desarrollo

- **RDaniloMM** (Danilo Moron) - Lead Developer
- **SGCOx119009** (Sergio C.) - Developer
- **GloriousEvolution1141** (Alexis) - Developer

## 🚀 Características Principales

### Sistema de Gestión de Pacientes

- Registro completo de pacientes con filiación
- Historia clínica digital
- Antecedentes patológicos estructurados
- Odontograma interactivo con múltiples versiones

### Casos Clínicos

- Creación y seguimiento de casos
- Diagnósticos y planes de tratamiento
- Presupuestos detallados con múltiples monedas
- Seguimiento de pagos y evolución

### Agenda y Citas

- Calendario interactivo (FullCalendar)
- Integración con Google Calendar
- Recordatorios automáticos vía WhatsApp

### Generación de Reportes PDF

- Ficha odontológica completa
- Presupuestos profesionales
- Exportación con odontograma incluido

### Chatbot con IA

- Asistente virtual para pacientes
- Sistema RAG para respuestas contextuales
- Integración con Google AI (Gemini)

### Landing Page Pública

- Diseño responsive profesional
- CMS para contenido editable
- SEO optimizado con Schema.org
- Política de privacidad (Ley peruana 29733)

## 🛠️ Stack Tecnológico

| Categoría  | Tecnología                             |
| ---------- | -------------------------------------- |
| Frontend   | Next.js 16, React 19, TypeScript       |
| Estilos    | Tailwind CSS 4, shadcn/ui, Radix UI    |
| Backend    | Supabase (PostgreSQL + Auth + Storage) |
| IA         | Vercel AI SDK, Google Gemini           |
| Calendario | FullCalendar, Google Calendar API      |
| PDF        | jsPDF, jspdf-autotable                 |
| Imágenes   | Cloudinary                             |
| Testing    | Playwright                             |
| Deploy     | Vercel                                 |

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/dental_company_web.git
cd dental_company_web

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

## ⚙️ Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google Calendar (opcional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests por módulo
npm run test:auth
npm run test:patients
npm run test:dental-record
npm run test:appointments
npm run test:clinical-cases

# Modo debug
npm run test:debug

# Ver reporte
npm run test:report
```

## 📁 Estructura del Proyecto

```
dental_company_web/
├── app/
│   ├── admin/           # Panel de administración
│   │   ├── (auth)/      # Rutas públicas (login)
│   │   └── (protected)/ # Rutas protegidas
│   ├── api/             # API Routes
│   ├── privacidad/      # Política de privacidad
│   └── page.tsx         # Landing page pública
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── calendar/        # Componentes de calendario
│   ├── casos/           # Casos clínicos
│   ├── odontograma/     # Odontograma interactivo
│   └── ...
├── lib/
│   ├── supabase/        # Clientes Supabase
│   ├── pdf-generator.ts # Generador de PDFs
│   └── ...
├── tests/               # Tests de Playwright
└── public/              # Assets estáticos
```

## 🔒 Seguridad

- Headers de seguridad configurados (X-Frame-Options, CSP, etc.)
- Autenticación con Supabase Auth
- Row Level Security (RLS) en base de datos
- Sanitización de inputs en generación de PDF
- Cumplimiento con Ley de Protección de Datos (Perú)

## 📊 Auditoría SEO/Seguridad

Última auditoría con [Squirrel](https://squirrelscan.com):

| Categoría     | Puntuación |
| ------------- | ---------- |
| Overall       | 86/100 (B) |
| Core SEO      | 100        |
| Accessibility | 100        |
| Security      | 80         |
| Performance   | 86         |

## 📄 Documentación Adicional

- [Manual de Usuario](MANUAL_USUARIO.md)
- [Diagramas UML](DIAGRAMAS_UML.md)
- [Plan de Testing](test-plan-dental-company.md)
- [SQL Schema](SQL_SUPABASE.sql)

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y su uso está restringido a Dental Company Tacna.

---

## Módulo de Casos Clínicos

Este módulo permite a los odontólogos registrar, consultar y dar seguimiento a los tratamientos de los pacientes de forma centralizada.

**Estructura de Rutas:**

- **Listado de Casos Clínicos:** `/admin/ficha-odontologica/[numero_historia]/casos`
  - Muestra una tabla con todos los casos clínicos de un paciente, con opciones de búsqueda, filtrado y paginación.
  - Permite crear nuevos casos y editar/cerrar/eliminar casos existentes (soft-delete).
- **Detalle de Caso Clínico:** `/admin/ficha-odontologica/[numero_historia]/casos/[casoId]`
  - Muestra un encabezado con la información principal del caso.
  - Incluye pestañas de navegación para diferentes aspectos del caso:
    - `diagnostico`: Para registrar y consultar diagnósticos.
    - `presupuesto`: Para gestionar presupuestos.
    - `citas`: Para ver citas y evolución (reutiliza `VistaCalendario`).
    - `imagenes`: Para gestionar imágenes del caso (reutiliza `ImageManager`).
    - `consentimientos`: Para gestionar consentimientos.
    - `recetas`: Para gestionar recetas.

**Endpoints de API (Supabase):**

- **`casos_clinicos`**: Tabla principal para almacenar la información de los casos.
  - `id`: UUID (PK)
  - `historia_id`: UUID (FK a `historias_clinicas`)
  - `nombre_caso`: TEXT
  - `diagnostico_preliminar`: TEXT
  - `descripcion`: TEXT
  - `fecha_inicio`: TIMESTAMP WITH TIME ZONE
  - `fecha_cierre`: TIMESTAMP WITH TIME ZONE
  - `estado`: ENUM ('Abierto', 'En progreso', 'Cerrado')
  - `deleted_at`: TIMESTAMP WITH TIME ZONE (para soft-delete)

**Recomendaciones de Base de Datos (SQL):**

Para optimizar las búsquedas y el rendimiento, se recomienda añadir los siguientes índices:

```sql
-- agregar índice por historia_id y estado para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_casos_historia_estado ON public.casos_clinicos(historia_id, estado);

-- (opcional) soft-delete: la columna ya está definida, este es un recordatorio si se necesita añadirla
ALTER TABLE public.casos_clinicos ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
```

- **`citas`**: Se ha añadido `caso_id` como FK opcional para vincular citas a casos.
- **`imagenes_pacientes`**: Se ha añadido `caso_id` como FK opcional para vincular imágenes a casos.

**Reutilización de Componentes:**

- **`components/calendar/VistaCalendario.tsx`**: Adaptado para aceptar `casoId` y filtrar citas.
- **`components/imagenes/ImageManager.tsx`**: Adaptado para aceptar `casoId` y gestionar imágenes vinculadas al caso.
- **`components/casos/CasoFormModal.tsx`**: Modal genérico para crear y editar casos.

**Instalación de Dependencias Adicionales:**

- `npm install @radix-ui/react-toast class-variance-authority`
- `npm install lucide-react` (si no está ya instalado)

**Tests Manuales Sugeridos:**

1.  Navegar a la ficha de un paciente y verificar la nueva pestaña "Casos Clínicos".
2.  En la vista de listado de casos:
    - Crear un nuevo caso y verificar que aparece en la tabla.
    - Editar un caso existente y verificar que los cambios se reflejan.
    - Cerrar un caso y verificar que el estado y la fecha de cierre se actualizan.
    - Eliminar un caso (soft-delete) y verificar que desaparece del listado.
    - Probar la búsqueda por nombre/diagnóstico y el filtro por estado.
    - Verificar la paginación.
3.  En la vista detallada de un caso:
    - Hacer clic en "Ver" desde el listado y verificar que se carga el detalle del caso.
    - Verificar que el encabezado muestra la información correcta del caso.
    - Navegar entre las pestañas ("Diagnóstico", "Presupuesto", "Citas / Evolución", "Imágenes del caso", "Consentimientos", "Recetas") y verificar que los placeholders se muestran correctamente.
    - Verificar que los botones "Editar Caso" y "Cerrar Caso" funcionan desde la vista detallada.
    - En la pestaña "Citas / Evolución", verificar que `VistaCalendario` recibe `pacienteId` y `casoId`.
    - En la pestaña "Imágenes del caso", verificar que `ImageManager` recibe `pacienteId` y `casoId`, y que se pueden subir imágenes vinculadas al caso.

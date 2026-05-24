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
| Imágenes   | ImageKit                               |
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

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
BIRTHDAY_EMAIL_IMAGE_URL=

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
│   ├── nosotros/        # Página "Sobre Nosotros" (E-E-A-T)
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

Última auditoría con [Squirrel](https://squirrelscan.com) (30 Enero 2026):

| Categoría            | Puntuación     |
| -------------------- | -------------- |
| Overall              | **67/100 (D)** |
| Accessibility        | 100% ✅        |
| Core SEO             | 100% ✅        |
| Internationalization | 100% ✅        |
| Links                | 100% ✅        |
| Mobile               | 100% ✅        |
| URL Structure        | 100% ✅        |
| Content              | 95%            |
| Images               | 95%            |
| Social Media         | 93%            |
| Security             | 89%            |
| Crawlability         | 86%            |
| Performance          | 80%            |
| Legal Compliance     | 80%            |
| E-E-A-T              | 63%            |
| Structured Data      | 0%             |

**Páginas auditadas:** 3 (/, /nosotros, /privacidad)  
**Resultado:** 195 passed, 19 warnings, 5 errors

## 📄 Documentación Adicional

- [Manual de Usuario](MANUAL_USUARIO.md)
- [Diagramas UML](DIAGRAMAS_UML.md)
- [Plan de Testing](test-plan-dental-company.md)

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

- **`citas`**: Se ha añadido `caso_id` como FK opcional para vincular citas a casos.
- **`imagenes_pacientes`**: Se ha añadido `caso_id` como FK opcional para vincular imágenes a casos.

**Reutilización de Componentes:**

- **`components/calendar/VistaCalendario.tsx`**: Adaptado para aceptar `casoId` y filtrar citas.
- **`components/imagenes/ImageManager.tsx`**: Adaptado para aceptar `casoId` y gestionar imágenes vinculadas al caso.
- **`components/casos/CasoFormModal.tsx`**: Modal genérico para crear y editar casos.

**Instalación de Dependencias Adicionales:**

- `npm install @radix-ui/react-toast class-variance-authority`
- `npm install lucide-react` (si no está ya instalado)

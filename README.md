## Dental company Web App
Hecho con Next.js, React.js, Supabase, Tailwind CSS y demás librerías.
Elaborado por RDaniloMM (Danilo Moron), SGCOx119009 (Sergio C.) y GloriousEvolution1141 (Alexis )

### Módulo de Casos Clínicos

Este módulo permite a los odontólogos registrar, consultar y dar seguimiento a los tratamientos de los pacientes de forma centralizada.

**Estructura de Rutas:**

*   **Listado de Casos Clínicos:** `/admin/ficha-odontologica/[numero_historia]/casos`
    *   Muestra una tabla con todos los casos clínicos de un paciente, con opciones de búsqueda, filtrado y paginación.
    *   Permite crear nuevos casos y editar/cerrar/eliminar casos existentes (soft-delete).
*   **Detalle de Caso Clínico:** `/admin/ficha-odontologica/[numero_historia]/casos/[casoId]`
    *   Muestra un encabezado con la información principal del caso.
    *   Incluye pestañas de navegación para diferentes aspectos del caso:
        *   `diagnostico`: Para registrar y consultar diagnósticos.
        *   `presupuesto`: Para gestionar presupuestos.
        *   `citas`: Para ver citas y evolución (reutiliza `VistaCalendario`).
        *   `imagenes`: Para gestionar imágenes del caso (reutiliza `ImageManager`).
        *   `consentimientos`: Para gestionar consentimientos.
        *   `recetas`: Para gestionar recetas.

**Endpoints de API (Supabase):**

*   **`casos_clinicos`**: Tabla principal para almacenar la información de los casos.
    *   `id`: UUID (PK)
    *   `historia_id`: UUID (FK a `historias_clinicas`)
    *   `nombre_caso`: TEXT
    *   `diagnostico_preliminar`: TEXT
    *   `descripcion`: TEXT
    *   `fecha_inicio`: TIMESTAMP WITH TIME ZONE
    *   `fecha_cierre`: TIMESTAMP WITH TIME ZONE
    *   `estado`: ENUM ('Abierto', 'En progreso', 'Cerrado')
    *   `deleted_at`: TIMESTAMP WITH TIME ZONE (para soft-delete)

**Recomendaciones de Base de Datos (SQL):**

Para optimizar las búsquedas y el rendimiento, se recomienda añadir los siguientes índices:

```sql
-- agregar índice por historia_id y estado para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_casos_historia_estado ON public.casos_clinicos(historia_id, estado);

-- (opcional) soft-delete: la columna ya está definida, este es un recordatorio si se necesita añadirla
ALTER TABLE public.casos_clinicos ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
```

*   **`citas`**: Se ha añadido `caso_id` como FK opcional para vincular citas a casos.
*   **`imagenes_pacientes`**: Se ha añadido `caso_id` como FK opcional para vincular imágenes a casos.

**Reutilización de Componentes:**

*   **`components/calendar/VistaCalendario.tsx`**: Adaptado para aceptar `casoId` y filtrar citas.
*   **`components/imagenes/ImageManager.tsx`**: Adaptado para aceptar `casoId` y gestionar imágenes vinculadas al caso.
*   **`components/casos/CasoFormModal.tsx`**: Modal genérico para crear y editar casos.

**Instalación de Dependencias Adicionales:**

*   `npm install @radix-ui/react-toast class-variance-authority`
*   `npm install lucide-react` (si no está ya instalado)

**Tests Manuales Sugeridos:**

1.  Navegar a la ficha de un paciente y verificar la nueva pestaña "Casos Clínicos".
2.  En la vista de listado de casos:
    *   Crear un nuevo caso y verificar que aparece en la tabla.
    *   Editar un caso existente y verificar que los cambios se reflejan.
    *   Cerrar un caso y verificar que el estado y la fecha de cierre se actualizan.
    *   Eliminar un caso (soft-delete) y verificar que desaparece del listado.
    *   Probar la búsqueda por nombre/diagnóstico y el filtro por estado.
    *   Verificar la paginación.
3.  En la vista detallada de un caso:
    *   Hacer clic en "Ver" desde el listado y verificar que se carga el detalle del caso.
    *   Verificar que el encabezado muestra la información correcta del caso.
    *   Navegar entre las pestañas ("Diagnóstico", "Presupuesto", "Citas / Evolución", "Imágenes del caso", "Consentimientos", "Recetas") y verificar que los placeholders se muestran correctamente.
    *   Verificar que los botones "Editar Caso" y "Cerrar Caso" funcionan desde la vista detallada.
    *   En la pestaña "Citas / Evolución", verificar que `VistaCalendario` recibe `pacienteId` y `casoId`.
    *   En la pestaña "Imágenes del caso", verificar que `ImageManager` recibe `pacienteId` y `casoId`, y que se pueden subir imágenes vinculadas al caso.

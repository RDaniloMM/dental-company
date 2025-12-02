# 📊 Diagramas UML - Sistema Dental Company Web (Mermaid)

Este documento contiene los diagramas UML enfocados en los módulos de Landing Page, Administración de Usuarios, Gestión de Contenidos (CMS), Chatbot y Autenticación.
Los diagramas están escritos en sintaxis Mermaid y pueden visualizarse directamente en GitHub, VS Code o cualquier visor compatible.

---

## 📑 Índice

1. [Diagrama de Casos de Uso](#1-diagrama-de-casos-de-uso)
2. [Diagrama de Clases](#2-diagrama-de-clases)
3. [Diagramas de Secuencia](#3-diagramas-de-secuencia)
4. [Modelo Relacional de Base de Datos](#4-modelo-relacional-de-base-de-datos)
5. [Diagrama de Despliegue](#5-diagrama-de-despliegue)

---

## 1. Diagrama de Casos de Uso

### 1.1 Casos de Uso: Administración y Landing Page

```mermaid
flowchart LR
    subgraph Actores
        Admin[👤 Administrador]
        Odontologo[👤 Odontólogo]
        Visitante[👤 Visitante Web]
    end

    subgraph Sistema["Sistema Dental Company Web"]
        subgraph Auth["🔐 Autenticación y Cuenta"]
            UC1[Iniciar Sesión]
            UC2[Registrarse con Invitación]
            UC3[Recuperar Contraseña]
            UC4[Configurar Cuenta]
            UC5[Gestionar Email Recuperación]
        end

        subgraph Dashboard["📊 Dashboard y Métricas"]
            UC6[Ver Dashboard Principal]
            UC7[Visualizar KPIs]
        end

        subgraph AdminUsers["👥 Administración de Usuarios"]
            UC8[Listar Usuarios]
            UC9[Crear/Invitar Usuario]
            UC10[Desactivar Usuario]
            UC11[Asignar Roles]
        end

        subgraph CMS["🌐 Gestión de Contenidos CMS"]
            UC12[Editar Información Clínica]
            UC13[Gestionar Servicios]
            UC14[Gestionar Equipo Médico]
            UC15[Personalizar Tema Visual]
        end

        subgraph Chatbot["🤖 Chatbot IA"]
            UC16[Consultar Chatbot]
            UC17[Configurar FAQs]
            UC18[Configurar Contexto]
            UC19[Sincronizar Base de Conocimiento]
        end

        subgraph Landing["🏠 Landing Page Pública"]
            UC20[Ver Servicios]
            UC21[Ver Equipo]
            UC22[Ver Información Contacto]
        end
    end

    %% Relaciones Visitante
    Visitante --> UC16
    Visitante --> UC20
    Visitante --> UC21
    Visitante --> UC22

    %% Relaciones Odontólogo
    Odontologo --> UC1
    Odontologo --> UC2
    Odontologo --> UC3
    Odontologo --> UC4
    Odontologo --> UC6

    %% Relaciones Admin
    Admin --> UC1
    Admin --> UC6
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19

    %% Inclusiones
    UC4 -.->|include| UC5
    UC6 -.->|include| UC7
```

---

## 2. Diagrama de Clases

### 2.1 Clases de Autenticación, CMS y Chatbot

```mermaid
classDiagram
    direction TB

    %% ========================================
    %% SECCIÓN 1: AUTENTICACIÓN Y USUARIOS
    %% ========================================
    class Personal {
        +UUID id
        +Text nombre_completo
        +UserDefined rol
        +Text especialidad
        +Text telefono
        +Text email
        +Boolean activo
        +Timestamp created_at
        +actualizarPerfil() void
    }

    class CodigoInvitacion {
        +UUID id
        +Text codigo
        +UUID creado_por
        +UUID usado_por
        +Text rol_asignado
        +Integer usos_maximos
        +Integer usos_actuales
        +Boolean activo
        +Timestamp expira_at
        +Timestamp created_at
        +Timestamp used_at
        +generar() void
        +validar() Boolean
    }

    %% ========================================
    %% SECCIÓN 2: CONFIGURACIÓN DEL SISTEMA
    %% ========================================
    class ConfigSeguridad {
        +UUID id
        +Text clave
        +Text valor
        +Text descripcion
        +Timestamp updated_at
        +actualizar() void
    }

    class AjustesAplicacion {
        +UUID id
        +Text clave
        +Text valor
        +Text grupo
        +UserDefined tipo
        +Text descripcion
        +Integer orden
        +Text resend_api_key
        +Timestamp updated_at
        +Timestamp created_at
        +actualizar() void
    }

    %% ========================================
    %% SECCIÓN 3: CMS (GESTIÓN DE CONTENIDOS)
    %% ========================================
    class CMSSeccion {
        +UUID id
        +Text seccion
        +Text titulo
        +Text subtitulo
        +JSONB contenido
        +Integer orden
        +Boolean visible
        +Timestamp updated_at
        +UUID updated_by
        +actualizar() void
    }

    class CMSServicio {
        +UUID id
        +Text nombre
        +Text descripcion
        +Text icono
        +Integer orden
        +Boolean visible
        +Text detalle_completo
        +Array beneficios
        +Varchar duracion
        +Text recomendaciones
        +Timestamp created_at
        +Timestamp updated_at
        +crear() void
        +editar() void
    }

    class CMSServicioImagen {
        +UUID id
        +UUID servicio_id
        +Text imagen_url
        +Text public_id
        +Text descripcion
        +Text alt_text
        +Integer orden
        +Boolean visible
        +Timestamp created_at
        +Timestamp updated_at
        +subir() void
    }

    class CMSEquipo {
        +UUID id
        +Text nombre
        +Text cargo
        +Text especialidad
        +Text foto_url
        +Text foto_public_id
        +JSONB curriculum
        +Integer orden
        +Boolean visible
        +Timestamp created_at
        +Timestamp updated_at
        +crear() void
        +editar() void
    }

    class CMSTema {
        +UUID id
        +Text clave
        +Text valor
        +Text tipo
        +Text descripcion
        +Text grupo
        +Timestamp updated_at
        +actualizar() void
    }

    class CMSCarrusel {
        +UUID id
        +Text imagen_url
        +Text alt_text
        +Integer orden
        +Boolean visible
        +Timestamp created_at
        +subir() void
    }

    %% ========================================
    %% SECCIÓN 4: CHATBOT (IA con RAG)
    %% ========================================
    class ChatbotFAQ {
        +UUID id
        +Text pregunta
        +Text respuesta
        +Array keywords
        +Text categoria
        +Integer prioridad
        +Boolean activo
        +Vector_768 embedding
        +Timestamp created_at
        +Timestamp updated_at
        +Timestamp embedding_updated_at
        +crear() void
        +generarEmbedding() void
    }

    class ChatbotContexto {
        +UUID id
        +Text titulo
        +Text contenido
        +Text tipo
        +Boolean activo
        +Vector_768 embedding
        +Timestamp created_at
        +Timestamp updated_at
        +Timestamp embedding_updated_at
        +crear() void
        +generarEmbedding() void
    }

    class ChatbotRateLimit {
        +UUID id
        +Text ip_hash
        +Integer requests_count
        +Timestamp first_request_at
        +Timestamp last_request_at
        +Timestamp blocked_until
        +verificar() Boolean
    }

    %% ========================================
    %% RELACIONES ENTRE SECCIONES
    %% ========================================
    Personal "1" --> "*" CodigoInvitacion : crea
    Personal "1" --> "*" CMSSeccion : actualiza
    Personal "1" --> "*" CMSServicio : gestiona
    Personal "1" --> "*" CMSEquipo : gestiona
    Personal "1" --> "*" ChatbotFAQ : gestiona
    Personal "1" --> "*" AjustesAplicacion : configura
    CMSServicio "1" --> "*" CMSServicioImagen : tiene
```

---

## 3. Diagramas de Secuencia

### 3.1 Recuperación de Contraseña

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 Usuario
    participant Frontend as 🖥️ Frontend
    participant Auth as 🔐 Supabase Auth
    participant Email as 📧 Servicio Email
    participant DB as 🗄️ Base de Datos

    rect rgb(230, 245, 255)
        Note over User, DB: Solicitud de Recuperación
        User->>Frontend: Accede a recuperar contraseña
        Frontend->>User: Mostrar formulario de email
        User->>Frontend: Ingresa su correo electrónico
        Frontend->>Auth: Solicitar restablecimiento
        activate Auth
        Auth->>DB: Verificar existencia del usuario
        activate DB
        DB-->>Auth: Usuario encontrado
        deactivate DB
        Auth->>Email: Enviar correo con enlace de recuperación
        activate Email
        Email-->>User: Email con enlace seguro
        deactivate Email
        Auth-->>Frontend: Solicitud procesada
        deactivate Auth
        Frontend-->>User: Mostrar confirmación de envío
    end

    rect rgb(255, 245, 230)
        Note over User, DB: Restablecimiento de Contraseña
        User->>Frontend: Accede al enlace del correo
        Frontend->>User: Mostrar formulario de nueva contraseña
        User->>Frontend: Ingresa nueva contraseña
        Frontend->>Auth: Actualizar contraseña
        activate Auth
        Auth->>DB: Guardar nueva contraseña cifrada
        activate DB
        DB-->>Auth: Confirmación
        deactivate DB
        Auth-->>Frontend: Contraseña actualizada
        deactivate Auth
        Frontend-->>User: Redirigir a inicio de sesión
        Frontend-->>User: Notificar cambio exitoso
    end
```

### 3.2 Interacción con Chatbot

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 Visitante
    participant Widget as 💬 Widget Chat
    participant API as ⚡ API
    participant RAG as 🔍 Servicio RAG
    participant Gemini as 🤖 Gemini IA
    participant DB as 🗄️ BD Vectorial

    rect rgb(230, 255, 230)
        Note over User, DB: Envío de Consulta
        User->>Widget: Escribe una pregunta
        activate Widget
        Widget->>API: Enviar mensaje del usuario
        activate API
    end

    rect rgb(255, 240, 245)
        Note over API, DB: Búsqueda de Contexto (RAG)
        API->>RAG: Buscar contexto relevante
        activate RAG
        RAG->>Gemini: Convertir pregunta a vector
        activate Gemini
        Gemini-->>RAG: Embedding de la pregunta
        deactivate Gemini
        RAG->>DB: Búsqueda semántica en FAQs y contextos
        activate DB
        DB-->>RAG: Fragmentos más relevantes
        deactivate DB
        RAG-->>API: Contexto enriquecido
        deactivate RAG
    end

    rect rgb(245, 240, 255)
        Note over API, Gemini: Generación de Respuesta
        API->>Gemini: Generar respuesta con contexto
        activate Gemini
        Note right of Gemini: El prompt incluye:<br/>- Rol del asistente<br/>- Contexto recuperado<br/>- Pregunta original
        Gemini-->>API: Respuesta generada
        deactivate Gemini
        API-->>Widget: Respuesta del asistente
        deactivate API
        Widget-->>User: Mostrar respuesta
        deactivate Widget
    end

    Note over User, DB: Las conversaciones no se almacenan en base de datos
```

### 3.3 Registro con Código de Invitación

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 Nuevo Usuario
    participant Frontend as 🖥️ Frontend
    participant API as ⚡ API
    participant Auth as 🔐 Supabase Auth
    participant DB as 🗄️ Base de Datos

    rect rgb(230, 245, 255)
        Note over User, DB: Verificación del Código
        User->>Frontend: Accede a página de registro
        Frontend->>User: Mostrar campo de código de invitación
        User->>Frontend: Ingresa código de invitación
        Frontend->>API: Verificar código
        activate API
        API->>DB: Buscar código válido y con usos disponibles
        activate DB
        DB-->>API: Resultado de búsqueda
        deactivate DB

        alt Código válido
            API-->>Frontend: Código aceptado con rol asignado
            Frontend-->>User: Mostrar rol y habilitar formulario
        else Código inválido o expirado
            API-->>Frontend: Error de validación
            Frontend-->>User: Mostrar mensaje de error
        end
        deactivate API
    end

    rect rgb(255, 245, 230)
        Note over User, DB: Registro de Credenciales
        Frontend->>User: Mostrar formulario de usuario y contraseña
        User->>Frontend: Ingresa nombre de usuario y contraseña
        Frontend->>Auth: Crear cuenta de usuario
        activate Auth
        Auth->>DB: Registrar nuevo usuario
        activate DB
        DB-->>Auth: Usuario creado
        deactivate DB
        Auth-->>Frontend: Usuario registrado exitosamente
        deactivate Auth

        Frontend->>API: Completar registro en el sistema
        activate API
        API->>DB: Crear perfil del personal con rol asignado
        activate DB
        DB-->>API: Perfil creado
        deactivate DB
        API->>DB: Actualizar uso del código de invitación
        activate DB
        DB-->>API: Código actualizado
        deactivate DB
        API-->>Frontend: Registro completado
        deactivate API

        Frontend-->>User: Redirigir a página de login
        Frontend-->>User: Notificar registro exitoso
    end
```

### 3.4 Inicio de Sesión

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 Usuario
    participant Frontend as 🖥️ Frontend
    participant Auth as 🔐 Supabase Auth
    participant MW as 🛡️ Middleware
    participant DB as 🗄️ Base de Datos

    rect rgb(230, 245, 255)
        Note over User, DB: Autenticación
        User->>Frontend: Accede a página de login
        Frontend->>User: Mostrar formulario
        User->>Frontend: Ingresa usuario y contraseña
        Frontend->>Auth: Solicitar autenticación
        activate Auth
        Auth->>DB: Verificar credenciales
        activate DB

        alt Credenciales correctas
            DB-->>Auth: Usuario válido
            deactivate DB
            Auth-->>Frontend: Sesión iniciada (token JWT)
        else Credenciales incorrectas
            DB-->>Auth: Error de autenticación
            Auth-->>Frontend: Error "Credenciales inválidas"
            Frontend-->>User: Mostrar mensaje de error
        end
        deactivate Auth
    end

    rect rgb(255, 245, 230)
        Note over User, DB: Verificación de Acceso
        Frontend->>MW: Navegar al panel administrativo
        activate MW
        MW->>Auth: Obtener usuario desde sesión
        activate Auth
        Auth-->>MW: Datos del usuario
        deactivate Auth
        MW->>DB: Consultar estado del usuario
        activate DB
        DB-->>MW: Información del personal
        deactivate DB

        alt Usuario activo en el sistema
            MW-->>Frontend: Acceso permitido
            Frontend-->>User: Mostrar Dashboard
        else Usuario inactivo o no registrado
            MW-->>Frontend: Acceso denegado
            Frontend-->>User: Redirigir a login con mensaje
        end
        deactivate MW
    end
```

### 3.5 Edición de Contenido CMS

```mermaid
sequenceDiagram
    autonumber
    participant Admin as 👤 Administrador
    participant CMS as 🖥️ Panel CMS
    participant API as ⚡ API
    participant Cloud as ☁️ Cloudinary
    participant DB as 🗄️ Base de Datos

    rect rgb(230, 245, 255)
        Note over Admin, DB: Carga de Datos
        Admin->>CMS: Selecciona sección a editar
        CMS->>API: Solicitar datos de la sección
        activate API
        API->>DB: Obtener contenido de la sección
        activate DB
        DB-->>API: Datos de la sección
        deactivate DB
        API-->>CMS: Información de la sección
        deactivate API
        CMS-->>Admin: Mostrar formulario con datos actuales
    end

    rect rgb(255, 245, 230)
        Note over Admin, DB: Edición y Guardado
        Admin->>CMS: Modifica título, subtítulo y contenido
        Admin->>CMS: Sube nueva imagen (opcional)

        opt Si hay imagen nueva
            CMS->>Cloud: Subir imagen al servicio
            activate Cloud
            Cloud-->>CMS: URL e identificador de imagen
            deactivate Cloud
        end

        Admin->>CMS: Guardar cambios
        CMS->>API: Enviar datos actualizados
        activate API
        API->>DB: Actualizar sección con nuevo contenido
        activate DB
        DB-->>API: Confirmación
        deactivate DB
        API-->>CMS: Operación exitosa
        deactivate API
        CMS-->>Admin: Notificar actualización completada
        CMS->>CMS: Invalidar caché de la landing page
    end
```

### 3.6 Sincronización de Embeddings (RAG)

```mermaid
sequenceDiagram
    autonumber
    participant Admin as 👤 Administrador
    participant Panel as 🖥️ Panel Chatbot
    participant API as ⚡ API
    participant Gemini as 🤖 Gemini IA
    participant DB as 🗄️ BD (pgvector)

    rect rgb(230, 245, 255)
        Note over Admin, DB: Identificar Contenido Pendiente
        Admin->>Panel: Iniciar sincronización de embeddings
        Panel->>API: Solicitar sincronización
        activate API
        API->>DB: Obtener FAQs sin embedding o desactualizados
        activate DB
        DB-->>API: Lista de FAQs pendientes
        deactivate DB
        API->>DB: Obtener contextos sin embedding o desactualizados
        activate DB
        DB-->>API: Lista de contextos pendientes
        deactivate DB
    end

    rect rgb(255, 240, 245)
        Note over API, DB: Generar Vectores
        loop Para cada contenido pendiente
            API->>Gemini: Generar embedding del texto
            activate Gemini
            Gemini-->>API: Vector de 768 dimensiones
            deactivate Gemini
            API->>DB: Guardar embedding y fecha de actualización
            activate DB
            DB-->>API: Confirmación
            deactivate DB
        end
    end

    rect rgb(230, 255, 230)
        Note over Admin, DB: Resultado
        API-->>Panel: Resumen de sincronización
        deactivate API
        Panel-->>Admin: Notificar sincronización completada
        Panel-->>Admin: Mostrar estadísticas de procesamiento
    end
```

### 3.7 Visualización del Dashboard (KPIs)

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 Usuario
    participant Dashboard as 🖥️ Dashboard
    participant API as ⚡ API
    participant DB as 🗄️ Base de Datos

    rect rgb(230, 245, 255)
        Note over User, DB: Carga de Métricas
        User->>Dashboard: Accede al panel principal
        activate Dashboard
        Dashboard->>API: Solicitar resumen de KPIs
        activate API

        par Consultas en paralelo
            API->>DB: Contar total de pacientes
            activate DB
            DB-->>API: Total pacientes
            deactivate DB
        and
            API->>DB: Contar citas pendientes
            activate DB
            DB-->>API: Citas pendientes
            deactivate DB
        and
            API->>DB: Calcular ingresos del mes
            activate DB
            DB-->>API: Ingresos mensuales
            deactivate DB
        and
            API->>DB: Contar casos clínicos activos
            activate DB
            DB-->>API: Casos activos
            deactivate DB
        end

        API-->>Dashboard: Métricas consolidadas
        deactivate API
        Dashboard-->>User: Mostrar tarjetas con indicadores
    end

    rect rgb(255, 245, 230)
        Note over User, DB: Carga de Gráficos
        Dashboard->>API: Solicitar datos para gráficos
        activate API
        API->>DB: Obtener datos agregados por período
        activate DB
        DB-->>API: Series de datos temporales
        deactivate DB
        API-->>Dashboard: Datos para visualización
        deactivate API
        Dashboard-->>User: Renderizar gráficos estadísticos
        deactivate Dashboard
    end
```

---

## 4. Modelo Relacional de Base de Datos

### 4.1 Modelo ER - Módulos Administrativos y CMS

```mermaid
erDiagram
    %% ========================================
    %% SECCIÓN 1: AUTENTICACIÓN Y USUARIOS
    %% ========================================
    auth_users {
        UUID id PK
        VARCHAR email
        VARCHAR encrypted_password
        TIMESTAMP email_confirmed_at
        TIMESTAMP last_sign_in_at
    }

    personal {
        UUID id PK,FK
        TEXT nombre_completo
        USER_DEFINED rol
        TEXT especialidad
        TEXT telefono
        TEXT email UK
        BOOLEAN activo
        TIMESTAMP created_at
    }

    codigos_invitacion {
        UUID id PK
        TEXT codigo UK
        UUID creado_por FK
        UUID usado_por FK
        TEXT rol_asignado
        INTEGER usos_maximos
        INTEGER usos_actuales
        BOOLEAN activo
        TIMESTAMP expira_at
        TIMESTAMP created_at
        TIMESTAMP used_at
    }

    %% ========================================
    %% SECCIÓN 2: CONFIGURACIÓN DEL SISTEMA
    %% ========================================
    config_seguridad {
        UUID id PK
        TEXT clave UK
        TEXT valor
        TEXT descripcion
        TIMESTAMP updated_at
    }

    ajustes_aplicacion {
        UUID id PK
        TEXT clave UK
        TEXT valor
        TEXT grupo
        USER_DEFINED tipo
        TEXT descripcion
        INTEGER orden
        TEXT resend_api_key
        TIMESTAMP updated_at
        TIMESTAMP created_at
    }

    %% ========================================
    %% SECCIÓN 3: CMS (GESTIÓN DE CONTENIDOS)
    %% ========================================
    cms_secciones {
        UUID id PK
        TEXT seccion UK
        TEXT titulo
        TEXT subtitulo
        JSONB contenido
        INTEGER orden
        BOOLEAN visible
        TIMESTAMP updated_at
        UUID updated_by FK
    }

    cms_servicios {
        UUID id PK
        TEXT nombre
        TEXT descripcion
        TEXT icono
        INTEGER orden
        BOOLEAN visible
        TEXT detalle_completo
        ARRAY beneficios
        VARCHAR duracion
        TEXT recomendaciones
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    cms_servicio_imagenes {
        UUID id PK
        UUID servicio_id FK
        TEXT imagen_url
        TEXT public_id
        TEXT descripcion
        TEXT alt_text
        INTEGER orden
        BOOLEAN visible
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    cms_equipo {
        UUID id PK
        TEXT nombre
        TEXT cargo
        TEXT especialidad
        TEXT foto_url
        TEXT foto_public_id
        JSONB curriculum
        INTEGER orden
        BOOLEAN visible
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    cms_tema {
        UUID id PK
        TEXT clave UK
        TEXT valor
        TEXT tipo
        TEXT descripcion
        TEXT grupo
        TIMESTAMP updated_at
    }

    cms_carrusel {
        UUID id PK
        TEXT imagen_url
        TEXT public_id
        TEXT alt_text
        INTEGER orden
        BOOLEAN visible
        TIMESTAMP created_at
    }

    %% ========================================
    %% SECCIÓN 4: CHATBOT (IA con RAG)
    %% ========================================
    chatbot_faqs {
        UUID id PK
        TEXT pregunta
        TEXT respuesta
        ARRAY keywords
        TEXT categoria
        INTEGER prioridad
        BOOLEAN activo
        VECTOR_768 embedding
        TIMESTAMP embedding_updated_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    chatbot_contexto {
        UUID id PK
        TEXT titulo
        TEXT contenido
        TEXT tipo
        BOOLEAN activo
        VECTOR_768 embedding
        TIMESTAMP embedding_updated_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    chatbot_rate_limit {
        UUID id PK
        TEXT ip_hash UK
        INTEGER requests_count
        TIMESTAMP first_request_at
        TIMESTAMP last_request_at
        TIMESTAMP blocked_until
    }

    %% ========================================
    %% RELACIONES ENTRE SECCIONES
    %% ========================================
    auth_users ||--|| personal : "perfil"
    personal ||--o{ codigos_invitacion : "crea"
    auth_users ||--o{ codigos_invitacion : "usa"
    auth_users ||--o{ cms_secciones : "actualiza"
    cms_servicios ||--o{ cms_servicio_imagenes : "tiene"
```

---

## 5. Diagrama de Despliegue

```mermaid
flowchart TB
    subgraph Cliente["🖥️ Cliente"]
        subgraph Browser["Navegador Web"]
            Landing["Landing Page"]
            AdminPanel["Panel Admin"]
            ChatWidget["Widget Chatbot"]
        end
    end

    subgraph Vercel["☁️ Vercel (Frontend & API)"]
        subgraph NextJS["Next.js App Router"]
            AuthPages["Auth Pages"]
            Dashboard["Dashboard"]
            CMSAdmin["CMS Admin"]
            APIRoutes["API Routes"]
        end
    end

    subgraph Supabase["🔷 Supabase (Backend as a Service)"]
        AuthService["🔐 Auth Service"]
        PostgreSQL["🗄️ PostgreSQL DB"]
        Vectores["📊 pgvector"]
    end

    subgraph GoogleAI["🤖 Google AI"]
        GeminiAPI["Gemini 2.0 Flash Lite<br/>(Inferencia)"]
        EmbeddingAPI["Text Embedding 004<br/>(Vectores)"]
    end

    subgraph Cloudinary["☁️ Cloudinary"]
        ImageStorage["📷 Almacenamiento<br/>de Imágenes"]
    end

    %% Conexiones
    Browser -->|HTTPS| NextJS
    NextJS -->|Auth SDK| AuthService
    NextJS -->|Data Query| PostgreSQL
    NextJS -->|Vector Search| Vectores
    NextJS -->|Generación Texto| GeminiAPI
    NextJS -->|Embeddings| EmbeddingAPI
    NextJS -->|Upload/Fetch| ImageStorage

    style Cliente fill:#e8f5e9
    style Vercel fill:#e3f2fd
    style Supabase fill:#fff3e0
    style GoogleAI fill:#f3e5f5
    style Cloudinary fill:#fce4ec
```

### 5.1 Arquitectura de Componentes

```mermaid
flowchart LR
    subgraph Frontend["🖥️ Frontend (Next.js)"]
        direction TB
        Pages["📄 Pages/Routes"]
        Components["🧩 Components"]
        Hooks["🪝 Hooks"]
        Lib["📚 Lib/Utils"]
    end

    subgraph API["⚡ API Routes"]
        direction TB
        AuthAPI["🔐 /api/auth"]
        CMSAPI["🌐 /api/cms"]
        ChatAPI["🤖 /api/chat"]
        CalendarAPI["📅 /api/calendar"]
        KPIAPI["📊 /api/kpi"]
    end

    subgraph Services["🔧 Servicios Externos"]
        direction TB
        Supabase["🔷 Supabase"]
        Gemini["🤖 Gemini AI"]
        Cloudinary["☁️ Cloudinary"]
        GoogleCal["📅 Google Calendar"]
    end

    Pages --> Components
    Components --> Hooks
    Components --> Lib
    Pages --> API

    AuthAPI --> Supabase
    CMSAPI --> Supabase
    CMSAPI --> Cloudinary
    ChatAPI --> Gemini
    ChatAPI --> Supabase
    CalendarAPI --> GoogleCal
    KPIAPI --> Supabase

    style Frontend fill:#e3f2fd
    style API fill:#fff3e0
    style Services fill:#f3e5f5
```

---

## 📝 Notas de Implementación

### Herramientas Utilizadas

| Categoría          | Tecnología                                             |
| ------------------ | ------------------------------------------------------ |
| **Frontend**       | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend**        | Next.js API Routes, Server Actions                     |
| **Base de Datos**  | PostgreSQL (Supabase)                                  |
| **Autenticación**  | Supabase Auth con JWT                                  |
| **Almacenamiento** | Cloudinary                                             |
| **IA/Chatbot**     | Gemini 2.0 flash lite, pgvector para embeddings        |
| **Calendario**     | Google Calendar API                                    |

### Convenciones de Diagramas

- Los colores en diagramas de estado indican el nivel de actividad
- Las relaciones con líneas punteadas indican dependencias opcionales
- Los bloques `rect` en secuencias agrupan fases del proceso

### Visualización

Los diagramas Mermaid pueden visualizarse en:

- ✅ GitHub (renderizado automático)
- ✅ VS Code (con extensión Mermaid Preview)
- ✅ [Mermaid Live Editor](https://mermaid.live)
- ✅ GitLab, Notion, Obsidian y otros

---

**Documento generado:** Diciembre 2025  
**Sistema:** Dental Company Web v1.0

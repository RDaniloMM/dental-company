# 📊 Diagramas UML - Sistema Dental Company Web

Este documento contiene los diagramas UML enfocados en los módulos de Landing Page, Administración de Usuarios, Gestión de Contenidos (CMS), Chatbot y Autenticación.
Los diagramas están escritos en sintaxis PlantUML y pueden visualizarse en [PlantText](https://www.planttext.com/).

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

```plantuml
@startuml Casos_de_Uso_Admin_Landing
!theme plain
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle awesome

title Diagrama de Casos de Uso - Módulos Administrativos y Públicos

actor "Administrador" as Admin
actor "Usuario Registrado" as Usuario
actor "Visitante Web" as Visitante

rectangle "Sistema Dental Company Web" {

    package "Autenticación y Cuenta" {
        usecase "Iniciar Sesión" as UC1
        usecase "Registrarse" as UC2
        usecase "Recuperar Contraseña" as UC3
        usecase "Configurar Cuenta" as UC4
        usecase "Gestionar Email Recuperación" as UC5
    }

    package "Dashboard y Métricas" {
        usecase "Ver Dashboard Principal" as UC6
        usecase "Visualizar KPIs" as UC7
    }

    package "Administración de Usuarios" <<Admin>> {
        usecase "Listar Usuarios" as UC8
        usecase "Crear/Invitar Usuario" as UC9
        usecase "Desactivar Usuario" as UC10
        usecase "Asignar Roles" as UC11
    }

    package "Gestión de Contenidos (CMS)" <<Admin>> {
        usecase "Editar Información Clínica" as UC12
        usecase "Gestionar Servicios" as UC13
        usecase "Gestionar Equipo Médico" as UC14
        usecase "Personalizar Tema Visual" as UC15
    }

    package "Chatbot IA" {
        usecase "Consultar Chatbot" as UC16
        usecase "Configurar FAQs" as UC17
        usecase "Configurar Contexto" as UC18
        usecase "Sincronizar Base de Conocimiento" as UC19
    }

    package "Landing Page Pública" {
        usecase "Ver Servicios" as UC20
        usecase "Ver Equipo" as UC21
        usecase "Ver Información Contacto" as UC22
    }
}

' Relaciones Visitante
Visitante --> UC2
Visitante --> UC3
Visitante --> UC16
Visitante --> UC20
Visitante --> UC21
Visitante --> UC22

' Relaciones Usuario
Usuario --> UC1
Usuario --> UC3
Usuario --> UC4
Usuario --> UC6
Usuario --> UC7

' Relaciones Admin
Admin --> UC1
Admin --> UC3
Admin --> UC4
Admin --> UC6
Admin --> UC7
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC11
Admin --> UC12
Admin --> UC13
Admin --> UC14
Admin --> UC15
Admin --> UC17
Admin --> UC18
Admin --> UC19

' Inclusiones y Extensiones
UC4 ..> UC5 : <<include>>
UC6 ..> UC7 : <<include>>

@enduml
```

---

## 2. Diagrama de Clases

### 2.1 Clases de Autenticación, CMS y Chatbot

```plantuml
@startuml Diagrama_Clases_Core
!theme plain
skinparam classAttributeIconSize 0
skinparam classFontStyle bold

title Diagrama de Clases - Core Administrativo y CMS

' ========== AUTENTICACIÓN Y USUARIOS ==========

class Usuario {
    +id: UUID
    +email: String
    +password_hash: String
    +created_at: DateTime
    --
    +iniciarSesion(): void
    +cerrarSesion(): void
    +recuperarContrasena(): void
}

class Personal {
    +id: UUID
    +usuario_id: UUID
    +nombre_completo: String
    +rol: RolUsuario
    +especialidad: String
    +telefono: String
    +email_contacto: String
    +activo: Boolean
    --
    +actualizarPerfil(): void
    +configurarEmailRecuperacion(): void
}

class CodigoInvitacion {
    +id: UUID
    +codigo: String
    +rol_asignado: RolUsuario
    +usos_maximos: Integer
    +usos_actuales: Integer
    +expira_at: DateTime
    --
    +generar(): void
    +validar(): Boolean
}

' ========== DASHBOARD ==========

class DashboardKPI {
    +total_pacientes: Integer
    +citas_hoy: Integer
    +ingresos_mes: Decimal
    +tratamientos_activos: Integer
    --
    +calcularMetricas(): void
    +generarGraficos(): JSON
}

' ========== CMS (GESTIÓN DE CONTENIDOS) ==========

class CMSConfiguracion {
    +nombre_clinica: String
    +telefono: String
    +direccion: String
    +horarios: String
    +redes_sociales: JSON
    --
    +actualizar(): void
}

class CMSServicio {
    +id: UUID
    +nombre: String
    +descripcion: String
    +icono: String
    +visible: Boolean
    +orden: Integer
    --
    +crear(): void
    +editar(): void
}

class CMSEquipo {
    +id: UUID
    +nombre: String
    +cargo: String
    +foto_url: String
    +visible: Boolean
    --
    +crear(): void
    +editar(): void
}

' ========== CHATBOT IA ==========

class ChatbotConfig {
    +system_prompt: String
    +modelo_ia: String = "Gemini 2.0 Flash Lite"
    +temperatura: Float
    --
    +actualizar(): void
}

class ChatbotFAQ {
    +id: UUID
    +pregunta: String
    +respuesta: String
    +keywords: Array
    +activo: Boolean
    +embedding: Vector
    --
    +crear(): void
    +generarEmbedding(): void
}

class ChatbotContexto {
    +id: UUID
    +titulo: String
    +contenido: String
    +activo: Boolean
    +embedding: Vector
    --
    +crear(): void
    +generarEmbedding(): void
}

' ========== RELACIONES ==========

Usuario "1" -- "0..1" Personal : tiene perfil >
Personal "1" -- "*" CodigoInvitacion : crea >
Personal "1" -- "1" DashboardKPI : visualiza >

Personal "1" -- "*" CMSServicio : gestiona >
Personal "1" -- "*" CMSEquipo : gestiona >
Personal "1" -- "*" ChatbotFAQ : gestiona >

enum RolUsuario {
    ADMIN
    ODONTOLOGO
}

@enduml
```

---

## 3. Diagramas de Secuencia

### 3.1 Autenticación: Recuperación de Contraseña

```plantuml
@startuml Secuencia_Recuperar_Password
!theme plain
skinparam sequenceMessageAlign center

title Diagrama de Secuencia - Recuperación de Contraseña

actor "Usuario" as User
participant "Frontend\n(Forgot Password)" as Frontend
participant "Supabase Auth" as Auth
participant "Servicio Email" as Email
database "Base de Datos" as DB

User -> Frontend: Clic en "¿Olvidaste tu contraseña?"
Frontend -> User: Solicitar correo electrónico

User -> Frontend: Ingresa email (ej: usuario@dental.com)
Frontend -> Auth: resetPasswordForEmail(email)
activate Auth

Auth -> DB: Buscar usuario por email
activate DB
DB --> Auth: Usuario encontrado
deactivate DB

Auth -> Email: Enviar correo con token de recuperación
activate Email
Email --> User: Correo con enlace de reset
deactivate Email

Auth --> Frontend: {success: true}
deactivate Auth

Frontend --> User: Mostrar mensaje "Correo enviado"

User -> Frontend: Clic en enlace del correo
Frontend -> User: Mostrar formulario "Nueva Contraseña"

User -> Frontend: Ingresa nueva contraseña
Frontend -> Auth: updateUser({ password: newPassword })
activate Auth

Auth -> DB: Actualizar hash de contraseña
activate DB
DB --> Auth: OK
deactivate DB

Auth --> Frontend: {success: true}
deactivate Auth

Frontend --> User: Redirigir a Login
Frontend --> User: Toast "Contraseña actualizada"

@enduml
```

### 3.2 Interacción con Chatbot (Gemini 2.0 Flash Lite)

```plantuml
@startuml Secuencia_Chatbot_Gemini
!theme plain
skinparam sequenceMessageAlign center

title Diagrama de Secuencia - Chatbot con Gemini 2.0 Flash Lite

actor "Visitante" as User
participant "Widget Chat" as Widget
participant "API Route\n(/api/chat)" as API
participant "RAG Service" as RAG
participant "Google Gemini API" as Gemini
database "PostgreSQL\n(pgvector)" as DB

User -> Widget: Envía pregunta
activate Widget

Widget -> API: POST /api/chat { mensaje }
activate API

API -> RAG: buscarContexto(mensaje)
activate RAG

RAG -> Gemini: Generar embedding (text-embedding-004)
activate Gemini
Gemini --> RAG: vector[768]
deactivate Gemini

RAG -> DB: Búsqueda semántica (FAQs + Contexto)
activate DB
DB --> RAG: Fragmentos relevantes
deactivate DB

RAG --> API: Contexto enriquecido
deactivate RAG

API -> Gemini: Generar respuesta (gemini-2.0-flash-lite)
note right
  Prompt incluye:
  - Rol del sistema
  - Contexto recuperado
  - Pregunta del usuario
end note
activate Gemini

Gemini --> API: Respuesta generada
deactivate Gemini

API --> Widget: { respuesta }
deactivate API

Widget --> User: Muestra respuesta
deactivate Widget

note bottom
  No se guarda historial de
  conversaciones en base de datos
end note

@enduml
```

---

## 4. Modelo Relacional de Base de Datos

### 4.1 Modelo ER - Módulos Administrativos y CMS

```plantuml
@startuml Modelo_ER_Admin_CMS
!theme plain
skinparam linetype ortho

title Modelo ER - Administración, CMS y Chatbot

' ========== AUTENTICACIÓN Y USUARIOS ==========

entity "auth.users" as users {
    *id : UUID <<PK>>
    --
    email : VARCHAR
    encrypted_password : VARCHAR
    email_confirmed_at : TIMESTAMP
    last_sign_in_at : TIMESTAMP
}

entity "personal" as personal {
    *id : UUID <<PK>> <<FK>>
    --
    nombre_completo : VARCHAR
    rol : ENUM ('Admin', 'Odontologo')
    especialidad : VARCHAR
    telefono : VARCHAR
    email : VARCHAR <<UK>>
    activo : BOOLEAN
    created_at : TIMESTAMP
}

entity "codigos_invitacion" as codigos {
    *id : UUID <<PK>>
    --
    codigo : VARCHAR <<UK>>
    creado_por : UUID <<FK>>
    usado_por : UUID <<FK>>
    rol_asignado : VARCHAR
    usos_maximos : INTEGER
    usos_actuales : INTEGER
    activo : BOOLEAN
    expira_at : TIMESTAMP
}

' ========== CMS (CONTENIDOS) ==========

entity "cms_secciones" as secciones {
    *id : UUID <<PK>>
    --
    seccion : VARCHAR <<UK>>
    titulo : VARCHAR
    subtitulo : VARCHAR
    contenido : JSONB
    visible : BOOLEAN
}

entity "cms_servicios" as servicios {
    *id : UUID <<PK>>
    --
    nombre : VARCHAR
    descripcion : TEXT
    icono : VARCHAR
    orden : INTEGER
    visible : BOOLEAN
}

entity "cms_equipo" as equipo {
    *id : UUID <<PK>>
    --
    nombre : VARCHAR
    cargo : VARCHAR
    foto_url : TEXT
    orden : INTEGER
    visible : BOOLEAN
}

entity "cms_tema" as tema {
    *id : UUID <<PK>>
    --
    clave : VARCHAR <<UK>>
    valor : VARCHAR
    tipo : VARCHAR
}

' ========== CHATBOT (RAG) ==========

entity "chatbot_faqs" as faqs {
    *id : UUID <<PK>>
    --
    pregunta : TEXT
    respuesta : TEXT
    keywords : TEXT[]
    activo : BOOLEAN
    embedding : VECTOR
}

entity "chatbot_contexto" as contexto {
    *id : UUID <<PK>>
    --
    titulo : VARCHAR
    contenido : TEXT
    activo : BOOLEAN
    embedding : VECTOR
}

entity "chatbot_rate_limit" as rate_limit {
    *id : UUID <<PK>>
    --
    ip_hash : VARCHAR <<UK>>
    requests_count : INTEGER
    blocked_until : TIMESTAMP
}

' ========== RELACIONES ==========

users ||--|| personal : "perfil"
personal ||--o{ codigos : "crea"
users ||--o{ codigos : "usa"

@enduml
```

---

## 5. Diagrama de Despliegue

````plantuml
@startuml Diagrama_Despliegue_Lite
!theme plain
skinparam nodeStyle rectangle

title Diagrama de Despliegue - Arquitectura Web y Servicios IA

node "Cliente" {
    node "Navegador Web" {
        artifact "Landing Page"
        artifact "Panel Admin"
        artifact "Widget Chatbot"
    }
}

cloud "Vercel (Frontend & API)" {
    node "Next.js App Router" {
        artifact "Auth Pages"
        artifact "Dashboard"
        artifact "CMS Admin"
        artifact "API Routes"
    }
}

cloud "Supabase (Backend as a Service)" {
    node "Auth Service" {
        artifact "Gestión Usuarios"
    }
    node "PostgreSQL DB" {
        artifact "Tablas CMS"
        artifact "Vectores (pgvector)"
    }
}

cloud "Google AI" {
    node "Gemini API" {
        artifact "Gemini 2.0 Flash Lite\n(Inferencia)"
        artifact "Text Embedding 004\n(Vectores)"
    }
}

' Conexiones
"Navegador Web" --> "Next.js App Router" : HTTPS
"Next.js App Router" --> "Auth Service" : Auth SDK
"Next.js App Router" --> "PostgreSQL DB" : Data Query
"Next.js App Router" --> "Gemini API" : Generación Texto/Embeddings

@enduml
```---

## 📝 Notas de Implementación

### Herramientas Utilizadas

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Server Actions
- **Base de Datos:** PostgreSQL (Supabase)
- **Autenticación:** Supabase Auth con JWT
- **Almacenamiento de Imágenes:** Cloudinary
- **IA/Chatbot:** Gemini 2.0 flash lite, pgvector para embeddings
- **Calendario:** Google Calendar API

### Convenciones de Diagramas

- Los colores en diagramas de estado indican el nivel de actividad
- Las relaciones con líneas punteadas indican dependencias opcionales
- Los estereotipos `<<include>>` y `<<extend>>` siguen la notación UML estándar

---

**Documento generado:** Diciembre 2025
**Sistema:** Dental Company Web v1.0
````

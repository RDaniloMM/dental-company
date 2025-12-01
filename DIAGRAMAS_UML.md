# 📊 Diagramas UML - Sistema Dental Company Web

Este documento contiene los diagramas UML del sistema de gestión para clínicas dentales.
Los diagramas están escritos en sintaxis PlantUML y pueden visualizarse en [PlantText](https://www.planttext.com/).

---

## 📑 Índice

1. [Diagrama de Casos de Uso](#1-diagrama-de-casos-de-uso)
2. [Diagrama de Clases](#2-diagrama-de-clases)
3. [Diagramas de Secuencia](#3-diagramas-de-secuencia)
4. [Modelo Relacional de Base de Datos](#4-modelo-relacional-de-base-de-datos)
5. [Diagrama de Componentes](#5-diagrama-de-componentes)
6. [Diagrama de Estados](#6-diagrama-de-estados)
7. [Diagrama de Actividades](#7-diagrama-de-actividades)
8. [Diagrama de Despliegue](#8-diagrama-de-despliegue)

---

## 1. Diagrama de Casos de Uso

### 1.1 Casos de Uso General del Sistema

```plantuml
@startuml Casos_de_Uso_General
!theme plain
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle awesome

title Diagrama de Casos de Uso - Sistema Dental Company Web

actor "Administrador" as Admin
actor "Odontólogo" as Odontologo
actor "Visitante Web" as Visitante

rectangle "Sistema Dental Company Web" {
    
    package "Gestión de Pacientes" {
        usecase "Registrar Paciente" as UC1
        usecase "Buscar Paciente" as UC2
        usecase "Ver Ficha Odontológica" as UC3
        usecase "Editar Filiación" as UC4
        usecase "Registrar Historia Clínica" as UC5
        usecase "Gestionar Odontograma" as UC6
        usecase "Subir Imágenes" as UC7
    }
    
    package "Gestión de Casos Clínicos" {
        usecase "Crear Caso Clínico" as UC8
        usecase "Registrar Diagnóstico" as UC9
        usecase "Crear Presupuesto" as UC10
        usecase "Registrar Pago" as UC11
        usecase "Generar Receta" as UC12
        usecase "Gestionar Consentimientos" as UC13
    }
    
    package "Gestión de Citas" {
        usecase "Agendar Cita" as UC14
        usecase "Ver Calendario" as UC15
        usecase "Modificar Estado Cita" as UC16
        usecase "Sincronizar Google Calendar" as UC17
    }
    
    package "Gestión de Tratamientos" {
        usecase "Administrar Procedimientos" as UC18
        usecase "Gestionar Grupos" as UC19
        usecase "Configurar Precios" as UC20
    }
    
    package "Reportes" {
        usecase "Generar PDF Ficha" as UC21
        usecase "Ver KPIs Dashboard" as UC22
        usecase "Exportar Reportes" as UC23
    }
    
    package "Administración" <<Admin>> {
        usecase "Gestionar Personal" as UC24
        usecase "Generar Códigos Invitación" as UC25
        usecase "Configurar CMS" as UC26
        usecase "Administrar Chatbot" as UC27
        usecase "Sincronizar IA" as UC28
    }
    
    package "Página Web Pública" {
        usecase "Ver Información Clínica" as UC29
        usecase "Consultar Servicios" as UC30
        usecase "Interactuar con Chatbot" as UC31
    }
}

' Relaciones Odontólogo
Odontologo --> UC1
Odontologo --> UC2
Odontologo --> UC3
Odontologo --> UC4
Odontologo --> UC5
Odontologo --> UC6
Odontologo --> UC7
Odontologo --> UC8
Odontologo --> UC9
Odontologo --> UC10
Odontologo --> UC11
Odontologo --> UC12
Odontologo --> UC13
Odontologo --> UC14
Odontologo --> UC15
Odontologo --> UC16
Odontologo --> UC21
Odontologo --> UC22

' Relaciones Admin (hereda de Odontólogo + adicionales)
Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC18
Admin --> UC19
Admin --> UC20
Admin --> UC23
Admin --> UC24
Admin --> UC25
Admin --> UC26
Admin --> UC27
Admin --> UC28

' Relaciones Visitante
Visitante --> UC29
Visitante --> UC30
Visitante --> UC31

' Extensiones e Inclusiones
UC3 ..> UC5 : <<include>>
UC3 ..> UC6 : <<include>>
UC10 ..> UC11 : <<extend>>
UC14 ..> UC17 : <<extend>>
UC27 ..> UC28 : <<include>>

@enduml
```

### 1.2 Casos de Uso - Gestión de Pacientes (Detallado)

```plantuml
@startuml Casos_de_Uso_Pacientes
!theme plain
left to right direction
skinparam actorStyle awesome

title Diagrama de Casos de Uso - Módulo de Pacientes

actor "Odontólogo" as Odontologo
actor "Sistema Externo\n(Cloudinary)" as Cloudinary

rectangle "Gestión de Pacientes" {
    usecase "Registrar Paciente" as UC1
    usecase "Validar DNI Único" as UC1a
    usecase "Generar Número Historia" as UC1b
    
    usecase "Buscar Paciente" as UC2
    usecase "Filtrar por DNI" as UC2a
    usecase "Filtrar por Nombre" as UC2b
    usecase "Filtrar por N° Historia" as UC2c
    
    usecase "Gestionar Filiación" as UC3
    usecase "Registrar Contacto Emergencia" as UC3a
    
    usecase "Gestionar Historia Clínica" as UC4
    usecase "Registrar Antecedentes" as UC4a
    usecase "Registrar Cuestionario" as UC4b
    usecase "Registrar Examen Clínico" as UC4c
    
    usecase "Gestionar Odontograma" as UC5
    usecase "Crear Nueva Versión" as UC5a
    usecase "Marcar Condición Dental" as UC5b
    usecase "Cambiar Tipo Odontograma" as UC5c
    
    usecase "Gestionar Imágenes" as UC6
    usecase "Subir Imagen" as UC6a
    usecase "Clasificar Imagen" as UC6b
    usecase "Ver Imagen Fullscreen" as UC6c
    usecase "Descargar Imagen" as UC6d
}

Odontologo --> UC1
Odontologo --> UC2
Odontologo --> UC3
Odontologo --> UC4
Odontologo --> UC5
Odontologo --> UC6

UC1 ..> UC1a : <<include>>
UC1 ..> UC1b : <<include>>

UC2 <.. UC2a : <<extend>>
UC2 <.. UC2b : <<extend>>
UC2 <.. UC2c : <<extend>>

UC3 ..> UC3a : <<include>>

UC4 ..> UC4a : <<include>>
UC4 ..> UC4b : <<include>>
UC4 <.. UC4c : <<extend>>

UC5 <.. UC5a : <<extend>>
UC5 ..> UC5b : <<include>>
UC5 <.. UC5c : <<extend>>

UC6 ..> UC6a : <<include>>
UC6 ..> UC6b : <<include>>
UC6 <.. UC6c : <<extend>>
UC6 <.. UC6d : <<extend>>

UC6a --> Cloudinary

@enduml
```

---

## 2. Diagrama de Clases

### 2.1 Diagrama de Clases Principal

```plantuml
@startuml Diagrama_de_Clases
!theme plain
skinparam classAttributeIconSize 0
skinparam classFontStyle bold

title Diagrama de Clases - Sistema Dental Company Web

' ========== ENTIDADES PRINCIPALES ==========

class Paciente {
    +id: UUID
    +numero_historia: String
    +nombres: String
    +apellidos: String
    +dni: String
    +fecha_nacimiento: Date
    +genero: String
    +ocupacion: String
    +telefono: String
    +email: String
    +direccion: String
    +contacto_emergencia: JSON
    +created_at: DateTime
    --
    +registrar(): void
    +actualizar(): void
    +buscar(): Paciente
    +obtenerHistoriaClinica(): HistoriaClinica
}

class HistoriaClinica {
    +id: UUID
    +paciente_id: UUID
    +created_at: DateTime
    +updated_at: DateTime
    --
    +crear(): void
    +obtenerAntecedentes(): List<Antecedente>
    +obtenerCuestionario(): List<CuestionarioRespuesta>
}

class Antecedente {
    +id: UUID
    +historia_id: UUID
    +categoria: String
    +datos: JSON
    +no_refiere: Boolean
    +fecha_registro: DateTime
    --
    +registrar(): void
    +actualizar(): void
}

class Odontograma {
    +id: UUID
    +paciente_id: UUID
    +odontograma_data: JSON
    +version: Integer
    +fecha_registro: DateTime
    --
    +crear(): void
    +nuevaVersion(): Odontograma
    +marcarCondicion(): void
}

class CasoClinico {
    +id: UUID
    +historia_id: UUID
    +nombre_caso: String
    +descripcion: String
    +estado: EstadoCaso
    +fecha_inicio: DateTime
    +fecha_cierre: DateTime
    --
    +crear(): void
    +cerrar(): void
    +cambiarEstado(): void
}

class Diagnostico {
    +id: UUID
    +caso_id: UUID
    +odontologo_id: UUID
    +tipo: String
    +cie10_id: Integer
    +fecha: DateTime
    --
    +registrar(): void
}

class Presupuesto {
    +id: UUID
    +paciente_id: UUID
    +caso_id: UUID
    +medico_id: UUID
    +nombre: String
    +costo_total: Decimal
    +total_pagado: Decimal
    +saldo_pendiente: Decimal
    +estado: EstadoPresupuesto
    +moneda_id: UUID
    --
    +crear(): void
    +agregarItem(): void
    +calcularTotal(): Decimal
    +registrarPago(): void
}

class Pago {
    +id: UUID
    +presupuesto_id: UUID
    +paciente_id: UUID
    +monto: Decimal
    +moneda_id: UUID
    +metodo_pago: String
    +tipo_comprobante: String
    +numero_comprobante: String
    +fecha_pago: DateTime
    --
    +registrar(): void
    +anular(): void
}

class Cita {
    +id: UUID
    +paciente_id: UUID
    +odontologo_id: UUID
    +caso_id: UUID
    +fecha_inicio: DateTime
    +fecha_fin: DateTime
    +estado: EstadoCita
    +motivo: String
    +google_calendar_event_id: String
    --
    +agendar(): void
    +confirmar(): void
    +completar(): void
    +cancelar(): void
    +sincronizarGoogle(): void
}

class Personal {
    +id: UUID
    +nombre_completo: String
    +rol: RolUsuario
    +especialidad: String
    +telefono: String
    +email: String
    +activo: Boolean
    --
    +registrar(): void
    +desactivar(): void
}

class Procedimiento {
    +id: UUID
    +nombre: String
    +descripcion: String
    +grupo_id: UUID
    +activo: Boolean
    --
    +crear(): void
    +obtenerPrecios(): List<Precio>
}

class ImagenPaciente {
    +id: UUID
    +paciente_id: UUID
    +caso_id: UUID
    +tipo: String
    +etapa: String
    +url: String
    +public_id: String
    +descripcion: String
    +fecha_captura: Date
    --
    +subir(): void
    +eliminar(): void
}

class Receta {
    +id: UUID
    +caso_id: UUID
    +paciente_id: UUID
    +prescriptor_id: UUID
    +contenido: String
    +pdf_url: String
    +fecha: DateTime
    --
    +crear(): void
    +generarPDF(): String
}

' ========== ENUMERACIONES ==========

enum EstadoCaso {
    ABIERTO
    EN_PROGRESO
    CERRADO
}

enum EstadoPresupuesto {
    POR_COBRAR
    PARCIAL
    PAGADO
}

enum EstadoCita {
    PROGRAMADA
    CONFIRMADA
    COMPLETADA
    CANCELADA
}

enum RolUsuario {
    ADMIN
    ODONTOLOGO
}

' ========== RELACIONES ==========

Paciente "1" -- "1" HistoriaClinica : tiene >
Paciente "1" -- "*" Odontograma : tiene >
Paciente "1" -- "*" CasoClinico : tiene >
Paciente "1" -- "*" Cita : tiene >
Paciente "1" -- "*" ImagenPaciente : tiene >

HistoriaClinica "1" -- "*" Antecedente : contiene >
HistoriaClinica "1" -- "*" CasoClinico : contiene >

CasoClinico "1" -- "*" Diagnostico : tiene >
CasoClinico "1" -- "*" Presupuesto : tiene >
CasoClinico "1" -- "*" Cita : tiene >
CasoClinico "1" -- "*" Receta : tiene >
CasoClinico "1" -- "*" ImagenPaciente : tiene >

Presupuesto "1" -- "*" Pago : recibe >

Personal "1" -- "*" Cita : atiende >
Personal "1" -- "*" Diagnostico : registra >
Personal "1" -- "*" Presupuesto : crea >
Personal "1" -- "*" Receta : prescribe >

Procedimiento "*" -- "*" Presupuesto : incluido en >

CasoClinico --> EstadoCaso
Presupuesto --> EstadoPresupuesto
Cita --> EstadoCita
Personal --> RolUsuario

@enduml
```

### 2.2 Diagrama de Clases - Módulo CMS y Chatbot

```plantuml
@startuml Diagrama_Clases_CMS_Chatbot
!theme plain
skinparam classAttributeIconSize 0

title Diagrama de Clases - Módulos CMS y Chatbot

package "Módulo CMS" {
    class CMSSeccion {
        +id: UUID
        +seccion: String
        +titulo: String
        +subtitulo: String
        +contenido: JSON
        +visible: Boolean
        +orden: Integer
        --
        +actualizar(): void
    }
    
    class CMSServicio {
        +id: UUID
        +nombre: String
        +descripcion: String
        +detalle_completo: String
        +icono: String
        +beneficios: Array
        +duracion: String
        +visible: Boolean
        +orden: Integer
        --
        +crear(): void
        +actualizar(): void
    }
    
    class CMSServicioImagen {
        +id: UUID
        +servicio_id: UUID
        +imagen_url: String
        +public_id: String
        +descripcion: String
        +orden: Integer
        --
        +subir(): void
        +eliminar(): void
    }
    
    class CMSEquipo {
        +id: UUID
        +nombre: String
        +cargo: String
        +especialidad: String
        +foto_url: String
        +curriculum: JSON
        +visible: Boolean
        --
        +crear(): void
        +actualizar(): void
    }
    
    class CMSTema {
        +id: UUID
        +clave: String
        +valor: String
        +tipo: TipoTema
        +grupo: String
        --
        +actualizar(): void
    }
}

package "Módulo Chatbot" {
    class ChatbotFAQ {
        +id: UUID
        +pregunta: String
        +respuesta: String
        +keywords: Array
        +categoria: String
        +prioridad: Integer
        +activo: Boolean
        +embedding: Vector
        --
        +crear(): void
        +actualizar(): void
        +generarEmbedding(): void
    }
    
    class ChatbotContexto {
        +id: UUID
        +titulo: String
        +contenido: String
        +tipo: String
        +activo: Boolean
        +embedding: Vector
        --
        +crear(): void
        +generarEmbedding(): void
    }
    
    class ChatbotConversacion {
        +id: UUID
        +session_id: String
        +pregunta: String
        +respuesta: String
        +modelo: String
        +tokens_usados: Integer
        +tiempo_respuesta_ms: Integer
        +created_at: DateTime
        --
        +registrar(): void
    }
    
    class ChatbotCola {
        +id: UUID
        +session_id: String
        +mensaje: String
        +estado: EstadoCola
        +intentos: Integer
        +error_mensaje: String
        --
        +encolar(): void
        +procesar(): void
    }
    
    class ChatbotRateLimit {
        +id: UUID
        +ip_hash: String
        +requests_count: Integer
        +blocked_until: DateTime
        --
        +verificar(): Boolean
        +incrementar(): void
        +bloquear(): void
    }
}

enum TipoTema {
    COLOR
    FUENTE
    TAMAÑO
    OTRO
}

enum EstadoCola {
    PENDIENTE
    PROCESANDO
    COMPLETADO
    FALLIDO
}

CMSServicio "1" -- "*" CMSServicioImagen : tiene >
ChatbotFAQ --> EstadoCola
CMSTema --> TipoTema

@enduml
```

---

## 3. Diagramas de Secuencia

### 3.1 Registro de Nuevo Paciente

```plantuml
@startuml Secuencia_Registro_Paciente
!theme plain
skinparam sequenceMessageAlign center

title Diagrama de Secuencia - Registro de Nuevo Paciente

actor "Odontólogo" as User
participant "Frontend\n(Next.js)" as Frontend
participant "API Route\n(/api/pacientes)" as API
participant "Supabase\nClient" as Supabase
database "PostgreSQL\n(Supabase)" as DB

User -> Frontend: Completar formulario paciente
activate Frontend

Frontend -> Frontend: Validar datos (Zod)
alt Datos inválidos
    Frontend --> User: Mostrar errores de validación
else Datos válidos
    Frontend -> API: POST /api/pacientes\n{datos_paciente}
    activate API
    
    API -> Supabase: Verificar DNI único
    activate Supabase
    Supabase -> DB: SELECT * FROM pacientes WHERE dni = ?
    activate DB
    DB --> Supabase: resultado
    deactivate DB
    Supabase --> API: {exists: boolean}
    deactivate Supabase
    
    alt DNI ya existe
        API --> Frontend: {error: "DNI ya registrado"}
        Frontend --> User: Mostrar error DNI duplicado
    else DNI disponible
        API -> Supabase: Generar número historia
        activate Supabase
        Supabase -> DB: SELECT generar_numero_historia()
        activate DB
        DB --> Supabase: "2025-00001"
        deactivate DB
        Supabase --> API: numero_historia
        deactivate Supabase
        
        API -> Supabase: INSERT paciente
        activate Supabase
        Supabase -> DB: INSERT INTO pacientes (...)
        activate DB
        DB --> Supabase: paciente_creado
        deactivate DB
        Supabase --> API: {data: paciente}
        deactivate Supabase
        
        API -> Supabase: Crear historia clínica
        activate Supabase
        Supabase -> DB: INSERT INTO historias_clinicas (...)
        activate DB
        DB --> Supabase: historia_creada
        deactivate DB
        Supabase --> API: {data: historia}
        deactivate Supabase
        
        API --> Frontend: {success: true, paciente}
        deactivate API
        Frontend --> User: Redirigir a ficha paciente
    end
end
deactivate Frontend

@enduml
```

### 3.2 Crear Presupuesto y Registrar Pago

```plantuml
@startuml Secuencia_Presupuesto_Pago
!theme plain
skinparam sequenceMessageAlign center

title Diagrama de Secuencia - Crear Presupuesto y Registrar Pago

actor "Odontólogo" as User
participant "Frontend\n(React)" as Frontend
participant "Server Action\n(actions.ts)" as Action
participant "Supabase\nClient" as Supabase
database "PostgreSQL" as DB

== Crear Presupuesto ==

User -> Frontend: Seleccionar procedimientos
activate Frontend
User -> Frontend: Configurar cantidades/precios
User -> Frontend: Clic "Guardar Presupuesto"

Frontend -> Action: upsertPresupuesto(formData, items)
activate Action

Action -> Action: Validar con Zod Schema
Action -> Supabase: Obtener usuario actual
activate Supabase
Supabase --> Action: {user}
deactivate Supabase

Action -> Supabase: Resolver personal/creador
activate Supabase
Supabase -> DB: SELECT FROM personal WHERE email = ?
activate DB
DB --> Supabase: personal_data
deactivate DB
Supabase --> Action: {creador_info}
deactivate Supabase

Action -> Action: Construir items_json
Action -> Action: Calcular costo_total

Action -> Supabase: UPSERT presupuesto
activate Supabase
Supabase -> DB: INSERT/UPDATE presupuestos (...)
activate DB
DB --> Supabase: presupuesto_guardado
deactivate DB
Supabase --> Action: {data}
deactivate Supabase

Action -> Action: revalidatePath()
Action --> Frontend: {success: true, planId}
deactivate Action

Frontend --> User: Toast "Presupuesto guardado"
Frontend -> Frontend: Refrescar tabla

== Registrar Pago ==

User -> Frontend: Clic "Registrar Pago"
User -> Frontend: Ingresar monto y método

Frontend -> Action: registrarPago(pagoData)
activate Action

Action -> Supabase: INSERT pago
activate Supabase
Supabase -> DB: INSERT INTO pagos (...)
activate DB
DB --> Supabase: pago_creado
deactivate DB
Supabase --> Action: {data: pago}
deactivate Supabase

Action -> Supabase: Actualizar presupuesto
activate Supabase
Supabase -> DB: UPDATE presupuestos\nSET total_pagado = total_pagado + monto
activate DB
DB --> Supabase: updated
deactivate DB
Supabase --> Action: {data}
deactivate Supabase

Action -> Action: Calcular nuevo estado
note right: Por Cobrar → Parcial → Pagado

Action -> Supabase: UPDATE estado presupuesto
activate Supabase
Supabase -> DB: UPDATE presupuestos SET estado = ?
activate DB
DB --> Supabase: updated
deactivate DB
Supabase --> Action: {data}
deactivate Supabase

Action --> Frontend: {success: true}
deactivate Action

Frontend --> User: Actualizar barra de progreso
deactivate Frontend

@enduml
```

### 3.3 Agendar Cita con Sincronización Google Calendar

```plantuml
@startuml Secuencia_Agendar_Cita
!theme plain
skinparam sequenceMessageAlign center

title Diagrama de Secuencia - Agendar Cita con Google Calendar

actor "Odontólogo" as User
participant "Frontend\n(CalendarAgregar)" as Frontend
participant "API Route\n(/api/calendar)" as API
participant "Google\nCalendar API" as Google
participant "Supabase" as Supabase
database "PostgreSQL" as DB

User -> Frontend: Seleccionar fecha/hora
activate Frontend
User -> Frontend: Seleccionar paciente
User -> Frontend: Completar datos cita
User -> Frontend: Clic "Agendar"

Frontend -> API: POST /api/calendar/events\n{cita_data}
activate API

API -> Supabase: Verificar disponibilidad
activate Supabase
Supabase -> DB: SELECT FROM citas\nWHERE odontologo_id = ?\nAND fecha_inicio BETWEEN ? AND ?
activate DB
DB --> Supabase: citas_existentes
deactivate DB
Supabase --> API: {disponible: boolean}
deactivate Supabase

alt Horario no disponible
    API --> Frontend: {error: "Horario ocupado"}
    Frontend --> User: Mostrar conflicto
else Horario disponible
    API -> Google: POST /calendar/events\n{summary, start, end, attendees}
    activate Google
    Google --> API: {eventId: "google_event_123"}
    deactivate Google
    
    API -> Supabase: INSERT cita
    activate Supabase
    Supabase -> DB: INSERT INTO citas (\n  ...,\n  google_calendar_event_id\n)
    activate DB
    DB --> Supabase: cita_creada
    deactivate DB
    Supabase --> API: {data: cita}
    deactivate Supabase
    
    API --> Frontend: {success: true, cita}
    deactivate API
    
    Frontend -> Frontend: Actualizar calendario
    Frontend --> User: Toast "Cita agendada"
end

deactivate Frontend

@enduml
```

### 3.4 Interacción con Chatbot (RAG)

```plantuml
@startuml Secuencia_Chatbot
!theme plain
skinparam sequenceMessageAlign center

title Diagrama de Secuencia - Chatbot con RAG

actor "Visitante" as User
participant "Widget\nChatbot" as Widget
participant "API Route\n(/api/chat)" as API
participant "RAG Utils" as RAG
participant "OpenAI\nAPI" as OpenAI
participant "Supabase" as Supabase
database "PostgreSQL\n(Embeddings)" as DB

User -> Widget: Escribir pregunta
activate Widget

Widget -> API: POST /api/chat\n{mensaje, session_id}
activate API

API -> API: Verificar rate limit
API -> Supabase: Check chatbot_rate_limit
activate Supabase
Supabase --> API: {allowed: true}
deactivate Supabase

API -> RAG: buscarContextoRelevante(pregunta)
activate RAG

RAG -> OpenAI: Generar embedding pregunta
activate OpenAI
OpenAI --> RAG: {embedding: vector[1536]}
deactivate OpenAI

RAG -> Supabase: Búsqueda semántica
activate Supabase
Supabase -> DB: SELECT * FROM chatbot_faqs\nORDER BY embedding <=> query_embedding\nLIMIT 5
activate DB
DB --> Supabase: faqs_relevantes
deactivate DB

Supabase -> DB: SELECT * FROM chatbot_contexto\nORDER BY embedding <=> query_embedding\nLIMIT 3
activate DB
DB --> Supabase: contextos_relevantes
deactivate DB
Supabase --> RAG: {faqs, contextos}
deactivate Supabase

RAG -> Supabase: Obtener info clínica (CMS)
activate Supabase
Supabase -> DB: SELECT FROM cms_secciones, cms_servicios
activate DB
DB --> Supabase: info_clinica
deactivate DB
Supabase --> RAG: {info}
deactivate Supabase

RAG --> API: {contexto_completo}
deactivate RAG

API -> API: Construir prompt con contexto
note right
  System: "Eres asistente de {clinica}..."
  Context: FAQs + Servicios + Info
  User: pregunta original
end note

API -> OpenAI: Chat Completion\n{messages, model: "gpt-4"}
activate OpenAI
OpenAI --> API: {respuesta, tokens}
deactivate OpenAI

API -> Supabase: Guardar conversación
activate Supabase
Supabase -> DB: INSERT INTO chatbot_conversaciones
activate DB
DB --> Supabase: saved
deactivate DB
Supabase --> API: ok
deactivate Supabase

API --> Widget: {respuesta, session_id}
deactivate API

Widget -> Widget: Renderizar respuesta (streaming)
Widget --> User: Mostrar respuesta

deactivate Widget

@enduml
```

---

## 4. Modelo Relacional de Base de Datos

### 4.1 Modelo ER Completo

```plantuml
@startuml Modelo_ER_Completo
!theme plain
skinparam linetype ortho

title Modelo Entidad-Relación - Sistema Dental Company Web

' ========== ENTIDADES PRINCIPALES ==========

entity "pacientes" as pacientes {
    *id : UUID <<PK>>
    --
    numero_historia : VARCHAR <<UK>>
    nombres : VARCHAR
    apellidos : VARCHAR
    dni : VARCHAR <<UK>>
    fecha_nacimiento : DATE
    genero : VARCHAR
    ocupacion : VARCHAR
    telefono : VARCHAR
    email : VARCHAR <<UK>>
    direccion : TEXT
    pais : VARCHAR
    departamento : VARCHAR
    provincia : VARCHAR
    distrito : VARCHAR
    contacto_emergencia : JSONB
    talla_m : DECIMAL
    peso_kg : DECIMAL
    imc : DECIMAL
    presion_arterial : VARCHAR
    created_at : TIMESTAMP
}

entity "historias_clinicas" as historias {
    *id : UUID <<PK>>
    --
    paciente_id : UUID <<FK>> <<UK>>
    created_at : TIMESTAMP
    updated_at : TIMESTAMP
}

entity "antecedentes" as antecedentes {
    *id : UUID <<PK>>
    --
    historia_id : UUID <<FK>>
    categoria : VARCHAR
    datos : JSONB
    no_refiere : BOOLEAN
    fecha_registro : TIMESTAMP
}

entity "cuestionario_respuestas" as cuestionario {
    *id : UUID <<PK>>
    --
    historia_id : UUID <<FK>>
    seccion : VARCHAR
    pregunta : VARCHAR
    respuesta_si_no : BOOLEAN
    respuesta_texto : TEXT
    detalle : TEXT
}

entity "odontogramas" as odontogramas {
    *id : UUID <<PK>>
    --
    paciente_id : UUID <<FK>>
    odontograma_data : JSONB
    version : INTEGER
    fecha_registro : TIMESTAMP
}

entity "casos_clinicos" as casos {
    *id : UUID <<PK>>
    --
    historia_id : UUID <<FK>>
    nombre_caso : VARCHAR
    descripcion : TEXT
    estado : VARCHAR
    fecha_inicio : TIMESTAMP
    fecha_cierre : TIMESTAMP
}

entity "diagnosticos" as diagnosticos {
    *id : UUID <<PK>>
    --
    caso_id : UUID <<FK>>
    odontologo_id : UUID <<FK>>
    cie10_id : INTEGER <<FK>>
    tipo : VARCHAR
    fecha : TIMESTAMP
}

entity "cie10_catalogo" as cie10 {
    *id : INTEGER <<PK>>
    --
    codigo : VARCHAR <<UK>>
    descripcion : TEXT
}

entity "presupuestos" as presupuestos {
    *id : UUID <<PK>>
    --
    paciente_id : UUID <<FK>>
    caso_id : UUID <<FK>>
    medico_id : UUID <<FK>>
    moneda_id : UUID <<FK>>
    nombre : VARCHAR
    observacion : TEXT
    costo_total : DECIMAL
    total_pagado : DECIMAL
    saldo_pendiente : DECIMAL
    estado : VARCHAR
    fecha_creacion : TIMESTAMP
}

entity "pagos" as pagos {
    *id : UUID <<PK>>
    --
    presupuesto_id : UUID <<FK>>
    paciente_id : UUID <<FK>>
    moneda_id : UUID <<FK>>
    recibido_por : UUID <<FK>>
    monto : DECIMAL
    metodo_pago : VARCHAR
    tipo_comprobante : VARCHAR
    numero_comprobante : VARCHAR
    fecha_pago : TIMESTAMP
}

entity "citas" as citas {
    *id : UUID <<PK>>
    --
    paciente_id : UUID <<FK>>
    odontologo_id : UUID <<FK>>
    caso_id : UUID <<FK>>
    moneda_id : UUID <<FK>>
    nombre_cita : VARCHAR
    fecha_inicio : TIMESTAMP
    fecha_fin : TIMESTAMP
    estado : ENUM
    motivo : TEXT
    google_calendar_event_id : VARCHAR
    created_at : TIMESTAMP
}

entity "personal" as personal {
    *id : UUID <<PK>> <<FK>>
    --
    nombre_completo : VARCHAR
    rol : ENUM
    especialidad : VARCHAR
    telefono : VARCHAR
    email : VARCHAR <<UK>>
    activo : BOOLEAN
    created_at : TIMESTAMP
}

entity "procedimientos" as procedimientos {
    *id : UUID <<PK>>
    --
    grupo_id : UUID <<FK>>
    unidad_id : UUID <<FK>>
    nombre : VARCHAR <<UK>>
    descripcion : TEXT
    tipo : VARCHAR
    activo : BOOLEAN
}

entity "grupos_procedimiento" as grupos {
    *id : UUID <<PK>>
    --
    nombre : VARCHAR <<UK>>
    descripcion : TEXT
}

entity "procedimiento_precios" as precios {
    *id : UUID <<PK>>
    --
    procedimiento_id : UUID <<FK>>
    moneda_id : UUID <<FK>>
    precio : DECIMAL
    vigente_desde : DATE
    vigente_hasta : DATE
}

entity "monedas" as monedas {
    *id : UUID <<PK>>
    --
    codigo : VARCHAR <<UK>>
    nombre : VARCHAR
    simbolo : VARCHAR
}

entity "imagenes_pacientes" as imagenes {
    *id : UUID <<PK>>
    --
    paciente_id : UUID <<FK>>
    caso_id : UUID <<FK>>
    tipo : VARCHAR
    etapa : VARCHAR
    url : TEXT
    public_id : VARCHAR
    descripcion : TEXT
    fecha_captura : DATE
}

entity "recetas" as recetas {
    *id : UUID <<PK>>
    --
    caso_id : UUID <<FK>>
    cita_id : UUID <<FK>>
    paciente_id : UUID <<FK>>
    prescriptor_id : UUID <<FK>>
    contenido : TEXT
    pdf_url : TEXT
    fecha : TIMESTAMP
}

entity "consentimientos" as consentimientos {
    *id : UUID <<PK>>
    --
    caso_id : UUID <<FK>>
    paciente_id : UUID <<FK>>
    firmado_por : UUID <<FK>>
    tipo : VARCHAR
    documento_url : TEXT
    firmado : BOOLEAN
    fecha_firma : TIMESTAMP
}

' ========== RELACIONES ==========

pacientes ||--|| historias : "tiene"
historias ||--o{ antecedentes : "contiene"
historias ||--o{ cuestionario : "contiene"
historias ||--o{ casos : "contiene"
pacientes ||--o{ odontogramas : "tiene"
pacientes ||--o{ citas : "tiene"
pacientes ||--o{ imagenes : "tiene"
pacientes ||--o{ presupuestos : "tiene"
pacientes ||--o{ pagos : "realiza"

casos ||--o{ diagnosticos : "tiene"
casos ||--o{ presupuestos : "tiene"
casos ||--o{ citas : "tiene"
casos ||--o{ recetas : "tiene"
casos ||--o{ consentimientos : "tiene"
casos ||--o{ imagenes : "tiene"

presupuestos ||--o{ pagos : "recibe"
presupuestos }o--|| monedas : "usa"

personal ||--o{ citas : "atiende"
personal ||--o{ diagnosticos : "registra"
personal ||--o{ presupuestos : "crea"
personal ||--o{ recetas : "prescribe"
personal ||--o{ pagos : "recibe"
personal ||--o{ consentimientos : "firma"

diagnosticos }o--|| cie10 : "clasifica"

procedimientos }o--|| grupos : "pertenece"
procedimientos ||--o{ precios : "tiene"
precios }o--|| monedas : "en"

citas }o--|| monedas : "usa"

@enduml
```

### 4.2 Modelo ER - Módulo CMS y Chatbot

```plantuml
@startuml Modelo_ER_CMS_Chatbot
!theme plain
skinparam linetype ortho

title Modelo ER - Módulos CMS y Chatbot

' ========== CMS ==========

entity "cms_secciones" as secciones {
    *id : UUID <<PK>>
    --
    seccion : VARCHAR <<UK>>
    titulo : VARCHAR
    subtitulo : VARCHAR
    contenido : JSONB
    orden : INTEGER
    visible : BOOLEAN
    updated_at : TIMESTAMP
    updated_by : UUID <<FK>>
}

entity "cms_servicios" as servicios {
    *id : UUID <<PK>>
    --
    nombre : VARCHAR
    descripcion : TEXT
    detalle_completo : TEXT
    icono : VARCHAR
    beneficios : TEXT[]
    duracion : VARCHAR
    recomendaciones : TEXT
    orden : INTEGER
    visible : BOOLEAN
}

entity "cms_servicio_imagenes" as serv_img {
    *id : UUID <<PK>>
    --
    servicio_id : UUID <<FK>>
    imagen_url : TEXT
    public_id : VARCHAR
    descripcion : TEXT
    orden : INTEGER
    visible : BOOLEAN
}

entity "cms_equipo" as equipo {
    *id : UUID <<PK>>
    --
    nombre : VARCHAR
    cargo : VARCHAR
    especialidad : VARCHAR
    foto_url : TEXT
    foto_public_id : VARCHAR
    curriculum : JSONB
    orden : INTEGER
    visible : BOOLEAN
}

entity "cms_tema" as tema {
    *id : UUID <<PK>>
    --
    clave : VARCHAR <<UK>>
    valor : VARCHAR
    tipo : VARCHAR
    descripcion : TEXT
    grupo : VARCHAR
}

entity "cms_carrusel" as carrusel {
    *id : UUID <<PK>>
    --
    imagen_url : TEXT
    alt_text : VARCHAR
    orden : INTEGER
    visible : BOOLEAN
}

' ========== CHATBOT ==========

entity "chatbot_faqs" as faqs {
    *id : UUID <<PK>>
    --
    pregunta : TEXT
    respuesta : TEXT
    keywords : TEXT[]
    categoria : VARCHAR
    prioridad : INTEGER
    activo : BOOLEAN
    embedding : VECTOR(1536)
    embedding_updated_at : TIMESTAMP
}

entity "chatbot_contexto" as contexto {
    *id : UUID <<PK>>
    --
    titulo : VARCHAR
    contenido : TEXT
    tipo : VARCHAR
    activo : BOOLEAN
    embedding : VECTOR(1536)
    embedding_updated_at : TIMESTAMP
}

entity "chatbot_conversaciones" as conversaciones {
    *id : UUID <<PK>>
    --
    session_id : VARCHAR
    pregunta : TEXT
    respuesta : TEXT
    modelo : VARCHAR
    tokens_usados : INTEGER
    tiempo_respuesta_ms : INTEGER
    ip_hash : VARCHAR
    created_at : TIMESTAMP
    expires_at : TIMESTAMP
}

entity "chatbot_cola" as cola {
    *id : UUID <<PK>>
    --
    session_id : VARCHAR
    mensaje : TEXT
    estado : VARCHAR
    intentos : INTEGER
    max_intentos : INTEGER
    error_mensaje : TEXT
    created_at : TIMESTAMP
    processed_at : TIMESTAMP
}

entity "chatbot_rate_limit" as rate_limit {
    *id : UUID <<PK>>
    --
    ip_hash : VARCHAR <<UK>>
    requests_count : INTEGER
    first_request_at : TIMESTAMP
    last_request_at : TIMESTAMP
    blocked_until : TIMESTAMP
}

' ========== CONFIGURACIÓN ==========

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

entity "config_seguridad" as config {
    *id : UUID <<PK>>
    --
    clave : VARCHAR <<UK>>
    valor : TEXT
    descripcion : TEXT
}

entity "ajustes_aplicacion" as ajustes {
    *id : UUID <<PK>>
    --
    clave : VARCHAR <<UK>>
    valor : TEXT
    grupo : VARCHAR
    tipo : ENUM
    descripcion : TEXT
    orden : INTEGER
}

' ========== RELACIONES ==========

servicios ||--o{ serv_img : "tiene"

@enduml
```

---

## 5. Diagrama de Componentes

```plantuml
@startuml Diagrama_Componentes
!theme plain
skinparam componentStyle uml2

title Diagrama de Componentes - Arquitectura del Sistema

package "Cliente (Browser)" {
    [Aplicación Next.js\n(React)] as NextApp
    [Componentes UI\n(shadcn/ui)] as UIComponents
    [Estado Local\n(useState/useEffect)] as State
}

package "Servidor Next.js" {
    package "App Router" {
        [Pages\n(app/)] as Pages
        [API Routes\n(app/api/)] as APIRoutes
        [Server Actions\n(actions.ts)] as ServerActions
        [Middleware\n(auth)] as Middleware
    }
    
    package "Componentes Servidor" {
        [React Server\nComponents] as RSC
        [Data Fetching] as DataFetch
    }
}

package "Servicios Externos" {
    cloud "Supabase" {
        [Auth Service] as SupaAuth
        [Database\n(PostgreSQL)] as SupaDB
        [Storage] as SupaStorage
        [Realtime] as SupaRealtime
    }
    
    cloud "Cloudinary" {
        [Image CDN] as CloudinaryCDN
        [Image Transform] as CloudinaryTransform
    }
    
    cloud "Google" {
        [Calendar API] as GoogleCal
        [OAuth 2.0] as GoogleOAuth
    }
    
    cloud "OpenAI" {
        [GPT-4 API] as GPT4
        [Embeddings API] as Embeddings
    }
}

package "Librerías Core" {
    [Zod\n(Validación)] as Zod
    [React Query\n(Cache)] as ReactQuery
    [Tailwind CSS] as Tailwind
}

' Conexiones Cliente
NextApp --> UIComponents
NextApp --> State
UIComponents --> Tailwind

' Conexiones Servidor
Pages --> RSC
Pages --> ServerActions
APIRoutes --> DataFetch
ServerActions --> Zod
Middleware --> SupaAuth

' Conexiones a Servicios
DataFetch --> SupaDB
ServerActions --> SupaDB
APIRoutes --> SupaAuth
APIRoutes --> CloudinaryCDN
APIRoutes --> GoogleCal
APIRoutes --> GPT4
APIRoutes --> Embeddings

' Conexiones internas Supabase
SupaAuth --> SupaDB
SupaStorage --> CloudinaryTransform

@enduml
```

---

## 6. Diagrama de Estados

### 6.1 Estados de un Caso Clínico

```plantuml
@startuml Estados_Caso_Clinico
!theme plain
skinparam state {
    BackgroundColor<<abierto>> LightBlue
    BackgroundColor<<progreso>> LightGreen
    BackgroundColor<<cerrado>> LightGray
}

title Diagrama de Estados - Caso Clínico

[*] --> Abierto : Crear caso

state "Abierto" as Abierto <<abierto>> {
    Abierto : Sin tratamiento iniciado
    Abierto : Puede agregar diagnósticos
    Abierto : Puede crear presupuestos
}

state "En Progreso" as EnProgreso <<progreso>> {
    EnProgreso : Tratamiento activo
    EnProgreso : Citas en curso
    EnProgreso : Pagos parciales
}

state "Cerrado" as Cerrado <<cerrado>> {
    Cerrado : Tratamiento finalizado
    Cerrado : Todos pagos completados
    Cerrado : Solo lectura
}

Abierto --> EnProgreso : Iniciar tratamiento\n[presupuesto aprobado]
Abierto --> Cerrado : Cerrar sin tratamiento\n[cancelación]

EnProgreso --> Cerrado : Finalizar tratamiento\n[objetivos cumplidos]
EnProgreso --> Abierto : Pausar tratamiento\n[por solicitud]

Cerrado --> EnProgreso : Reabrir caso\n[complicación/seguimiento]

note right of Abierto
  Estado inicial
  al crear el caso
end note

note right of EnProgreso
  Automático cuando
  se agenda primera cita
  o se aprueba presupuesto
end note

note right of Cerrado
  Manual por el
  odontólogo tratante
end note

@enduml
```

### 6.2 Estados de una Cita

```plantuml
@startuml Estados_Cita
!theme plain
skinparam state {
    BackgroundColor<<prog>> #87CEEB
    BackgroundColor<<conf>> #90EE90
    BackgroundColor<<comp>> #D3D3D3
    BackgroundColor<<canc>> #FFB6C1
}

title Diagrama de Estados - Cita

[*] --> Programada : Agendar cita

state "Programada" as Programada <<prog>> {
    Programada : Cita agendada
    Programada : Pendiente confirmación
    Programada : Sincronizada con Google
}

state "Confirmada" as Confirmada <<conf>> {
    Confirmada : Paciente confirmó asistencia
    Confirmada : Recordatorio enviado
}

state "Completada" as Completada <<comp>> {
    Completada : Cita realizada
    Completada : Notas registradas
    Completada : Puede generar seguimiento
}

state "Cancelada" as Cancelada <<canc>> {
    Cancelada : Cita anulada
    Cancelada : Evento Google eliminado
    Cancelada : Registro histórico
}

Programada --> Confirmada : Confirmar\n[paciente acepta]
Programada --> Cancelada : Cancelar\n[por paciente/clínica]
Programada --> Completada : Completar\n[atención sin confirmar]

Confirmada --> Completada : Completar\n[cita realizada]
Confirmada --> Cancelada : Cancelar\n[emergencia/no show]
Confirmada --> Programada : Reprogramar\n[cambio de fecha]

Completada --> [*]
Cancelada --> [*]

note right of Programada
  Color azul en
  calendario
end note

note right of Confirmada
  Color verde en
  calendario
end note

note right of Cancelada
  Color rojo en
  calendario
end note

@enduml
```

### 6.3 Estados de un Presupuesto

```plantuml
@startuml Estados_Presupuesto
!theme plain

title Diagrama de Estados - Presupuesto

[*] --> Propuesto : Crear presupuesto

state "Propuesto" as Propuesto {
    Propuesto : Pendiente aprobación
    Propuesto : Total: 100%
    Propuesto : Pagado: 0%
}

state "Por Cobrar" as PorCobrar {
    PorCobrar : Aprobado por paciente
    PorCobrar : Tratamiento autorizado
    PorCobrar : Sin pagos registrados
}

state "Parcial" as Parcial {
    Parcial : Pagos parciales recibidos
    Parcial : 0% < Pagado < 100%
    Parcial : Saldo pendiente activo
}

state "Pagado" as Pagado {
    Pagado : Totalmente cancelado
    Pagado : Pagado: 100%
    Pagado : Saldo: 0
}

state "Anulado" as Anulado {
    Anulado : Presupuesto cancelado
    Anulado : No se realizó tratamiento
}

Propuesto --> PorCobrar : Aprobar\n[paciente acepta]
Propuesto --> Anulado : Rechazar\n[paciente no acepta]

PorCobrar --> Parcial : Registrar pago\n[monto < total]
PorCobrar --> Pagado : Registrar pago\n[monto = total]
PorCobrar --> Anulado : Anular\n[cancelación]

Parcial --> Parcial : Registrar pago\n[saldo > 0]
Parcial --> Pagado : Registrar pago\n[saldo = 0]

Pagado --> [*]
Anulado --> [*]

note bottom of Parcial
  Estado calculado automáticamente:
  total_pagado / costo_total * 100
end note

@enduml
```

---

## 7. Diagrama de Actividades

### 7.1 Proceso de Atención al Paciente

```plantuml
@startuml Actividad_Atencion_Paciente
!theme plain
skinparam activityShape octagon

title Diagrama de Actividades - Proceso de Atención al Paciente

start

:Paciente llega a la clínica;

if (¿Es paciente nuevo?) then (Sí)
    :Registrar datos del paciente;
    :Generar número de historia;
    :Crear historia clínica;
    :Completar filiación;
    :Registrar antecedentes;
else (No)
    :Buscar paciente por DNI/Nombre;
    :Verificar datos actualizados;
endif

:Realizar examen clínico inicial;
:Registrar signos vitales;
:Evaluar estado dental;
:Actualizar odontograma;

if (¿Requiere tratamiento?) then (Sí)
    :Crear caso clínico;
    
    fork
        :Registrar diagnósticos\n(CIE-10);
    fork again
        :Tomar fotografías\nintraorales;
    fork again
        :Solicitar radiografías\n(si aplica);
    end fork
    
    :Crear presupuesto;
    :Agregar procedimientos;
    :Calcular costo total;
    
    :Presentar presupuesto al paciente;
    
    if (¿Paciente acepta?) then (Sí)
        :Aprobar presupuesto;
        
        if (¿Pago inicial?) then (Sí)
            :Registrar pago;
            :Emitir comprobante;
        else (No)
        endif
        
        :Agendar próxima cita;
        :Sincronizar con Google Calendar;
        
        if (¿Tratamiento inmediato?) then (Sí)
            :Realizar procedimiento;
            :Actualizar odontograma;
            :Registrar notas clínicas;
            
            if (¿Requiere medicación?) then (Sí)
                :Generar receta;
                :Imprimir PDF;
            else (No)
            endif
        else (No)
        endif
        
    else (No)
        :Registrar rechazo;
        :Ofrecer alternativas;
    endif
    
else (No)
    :Registrar consulta informativa;
    :Dar recomendaciones;
endif

:Actualizar historia clínica;
:Despedir al paciente;

stop

@enduml
```

### 7.2 Proceso de Gestión de Citas

```plantuml
@startuml Actividad_Gestion_Citas
!theme plain

title Diagrama de Actividades - Gestión de Citas

|Recepcionista/Odontólogo|
start
:Abrir módulo de citas;
:Ver calendario;

if (¿Nueva cita?) then (Sí)
    :Buscar paciente;
    
    if (¿Paciente encontrado?) then (Sí)
        :Seleccionar paciente;
    else (No)
        :Registrar nuevo paciente;
    endif
    
    :Seleccionar fecha y hora;
    
    |Sistema|
    :Verificar disponibilidad\nodontólogo;
    
    if (¿Horario disponible?) then (Sí)
        :Mostrar slot disponible;
    else (No)
        :Mostrar conflicto;
        |Recepcionista/Odontólogo|
        :Seleccionar otro horario;
        |Sistema|
    endif
    
    |Recepcionista/Odontólogo|
    :Seleccionar odontólogo;
    :Ingresar motivo de cita;
    :Seleccionar duración;
    
    if (¿Vincular a caso?) then (Sí)
        :Seleccionar caso clínico;
    else (No)
    endif
    
    :Confirmar cita;
    
    |Sistema|
    :Guardar cita en BD;
    :Crear evento Google Calendar;
    :Enviar confirmación;
    
else (No)
    |Recepcionista/Odontólogo|
    
    if (¿Modificar cita?) then (Sí)
        :Seleccionar cita existente;
        
        switch (Acción)
        case (Confirmar)
            :Cambiar estado a Confirmada;
        case (Reprogramar)
            :Seleccionar nueva fecha;
            |Sistema|
            :Actualizar evento Google;
        case (Cancelar)
            :Registrar motivo cancelación;
            |Sistema|
            :Eliminar evento Google;
            :Cambiar estado a Cancelada;
        case (Completar)
            |Recepcionista/Odontólogo|
            :Registrar notas de atención;
            |Sistema|
            :Cambiar estado a Completada;
        endswitch
        
    else (No)
        :Ver historial de citas;
        :Filtrar por estado/fecha;
    endif
endif

|Sistema|
:Actualizar calendario;
:Refrescar vista;

|Recepcionista/Odontólogo|
stop

@enduml
```

---

## 8. Diagrama de Despliegue

```plantuml
@startuml Diagrama_Despliegue
!theme plain
skinparam nodeStyle rectangle

title Diagrama de Despliegue - Infraestructura del Sistema

node "Cliente" {
    node "Navegador Web" as Browser {
        artifact "Next.js App\n(React SPA)" as ReactApp
        artifact "Service Worker\n(Cache)" as SW
    }
}

node "Vercel Edge Network" as Vercel {
    node "Edge Functions" as Edge {
        artifact "Middleware\n(Auth)" as AuthMiddleware
    }
    
    node "Serverless Functions" as Serverless {
        artifact "API Routes\n(/api/*)" as APIRoutes
        artifact "Server Actions" as Actions
        artifact "React Server\nComponents" as RSC
    }
    
    database "Edge Cache" as EdgeCache
}

cloud "Supabase Cloud" as Supabase {
    node "Auth Service" as SupaAuth {
        artifact "JWT Provider" as JWT
        artifact "OAuth Providers" as OAuth
    }
    
    node "PostgreSQL 15" as SupaDB {
        database "dental_company_db" as DB {
            artifact "Tables" as Tables
            artifact "Functions" as Functions
            artifact "Triggers" as Triggers
            artifact "RLS Policies" as RLS
        }
        
        database "pgvector" as Vector {
            artifact "Embeddings\nStorage" as EmbeddingsStore
        }
    }
    
    node "Realtime" as Realtime {
        artifact "WebSocket\nServer" as WS
    }
}

cloud "Cloudinary CDN" as Cloudinary {
    node "Media Storage" as MediaStorage {
        artifact "Images\nRepository" as Images
    }
    
    node "Transform API" as Transform {
        artifact "Image\nOptimization" as Optimize
    }
}

cloud "Google Cloud" as Google {
    node "Calendar API" as CalAPI {
        artifact "Events\nManagement" as Events
    }
    
    node "OAuth 2.0" as GoogleOAuth {
        artifact "Token\nService" as Tokens
    }
}

cloud "OpenAI API" as OpenAI {
    node "GPT-4" as GPT {
        artifact "Chat\nCompletions" as Chat
    }
    
    node "Embeddings" as EmbAPI {
        artifact "text-embedding-\nada-002" as Ada
    }
}

' Conexiones
Browser --> Vercel : HTTPS
ReactApp --> SW : Cache API

Vercel --> Supabase : REST/GraphQL
Edge --> SupaAuth : JWT Verify
Serverless --> SupaDB : PostgreSQL
Serverless --> Realtime : WebSocket

Serverless --> Cloudinary : REST API
Serverless --> Google : REST API
Serverless --> OpenAI : REST API

SupaAuth --> OAuth : Federation
SupaDB --> Vector : Extension

note right of Vercel
  **Vercel Configuration:**
  - Region: iad1 (US East)
  - Node.js 20.x
  - Edge Runtime
end note

note right of Supabase
  **Supabase Plan:**
  - Pro Plan
  - Region: us-east-1
  - pgvector extension
end note

note bottom of Cloudinary
  **Storage:**
  - Auto optimization
  - Lazy loading
  - Responsive images
end note

@enduml
```

---

## 📝 Notas de Implementación

### Herramientas Utilizadas
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Server Actions
- **Base de Datos:** PostgreSQL (Supabase)
- **Autenticación:** Supabase Auth con JWT
- **Almacenamiento de Imágenes:** Cloudinary
- **IA/Chatbot:** OpenAI GPT-4, pgvector para embeddings
- **Calendario:** Google Calendar API

### Convenciones de Diagramas
- Los colores en diagramas de estado indican el nivel de actividad
- Las relaciones con líneas punteadas indican dependencias opcionales
- Los estereotipos `<<include>>` y `<<extend>>` siguen la notación UML estándar

---

**Documento generado:** Diciembre 2025  
**Sistema:** Dental Company Web v1.0

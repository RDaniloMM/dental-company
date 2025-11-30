# 📖 Manual de Usuario - Sistema Dental Company Web

---

## 📑 Índice

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
   - 2.1 [Inicio de Sesión](#21-inicio-de-sesión)
   - 2.2 [Recuperar Contraseña](#22-recuperar-contraseña)
   - 2.3 [Registro con Código de Invitación](#23-registro-con-código-de-invitación)
3. [Roles de Usuario](#3-roles-de-usuario)
4. [Navegación Principal](#4-navegación-principal)
5. [Dashboard / Inicio](#5-dashboard--inicio)
   - 5.1 [KPIs y Métricas](#51-kpis-y-métricas)
   - 5.2 [Calendario Integrado](#52-calendario-integrado)
6. [Historias Clínicas / Pacientes](#6-historias-clínicas--pacientes)
   - 6.1 [Lista de Pacientes](#61-lista-de-pacientes)
   - 6.2 [Registrar Nuevo Paciente](#62-registrar-nuevo-paciente)
   - 6.3 [Búsqueda de Pacientes](#63-búsqueda-de-pacientes)
7. [Ficha Odontológica del Paciente](#7-ficha-odontológica-del-paciente)
   - 7.1 [Filiación](#71-filiación)
   - 7.2 [Historia Clínica](#72-historia-clínica)
   - 7.3 [Imágenes del Paciente](#73-imágenes-del-paciente)
   - 7.4 [Odontograma Digital](#74-odontograma-digital)
8. [Casos Clínicos](#8-casos-clínicos)
   - 8.1 [Crear Caso Clínico](#81-crear-caso-clínico)
   - 8.2 [Diagnóstico](#82-diagnóstico)
   - 8.3 [Presupuesto](#83-presupuesto)
   - 8.4 [Pagos](#84-pagos)
   - 8.5 [Citas del Caso](#85-citas-del-caso)
   - 8.6 [Recetas](#86-recetas)
   - 8.7 [Consentimientos](#87-consentimientos)
   - 8.8 [Imágenes del Caso](#88-imágenes-del-caso)
9. [Gestión de Citas](#9-gestión-de-citas)
   - 9.1 [Vista Calendario](#91-vista-calendario)
   - 9.2 [Agendar Nueva Cita](#92-agendar-nueva-cita)
   - 9.3 [Historial de Citas](#93-historial-de-citas)
10. [Tratamientos y Procedimientos](#10-tratamientos-y-procedimientos)
    - 10.1 [Lista de Procedimientos](#101-lista-de-procedimientos)
    - 10.2 [Grupos de Procedimientos](#102-grupos-de-procedimientos)
11. [Reportes](#11-reportes)
12. [Personal de la Clínica](#12-personal-de-la-clínica-solo-administrador)
    - 12.1 [Gestión de Personal](#121-gestión-de-personal)
    - 12.2 [Códigos de Invitación](#122-códigos-de-invitación)
13. [Gestor CMS](#13-gestor-cms-solo-administrador)
    - 13.1 [Información General](#131-información-general)
    - 13.2 [Servicios](#132-servicios)
    - 13.3 [Equipo Médico](#133-equipo-médico)
    - 13.4 [Tema Visual](#134-tema-visual)
14. [Configuración del Chatbot](#14-configuración-del-chatbot-solo-administrador)
    - 14.1 [Configuración General](#141-configuración-general)
    - 14.2 [FAQs](#142-faqs)
    - 14.3 [Contextos Adicionales](#143-contextos-adicionales)
    - 14.4 [Sincronización IA](#144-sincronización-ia)
15. [Visor de Imágenes](#15-visor-de-imágenes)
16. [Ajustes de Cuenta](#16-ajustes-de-cuenta)
17. [Preguntas Frecuentes](#17-preguntas-frecuentes)

---

## 1. Introducción

**Dental Company Web** es un sistema integral de gestión para clínicas dentales que permite administrar de manera eficiente:

- 👤 Pacientes e historias clínicas
- 🦷 Odontogramas digitales
- 📋 Casos clínicos y tratamientos
- 💰 Presupuestos y pagos
- 📅 Citas y agenda
- 📊 Reportes y estadísticas
- 🌐 Contenido de la página web pública
- 🤖 Chatbot inteligente con IA

El sistema está diseñado para ser intuitivo y accesible desde cualquier dispositivo con conexión a internet.

---

## 2. Acceso al Sistema

### 2.1 Inicio de Sesión

1. Ingrese a la URL del sistema proporcionada por su administrador
2. En la pantalla de inicio de sesión, ingrese:
   - **Correo electrónico:** Su email registrado
   - **Contraseña:** Su contraseña de acceso
3. Haga clic en **"Iniciar Sesión"**

> 💡 **Tip:** Marque la casilla "Recordarme" para mantener su sesión activa.

### 2.2 Recuperar Contraseña

Si olvidó su contraseña:

1. En la pantalla de inicio de sesión, haga clic en **"¿Olvidaste tu contraseña?"**
2. Ingrese su correo electrónico registrado
3. Recibirá un email con un enlace para restablecer su contraseña
4. Siga las instrucciones del email para crear una nueva contraseña

### 2.3 Registro con Código de Invitación

Para nuevos usuarios:

1. Solicite un código de invitación a su administrador
2. Acceda al enlace de registro
3. Ingrese el código de invitación
4. Complete sus datos personales
5. Cree su contraseña
6. Haga clic en **"Registrarse"**

---

## 3. Roles de Usuario

El sistema cuenta con dos roles principales:

| Rol               | Descripción               | Acceso                                                                                      |
| ----------------- | ------------------------- | ------------------------------------------------------------------------------------------- |
| **Administrador** | Control total del sistema | Todos los módulos, incluyendo Personal, CMS y Chatbot                                       |
| **Odontólogo**    | Usuario clínico           | Módulos clínicos (pacientes, citas, tratamientos) sin acceso a configuración administrativa |

---

## 4. Navegación Principal

El menú lateral (sidebar) contiene las siguientes secciones:

**Para todos los usuarios:**

- 🏠 **Inicio** - Dashboard principal con KPIs
- 📁 **Historias Clínicas** - Gestión de pacientes
- 📅 **Citas** - Calendario y agenda
- 🩺 **Tratamientos** - Procedimientos y precios
- 📊 **Reportes** - Generación de PDFs
- ⚙️ **Mi Cuenta** - Configuración personal
- ❓ **Ayuda** - Soporte y documentación

**Solo para Administradores:**

- 👥 **Personal de la Clínica** - Gestión de usuarios
- 📋 **Gestor CMS** - Contenido de la página web
- 🤖 **Chatbot** - Base de conocimiento IA

---

## 5. Dashboard / Inicio

### 5.1 KPIs y Métricas

El dashboard muestra tarjetas con métricas clave:

- **Total de Pacientes:** Número total y crecimiento mensual
- **Citas del Día/Semana:** Cantidad de citas programadas
- **Ingresos del Mes:** Total de ingresos con comparativa al mes anterior
- **Tratamientos Activos:** Casos clínicos en progreso

**Gráficos disponibles:**

- Estado de citas (programadas, confirmadas, completadas, canceladas)
- Estado de tratamientos
- Top procedimientos más realizados

### 5.2 Calendario Integrado

Vista rápida del calendario con las citas del día/semana actual, integrado con Google Calendar.

---

## 6. Historias Clínicas / Pacientes

### 6.1 Lista de Pacientes

La pantalla principal muestra:

- **Tabla de pacientes** con columnas configurables:

  - Número de historia
  - Nombres y apellidos
  - DNI
  - Fecha de nacimiento
  - Teléfono
  - Email
  - Fecha de registro

- **Estadísticas:**
  - Total de pacientes
  - Nuevos del mes
  - Distribución por género

> 💡 **Tip:** Haga clic en el icono de columnas para mostrar/ocultar campos según sus necesidades.

### 6.2 Registrar Nuevo Paciente

1. Haga clic en el botón **"Nuevo Paciente"**
2. Complete los datos obligatorios:
   - Nombres
   - Apellido paterno
   - DNI
   - Fecha de nacimiento
   - Sexo
3. Complete datos opcionales (teléfono, email, dirección)
4. Elija una opción:
   - **Registrar:** Guarda solo los datos básicos
   - **Registrar y Completar Ficha:** Guarda y abre la ficha completa de filiación

### 6.3 Búsqueda de Pacientes

Utilice la barra de búsqueda para encontrar pacientes por:

- Nombre o apellidos
- Número de DNI
- Número de historia clínica

---

## 7. Ficha Odontológica del Paciente

Al seleccionar un paciente, accede a su ficha completa con las siguientes secciones:

### 7.1 Filiación

Datos personales completos del paciente:

- **Datos personales:** Nombres, apellidos, DNI, fecha de nacimiento, sexo, estado civil, ocupación
- **Contacto:** Teléfono, celular, email
- **Ubicación:** País, departamento/región, provincia, distrito, dirección
- **Contacto de emergencia:** Nombre, parentesco, teléfono (obligatorio)
- **Referido:** Cómo conoció la clínica

### 7.2 Historia Clínica

#### Antecedentes Patológicos

El sistema registra antecedentes organizados por sistemas:

| Sistema                   | Ejemplos                         |
| ------------------------- | -------------------------------- |
| Cardiovascular            | Hipertensión, arritmias, soplos  |
| Respiratorio              | Asma, bronquitis, TBC            |
| Endocrino-metabólico      | Diabetes, tiroides               |
| Neurológico-psiquiátrico  | Epilepsia, depresión             |
| Hematológico-inmunológico | Anemia, VIH, hepatitis           |
| Digestivo-hepático        | Gastritis, hepatitis             |
| Renal                     | Insuficiencia renal              |
| Alergias                  | Medicamentos, látex, anestésicos |
| Otros                     | Embarazo, cirugías previas       |

Para cada antecedente puede indicar:

- Estado (Sí/No)
- Observaciones específicas

#### Cuestionario de Hábitos

- Consumo de tabaco
- Consumo de alcohol
- Uso de drogas
- Otros hábitos relevantes

#### Examen Clínico

- Talla y peso
- IMC (calculado automáticamente)
- Presión arterial
- Frecuencia cardíaca

### 7.3 Imágenes del Paciente

Galería para almacenar imágenes clínicas:

**Tipos de imágenes:**

- Radiografías
- Fotografías intraorales
- Retratos
- Panorámicas
- Periapicales
- Modelos de estudio
- Documentos
- Otros

**Funcionalidades:**

- Subir nuevas imágenes
- Clasificar por tipo
- Agregar título y descripción
- Registrar fecha de captura
- Filtrar por tipo
- Ver en pantalla completa
- Descargar imágenes

### 7.4 Odontograma Digital

Herramienta visual para registrar el estado dental del paciente:

**Características:**

- Diagrama interactivo de 32 piezas dentales (dentición permanente)
- Sistema de versiones para mantener histórico
- Registro de condiciones por zona dental

**Zonas por diente:**

- Mesial
- Distal
- Oclusal/Incisal
- Vestibular
- Palatino/Lingual

**Condiciones registrables:**

- Caries
- Restauraciones (resina, amalgama, etc.)
- Ausencias
- Fracturas
- Endodoncia
- Prótesis
- Y más...

**Cómo usar:**

1. Seleccione el diente haciendo clic sobre él
2. Elija la zona a marcar (si aplica)
3. Seleccione la condición del menú
4. El sistema guarda automáticamente los cambios
5. Use "Nueva versión" para crear un nuevo registro histórico

---

## 8. Casos Clínicos

Los casos clínicos permiten agrupar todo el tratamiento de un paciente.

### 8.1 Crear Caso Clínico

1. Desde la ficha del paciente, vaya a **"Casos"**
2. Haga clic en **"Nuevo Caso"**
3. Complete:
   - Nombre del caso (ej: "Rehabilitación oral completa")
   - Descripción inicial
   - Fecha de inicio
4. Haga clic en **"Guardar"**

**Estados del caso:**

- 🟢 **Abierto:** Caso nuevo sin iniciar
- 🔵 **En progreso:** Tratamiento en curso
- ⚫ **Cerrado:** Tratamiento finalizado

### 8.2 Diagnóstico

Registre los diagnósticos clínicos del caso:

1. Vaya a la pestaña **"Diagnóstico"** dentro del caso
2. Agregue diagnósticos con:
   - Tipo de diagnóstico
   - Descripción detallada
   - Fecha del diagnóstico

### 8.3 Presupuesto

Cree y gestione presupuestos para el caso:

#### Crear Presupuesto

1. Vaya a la pestaña **"Presupuesto"**
2. Haga clic en **"Nuevo Presupuesto"**
3. Complete:
   - Nombre del presupuesto
   - Moneda (PEN, CLP, USD)
   - Especialidad (opcional)
   - Observaciones

#### Agregar Procedimientos

1. Haga clic en **"Agregar Procedimiento"**
2. Seleccione:
   - Procedimiento del catálogo o escriba uno personalizado
   - Pieza dental (si aplica)
   - Cantidad
   - Precio unitario
   - Descuento (opcional)
3. El sistema calcula automáticamente el subtotal

#### Vista del Presupuesto

El presupuesto muestra:

- Lista de procedimientos con precios
- Subtotal, descuentos y total
- Estado de pago (Por cobrar, Parcial, Pagado)
- Barra de progreso de pagos

### 8.4 Pagos

Registre los pagos del presupuesto:

1. Haga clic en **"Registrar Pago"**
2. Complete:
   - Monto del pago
   - Método de pago:
     - 💵 Efectivo
     - 💳 Tarjeta de crédito/débito
     - 🏦 Transferencia bancaria
     - 📱 Yape
     - 📱 Plin
   - Tipo de comprobante:
     - Boleta
     - Factura
     - Ticket
   - Número de comprobante
   - Observaciones (opcional)
3. Haga clic en **"Guardar"**

**El sistema actualiza automáticamente:**

- El monto restante por cobrar
- El estado del presupuesto (Por cobrar → Parcial → Pagado)
- La barra de progreso

**Historial de pagos:**

- Visualice todos los pagos realizados
- Edite o elimine pagos si es necesario
- Vea el total pagado y el saldo pendiente

### 8.5 Citas del Caso

Gestione las citas asociadas al caso clínico:

1. Vaya a la pestaña **"Citas"**
2. Vea el listado de citas del caso
3. Agregue nuevas citas vinculadas automáticamente al caso

### 8.6 Recetas

Registre prescripciones médicas:

1. Vaya a la pestaña **"Recetas"**
2. Cree una nueva receta con:
   - Lista de medicamentos
   - Dosis e indicaciones
   - Duración del tratamiento
3. Genere PDF para imprimir

### 8.7 Consentimientos

Gestione documentos de consentimiento informado:

1. Vaya a la pestaña **"Consentimientos"**
2. Seleccione el tipo de consentimiento
3. Complete la información requerida
4. Registre la firma del paciente

### 8.8 Imágenes del Caso

Galería específica para imágenes del caso clínico:

1. Vaya a la pestaña **"Imágenes"**
2. Suba imágenes relacionadas con el tratamiento
3. Clasifique por tipo y etapa:
   - **Etapas:** Antes, Durante, Después, Seguimiento
   - **Tipos:** Radiografía, Intraoral, etc.

---

## 9. Gestión de Citas

### 9.1 Vista Calendario

El calendario muestra las citas en diferentes vistas:

- **Día:** Detalle de todas las citas del día
- **Semana:** Vista semanal con franjas horarias
- **Mes:** Vista mensual con indicadores de citas

**Código de colores:**

- 🔵 Programada
- 🟢 Confirmada
- ⚫ Completada
- 🔴 Cancelada

### 9.2 Agendar Nueva Cita

1. Haga clic en **"Nueva Cita"** o directamente en el calendario
2. Complete los datos:
   - **Paciente:** Busque y seleccione el paciente
   - **Odontólogo:** Asigne el profesional
   - **Fecha y hora:** Seleccione día y hora
   - **Duración:** Tiempo estimado de la cita
   - **Motivo:** Descripción de la cita
   - **Caso clínico:** Vincule a un caso existente (opcional)
3. Haga clic en **"Agendar"**

### 9.3 Historial de Citas

Visualice todas las citas con:

- Filtros por estado
- Búsqueda por paciente
- Estadísticas:
  - Total de citas
  - Citas por estado (programadas, confirmadas, completadas, canceladas)

**Acciones disponibles:**

- Ver detalle de la cita
- Cambiar estado
- Editar información
- Cancelar cita

---

## 10. Tratamientos y Procedimientos

### 10.1 Lista de Procedimientos

Catálogo completo de procedimientos dentales:

**Columnas disponibles:**

- Nombre del procedimiento
- Grupo/Categoría
- Precios por moneda (PEN, CLP, USD)
- Estado (activo/inactivo)

**Funcionalidades:**

- Buscar procedimientos
- Filtrar por grupo
- Activar/Desactivar procedimientos
- Editar precios
- Configurar columnas visibles

### 10.2 Grupos de Procedimientos

Organice los procedimientos en categorías:

**Ejemplos de grupos:**

- Odontología General
- Ortodoncia
- Endodoncia
- Periodoncia
- Cirugía Oral
- Estética Dental
- Prótesis

**Gestión de grupos:**

- Crear nuevos grupos
- Editar nombre y descripción
- Ver cantidad de procedimientos por grupo
- Eliminar grupos (solo si no tienen procedimientos asociados)

---

## 11. Reportes

Genere documentos PDF profesionales:

### Tipos de Reportes

1. **Ficha Odontológica Completa:**

   - Datos de filiación
   - Historia clínica
   - Odontograma
   - Antecedentes

2. **Historial de Citas:**

   - Lista de todas las citas del paciente
   - Estados y resultados

3. **Resumen de Tratamientos:**
   - Casos clínicos
   - Procedimientos realizados
   - Pagos efectuados

### Cómo Generar un Reporte

1. Vaya a **"Reportes"**
2. Busque y seleccione el paciente
3. Elija el tipo de reporte
4. Haga clic en **"Generar PDF"**
5. Descargue o imprima el documento

---

## 12. Personal de la Clínica (Solo Administrador)

### 12.1 Gestión de Personal

Administre los usuarios del sistema:

**Información del personal:**

- Nombre completo
- Rol (Administrador/Odontólogo)
- Especialidad
- Teléfono de contacto
- Estado (activo/inactivo)

**Acciones disponibles:**

- Editar datos del personal
- Activar/Desactivar usuarios
- Eliminar usuarios (desactivación permanente)

### 12.2 Códigos de Invitación

Control de acceso al sistema:

#### Configuración de Registro

- **Toggle "Registro Público":**
  - ON: Cualquiera puede registrarse
  - OFF: Solo con código de invitación

#### Generar Código de Invitación

1. Haga clic en **"Nuevo Código"**
2. Configure:
   - Rol asignado al nuevo usuario
   - Número máximo de usos
   - Días hasta expiración
3. Haga clic en **"Generar"**
4. Copie el código y compártalo con el nuevo usuario

**Gestión de códigos:**

- Ver códigos activos
- Copiar código al portapapeles
- Ver usos restantes
- Eliminar códigos

---

## 13. Gestor CMS (Solo Administrador)

Configure el contenido de la página web pública de la clínica.

### 13.1 Información General

Datos básicos de la clínica:

- **Nombre de la clínica**
- **Slogan**
- **Teléfono de contacto**
- **WhatsApp**
- **Email**
- **Dirección física**
- **Horarios de atención**

> 💡 Esta información también es utilizada por el chatbot para responder preguntas.

### 13.2 Servicios

Gestione los servicios que ofrece la clínica:

**Información por servicio:**

- Nombre del servicio
- Descripción corta (para tarjetas)
- Descripción detallada (para modal)
- Icono representativo
- Orden de aparición
- Visibilidad (mostrar/ocultar)

**Detalles adicionales:**

- Galería de imágenes del servicio
- Beneficios del tratamiento
- Duración aproximada
- Recomendaciones pre/post tratamiento

### 13.3 Equipo Médico

Presente al equipo profesional:

**Datos por profesional:**

- Foto (subida automática a la nube)
- Nombre completo
- Especialidad
- Curriculum vitae:
  - Formación académica
  - Experiencia profesional
  - Áreas de especialización
  - Filosofía profesional

### 13.4 Tema Visual

Personalice los colores de la página:

- **Color primario:** Color principal de la marca
- **Color secundario:** Color complementario
- **Color de acento:** Para elementos destacados

---

## 14. Configuración del Chatbot (Solo Administrador)

Configure el asistente virtual de la clínica.

### 14.1 Configuración General

#### System Prompt

Define la personalidad y comportamiento del chatbot:

```
Ejemplo: "Eres un asistente amable de la clínica dental.
Responde consultas sobre servicios, horarios y ubicación.
Siempre sugiere agendar una cita para casos específicos."
```

#### Fuentes de Información

Active/desactive qué información puede usar el chatbot:

- ✅ Información general de la clínica
- ✅ Servicios disponibles
- ✅ Equipo médico

### 14.2 FAQs

Preguntas frecuentes para respuestas rápidas:

**Crear FAQ:**

1. Haga clic en **"Nueva FAQ"**
2. Complete:
   - Pregunta (cómo la haría el usuario)
   - Respuesta (información a proporcionar)
   - Keywords (palabras clave de búsqueda)
   - Categoría
   - Prioridad (1-10)
3. Active/Desactive según necesidad

**Ejemplos de FAQs:**

- "¿Cuál es el horario de atención?"
- "¿Aceptan seguros dentales?"
- "¿Cuánto cuesta una limpieza?"

### 14.3 Contextos Adicionales

Información extensa para el chatbot:

**Tipos de contexto:**

- Información general
- Detalles de servicios
- Políticas de la clínica
- Promociones vigentes
- Información del equipo
- Otros

**Crear contexto:**

1. Haga clic en **"Nuevo Contexto"**
2. Seleccione el tipo
3. Escriba el contenido extenso
4. Active/Desactive según necesidad

### 14.4 Sincronización IA

Para que el chatbot use la información actualizada:

1. Vaya a la pestaña **"Sincronización"**
2. Revise el estado actual de los embeddings
3. Haga clic en **"Sincronizar ahora"**
4. Espere a que el proceso termine

> ⚠️ **Importante:** Sincronice después de agregar o modificar FAQs y Contextos.

---

## 15. Visor de Imágenes

El sistema incluye un visor de imágenes en pantalla completa:

**Funcionalidades:**

- Vista a pantalla completa
- Información de la imagen (tipo, etapa, fecha)
- Botón de descarga
- Controles táctiles en móviles

**Cómo usar:**

1. En cualquier galería de imágenes, haga clic en el ícono de lupa 🔍
2. La imagen se muestra en pantalla completa
3. Use los controles en la parte superior para:
   - Ver información de la imagen
   - Descargar la imagen
   - Cerrar el visor
4. En móviles, toque la pantalla para mostrar/ocultar controles

---

## 16. Ajustes de Cuenta

Configure su perfil personal:

**Opciones disponibles:**

- Cambiar contraseña
- Actualizar datos de contacto
- Preferencias de notificaciones
- Configuración de tema (claro/oscuro)

---

## 17. Preguntas Frecuentes

### ¿Cómo recupero mi contraseña?

1. En la pantalla de inicio de sesión, haga clic en "¿Olvidaste tu contraseña?"
2. Ingrese su correo electrónico
3. Revise su bandeja de entrada y siga el enlace

### ¿Puedo acceder desde mi celular?

Sí, el sistema es responsive y funciona en dispositivos móviles. Se recomienda usar un navegador actualizado (Chrome, Safari, Firefox).

### ¿Cómo subo una imagen?

1. Vaya a la sección de imágenes (del paciente o del caso)
2. Haga clic en "Agregar Imagen"
3. Seleccione el archivo, agregue título y tipo
4. Haga clic en "Subir"

### ¿Cómo genero un PDF de la ficha del paciente?

1. Vaya a "Reportes"
2. Busque el paciente
3. Seleccione "Ficha Odontológica Completa"
4. Haga clic en "Generar PDF"

### ¿Cómo sincronizo el calendario con Google Calendar?

El sistema se integra automáticamente con Google Calendar. Las citas creadas aparecerán en su calendario de Google si ha autorizado la conexión en la configuración.

### ¿Qué hago si el chatbot no responde correctamente?

1. Vaya a Chatbot → FAQs
2. Agregue o edite las preguntas frecuentes
3. Vaya a Chatbot → Sincronización
4. Haga clic en "Sincronizar ahora"

---

## Soporte Técnico

Si tiene problemas o consultas sobre el sistema, contacte a su administrador o al equipo de soporte técnico.

---

**Versión del Manual:** 1.0  
**Última actualización:** Noviembre 2025  
**Sistema:** Dental Company Web

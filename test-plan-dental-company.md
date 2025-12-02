# Plan de Pruebas - Sistema Dental Company Web

## Application Overview

Sistema integral de gestión dental que incluye manejo de pacientes, historias clínicas, agendamiento de citas, odontograma digital, casos clínicos, presupuestos, imágenes médicas, KPIs y dashboard administrativo. La aplicación cuenta con integración de Google Calendar, chatbot AI, gestión de personal y un sistema completo de autenticación y autorización.

## Test Scenarios

### 1. Autenticación y Acceso

**Seed:** `tests/auth-setup.spec.ts`

#### 1.1. Login exitoso con credenciales válidas

**File:** `tests/auth/login-success.spec.ts`

**Steps:**
  1. Navegar a https://dental-company-tacna.vercel.app
  2. Hacer clic en el enlace 'Iniciar sesión' en la página principal
  3. Ingresar nombre de usuario válido en el campo 'Usuario'
  4. Ingresar contraseña válida en el campo 'Contraseña'
  5. Hacer clic en el botón 'Iniciar Sesión'
  6. Verificar redirección al dashboard administrativo

**Expected Results:**
  - La página principal se carga correctamente
  - El enlace de login está visible y es clickeable
  - Los campos de usuario y contraseña permiten entrada de texto
  - El botón de login está habilitado
  - Se muestra mensaje de 'Iniciando sesión...' durante el proceso
  - Redirección exitosa a /admin/dashboard con datos del usuario

#### 1.2. Login fallido con credenciales inválidas

**File:** `tests/auth/login-failure.spec.ts`

**Steps:**
  1. Navegar a la página de login
  2. Ingresar nombre de usuario inválido
  3. Ingresar contraseña incorrecta
  4. Hacer clic en 'Iniciar Sesión'
  5. Verificar mensaje de error

**Expected Results:**
  - Se muestra mensaje 'Usuario o contraseña incorrectos'
  - El usuario permanece en la página de login
  - Los campos se mantienen visibles para reintento

#### 1.3. Registro de nuevo usuario con código de invitación

**File:** `tests/auth/register-with-code.spec.ts`

**Steps:**
  1. Navegar a la página de registro
  2. Ingresar nombre de usuario único
  3. Ingresar contraseña fuerte
  4. Repetir la contraseña
  5. Ingresar código de invitación válido
  6. Hacer clic en 'Verificar código'
  7. Confirmar registro
  8. Completar el proceso de registro

**Expected Results:**
  - El código de invitación se verifica correctamente
  - Se asigna el rol correspondiente al código
  - El usuario es creado exitosamente
  - Redirección al dashboard con perfil completo

#### 1.4. Recuperación de contraseña

**File:** `tests/auth/password-recovery.spec.ts`

**Steps:**
  1. Hacer clic en '¿Olvidaste tu contraseña?'
  2. Ingresar email registrado
  3. Enviar solicitud de recuperación
  4. Verificar mensaje de confirmación
  5. Simular acceso al enlace de recuperación

**Expected Results:**
  - Se muestra formulario de recuperación
  - Email es enviado correctamente
  - Mensaje de confirmación es visible
  - El enlace redirige a formulario de nueva contraseña

#### 1.5. Logout y protección de rutas

**File:** `tests/auth/logout-protection.spec.ts`

**Steps:**
  1. Iniciar sesión exitosamente
  2. Navegar al dashboard
  3. Hacer clic en el botón de cerrar sesión
  4. Verificar redirección a página principal
  5. Intentar acceder a ruta protegida directamente
  6. Verificar redirección a login

**Expected Results:**
  - Logout se ejecuta correctamente
  - Sesión se cierra completamente
  - Rutas protegidas redirigen a login
  - No se puede acceder sin autenticación

### 2. Dashboard y KPIs

**Seed:** `tests/dashboard-setup.spec.ts`

#### 2.1. Visualización correcta del dashboard principal

**File:** `tests/dashboard/main-dashboard.spec.ts`

**Steps:**
  1. Iniciar sesión como administrador
  2. Navegar al dashboard principal
  3. Verificar carga de tarjetas KPI
  4. Comprobar métricas de pacientes
  5. Verificar datos de citas
  6. Revisar información financiera
  7. Comprobar estadísticas de tratamientos

**Expected Results:**
  - Todas las tarjetas KPI se cargan sin errores
  - Las métricas muestran datos actuales
  - Los iconos y colores son consistentes
  - Las tendencias se visualizan correctamente
  - Los números coinciden con los datos reales

#### 2.2. Interacción con gráficos estadísticos

**File:** `tests/dashboard/charts-interaction.spec.ts`

**Steps:**
  1. Acceder a la sección de gráficos
  2. Hacer clic en el botón 'Personalizar'
  3. Ocultar algunos gráficos
  4. Mostrar gráficos ocultos
  5. Usar 'Mostrar todos' y 'Ocultar todos'
  6. Restablecer configuración
  7. Verificar persistencia de preferencias

**Expected Results:**
  - Los gráficos se ocultan/muestran correctamente
  - La configuración se guarda en localStorage
  - Los botones funcionan según lo esperado
  - El contador de gráficos visibles es exacto
  - Las preferencias persisten al recargar

#### 2.3. Responsividad del dashboard

**File:** `tests/dashboard/responsive-design.spec.ts`

**Steps:**
  1. Acceder al dashboard en escritorio
  2. Cambiar tamaño de ventana a tablet
  3. Verificar adaptación de tarjetas KPI
  4. Cambiar a vista móvil
  5. Comprobar legibilidad de gráficos
  6. Verificar menú de navegación móvil

**Expected Results:**
  - Las tarjetas se reorganizan correctamente
  - Los gráficos mantienen legibilidad
  - El menú hamburguesa funciona en móvil
  - No hay desbordamiento horizontal
  - Todos los elementos son accesibles

### 3. Gestión de Pacientes

**Seed:** `tests/patients-setup.spec.ts`

#### 3.1. Registro de nuevo paciente - datos básicos

**File:** `tests/patients/register-basic.spec.ts`

**Steps:**
  1. Navegar a 'Historias Clínicas'
  2. Hacer clic en 'Nuevo Paciente'
  3. Completar campos obligatorios: nombres, apellidos, DNI
  4. Ingresar fecha de nacimiento
  5. Seleccionar género
  6. Elegir 'Registro Rápido'
  7. Confirmar creación del paciente

**Expected Results:**
  - El formulario se presenta correctamente
  - Los campos obligatorios están marcados
  - La validación de DNI funciona
  - Se calcula la edad automáticamente
  - El paciente se crea con número de historia único

#### 3.2. Registro completo de paciente con ficha odontológica

**File:** `tests/patients/register-complete.spec.ts`

**Steps:**
  1. Crear nuevo paciente
  2. Elegir 'Registrar y Completar Ficha'
  3. Completar datos de filiación completos
  4. Agregar información de contacto
  5. Incluir contacto de emergencia (obligatorio)
  6. Agregar datos de ubicación
  7. Especificar cómo fue referido
  8. Guardar ficha completa

**Expected Results:**
  - Todos los campos de filiación se guardan
  - El contacto de emergencia es obligatorio y se valida
  - Los datos de ubicación se almacenan correctamente
  - La ficha se crea completa y navegable

#### 3.3. Búsqueda y filtrado de pacientes

**File:** `tests/patients/search-filter.spec.ts`

**Steps:**
  1. Acceder a lista de pacientes
  2. Usar búsqueda por nombre
  3. Filtrar por DNI
  4. Buscar por número de historia
  5. Aplicar filtros de edad
  6. Combinar múltiples filtros
  7. Limpiar filtros

**Expected Results:**
  - La búsqueda devuelve resultados relevantes
  - Los filtros funcionan correctamente
  - La combinación de filtros es precisa
  - Limpiar filtros restaura lista completa

#### 3.4. Navegación a ficha odontológica

**File:** `tests/patients/navigate-to-record.spec.ts`

**Steps:**
  1. Localizar paciente en la lista
  2. Hacer clic en 'Ver Ficha'
  3. Verificar carga de datos del paciente
  4. Explorar pestañas de la ficha
  5. Comprobar información mostrada
  6. Verificar navegación entre secciones

**Expected Results:**
  - La ficha se abre correctamente
  - Todos los datos del paciente se cargan
  - Las pestañas funcionan sin errores
  - La navegación es fluida e intuitiva

### 4. Ficha Odontológica

**Seed:** `tests/dental-record-setup.spec.ts`

#### 4.1. Completar datos de filiación

**File:** `tests/dental-record/filiacion.spec.ts`

**Steps:**
  1. Acceder a ficha de paciente existente
  2. Navegar a pestaña 'Filiación'
  3. Completar datos personales faltantes
  4. Agregar información de contacto completa
  5. Configurar contacto de emergencia
  6. Incluir datos de ubicación detallados
  7. Especificar origen de referencia
  8. Guardar cambios

**Expected Results:**
  - Todos los campos se pueden editar
  - Las validaciones funcionan correctamente
  - Los datos se guardan sin pérdida
  - Los cambios se reflejan inmediatamente

#### 4.2. Registro de historia clínica - antecedentes

**File:** `tests/dental-record/clinical-history.spec.ts`

**Steps:**
  1. Ir a pestaña 'Historia Clínica'
  2. Completar antecedentes cardiovasculares
  3. Registrar antecedentes respiratorios
  4. Documentar condiciones endocrino-metabólicas
  5. Incluir antecedentes neurológico-psiquiátricos
  6. Registrar alergias conocidas
  7. Completar otros antecedentes relevantes
  8. Guardar historia clínica

**Expected Results:**
  - Cada sistema de antecedentes se puede documentar
  - Las opciones Sí/No funcionan correctamente
  - Los campos de observaciones permiten texto libre
  - La información se organiza por sistemas

#### 4.3. Cuestionario de hábitos y examen clínico

**File:** `tests/dental-record/habits-examination.spec.ts`

**Steps:**
  1. Completar cuestionario de hábitos
  2. Registrar consumo de tabaco y alcohol
  3. Documentar otros hábitos relevantes
  4. Ingresar datos de examen clínico
  5. Registrar talla y peso
  6. Verificar cálculo automático de IMC
  7. Incluir signos vitales

**Expected Results:**
  - El cuestionario se completa adecuadamente
  - El IMC se calcula automáticamente
  - Los rangos de signos vitales se validan
  - Todos los datos se almacenan correctamente

#### 4.4. Gestión de imágenes del paciente

**File:** `tests/dental-record/images.spec.ts`

**Steps:**
  1. Acceder a sección 'Imágenes'
  2. Subir radiografía panorámica
  3. Agregar fotos intraorales
  4. Incluir imágenes de radiografías periapicales
  5. Organizar imágenes por categorías
  6. Agregar descripciones a las imágenes
  7. Verificar visualización en galería

**Expected Results:**
  - Las imágenes se suben correctamente
  - Se pueden organizar por categorías
  - Las descripciones se guardan
  - La galería muestra todas las imágenes
  - La visualización es clara y accesible

### 5. Odontograma Digital

**Seed:** `tests/odontogram-setup.spec.ts`

#### 5.1. Creación de odontograma adulto

**File:** `tests/odontogram/adult-odontogram.spec.ts`

**Steps:**
  1. Acceder a sección odontograma
  2. Seleccionar 'Odontograma Adulto'
  3. Hacer clic en diente 11 (incisivo central)
  4. Seleccionar zona 'Mesial'
  5. Elegir condición 'Caries'
  6. Marcar diente 16 como 'Restauración'
  7. Agregar especificaciones en el campo de texto
  8. Incluir observaciones relevantes
  9. Guardar odontograma

**Expected Results:**
  - El odontograma de 32 piezas se muestra
  - Los dientes son seleccionables
  - Las zonas se marcan correctamente
  - Las condiciones se aplican visualmente
  - Los textos se guardan sin problemas

#### 5.2. Odontograma infantil y gestión de versiones

**File:** `tests/odontogram/child-odontogram.spec.ts`

**Steps:**
  1. Cambiar a 'Odontograma Infantil'
  2. Marcar algunas piezas deciduas
  3. Guardar primera versión
  4. Crear nueva versión
  5. Modificar condiciones existentes
  6. Guardar segunda versión
  7. Navegar entre versiones históricas
  8. Verificar fechas de registro

**Expected Results:**
  - El odontograma infantil muestra 20 piezas
  - Las versiones se crean correctamente
  - El historial se mantiene intacto
  - Las fechas se registran automáticamente
  - Se puede navegar entre versiones

#### 5.3. Condiciones dentales avanzadas

**File:** `tests/odontogram/advanced-conditions.spec.ts`

**Steps:**
  1. Seleccionar diente molar
  2. Aplicar múltiples condiciones en diferentes zonas
  3. Marcar ausencia dental
  4. Registrar tratamiento de endodoncia
  5. Incluir prótesis fija
  6. Documentar fracturas
  7. Verificar representación visual

**Expected Results:**
  - Múltiples condiciones se pueden aplicar
  - Cada zona se marca independientemente
  - Los colores y símbolos son distintivos
  - La representación visual es clara

### 6. Gestión de Citas

**Seed:** `tests/appointments-setup.spec.ts`

#### 6.1. Creación de cita nueva

**File:** `tests/appointments/create-appointment.spec.ts`

**Steps:**
  1. Navegar a sección 'Citas'
  2. Verificar estado de conexión con Google Calendar
  3. Hacer clic en 'Nueva cita'
  4. Seleccionar paciente del dropdown
  5. Elegir odontólogo responsable
  6. Especificar motivo de la cita
  7. Seleccionar fecha y hora con flatpickr
  8. Configurar duración (60 minutos)
  9. Establecer estado como 'Programada'
  10. Agregar costo y moneda
  11. Incluir notas adicionales
  12. Guardar cita

**Expected Results:**
  - El estado de Google Calendar se muestra
  - El formulario modal se abre correctamente
  - Todos los campos se pueden completar
  - La fecha/hora se selecciona con calendario
  - La cita se crea en Google Calendar
  - La cita se guarda en la base de datos

#### 6.2. Vinculación de cita a caso clínico

**File:** `tests/appointments/link-to-case.spec.ts`

**Steps:**
  1. Crear nueva cita
  2. Seleccionar paciente que tiene casos clínicos
  3. Verificar aparición del selector de casos
  4. Elegir caso clínico específico
  5. Completar resto de información
  6. Confirmar creación
  7. Verificar vinculación en vista de caso

**Expected Results:**
  - El selector de casos aparece dinámicamente
  - Solo se muestran casos abiertos del paciente
  - La vinculación se establece correctamente
  - La cita aparece en el caso clínico

#### 6.3. Gestión de estados de cita

**File:** `tests/appointments/appointment-states.spec.ts`

**Steps:**
  1. Localizar cita existente
  2. Cambiar estado de 'Programada' a 'Confirmada'
  3. Modificar estado a 'Completada'
  4. Probar cancelación de cita
  5. Verificar sincronización con Google Calendar
  6. Comprobar historial de cambios

**Expected Results:**
  - Los estados se actualizan correctamente
  - Los colores de badge cambian según estado
  - Google Calendar se sincroniza
  - El historial se mantiene

#### 6.4. Vista de calendario integrado

**File:** `tests/appointments/calendar-view.spec.ts`

**Steps:**
  1. Acceder a vista de calendario
  2. Verificar carga del iframe de Google Calendar
  3. Comprobar visualización de citas creadas
  4. Navegar entre meses
  5. Verificar responsive en móvil
  6. Probar vista colapsable en móvil

**Expected Results:**
  - El calendario se carga completamente
  - Las citas aparecen en las fechas correctas
  - La navegación funciona fluidamente
  - La vista móvil es funcional

### 7. Casos Clínicos

**Seed:** `tests/clinical-cases-setup.spec.ts`

#### 7.1. Creación de nuevo caso clínico

**File:** `tests/clinical-cases/create-case.spec.ts`

**Steps:**
  1. Acceder a ficha de paciente
  2. Navegar a sección 'Casos'
  3. Hacer clic en 'Nuevo Caso'
  4. Ingresar nombre descriptivo del caso
  5. Completar descripción detallada
  6. Seleccionar odontólogo responsable
  7. Establecer prioridad
  8. Agregar observaciones iniciales
  9. Guardar caso clínico

**Expected Results:**
  - El formulario modal se abre correctamente
  - Todos los campos permiten entrada de datos
  - El caso se crea con estado 'Abierto'
  - Se genera ID único para el caso
  - El caso aparece en la lista del paciente

#### 7.2. Gestión de diagnósticos

**File:** `tests/clinical-cases/diagnostics.spec.ts`

**Steps:**
  1. Abrir caso clínico existente
  2. Navegar a pestaña 'Diagnóstico'
  3. Agregar diagnóstico principal
  4. Incluir diagnósticos secundarios
  5. Especificar códigos CIE-10 si aplica
  6. Agregar plan de tratamiento
  7. Documentar pronóstico
  8. Guardar información diagnóstica

**Expected Results:**
  - Los diagnósticos se pueden agregar
  - Se permite texto libre y códigos
  - El plan de tratamiento es editable
  - Toda la información se persiste

#### 7.3. Gestión de presupuestos

**File:** `tests/clinical-cases/budgets.spec.ts`

**Steps:**
  1. Acceder a pestaña 'Presupuesto'
  2. Agregar nuevo ítem de tratamiento
  3. Especificar descripción del procedimiento
  4. Ingresar cantidad y precio unitario
  5. Verificar cálculo de subtotal
  6. Agregar múltiples ítems
  7. Comprobar cálculo de total
  8. Aplicar descuentos si corresponde
  9. Guardar presupuesto

**Expected Results:**
  - Los ítems se agregan correctamente
  - Los cálculos son automáticos y precisos
  - El total se actualiza dinámicamente
  - Los descuentos se aplican correctamente

#### 7.4. Seguimiento de pagos

**File:** `tests/clinical-cases/payments.spec.ts`

**Steps:**
  1. Ir a sección de pagos del caso
  2. Registrar pago inicial
  3. Especificar método de pago
  4. Agregar comprobante de pago
  5. Verificar actualización de saldo
  6. Registrar pagos parciales
  7. Completar pago total
  8. Verificar estado 'Pagado'

**Expected Results:**
  - Los pagos se registran correctamente
  - El saldo se calcula automáticamente
  - Los comprobantes se almacenan
  - El estado se actualiza según pagos

### 8. Gestión de Personal

**Seed:** `tests/staff-setup.spec.ts`

#### 8.1. Registro de nuevo personal

**File:** `tests/staff/add-staff.spec.ts`

**Steps:**
  1. Acceder a sección 'Personal'
  2. Hacer clic en 'Agregar Personal'
  3. Completar datos personales
  4. Asignar rol (Odontólogo/Asistente/Administrador)
  5. Configurar permisos específicos
  6. Establecer horarios de trabajo
  7. Incluir información de contacto
  8. Guardar registro de personal

**Expected Results:**
  - El formulario se completa sin errores
  - Los roles se asignan correctamente
  - Los permisos se configuran según rol
  - El personal aparece en la lista activa

#### 8.2. Gestión de códigos de invitación

**File:** `tests/staff/invitation-codes.spec.ts`

**Steps:**
  1. Navegar a pestaña 'Códigos de Invitación'
  2. Generar nuevo código
  3. Asignar rol específico al código
  4. Configurar fecha de expiración
  5. Copiar código generado
  6. Verificar listado de códigos activos
  7. Desactivar código usado
  8. Comprobar historial de códigos

**Expected Results:**
  - Los códigos se generan únicos
  - Los roles se asignan correctamente
  - Las fechas de expiración funcionan
  - El historial se mantiene completo

#### 8.3. Configuración de seguridad

**File:** `tests/staff/security-settings.spec.ts`

**Steps:**
  1. Ir a pestaña 'Configuración de Seguridad'
  2. Alternar registro público on/off
  3. Verificar impacto en formulario de registro
  4. Configurar restricciones adicionales
  5. Probar configuración con nuevo registro
  6. Verificar mensajes de estado

**Expected Results:**
  - El toggle funciona correctamente
  - Los cambios se aplican inmediatamente
  - El registro se comporta según configuración
  - Los mensajes informativos son claros

### 9. Sistema CMS

**Seed:** `tests/cms-setup.spec.ts`

#### 9.1. Gestión de contenido de la página principal

**File:** `tests/cms/homepage-content.spec.ts`

**Steps:**
  1. Acceder a panel CMS
  2. Editar información de la clínica
  3. Modificar título y descripción principal
  4. Actualizar información de contacto
  5. Cambiar horarios de atención
  6. Subir nuevo logo
  7. Configurar colores del tema
  8. Previsualizar cambios
  9. Publicar actualizaciones

**Expected Results:**
  - Todos los campos son editables
  - Las imágenes se suben correctamente
  - Los colores se aplican en tiempo real
  - La previsualización es fiel
  - Los cambios se publican exitosamente

#### 9.2. Configuración de servicios

**File:** `tests/cms/services-config.spec.ts`

**Steps:**
  1. Editar lista de servicios
  2. Agregar nuevo servicio odontológico
  3. Asignar icono representativo
  4. Completar descripción del servicio
  5. Subir imagen relacionada
  6. Configurar orden de visualización
  7. Eliminar servicio obsoleto
  8. Verificar cambios en página pública

**Expected Results:**
  - Los servicios se gestionan correctamente
  - Los iconos se muestran apropiadamente
  - Las imágenes se cargan sin problemas
  - El orden se respeta en la página

#### 9.3. Gestión del equipo médico

**File:** `tests/cms/team-management.spec.ts`

**Steps:**
  1. Acceder a sección equipo
  2. Agregar nuevo miembro del equipo
  3. Subir foto profesional
  4. Completar curriculum vitae
  5. Especificar especialidades
  6. Configurar información de contacto
  7. Establecer orden de aparición
  8. Publicar perfil del miembro

**Expected Results:**
  - Los perfiles se crean completamente
  - Las fotos se optimizan automáticamente
  - Los currículos se muestran organizadamente
  - La información es accesible públicamente

### 10. Chatbot AI y Comunicación

**Seed:** `tests/chatbot-setup.spec.ts`

#### 10.1. Interacción básica con chatbot

**File:** `tests/chatbot/basic-interaction.spec.ts`

**Steps:**
  1. Localizar botón flotante del chatbot
  2. Hacer clic para abrir conversación
  3. Enviar saludo inicial
  4. Hacer pregunta sobre servicios
  5. Solicitar información de contacto
  6. Preguntar sobre horarios
  7. Probar diferentes tipos de consultas
  8. Cerrar conversación

**Expected Results:**
  - El chatbot responde apropiadamente
  - Las respuestas son contextualmente relevantes
  - La información proporcionada es correcta
  - La interfaz es intuitiva y responsive

#### 10.2. Configuración del chatbot desde admin

**File:** `tests/chatbot/admin-config.spec.ts`

**Steps:**
  1. Acceder a configuración de chatbot en CMS
  2. Habilitar/deshabilitar chatbot
  3. Configurar mensajes predefinidos
  4. Actualizar base de conocimiento
  5. Probar respuestas automáticas
  6. Configurar derivación a contacto humano
  7. Verificar cambios en página pública

**Expected Results:**
  - El toggle de activación funciona
  - Los mensajes se pueden personalizar
  - La base de conocimiento se actualiza
  - Los cambios se reflejan inmediatamente

### 11. Flujos de Navegación y UX

**Seed:** `tests/navigation-setup.spec.ts`

#### 11.1. Navegación principal del sistema

**File:** `tests/navigation/main-navigation.spec.ts`

**Steps:**
  1. Verificar menú lateral del admin
  2. Navegar entre diferentes secciones
  3. Usar breadcrumbs para orientación
  4. Probar búsqueda global
  5. Verificar accesos directos
  6. Comprobar menú de usuario
  7. Probar navegación con teclado

**Expected Results:**
  - Todas las secciones son accesibles
  - Los breadcrumbs reflejan ubicación actual
  - La búsqueda devuelve resultados relevantes
  - La navegación por teclado funciona
  - El menú es responsive en todos los dispositivos

#### 11.2. Flujo completo: paciente nuevo a tratamiento

**File:** `tests/navigation/complete-workflow.spec.ts`

**Steps:**
  1. Registrar paciente nuevo
  2. Completar ficha odontológica
  3. Crear historia clínica
  4. Realizar odontograma inicial
  5. Crear caso clínico
  6. Agendar primera cita
  7. Generar presupuesto
  8. Registrar pago inicial
  9. Programar seguimiento

**Expected Results:**
  - El flujo se completa sin interrupciones
  - Los datos se mantienen consistentes
  - Las transiciones son fluidas
  - Todos los vínculos se establecen correctamente

#### 11.3. Manejo de errores y validaciones

**File:** `tests/navigation/error-handling.spec.ts`

**Steps:**
  1. Intentar enviar formularios incompletos
  2. Probar datos inválidos en campos
  3. Simular errores de conexión
  4. Verificar mensajes de error
  5. Comprobar recuperación automática
  6. Probar límites de campos
  7. Verificar sanitización de inputs

**Expected Results:**
  - Los errores se muestran claramente
  - Las validaciones son comprensibles
  - El sistema se recupera graciosamente
  - Los datos se protegen contra inyección

### 12. Reportes y Documentación

**Seed:** `tests/reports-setup.spec.ts`

#### 12.1. Generación de reportes PDF

**File:** `tests/reports/pdf-generation.spec.ts`

**Steps:**
  1. Acceder a ficha de paciente
  2. Generar PDF de ficha odontológica completa
  3. Crear reporte de historial de citas
  4. Generar resumen de tratamientos
  5. Descargar reporte de pagos
  6. Verificar formato y contenido
  7. Comprobar integridad de datos

**Expected Results:**
  - Los PDFs se generan correctamente
  - El formato es profesional y legible
  - Toda la información relevante está incluida
  - Los archivos se descargan exitosamente

#### 12.2. Análisis de KPIs y estadísticas

**File:** `tests/reports/kpi-analysis.spec.ts`

**Steps:**
  1. Acceder al dashboard de KPIs
  2. Verificar métricas de pacientes
  3. Analizar estadísticas de citas
  4. Revisar datos financieros
  5. Examinar rendimiento del personal
  6. Comparar períodos de tiempo
  7. Exportar datos estadísticos

**Expected Results:**
  - Todas las métricas se calculan correctamente
  - Los gráficos reflejan datos reales
  - Las comparaciones temporales son precisas
  - Los datos son exportables

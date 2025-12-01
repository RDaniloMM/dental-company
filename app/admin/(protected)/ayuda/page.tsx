"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  CalendarDays,
  Stethoscope,
  FolderOpen,
  BarChart3,
  Bot,
  Settings,
  HelpCircle,
  ExternalLink,
  FileText,
} from "lucide-react";

export default function AyudaPage() {
  return (
    <div className='container mx-auto p-6 max-w-2xl'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <BookOpen className='h-6 w-6' />
          Centro de Ayuda
        </h1>
        <p className='text-muted-foreground'>
          Guía completa para utilizar el sistema de gestión dental
        </p>
      </div>

      <div className='space-y-6'>
        {/* Manual de Uso */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <HelpCircle className='h-5 w-5' />
              Manual de uso rápido
            </CardTitle>
            <CardDescription>
              Aprende a utilizar todas las funciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion
              type='single'
              collapsible
              className='w-full'
            >
              <AccordionItem value='inicio'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <HelpCircle className='h-4 w-4' />
                    ¿Cómo empezar?
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>Dental Company Web</strong> es un sistema integral
                    de gestión para clínicas dentales. Aquí podrás:
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      👤 Gestionar pacientes e historias clínicas completas
                    </li>
                    <li>🦷 Utilizar odontogramas digitales interactivos</li>
                    <li>
                      📋 Administrar casos clínicos con presupuestos y pagos
                    </li>
                    <li>
                      📅 Programar citas con integración a Google Calendar
                    </li>
                    <li>📊 Visualizar KPIs y estadísticas en tiempo real</li>
                    <li>🤖 Configurar el chatbot inteligente con IA</li>
                  </ul>
                  <div className='bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-2'>
                    <p className='text-blue-700 dark:text-blue-300 text-xs'>
                      💡 <strong>Tip:</strong> Usa el menú lateral para navegar
                      entre las secciones. Los administradores tienen acceso a
                      módulos adicionales como Personal, CMS y Chatbot.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='pacientes'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <FolderOpen className='h-4 w-4' />
                    Historias Clínicas y Fichas
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>📋 Registrar nuevo paciente:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>
                      Ve a &quot;Historias Clínicas&quot; en el menú lateral
                    </li>
                    <li>Haz clic en &quot;Nuevo Paciente&quot;</li>
                    <li>
                      Completa los datos obligatorios: nombres, apellidos, DNI,
                      fecha de nacimiento y sexo
                    </li>
                    <li>
                      Elige entre &quot;Registro Rápido&quot; o &quot;Registrar
                      y Completar Ficha&quot;
                    </li>
                  </ol>

                  <p className='mt-3'>
                    <strong>📁 Ficha Odontológica completa:</strong>
                  </p>
                  <p>
                    Cada paciente tiene una ficha con las siguientes secciones:
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>Filiación:</strong> Datos personales, contacto de
                      emergencia (obligatorio), ubicación
                    </li>
                    <li>
                      <strong>Historia Clínica:</strong> Antecedentes
                      patológicos organizados por sistemas, cuestionario de
                      hábitos, examen clínico (talla, peso, IMC, presión
                      arterial)
                    </li>
                    <li>
                      <strong>Imágenes:</strong> Galería de radiografías, fotos
                      intraorales, panorámicas, etc.
                    </li>
                    <li>
                      <strong>Odontograma:</strong> Diagrama interactivo de
                      piezas dentales
                    </li>
                    <li>
                      <strong>Casos:</strong> Gestión de tratamientos con
                      presupuestos y pagos
                    </li>
                  </ul>

                  <div className='bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-2'>
                    <p className='text-amber-700 dark:text-amber-300 text-xs'>
                      💡 <strong>Tip:</strong> Usa el buscador para encontrar
                      pacientes por nombre, DNI o número de historia clínica.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='citas'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <CalendarDays className='h-4 w-4' />
                    Gestión de Citas
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>📅 Vista del Calendario:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>Vista Día:</strong> Detalle de todas las citas del
                      día seleccionado
                    </li>
                    <li>
                      <strong>Vista Semana:</strong> Vista semanal con franjas
                      horarias
                    </li>
                    <li>
                      <strong>Vista Mes:</strong> Vista mensual con indicadores
                      de citas
                    </li>
                  </ul>

                  <p className='mt-3'>
                    <strong>➕ Agendar nueva cita:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>
                      Haz clic en &quot;Nueva Cita&quot; o directamente en el
                      calendario
                    </li>
                    <li>Busca y selecciona el paciente</li>
                    <li>Asigna el odontólogo responsable</li>
                    <li>Selecciona fecha, hora y duración estimada</li>
                    <li>Indica el motivo de la consulta</li>
                    <li>Opcionalmente, vincula a un caso clínico existente</li>
                  </ol>

                  <p className='mt-3'>
                    <strong>🏷️ Estados de citas (código de colores):</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      🔵 <strong>Programada:</strong> Cita agendada pendiente de
                      confirmar
                    </li>
                    <li>
                      🟢 <strong>Confirmada:</strong> El paciente confirmó su
                      asistencia
                    </li>
                    <li>
                      ⚫ <strong>Completada:</strong> Cita realizada
                      exitosamente
                    </li>
                    <li>
                      🔴 <strong>Cancelada:</strong> Cita cancelada
                    </li>
                  </ul>

                  <div className='bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-md p-3 mt-2'>
                    <p className='text-green-700 dark:text-green-300 text-xs'>
                      🔗 <strong>Integración:</strong> Las citas se sincronizan
                      automáticamente con Google Calendar si has autorizado la
                      conexión.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='tratamientos'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Stethoscope className='h-4 w-4' />
                    Tratamientos y Procedimientos
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>📋 Catálogo de procedimientos:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      Vista completa de todos los procedimientos dentales
                      disponibles
                    </li>
                    <li>
                      Precios configurados en múltiples monedas (PEN, CLP, USD)
                    </li>
                    <li>
                      Organización por grupos: Ortodoncia, Endodoncia,
                      Periodoncia, Cirugía, etc.
                    </li>
                    <li>Activar/desactivar procedimientos según necesidad</li>
                  </ul>

                  <p className='mt-3'>
                    <strong>💰 Presupuestos y Pagos:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>
                      Crea presupuestos dentro de cada caso clínico del paciente
                    </li>
                    <li>Agrega procedimientos del catálogo o personalizados</li>
                    <li>Aplica descuentos opcionales por item</li>
                    <li>Registra pagos parciales o totales</li>
                    <li>
                      El sistema calcula automáticamente el saldo pendiente
                    </li>
                  </ol>

                  <p className='mt-3'>
                    <strong>💳 Métodos de pago soportados:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>💵 Efectivo</li>
                    <li>💳 Tarjeta de crédito/débito</li>
                    <li>🏦 Transferencia bancaria</li>
                    <li>📱 Yape / Plin</li>
                  </ul>

                  <div className='bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-md p-3 mt-2'>
                    <p className='text-purple-700 dark:text-purple-300 text-xs'>
                      📊 <strong>Estados del presupuesto:</strong> Por cobrar →
                      Parcial → Pagado. La barra de progreso muestra visualmente
                      el avance de los pagos.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='odontograma'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Stethoscope className='h-4 w-4' />
                    Odontograma Digital
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>🦷 Tipos de Odontograma:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>Adulto:</strong> 32 piezas dentales (dentición
                      permanente)
                    </li>
                    <li>
                      <strong>Infantil:</strong> 20 piezas dentales (dentición
                      decidua/de leche)
                    </li>
                  </ul>

                  <p className='mt-3'>
                    <strong>📍 Zonas por diente:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      Mesial • Distal • Oclusal/Incisal • Vestibular •
                      Palatino/Lingual
                    </li>
                  </ul>

                  <p className='mt-3'>
                    <strong>🏷️ Condiciones registrables:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      Caries, Restauraciones (resina, amalgama), Ausencias
                    </li>
                    <li>Fracturas, Endodoncia, Prótesis, y más...</li>
                  </ul>

                  <p className='mt-3'>
                    <strong>✏️ Cómo usar:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>Selecciona el tipo de odontograma (adulto/infantil)</li>
                    <li>Haz clic en el diente a editar</li>
                    <li>Selecciona la zona afectada</li>
                    <li>Elige la condición del menú</li>
                    <li>Los cambios se guardan automáticamente</li>
                  </ol>

                  <div className='bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-2'>
                    <p className='text-blue-700 dark:text-blue-300 text-xs'>
                      📜 <strong>Historial:</strong> Usa &quot;Nueva
                      versión&quot; para crear un registro histórico. Puedes ver
                      las versiones anteriores del odontograma en cualquier
                      momento.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='reportes'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <BarChart3 className='h-4 w-4' />
                    Reportes y PDFs
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>📊 Dashboard (Inicio):</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      KPIs en tiempo real: pacientes, citas, ingresos,
                      tratamientos activos
                    </li>
                    <li>Gráficos de estado de citas y tratamientos</li>
                    <li>Top procedimientos más realizados</li>
                    <li>Comparativas con períodos anteriores</li>
                  </ul>

                  <p className='mt-3'>
                    <strong>📄 Generación de PDFs:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>Ficha Odontológica Completa:</strong> Datos de
                      filiación, historia clínica, odontograma y antecedentes
                    </li>
                    <li>
                      <strong>Historial de Citas:</strong> Lista de todas las
                      citas del paciente con estados y resultados
                    </li>
                    <li>
                      <strong>Resumen de Tratamientos:</strong> Casos clínicos,
                      procedimientos realizados y pagos efectuados
                    </li>
                  </ul>

                  <p className='mt-3'>
                    <strong>📥 Cómo generar un reporte:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>Ve a &quot;Reportes&quot; en el menú</li>
                    <li>Busca y selecciona el paciente</li>
                    <li>Elige el tipo de reporte</li>
                    <li>Haz clic en &quot;Generar PDF&quot;</li>
                    <li>Descarga o imprime el documento</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='chatbot'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Bot className='h-4 w-4' />
                    Chatbot con IA
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>🤖 Asistente Virtual Inteligente:</strong>
                  </p>
                  <p>
                    El chatbot utiliza inteligencia artificial para responder
                    consultas de usuarios y pacientes potenciales.
                  </p>

                  <p className='mt-3'>
                    <strong>⚙️ Configuración (Solo Administradores):</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>System Prompt:</strong> Define la personalidad y
                      comportamiento del chatbot
                    </li>
                    <li>
                      <strong>FAQs:</strong> Preguntas frecuentes con respuestas
                      predefinidas y palabras clave
                    </li>
                    <li>
                      <strong>Contextos:</strong> Información extensa que el
                      chatbot puede usar (políticas, promociones, etc.)
                    </li>
                    <li>
                      <strong>Fuentes CMS:</strong> Activa/desactiva info de la
                      clínica, servicios y equipo médico
                    </li>
                  </ul>

                  <p className='mt-3'>
                    <strong>🔄 Sincronización IA:</strong>
                  </p>
                  <p>
                    Después de agregar o modificar FAQs y Contextos, recuerda
                    hacer clic en &quot;Sync IA&quot; para que el chatbot use la
                    información actualizada.
                  </p>

                  <div className='bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-md p-3 mt-2'>
                    <p className='text-indigo-700 dark:text-indigo-300 text-xs'>
                      💬 <strong>Acceso:</strong> Los usuarios pueden acceder al
                      chatbot desde el ícono flotante en la esquina inferior
                      derecha de la página pública.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='admin'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    Administración (Solo Admins)
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    Si eres administrador, tienes acceso a módulos adicionales:
                  </p>

                  <p className='mt-2'>
                    <strong>👥 Personal de la Clínica:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      Gestionar usuarios del sistema (odontólogos y admins)
                    </li>
                    <li>Ver especialidad, teléfono y estado de cada usuario</li>
                    <li>Activar/desactivar cuentas de usuario</li>
                  </ul>

                  <p className='mt-3'>
                    <strong>🔑 Códigos de Invitación:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>
                      Ve a &quot;Personal de la Clínica&quot; → pestaña
                      &quot;Códigos&quot;
                    </li>
                    <li>Haz clic en &quot;Nuevo Código&quot;</li>
                    <li>
                      Selecciona el rol (Admin/Odontólogo), usos máximos y días
                      de expiración
                    </li>
                    <li>Copia y comparte el código con el nuevo usuario</li>
                  </ol>

                  <p className='mt-3'>
                    <strong>📋 Gestor CMS:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>Info General:</strong> Nombre, slogan, teléfono,
                      WhatsApp, email, dirección, horarios
                    </li>
                    <li>
                      <strong>Servicios:</strong> Lista de servicios con
                      descripciones, iconos e imágenes
                    </li>
                    <li>
                      <strong>Equipo:</strong> Profesionales con foto,
                      especialidad y currículum
                    </li>
                    <li>
                      <strong>Tema Visual:</strong> Colores primario, secundario
                      y de acento
                    </li>
                  </ul>

                  <div className='bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-md p-3 mt-2'>
                    <p className='text-orange-700 dark:text-orange-300 text-xs'>
                      ⚠️ <strong>Importante:</strong> Si desactivas
                      &quot;Registro Público&quot;, solo usuarios con código de
                      invitación podrán crear cuentas.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='imagenes'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <FolderOpen className='h-4 w-4' />
                    Visor de Imágenes
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>🔍 Visor en Pantalla Completa:</strong>
                  </p>
                  <p>
                    Al hacer clic en el ícono de lupa en cualquier imagen, se
                    abre el visor fullscreen con:
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Vista ampliada de la imagen</li>
                    <li>
                      Información del tipo de imagen y etapa del tratamiento
                    </li>
                    <li>Botón de descarga con nombre descriptivo</li>
                    <li>Controles táctiles optimizados para móviles</li>
                  </ul>

                  <p className='mt-3'>
                    <strong>📥 Descarga con nombre descriptivo:</strong>
                  </p>
                  <p>Al descargar, el archivo incluye información relevante:</p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Número de ficha del paciente</li>
                    <li>Nombre del caso clínico</li>
                    <li>Tipo de imagen (Radiografía, Intraoral, etc.)</li>
                    <li>Etapa del tratamiento (Antes, Durante, Después)</li>
                    <li>Fecha de captura</li>
                  </ul>

                  <div className='bg-slate-100 dark:bg-slate-800 rounded-md p-2 mt-2 font-mono text-xs'>
                    Ejemplo:
                    Ficha_00123_Rehabilitacion_Radiografia_Antes_2025-11-30.jpg
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='soporte'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Settings className='h-4 w-4' />
                    Soporte y Solución de Problemas
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-3'>
                  <p>
                    <strong>🔧 Solución de problemas comunes:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>Página no carga:</strong> Presiona F5 para
                      refrescar o Ctrl+Shift+R para forzar recarga
                    </li>
                    <li>
                      <strong>Sesión expirada:</strong> Cierra sesión y vuelve a
                      iniciar
                    </li>
                    <li>
                      <strong>Datos no actualizados:</strong> Limpia el caché
                      del navegador (Ctrl+Shift+Delete)
                    </li>
                    <li>
                      <strong>Problemas de conexión:</strong> Verifica tu
                      conexión a internet
                    </li>
                  </ul>

                  <p className='mt-3'>
                    <strong>❓ Preguntas Frecuentes:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>¿Puedo acceder desde mi celular?</strong> Sí, el
                      sistema es responsive y funciona en todos los
                      dispositivos.
                    </li>
                    <li>
                      <strong>¿Cómo sincronizo con Google Calendar?</strong> La
                      integración es automática una vez autorizada en
                      configuración.
                    </li>
                    <li>
                      <strong>¿El chatbot no responde bien?</strong> Ve a
                      Chatbot → Sync IA después de modificar FAQs o Contextos.
                    </li>
                  </ul>

                  <div className='bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md p-3 mt-2'>
                    <p className='text-red-700 dark:text-red-300 text-xs'>
                      🆘 <strong>¿Problemas persistentes?</strong> Contacta al
                      administrador del sistema o al equipo de soporte técnico.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Documentación Completa */}
        <Card className='border-primary/20 bg-primary/5'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <FileText className='h-5 w-5 text-primary' />
              Documentación Completa
            </CardTitle>
            <CardDescription>
              Accede al manual de usuario detallado con todas las instrucciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              size='lg'
              className='w-full sm:w-auto group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
            >
              <a
                href='https://docs.google.com/document/d/1RwI2CGSuq1cHeoco354-a8KHLdbv-w_RW9K9y9GRcAI/edit?usp=sharing'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
                <ExternalLink className='mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12' />
                Abrir Manual de Usuario
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

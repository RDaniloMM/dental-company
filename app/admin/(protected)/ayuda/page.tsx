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
                <AccordionContent className='text-sm text-muted-foreground space-y-2'>
                  <p>
                    Bienvenido al sistema de gestión de la clínica dental. Aquí
                    podrás:
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Gestionar historias clínicas de pacientes</li>
                    <li>Programar y administrar citas</li>
                    <li>Registrar tratamientos y procedimientos</li>
                    <li>Generar reportes de la clínica</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='pacientes'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <FolderOpen className='h-4 w-4' />
                    Historias Clínicas
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-2'>
                  <p>
                    <strong>Registrar un nuevo paciente:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>
                      Ve a &quot;Historias Clínicas&quot; en el menú lateral
                    </li>
                    <li>Haz clic en &quot;Nuevo Paciente&quot;</li>
                    <li>
                      Completa los datos básicos (nombre, DNI, fecha de
                      nacimiento)
                    </li>
                    <li>
                      Puedes hacer &quot;Registro Rápido&quot; o &quot;Registrar
                      y Completar Ficha&quot;
                    </li>
                  </ol>
                  <p className='mt-2'>
                    <strong>Ver ficha de paciente:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      Busca al paciente por nombre, DNI o número de historia
                    </li>
                    <li>
                      Haz clic en &quot;Ver Ficha&quot; para acceder a toda su
                      información
                    </li>
                    <li>
                      En la ficha encontrarás: datos personales, odontograma,
                      historial de citas e imágenes
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='citas'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <CalendarDays className='h-4 w-4' />
                    Gestión de Citas
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-2'>
                  <p>
                    <strong>Agendar una cita:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>Accede a &quot;Citas&quot; desde el menú lateral</li>
                    <li>En el calendario, haz clic en el día y hora deseada</li>
                    <li>Selecciona el paciente y el odontólogo</li>
                    <li>Indica el motivo de la consulta y guarda</li>
                  </ol>
                  <p className='mt-2'>
                    <strong>Estados de citas:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>Programada:</strong> Cita agendada pendiente de
                      confirmar
                    </li>
                    <li>
                      <strong>Confirmada:</strong> El paciente confirmó su
                      asistencia
                    </li>
                    <li>
                      <strong>Completada:</strong> Cita realizada exitosamente
                    </li>
                    <li>
                      <strong>Cancelada:</strong> Cita cancelada por el paciente
                      o la clínica
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='tratamientos'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Stethoscope className='h-4 w-4' />
                    Tratamientos
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-2'>
                  <p>
                    <strong>Administrar procedimientos:</strong>
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      En &quot;Tratamientos&quot; puedes ver todos los
                      procedimientos disponibles
                    </li>
                    <li>
                      Cada procedimiento tiene precios configurados en
                      diferentes monedas
                    </li>
                    <li>
                      Puedes organizar los procedimientos por grupos
                      (Ortodoncia, Endodoncia, etc.)
                    </li>
                  </ul>
                  <p className='mt-2'>
                    <strong>Agregar un tratamiento al paciente:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>Accede a la ficha del paciente</li>
                    <li>Ve al odontograma y selecciona el diente</li>
                    <li>Agrega el procedimiento realizado o planificado</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='reportes'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <BarChart3 className='h-4 w-4' />
                    Reportes
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-2'>
                  <p>En la sección de reportes puedes:</p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Ver estadísticas de pacientes y citas</li>
                    <li>Consultar los tratamientos más realizados</li>
                    <li>Analizar ingresos por período</li>
                    <li>Exportar datos para análisis externo</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='chatbot'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Bot className='h-4 w-4' />
                    Asistente Chatbot
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-2'>
                  <p>El chatbot es tu asistente virtual para:</p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Consultar información rápida sobre pacientes</li>
                    <li>Obtener ayuda sobre el uso del sistema</li>
                    <li>Resolver dudas sobre procedimientos</li>
                  </ul>
                  <p className='mt-2 text-xs'>
                    Puedes acceder al chatbot desde el ícono flotante en la
                    esquina inferior derecha.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='admin'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    Administración (Solo Admins)
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-2'>
                  <p>Si eres administrador, tienes acceso adicional a:</p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <strong>Personal de la Clínica:</strong> Gestionar
                      usuarios, crear códigos de invitación
                    </li>
                    <li>
                      <strong>Gestor CMS:</strong> Administrar contenido del
                      sistema
                    </li>
                    <li>
                      <strong>Chatbot:</strong> Configurar el asistente virtual
                    </li>
                  </ul>
                  <p className='mt-2'>
                    <strong>Crear códigos de invitación:</strong>
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>Ve a &quot;Personal de la Clínica&quot;</li>
                    <li>
                      En la pestaña &quot;Códigos de Invitación&quot;, crea un
                      nuevo código
                    </li>
                    <li>
                      Selecciona el rol (Admin u Odontólogo) y usos máximos
                    </li>
                    <li>
                      Comparte el código con el nuevo usuario para que se
                      registre
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='soporte'>
                <AccordionTrigger className='text-sm'>
                  <div className='flex items-center gap-2'>
                    <Settings className='h-4 w-4' />
                    Soporte Técnico
                  </div>
                </AccordionTrigger>
                <AccordionContent className='text-sm text-muted-foreground space-y-2'>
                  <p>Si tienes problemas técnicos:</p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Intenta refrescar la página (F5)</li>
                    <li>Cierra sesión y vuelve a iniciar</li>
                    <li>Limpia el caché del navegador</li>
                  </ul>
                  <p className='mt-2'>
                    Para soporte adicional, contacta al administrador del
                    sistema.
                  </p>
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

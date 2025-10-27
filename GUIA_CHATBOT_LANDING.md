# 🚀 Guía Rápida - Chatbot Flotante en Landing Page

## ✅ Ya está implementado!

El chatbot RAG ahora está integrado en tu landing page principal como un widget flotante accesible públicamente.

## 🎯 ¿Qué cambió?

### ANTES ❌

- Chatbot en `/chatbot` (página separada)
- Solo accesible con URL directa
- No visible para visitantes normales

### AHORA ✅

- **Chatbot flotante** en landing page principal (`/`)
- **Visible para todos** los visitantes
- **Botón siempre visible** en esquina inferior derecha
- **15 FAQs** con información de tu clínica
- **Modo FAQ siempre activado** para usuarios públicos

## 👀 Cómo se Ve

### Botón Flotante (Cerrado)

```
┌─────────────────────────────┐
│                             │
│    Tu Landing Page          │
│                             │
│                        [💬] │ ← Botón azul flotante
│                             │
└─────────────────────────────┘
```

### Ventana Abierta

```
┌─────────────────────────────┐
│                             │
│    Tu Landing Page          │
│                             │
│                ┌──────────┐ │
│                │ 💬 Chat  │ │
│                │──────────│ │
│                │ Mensaje  │ │
│                │──────────│ │
│                │ [Input]  │ │
│                └──────────┘ │
└─────────────────────────────┘
```

## 🚀 Para Probar

### 1. Inicia el servidor

```powershell
npm run dev
```

### 2. Abre tu navegador

Ve a: `http://localhost:3000`

### 3. Busca el botón

- Esquina **inferior derecha**
- **Botón azul** con icono de mensaje
- Al hacer hover dice: "¿Necesitas ayuda?"

### 4. Haz click

Se abre una ventana de chat

### 5. Prueba estas preguntas

- ✅ "¿Cuál es el horario?"
- ✅ "¿Cómo agendo una cita?"
- ✅ "¿Dónde están ubicados?"
- ✅ "¿Cuánto cuesta?"
- ✅ "¿Atienden niños?"
- ✅ "¿Hacen blanqueamiento?"

## 📱 Funciona en Mobile

En dispositivos móviles:

- El chat ocupa **90%** del ancho de pantalla
- **Botón más compacto** pero visible
- **Touch-friendly**
- Scroll automático

## 🎨 Características

### Mensaje de Bienvenida

Cuando abres el chat por primera vez, verás:

```
👋 ¡Hola! Soy tu asistente virtual.
Puedo ayudarte con:
• Horarios de atención
• Agendar citas
• Información de servicios
• Precios y seguros
```

### Indicador FAQ

En el header del chat dice:

```
📖 Base de conocimiento activa
```

Esto indica que está usando las 15 FAQs

### Botón Copiar

Cada respuesta del asistente tiene un botón 📋 para copiar

## 📊 15 FAQs Disponibles

El chatbot puede responder sobre:

1. **Horarios** - Lun-Vie 9-7, Sáb 9-1
2. **Agendar cita** - Tel: +51 952 864 883
3. **Servicios** - Limpieza, ortodoncia, implantes, etc.
4. **Seguros** - Acepta mayoría de seguros
5. **Precios** - Invita a contactar
6. **Emergencias** - Atención en horario
7. **Requisitos** - No necesita referencia
8. **Duración** - Tiempos de tratamientos
9. **Ubicación** - Av. General Suarez 312, Tacna
10. **Estacionamiento** - Sí disponible
11. **Bioseguridad** - Protocolos estrictos
12. **Niños** - Odontopediatría disponible
13. **Blanqueamiento** - Servicio disponible
14. **Formas de pago** - Efectivo, tarjetas, financiamiento
15. **Sin cita** - Atienden pero mejor agendar

## 🔧 Personalización Rápida

### Cambiar Color del Botón

`components/floating-chatbot.tsx` línea 82:

```typescript
className = "bg-blue-600 hover:bg-blue-700";
// Cambia "blue" por otro color: green, purple, red, etc.
```

### Cambiar Mensaje de Bienvenida

`components/floating-chatbot.tsx` línea 112:

```typescript
<p className='text-sm text-gray-700'>👋 Tu mensaje aquí</p>
```

### Agregar Más FAQs

`lib/faq-data.ts`:

```typescript
{
  id: "16",
  question: "¿Tu pregunta?",
  answer: "Tu respuesta...",
  keywords: ["palabra1", "palabra2"]
}
```

## 🎯 Información Incluida Automáticamente

Todas las respuestas del chatbot incluyen:

- ✅ Teléfono: +51 952 864 883
- ✅ Email: d.c.com@hotmail.com
- ✅ Dirección: Av. General Suarez 312, Tacna
- ✅ Horarios específicos

## 💡 Tips de Uso

### Para Visitantes

- Click en botón flotante
- Escribe pregunta natural
- Recibe respuesta instantánea
- Puede copiar información
- Cerrar con X en header

### Para Ti (Admin)

- Monitorea qué preguntan (futuro: analytics)
- Actualiza FAQs según necesidad
- Agrega más keywords si no encuentra
- Revisa que info sea actual

## ⚡ Ventajas

### Para Visitantes

✅ **24/7 disponible** - Siempre pueden preguntar
✅ **Respuestas instantáneas** - No esperar llamada
✅ **Info precisa** - Basada en tu base de conocimiento
✅ **Fácil de usar** - Interface intuitiva

### Para Tu Clínica

✅ **Reduce llamadas** - Preguntas básicas se responden solas
✅ **Mejor experiencia** - Usuarios encuentran info rápido
✅ **Profesional** - Da imagen moderna
✅ **Conversiones** - Más agendamiento de citas

## 🔍 Testing Checklist

- [ ] Botón flotante visible en landing
- [ ] Click abre ventana de chat
- [ ] Mensaje de bienvenida aparece
- [ ] Pregunta sobre horario funciona
- [ ] Pregunta sobre ubicación funciona
- [ ] Respuestas incluyen datos de contacto
- [ ] Botón copiar funciona
- [ ] Cerrar con X funciona
- [ ] Responsive en mobile
- [ ] Reabre y mantiene conversación

## 🚨 Solución Rápida de Problemas

### No veo el botón flotante

1. Verifica que guardaste `app/page.tsx`
2. Reinicia el servidor: Ctrl+C y `npm run dev`
3. Refresca el navegador: F5

### Botón aparece pero no abre

1. Abre consola del navegador (F12)
2. Busca errores rojos
3. Verifica API key en `.env.local`

### Respuestas genéricas

1. Verifica que modo FAQ esté activo
2. Revisa que keywords coincidan
3. Mejora las FAQs en `faq-data.ts`

### Error de API

1. Verifica API key: `.env.local`
2. Confirma cuota de Google Gemini
3. Revisa logs en terminal

## 📱 Mobile Testing

Abre en Chrome DevTools:

1. F12 → Toggle device toolbar
2. Selecciona iPhone/Android
3. Prueba botón flotante
4. Verifica que chat sea usable

## 🎉 Próximos Pasos Sugeridos

### Corto Plazo (1-2 semanas)

- [ ] Monitorea uso real
- [ ] Agrega más FAQs según preguntas reales
- [ ] Ajusta keywords que no funcionan
- [ ] Prueba en diferentes dispositivos

### Mediano Plazo (1-2 meses)

- [ ] Implementa analytics (qué preguntan)
- [ ] Agrega botones de feedback (👍👎)
- [ ] Integra con WhatsApp Business
- [ ] Agrega seguimiento a conversiones

### Largo Plazo (3+ meses)

- [ ] Embeddings vectoriales (búsqueda mejor)
- [ ] Integración directa con calendario
- [ ] Multi-idioma (inglés)
- [ ] Voice input/output

## 📚 Documentación

- **CHATBOT_LANDING_README.md** - Documentación completa técnica
- **RAG_README.md** - Explicación del sistema RAG
- **GUIA_RAPIDA.md** - Esta guía

## 🎯 Resultado Final

Ahora tienes:

- ✅ Chatbot público en landing page
- ✅ 15 FAQs con info de tu clínica
- ✅ Sistema RAG funcionando
- ✅ Interface profesional y amigable
- ✅ Responsive mobile/desktop
- ✅ Gratis (Google Gemini)
- ✅ Fácil de actualizar

---

**¿Listo para probarlo?** 🚀

```powershell
npm run dev
```

Luego abre: `http://localhost:3000`

¡Busca el botón azul en la esquina! 💬

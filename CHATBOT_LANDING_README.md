# 🤖 Chatbot RAG para Landing Page - DENTAL COMPANY

## 📋 Descripción

Sistema de chatbot flotante con RAG (Retrieval-Augmented Generation) integrado en la landing page pública de DENTAL COMPANY. Cualquier visitante puede usarlo para obtener información sobre la clínica, servicios, horarios y más.

## ✨ Características

### 🎯 Chatbot Flotante

- **Botón flotante** en esquina inferior derecha
- **Animación hover** con texto "¿Necesitas ayuda?"
- **Ventana modal** responsive (móvil y desktop)
- **Siempre visible** en todas las secciones de la landing

### 🧠 Sistema RAG Inteligente

- **15 FAQs** pre-cargadas con información de la clínica
- **Búsqueda automática** por keywords y similitud
- **Contexto relevante** inyectado en cada respuesta
- **Modo FAQ siempre activado** para usuarios públicos

### 💬 Interfaz Amigable

- Mensaje de bienvenida con opciones comunes
- Indicador visual "Base de conocimiento activa"
- Botón para copiar respuestas
- Scroll automático a nuevos mensajes
- Diseño profesional y limpio

## 📁 Archivos Principales

### Componente del Chatbot

```
components/
  └── floating-chatbot.tsx    # Componente flotante principal
```

### Base de Conocimiento

```
lib/
  ├── faq-data.ts            # 15 FAQs de la clínica
  └── rag-utils.ts           # Motor de búsqueda RAG
```

### API Backend

```
app/
  └── api/
      └── chat/
          └── route.ts       # Endpoint con Gemini + RAG
```

### Integración Landing

```
app/
  └── page.tsx              # Landing page con chatbot flotante
```

## 🎨 Diseño Visual

### Botón Flotante

- **Color**: Azul (#2563eb)
- **Posición**: Bottom-right (24px margin)
- **Icono**: MessageCircle
- **Efecto hover**: Escala 1.1 + texto expandible
- **Z-index**: 50 (siempre visible)

### Ventana de Chat

- **Tamaño**: 384px × 600px (desktop)
- **Responsive**: 90vw en móvil
- **Max height**: 80vh
- **Sombra**: shadow-2xl
- **Border radius**: rounded-lg

### Colores

- Header: bg-blue-600
- Body: bg-white
- Footer: bg-gray-100
- Bienvenida: bg-blue-50

## 📊 FAQs Incluidas (15 total)

1. ✅ Horario de atención
2. ✅ Cómo agendar cita
3. ✅ Servicios dentales
4. ✅ Seguros médicos
5. ✅ Precios/Costos
6. ✅ Emergencias
7. ✅ Requisitos para agendar
8. ✅ Duración de limpieza
9. ✅ Ubicación de la clínica
10. ✅ Estacionamiento
11. ✅ Medidas de bioseguridad
12. ✅ Atención a niños
13. ✅ Blanqueamiento dental
14. ✅ Formas de pago
15. ✅ Atención sin cita

## 🚀 Cómo Funciona

### Flujo de Usuario

```
1. Usuario visita landing page
2. Ve botón flotante "¿Necesitas ayuda?"
3. Click → Abre ventana de chat
4. Lee mensaje de bienvenida con opciones
5. Escribe pregunta (ej: "¿Cuál es el horario?")
6. Sistema:
   - Busca en 15 FAQs
   - Encuentra las 3 más relevantes
   - Genera contexto RAG
   - Envía a Gemini con contexto
7. Gemini responde usando información específica
8. Usuario recibe respuesta precisa ✅
```

### Flujo Técnico

```
[Usuario] → [Input]
              ↓
      [FloatingChatbot]
              ↓
    [POST /api/chat]
         ↓         ↓
  [useFAQ=true]  [searchFAQs()]
         ↓         ↓
    [Gemini]  [Top 3 FAQs]
         ↓         ↓
    [Response con contexto]
         ↓
    [Usuario recibe]
```

## 🔧 Configuración

### Variables de Entorno

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui
```

### Modelo por Defecto

```typescript
// components/floating-chatbot.tsx
const [model] = useState<string>("gemini-2.0-flash-exp");
const [useFAQ] = useState(true); // Siempre activado
```

## 📝 Personalización

### Agregar Nuevas FAQs

Edita `lib/faq-data.ts`:

```typescript
{
  id: "16",
  question: "¿Tu pregunta?",
  answer: "Tu respuesta detallada con info de contacto si es relevante.",
  keywords: ["palabra1", "palabra2", "sinonimo1", "sinonimo2"]
}
```

**Tips para keywords efectivos:**

- Incluye todas las variaciones posibles
- Piensa en términos coloquiales
- Agrega errores comunes de escritura
- Usa verbos y sustantivos relacionados

### Cambiar Colores del Chatbot

En `components/floating-chatbot.tsx`:

```typescript
// Botón flotante
className = "bg-blue-600 hover:bg-blue-700"; // Cambiar azul

// Header
className = "bg-blue-600 text-white"; // Cambiar azul

// Mensaje bienvenida
className = "bg-blue-50 border-blue-100"; // Cambiar fondo
```

### Modificar Mensaje de Bienvenida

En `components/floating-chatbot.tsx` (línea ~110):

```typescript
<p className="text-sm text-gray-700">
  👋 Tu mensaje personalizado aquí
</p>
<ul className="text-xs text-gray-600 mt-2 space-y-1 ml-4">
  <li>• Tu punto 1</li>
  <li>• Tu punto 2</li>
  // ...
</ul>
```

### Ajustar Prompt del Sistema

En `app/api/chat/route.ts` (línea ~24):

```typescript
let systemPrompt = `Eres el asistente virtual de [TU CLÍNICA]...`;
```

## 🎯 Mejores Prácticas

### ✅ DO (Hacer)

- Mantener FAQs actualizadas con info real
- Incluir datos de contacto en respuestas
- Usar lenguaje amigable y profesional
- Probar regularmente las búsquedas
- Agregar keywords cuando no encuentra respuestas

### ❌ DON'T (No hacer)

- No inventar precios o info médica
- No dar diagnósticos
- No sobrecargar con muchas FAQs (max 20-25)
- No usar keywords muy genéricas
- No olvidar actualizar info de contacto

## 📱 Responsive

### Mobile (< 768px)

- Ancho: 90vw
- Botón flotante más pequeño
- Chat ocupa casi toda la pantalla
- Touch-friendly

### Desktop (≥ 768px)

- Ancho fijo: 384px
- Botón con texto expandible
- Posición fixed bottom-right
- Hover effects

## 🔍 Testing

### Preguntas de Prueba

```
1. "¿Cuál es el horario?" → Debe responder horarios exactos
2. "¿Cómo agendo cita?" → Debe dar teléfono y opciones
3. "¿Dónde quedan?" → Debe dar dirección completa
4. "¿Cuánto cuesta?" → Debe invitar a contactar
5. "¿Atienden niños?" → Debe mencionar odontopediatría
6. "Hola" → Debe dar bienvenida amigable
7. "¿Hacen blanqueamiento?" → Debe confirmar y dar contacto
```

### Verificar

- ✅ Respuestas incluyen datos de contacto
- ✅ No inventa información
- ✅ Es amigable y profesional
- ✅ Sugiere agendar cita cuando corresponde
- ✅ Funciona en mobile y desktop

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# 1. Push a GitHub
git add .
git commit -m "Add floating chatbot with RAG"
git push

# 2. Deploy en Vercel
# - Conecta el repo
# - Agrega GOOGLE_GENERATIVE_AI_API_KEY
# - Deploy automático
```

### Variables de Entorno en Producción

```
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
```

## 📈 Métricas Sugeridas

Para futuras mejoras, considera trackear:

- Preguntas más frecuentes
- Tasa de conversión a citas
- Tiempo de respuesta
- Satisfacción del usuario (👍👎)
- Preguntas sin respuesta encontrada

## 🔄 Próximas Mejoras

### Corto Plazo

- [ ] Analytics de preguntas
- [ ] Botón de feedback (👍👎)
- [ ] Sugerencias de preguntas populares
- [ ] Historial de conversación persistente

### Largo Plazo

- [ ] Embeddings vectoriales con Google
- [ ] Integración con Supabase pgvector
- [ ] Multi-idioma (inglés)
- [ ] Integración directa con calendario
- [ ] Notificaciones push
- [ ] Voice input/output

## 🆘 Troubleshooting

### El chatbot no aparece

- Verifica que `<FloatingChatbot />` esté en `app/page.tsx`
- Revisa la consola del navegador por errores
- Confirma que la API key esté configurada

### No encuentra FAQs relevantes

- Agrega más keywords en `faq-data.ts`
- Baja el threshold en `rag-utils.ts`
- Verifica que la pregunta sea similar a alguna FAQ

### Respuestas genéricas

- Activa modo FAQ (debe estar siempre activado)
- Verifica que las FAQs tengan info específica
- Mejora el system prompt

### Error de API

- Verifica API key de Google Gemini
- Confirma que tienes cuota disponible
- Revisa logs en Vercel/consola

## 📚 Documentación Adicional

- **RAG_README.md** - Explicación técnica del sistema RAG
- **GUIA_RAPIDA.md** - Guía de uso rápida
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Google Gemini API](https://ai.google.dev/)

## 👥 Contacto y Soporte

Para preguntas sobre implementación:

- Revisa la documentación completa
- Consulta los ejemplos en `lib/rag-example.ts`
- Verifica las FAQs existentes como referencia

---

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025  
**Clínica**: DENTAL COMPANY - Tacna, Perú

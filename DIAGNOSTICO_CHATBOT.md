# 🔧 Diagnóstico y Soluciones - Chatbot en Producción

## ⚠️ Problema Reportado

El chatbot funciona solo para algunos usuarios en producción.

## 🔍 Causas Posibles y Soluciones

### 1. **Límites de Cuota de Google Gemini API** ⭐ MÁS PROBABLE

#### Síntoma:

- Funciona para primeros usuarios
- Deja de funcionar después de cierto número de requests
- Puede volver a funcionar después de un tiempo

#### Causa:

Google Gemini API gratuita tiene límites:

- **15 RPM** (Requests Per Minute)
- **1500 RPD** (Requests Per Day)
- **1 millón tokens/mes** para tier gratuito

#### Solución:

```typescript
// app/api/chat/route.ts
// Agregar manejo de errores y rate limiting

export async function POST(req: Request) {
  try {
    const { messages, model, useFAQ = false } = await req.json();

    const geminiModel = google(model);

    // ... resto del código

    const result = streamText({
      model: geminiModel,
      messages: convertToModelMessages(messages),
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error: any) {
    console.error("Error en chatbot:", error);

    // Detectar errores de cuota
    if (error.message?.includes("quota") || error.message?.includes("limit")) {
      return new Response(
        JSON.stringify({
          error: "Límite de uso alcanzado. Por favor intenta en unos minutos.",
          code: "QUOTA_EXCEEDED",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Error genérico
    return new Response(
      JSON.stringify({
        error: "Error al procesar tu mensaje. Por favor intenta nuevamente.",
        code: "INTERNAL_ERROR",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
```

### 2. **Variable de Entorno GOOGLE_GENERATIVE_AI_API_KEY**

#### Síntoma:

- No funciona para nadie
- O funciona localmente pero no en producción

#### Verificar:

1. En Vercel/tu plataforma de deployment:
   - Settings → Environment Variables
   - Verifica que `GOOGLE_GENERATIVE_AI_API_KEY` esté configurada
   - Verifica que no tenga espacios extra o caracteres raros

#### Solución:

```bash
# En Vercel
1. Dashboard → Project → Settings → Environment Variables
2. Agregar/Verificar:
   Name: GOOGLE_GENERATIVE_AI_API_KEY
   Value: AIzaSy... (tu key sin espacios)
   Environment: Production, Preview, Development

3. Redeploy después de cambiar variables
```

### 3. **CORS / Network Issues**

#### Síntoma:

- Funciona en algunos navegadores/dispositivos pero no en otros
- Error en consola del navegador sobre CORS

#### Solución:

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};
```

### 4. **Edge Runtime / Timeout Issues**

#### Síntoma:

- Se queda "cargando" para algunos usuarios
- Timeout después de 30 segundos

#### Causa:

El `maxDuration = 30` puede no ser suficiente o no estar respetado

#### Solución:

```typescript
// app/api/chat/route.ts
export const runtime = "edge"; // O 'nodejs'
export const maxDuration = 30;
export const dynamic = "force-dynamic";
```

### 5. **Client-Side Hydration Issues**

#### Síntoma:

- Funciona después de reload
- No funciona en primera carga

#### Solución:

Agregar dynamic import:

```typescript
// app/page.tsx
import dynamic from "next/dynamic";

const FloatingChatbot = dynamic(
  () =>
    import("@/components/floating-chatbot").then((mod) => ({
      default: mod.FloatingChatbot,
    })),
  { ssr: false }
);
```

### 6. **AdBlockers / Privacy Extensions**

#### Síntoma:

- Funciona en modo incógnito pero no en normal
- Funciona en algunos navegadores pero no en otros

#### Causa:

Extensions como uBlock Origin, Privacy Badger pueden bloquear:

- Requests a `/api/chat`
- WebSockets para streaming
- Third-party API calls

#### Solución:

Agregar mensaje de error amigable cuando falla:

```typescript
// components/floating-chatbot.tsx
const { messages, sendMessage, status, error } = useChat({
  onError: (error) => {
    console.error("Chat error:", error);
    // Mostrar mensaje al usuario
  },
});

// En el JSX, mostrar error si existe
{
  error && (
    <div className='p-4 bg-red-50 text-red-700 text-sm'>
      ⚠️ Error: {error.message}. Si usas un bloqueador de anuncios, intenta
      desactivarlo.
    </div>
  );
}
```

## 🎯 Solución Recomendada (Implementar YA)

### Paso 1: Agregar manejo de errores robusto

```typescript
// app/api/chat/route.ts - VERSIÓN MEJORADA
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import {
  searchFAQs,
  generateRAGContext,
  isRelevantForFAQ,
} from "@/lib/rag-utils";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Verificar API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("API KEY no configurada");
      return new Response(
        JSON.stringify({
          error: "Servicio temporalmente no disponible",
          code: "CONFIG_ERROR",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, model, useFAQ = false } = await req.json();

    // Validar input
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Mensajes inválidos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const geminiModel = google(model);

    let systemPrompt = `Eres el asistente virtual de DENTAL COMPANY, una clínica dental en Tacna, Perú.

INFORMACIÓN DE LA CLÍNICA:
- Ubicación: Av. General Suarez N° 312, Tacna, Perú
- Teléfono: +51 952 864 883
- Email: d.c.com@hotmail.com
- Horario: Lunes a Viernes 9:00 AM - 7:00 PM, Sábados 9:00 AM - 1:00 PM, Domingos cerrado

TU ROL:
- Responde de manera amable, profesional y empática
- Proporciona información clara y precisa sobre servicios dentales
- Si no tienes información específica, invita al usuario a contactar directamente a la clínica
- Usa emojis ocasionalmente para hacer la conversación más amigable 😊
- Sé breve y directo en tus respuestas
- Nunca inventes información médica o precios si no los tienes

IMPORTANTE:
- NO proporciones diagnósticos médicos
- NO recomiendes tratamientos específicos sin evaluación profesional
- SIEMPRE recomienda agendar una cita para evaluación personalizada`;

    if (useFAQ && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const userQuery = lastMessage.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join(" ");

      if (isRelevantForFAQ(userQuery)) {
        const relevantFAQs = searchFAQs(userQuery, 3);
        if (relevantFAQs.length > 0) {
          const ragContext = generateRAGContext(relevantFAQs);
          systemPrompt += "\n\n" + ragContext;
        }
      }
    }

    const result = streamText({
      model: geminiModel,
      messages: convertToModelMessages(messages),
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error: any) {
    console.error("Error en chatbot API:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Rate limit / Quota exceeded
    if (
      error.message?.includes("quota") ||
      error.message?.includes("limit") ||
      error.message?.includes("429")
    ) {
      return new Response(
        JSON.stringify({
          error:
            "⏳ Límite temporal alcanzado. Por favor intenta en unos minutos o contáctanos al +51 952 864 883",
          code: "QUOTA_EXCEEDED",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // API key inválida
    if (error.message?.includes("API key") || error.message?.includes("401")) {
      return new Response(
        JSON.stringify({
          error: "Error de configuración. Por favor contáctanos directamente.",
          code: "AUTH_ERROR",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Error genérico
    return new Response(
      JSON.stringify({
        error:
          "⚠️ Error al procesar tu mensaje. Intenta nuevamente o contáctanos al +51 952 864 883",
        code: "INTERNAL_ERROR",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
```

### Paso 2: Mejorar el componente con manejo de errores

```typescript
// components/floating-chatbot.tsx - Agregar al final del archivo

// Modificar useChat para manejar errores:
const { messages, sendMessage, status, error } = useChat({
  api: "/api/chat",
  onError: (error) => {
    console.error("Chat error:", error);
  },
});

// Agregar en el JSX (después del mensaje de bienvenida):
{
  error && (
    <div className='p-4 m-4 bg-red-50 border border-red-200 rounded-lg'>
      <p className='text-sm text-red-700 font-medium'>⚠️ {error.message}</p>
      <p className='text-xs text-red-600 mt-1'>
        Puedes llamarnos directamente al +51 952 864 883
      </p>
    </div>
  );
}
```

## 📊 Monitoreo en Producción

### Logs a revisar en Vercel:

```bash
1. Ve a tu proyecto en Vercel
2. Functions → Select /api/chat
3. Revisa logs para ver:
   - Errores 429 (rate limit)
   - Errores 500 (server errors)
   - Timeouts
```

### Verificar cuota de Google:

```
1. Ve a: https://aistudio.google.com/app/apikey
2. Revisa tu API key
3. Chequea límites de uso
4. Considera upgrade a plan pagado si es necesario
```

## ✅ Checklist de Diagnóstico

- [ ] Variable `GOOGLE_GENERATIVE_AI_API_KEY` configurada en producción
- [ ] Redeploy después de agregar/cambiar variables
- [ ] API key válida y activa en Google AI Studio
- [ ] Revisar logs de Vercel por errores
- [ ] Probar en diferentes navegadores
- [ ] Probar con AdBlocker desactivado
- [ ] Verificar cuota de Google Gemini API
- [ ] Implementar manejo de errores mejorado
- [ ] Agregar logging para debugging

## 🚀 Plan de Acción Inmediato

1. **Implementar versión mejorada de la API** (código arriba)
2. **Verificar variable de entorno** en Vercel
3. **Revisar logs** para identificar el error específico
4. **Considerar plan pagado** si el límite gratuito no es suficiente

## 💡 Alternativas si el problema persiste

### Opción 1: Rate Limiting en tu lado

Implementar cola de mensajes o throttling

### Opción 2: Caché de respuestas

Cachear respuestas comunes para reducir llamadas a la API

### Opción 3: Fallback a respuestas estáticas

Si falla la API, responder solo con FAQs sin IA

### Opción 4: Upgrade a plan pagado

Google Gemini Pro tiene límites mucho más altos

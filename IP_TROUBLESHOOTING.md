# 🌐 Solución para Problemas de IP con Google Cloud

## ⚠️ Problema Identificado

El chatbot funciona solo para algunos usuarios debido a posibles **restricciones de IP por parte de Google Cloud**.

## 🔍 ¿Por qué sucede esto?

### Causa Principal: Vercel Edge Runtime + Google Cloud

```
Usuario 1 → Vercel Edge (IP: 1.2.3.4) → Google Gemini ✅
Usuario 2 → Vercel Edge (IP: 1.2.3.4) → Google Gemini ✅
Usuario 3 → Vercel Edge (IP: 1.2.3.4) → Google Gemini ✅
...
Usuario 20 → Vercel Edge (IP: 1.2.3.4) → Google Gemini ❌ BLOQUEADO

Google ve: "Muchos requests desde la misma IP = posible abuso"
```

### Factores que Activan el Bloqueo:

1. **Múltiples usuarios → Misma IP de Vercel**
2. **Rate limiting por IP** (no por API key)
3. **Vercel Edge IPs compartidas** entre muchos sitios
4. **Google Cloud detecta patrones sospechosos**

## ✅ Soluciones Implementadas

### 1. Cambio a Node.js Runtime

**Antes:**

```typescript
// Edge runtime (problemático)
export const runtime = "edge";
```

**Ahora:**

```typescript
// Node.js runtime (más estable con Google Cloud)
export const runtime = "nodejs";
```

**Beneficios:**

- ✅ IPs más estables
- ✅ Mejor compatibilidad con Google Cloud
- ✅ Menos probabilidad de bloqueo
- ✅ Headers más consistentes

### 2. Logging de IPs

```typescript
const forwarded = req.headers.get("x-forwarded-for");
const ip = forwarded ? forwarded.split(",")[0] : "unknown";
console.log("Chat request from IP:", ip);
```

**Para qué sirve:**

- Ver qué IPs están haciendo requests
- Identificar patrones de bloqueo
- Debug en Vercel logs

### 3. Detección Mejorada de Errores

Ahora detecta más tipos de errores relacionados con IP:

| Error Code              | Mensaje        | Causa Probable               |
| ----------------------- | -------------- | ---------------------------- |
| `RESOURCE_EXHAUSTED`    | Quota exceeded | Rate limit por IP            |
| `PERMISSION_DENIED`     | Auth error     | IP bloqueada                 |
| `403 Forbidden`         | Auth error     | Región/IP bloqueada          |
| `429 Too Many Requests` | Rate limit     | Demasiados requests desde IP |

## 🔧 Verificación y Diagnóstico

### Paso 1: Revisar Logs en Vercel

```bash
1. Ve a Vercel Dashboard
2. Functions → /api/chat → Logs
3. Busca líneas como:
   "Chat request from IP: 1.2.3.4"
4. ¿Ves la misma IP muchas veces? → Problema de IP compartida
```

### Paso 2: Identificar el Error Exacto

```bash
En los logs, busca:
- "Rate limit hit - Google Cloud quota exceeded"
- "Auth error - possible IP block"
- Errores 429, 403, RESOURCE_EXHAUSTED
```

### Paso 3: Confirmar si es Problema de IP

**Test A - Desde diferentes ubicaciones:**

```
✅ Funciona desde tu casa
❌ No funciona desde oficina
→ Problema de IP
```

**Test B - Con VPN:**

```
❌ No funciona sin VPN
✅ Funciona con VPN (cambia IP)
→ Problema de IP
```

**Test C - En diferentes momentos:**

```
✅ Funciona temprano en la mañana
❌ No funciona en horas pico
→ Rate limiting por volumen
```

## 🚀 Soluciones Adicionales

### Opción 1: Configurar IP Allowlist en Google Cloud (RECOMENDADO)

```bash
1. Ve a Google AI Studio
2. Settings → API Restrictions
3. Application restrictions → IP addresses
4. Agrega las IPs de Vercel
```

**Cómo obtener IPs de Vercel:**

```bash
# Opción A: En tus logs
Vercel → Functions → Logs → Busca "Chat request from IP"

# Opción B: Usar servicio de Vercel
Contacta a Vercel Support para lista de IPs

# Opción C: Dynamic (no recomendado)
Las IPs de Vercel pueden cambiar
```

### Opción 2: Usar API Key con Más Cuota

```bash
1. Ve a https://aistudio.google.com/
2. Crea proyecto nuevo en Google Cloud Console
3. Habilita Generative Language API
4. Crea API key con cuota dedicada
5. Configura restricciones de API key:
   - Por referrer (tu dominio)
   - Sin restricción de IP (temporal)
```

### Opción 3: Implementar Proxy con IP Fija

```typescript
// Opción avanzada: Usar servidor proxy con IP fija
// Vercel → Tu servidor (IP fija) → Google Cloud

// En tu servidor (DigitalOcean, AWS, etc):
app.post("/proxy-to-gemini", async (req, res) => {
  // Tu IP será consistente aquí
  const response = await fetch("https://generativelanguage.googleapis.com/...");
  res.json(response);
});

// En Vercel API:
const response = await fetch("https://tu-servidor.com/proxy-to-gemini");
```

### Opción 4: Caché Agresivo para Reducir Calls

```typescript
// Cachear respuestas para preguntas comunes
const cache = new Map<string, {response: string, timestamp: number}>();
const CACHE_TTL = 3600000; // 1 hora

export async function POST(req: Request) {
  const userQuery = /* extraer query */;
  const cacheKey = userQuery.toLowerCase().trim();

  // Revisar caché
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Serving from cache, saving API call');
    return new Response(cached.response);
  }

  // Si no está en caché, llamar a API
  const response = await streamText(/* ... */);

  // Guardar en caché
  cache.set(cacheKey, {
    response: response,
    timestamp: Date.now()
  });

  return response;
}
```

### Opción 5: Rate Limiting en Tu Lado

```typescript
// Instalar: npm install @upstash/ratelimit @upstash/redis
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests/minuto por IP
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success, limit, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response(
      JSON.stringify({
        error: "Demasiadas consultas. Espera un momento.",
        remaining: 0,
        limit: limit,
      }),
      { status: 429 }
    );
  }

  // Continuar con lógica normal
}
```

## 📊 Monitoreo de IPs

### Script para Analizar Logs

```bash
# En Vercel logs, exporta a archivo
# Luego analiza:

grep "Chat request from IP" logs.txt | \
  awk '{print $NF}' | \
  sort | uniq -c | sort -rn

# Output ejemplo:
# 45 1.2.3.4      ← Esta IP hace muchos requests
# 12 5.6.7.8
#  3 9.10.11.12
```

### Dashboard Simple en Vercel

```typescript
// Agregar a tu API endpoint separado: /api/stats
import { kv } from "@vercel/kv";

export async function GET() {
  const stats = await kv.hgetall("ip-stats");
  return Response.json(stats);
}

// En tu /api/chat, incrementar contador:
await kv.hincrby("ip-stats", ip, 1);
```

## 🎯 Plan de Acción Inmediato

### 1. Deploy con los cambios actuales

```bash
git add .
git commit -m "Fix: Change to Node.js runtime for Google Cloud IP issues"
git push origin main
```

### 2. Monitorear por 24 horas

```bash
- Ve a Vercel → Functions → Logs
- Busca "Chat request from IP"
- Anota las IPs que aparecen
- Busca errores 429, 403
```

### 3. Si sigue fallando → Opción 1 (IP Allowlist)

```bash
- Recopila las IPs de Vercel de los logs
- Agrégalas a Google Cloud allowlist
- Redeploy y prueba
```

### 4. Si aún falla → Opción 5 (Rate Limiting)

```bash
- Implementa rate limiting por IP
- Limita a 10 requests/minuto por usuario
- Reduce carga a Google Cloud
```

## 🔍 Diagnóstico Rápido

### ¿Cómo saber si ES problema de IP?

**Síntoma 1**: Logs muestran errores 429 o 403

```
✅ ES problema de IP/quota
```

**Síntoma 2**: Funciona por la mañana, falla por la tarde

```
✅ ES rate limiting acumulativo
```

**Síntoma 3**: Funciona con VPN, falla sin VPN

```
✅ ES bloqueo de IP específica
```

**Síntoma 4**: Misma IP aparece muchas veces en logs

```
✅ ES IP compartida de Vercel
```

**Síntoma 5**: Funciona en localhost, falla en production

```
✅ ES problema con IPs de Vercel/cloud
```

## 📱 Test de Verificación

```bash
# Test 1: Desde diferentes redes
curl https://tu-sitio.com/api/chat -d '{"messages":[...]}' -H "Content-Type: application/json"

# Si funciona desde tu red pero no desde otras → Problema de IP

# Test 2: Con header de IP diferente (solo para debug)
curl https://tu-sitio.com/api/chat \
  -H "x-forwarded-for: 8.8.8.8" \
  -d '{"messages":[...]}' \
  -H "Content-Type: application/json"
```

## 💡 Mejores Prácticas

1. ✅ **Usar Node.js runtime** (ya implementado)
2. ✅ **Log de IPs** (ya implementado)
3. ✅ **Caché de respuestas comunes** (reduce llamadas)
4. ✅ **Rate limiting en tu lado** (controlas el flujo)
5. ✅ **Mensajes de error claros** (usuario sabe qué pasa)

## 🆘 Si Nada Funciona

### Última Opción: Cambiar de Provider de IA

Si Google Cloud sigue bloqueando:

```typescript
// Cambiar a otro provider (OpenAI, Anthropic, etc)
import { openai } from "@ai-sdk/openai";

const result = streamText({
  model: openai("gpt-4o-mini"), // Más estable con IPs
  messages: convertToModelMessages(messages),
  system: systemPrompt,
});
```

**Pros:**

- Menos problemas de IP
- Más estable
- Mejor rate limiting

**Cons:**

- No es gratis como Gemini
- Requiere nueva API key

---

**Próximos pasos:**

1. Deploy con cambios
2. Monitorear logs 24h
3. Analizar IPs en logs
4. Aplicar solución específica según resultados

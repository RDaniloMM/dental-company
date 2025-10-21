# 🚀 Guía de Deployment y Verificación

## ✅ Cambios Implementados

### 1. **Manejo Robusto de Errores en la API**

- ✅ Detecta errores de cuota/rate limit
- ✅ Detecta problemas de autenticación
- ✅ Detecta timeouts
- ✅ Mensajes de error amigables con teléfono de contacto
- ✅ Logging detallado para debugging

### 2. **UI Mejorada con Feedback de Errores**

- ✅ Muestra mensajes de error claros al usuario
- ✅ Incluye teléfono de contacto directo
- ✅ No deja al usuario sin respuesta

## 📋 Pasos para Deployment en Vercel

### Paso 1: Verificar Variable de Entorno

```bash
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Verifica que existe:

   Name: GOOGLE_GENERATIVE_AI_API_KEY
   Value: AIzaSy... (tu API key completa)

4. Asegúrate que esté marcada para:
   ☑ Production
   ☑ Preview
   ☑ Development
```

### Paso 2: Commit y Push

```bash
git add .
git commit -m "Add robust error handling for chatbot"
git push origin main
```

### Paso 3: Verificar Deployment

```bash
1. Vercel detectará el push automáticamente
2. Espera que termine el build (2-3 min)
3. Vercel te dará una URL de preview
4. Prueba en esa URL antes de production
```

### Paso 4: Promote a Production

```bash
Si todo funciona en preview:
1. Ve a Deployments en Vercel
2. Click en el deployment exitoso
3. Click "Promote to Production"
```

## 🔍 Verificación Post-Deployment

### Test 1: Verificar que el chatbot carga

```
1. Ve a tu sitio: https://tu-sitio.vercel.app
2. Busca el botón azul flotante
3. Click para abrir
4. Debe mostrar mensaje de bienvenida
```

### Test 2: Enviar mensaje

```
1. Escribe: "¿Cuál es el horario?"
2. Debe responder con los horarios correctos
3. Si falla, revisar logs (Paso siguiente)
```

### Test 3: Revisar Logs en Vercel

```
1. Ve a Functions → /api/chat
2. Click en "View Logs"
3. Busca:
   - Errores 429 (rate limit)
   - Errores 401 (API key)
   - Errores 500 (server)
   - Console.log de errores
```

## 🔧 Troubleshooting por Error

### Error: "Servicio temporalmente no disponible"

**Causa**: API key no configurada

**Solución**:

```
1. Vercel → Settings → Environment Variables
2. Agregar GOOGLE_GENERATIVE_AI_API_KEY
3. Redeploy
```

### Error: "Muchas consultas al mismo tiempo"

**Causa**: Límite de Google Gemini alcanzado

**Solución A - Esperar**:

- Límite se resetea automáticamente
- 15 requests/minuto
- 1500 requests/día

**Solución B - Upgrade**:

```
1. Ve a https://aistudio.google.com/
2. Upgrade a plan pagado
3. Límites más altos
```

### Error: "Error de configuración del servicio"

**Causa**: API key inválida

**Solución**:

```
1. Ve a https://aistudio.google.com/app/apikey
2. Genera nueva API key
3. Actualiza en Vercel
4. Redeploy
```

### Chatbot no aparece en el sitio

**Causa**: Error de build o JavaScript

**Solución**:

```
1. Vercel → Deployments → Click en último
2. Revisa "Build Logs"
3. Busca errores
4. Corrige y push de nuevo
```

## 📊 Monitoreo Continuo

### Opción 1: Vercel Analytics (Recomendado)

```
1. Ve a tu proyecto en Vercel
2. Analytics → Enable
3. Gratis hasta 100k requests/mes
4. Te muestra:
   - Errores en tiempo real
   - Performance
   - Uso por endpoint
```

### Opción 2: Logs Manuales

```
1. Functions → /api/chat
2. Revisa periódicamente
3. Busca patrones de errores
```

### Opción 3: Google AI Studio

```
1. Ve a https://aistudio.google.com/
2. Revisa uso de tu API key
3. Monitorea cuota restante
```

## 🎯 Checklist Final

Antes de considerar el deployment exitoso:

- [ ] Variable GOOGLE_GENERATIVE_AI_API_KEY configurada
- [ ] Build exitoso en Vercel
- [ ] Botón flotante visible en el sitio
- [ ] Chat abre correctamente
- [ ] Mensaje de bienvenida aparece
- [ ] Puede enviar mensajes
- [ ] Recibe respuestas coherentes
- [ ] Errores se muestran amigablemente
- [ ] Teléfono de contacto visible en errores
- [ ] Probado en Chrome
- [ ] Probado en móvil
- [ ] Logs sin errores críticos

## 📱 Pruebas de Compatibilidad

### Navegadores Desktop

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Navegadores Mobile

- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Samsung Internet

### Con/Sin Ad Blockers

- [ ] Sin ad blocker
- [ ] Con uBlock Origin
- [ ] Con AdBlock Plus

## 🆘 Si Nada Funciona

### Plan B: Revisar Todo

```bash
1. Verifica .env.local localmente
   - Corre: npm run dev
   - Prueba localmente
   - ¿Funciona? → Problema es en Vercel

2. Verifica Vercel Environment Variables
   - ¿Está la key?
   - ¿Sin espacios extra?
   - ¿Para Production?

3. Revisa Google AI Studio
   - ¿API key válida?
   - ¿No expirada?
   - ¿Cuota disponible?

4. Redeploy completo
   - Vercel → Settings → General
   - "Redeploy" → Latest Production
```

### Contactar Soporte

Si aún no funciona, contacta con:

- Vercel Support (con logs)
- Google AI Support (con API key)
- O revisa el archivo DIAGNOSTICO_CHATBOT.md

## 💡 Optimizaciones Post-Deployment

### Reducir Uso de API

```typescript
// Implementar caché simple
const responseCache = new Map();

// Antes de llamar a Gemini:
const cacheKey = userQuery.toLowerCase().trim();
if (responseCache.has(cacheKey)) {
  return responseCache.get(cacheKey);
}

// Después de respuesta:
responseCache.set(cacheKey, response);
```

### Rate Limiting en tu lado

```typescript
// Limitar requests por IP
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: /* tu redis */,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

const { success } = await ratelimit.limit(ip);
if (!success) {
  return new Response("Too many requests", { status: 429 });
}
```

## 🎓 Recursos Útiles

- **Vercel Docs**: https://vercel.com/docs
- **Google Gemini Docs**: https://ai.google.dev/docs
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **Tu Diagnóstico**: DIAGNOSTICO_CHATBOT.md

---

**Última actualización**: Octubre 2025
**Próxima revisión**: Después del primer deployment

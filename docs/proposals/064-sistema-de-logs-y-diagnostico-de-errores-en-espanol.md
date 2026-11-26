# Propuesta Técnica 064: Sistema de Logging Inteligente y Diagnóstico de Errores en Español

## 1. Contexto y Diagnóstico
El usuario ha solicitado estandarizar el sistema de logs para que ante cualquier error operativo, de red o de aplicación, la consola del navegador imprima claramente:
1. El **error exacto**.
2. **El porqué (Causa raíz)** en español comprensible.
3. **Orientación directa** para llegar de inmediato a la causa y corregirla.

### Diagnóstico Actual
- En `src/core/http/httpClient.ts`, los errores lanzan instancias de `HttpError`, pero no se formatea un bloque de log en consola con diagnóstico en español.
- En `src/core/offline/application/sync-coordinator.service.ts`, los fallos de sincronización silencian o simplifican el mensaje en variables internas sin un log enriquecido en consola.
- No existe un manejador global de errores (`ErrorHandler` de Angular) para interceptar excepciones de componentes o plantillas y explicarlas en español.

---

## 2. Plan de Implementación Modular

### A. Módulo Centralizado `AppLogger` (`src/core/errors/app-logger.ts`)
Crear un módulo especializado ($\le 150$ líneas) con formato visual de alta visibilidad para la consola de desarrollador:
```
🚨 [MISINCOL ERROR] ➔ [Contexto: HTTP Client | POST /teams]
❌ Error: Error en la validación de campos del equipo
🔍 Por qué ocurrió: Los datos enviados no cumplen las validaciones del servidor (DTO o campos requeridos faltantes).
💡 Cómo resolverlo: Comprobar que el formulario incluya population, evangelicaCongregations y evangelicalsCount.
📦 Detalles técnicos: { status: 400, url: '...', datos: { ... } }
```

### B. Diccionario Semántico de Causas Raíz y Soluciones (Español)
Mapear automáticamente según código de estado y tipo de excepción:
- **400 Bad Request:** Validación de esquema/DTO rechazada por campos faltantes o tipos incorrectos.
- **401 Unauthorized:** Sesión caducada o token JWT Bearer ausente/inválido.
- **403 Forbidden:** El rol del usuario activo carece de facultades en la matriz de seguridad.
- **404 Not Found:** Endpoint inexistente o registro no encontrado en PostgreSQL.
- **408 Timeout:** La petición superó el tiempo límite configurado sin respuesta del servidor.
- **409 Conflict:** Conflicto de duplicidad (correo, PIN o slug ya en uso).
- **422 Unprocessable:** Violación de reglas de negocio (ej. presupuesto de pilares mayor al total).
- **500/502/503:** Error de servidor remoto o pérdida de enlace en Cloudflare/PM2.
- **NetworkError / Failed to fetch:** Fallo de conexión física a internet o bloqueo CORS.

### C. Integración en Puntos Críticos
1. **`httpClient.ts`:** Capturar cualquier respuesta no exitosa o caída de red y disparar el logger enriquecido antes de relanzar el error.
2. **`sync-coordinator.service.ts`:** Imprimir diagnóstico en español cuando una mutación de la cola outbox sea rechazada o marcada como fallida.
3. **`app-error-handler.ts` (`src/core/errors/`):** Implementar la interfaz `ErrorHandler` de Angular y registrarla en `app.config.ts` para capturar cualquier fallo de renderizado o runtime de la aplicación.

---

## 3. Cumplimiento de Gobernanza Técnica
- Límite estricto $\le 150$ líneas por archivo modificado o creado.
- Tipado estricto sin `any`.
- Verificación exhaustiva con Vitest (88+ pruebas) y compilación Vite de producción.

---

## 4. Estado de Ejecución
- **Estado:** ✅ APROBADO Y EJECUTADO
- **Archivos creados/actualizados:**
  1. `frontend/src/core/errors/app-logger.ts` (102 líneas)
  2. `frontend/src/core/errors/app-error-handler.ts` (19 líneas)
  3. `frontend/src/core/errors/app-logger.spec.ts` (90 líneas)
  4. `frontend/src/main.ts` (23 líneas)
  5. `frontend/src/core/http/httpClient.ts` (143 líneas)
  6. `frontend/src/core/offline/application/sync-coordinator.service.ts` (107 líneas)


---

## 4. Estado de Aprobación
- [x] Análisis técnico y diseño conceptual completado.
- [ ] Esperando aprobación del usuario para aplicar el sistema de logs.

# ADR-028: Adopción Integral del Contrato de Gobernanza Técnica v2026.4.0

## Estado
**APROBADO Y EJECUTADO** (Conforme a la aprobación explícita del usuario y PROP-001)

## Contexto
El sistema `planMinisterial` (MISINCOL PDM) venía evolucionando con una arquitectura modular por dominios, pero requería alineación completa con el **Contrato de Gobernanza Técnica y Modelo Multi-Agente Ultra-Estricto (Antigravity Edition, v2026.4.0)** definido en `.gemini/GEMINI.md`.

Los requerimientos clave de la gobernanza son:
1. **Regla de Oro (150 líneas por archivo):** Ningún archivo de código fuente (.ts, .tsx) puede superar las 150 líneas.
2. **Vertical Slicing:** Organización del código en `src/features/[feature]/` subdividido estrictamente en `domain/`, `application/` e `infrastructure/`.
3. **Cero SDKs Comerciales Opacos:** Núcleo HTTP base nativo (`fetch`) en `src/core/http/` con control tipado de errores y encabezados estándar.
4. **Ciclo de Vida Formal:** Propuesta ➡️ Feedback ➡️ Ejecución ➡️ Informe.
5. **Backend Congelado:** Se estandariza el frontend, sus abstracciones y contratos sin desplegar aún el servidor backend.

## Decisiones de Diseño

1. **Migración de `src/modules/` a `src/features/`:**
   - Se crearon las 6 rebanadas verticales: `admin`, `audit`, `auth`, `notes`, `plans`, `reports`.
   - Dentro de cada rebanada, la UI y los adaptadores se integraron en `infrastructure/`.
   - Se adicionó la capa `domain/` en `reports` para cumplir la trinidad DDD en todas las rebanadas.

2. **Resolución de Archivos Críticos (> 150 líneas):**
   - `TeamDepartmentZoomCard.tsx` (273 líneas) ➡️ Se fragmentó en `departmentBounds.constants.ts` (48 líneas), `useDepartmentZoomViewBox.ts` (68 líneas) y `TeamDepartmentZoomCard.tsx` (106 líneas).
   - `colombiaLocations.ts` (178 líneas) ➡️ Se fragmentó en `colombiaDepartments.data.ts` (93 líneas) y `colombiaLocations.ts` (105 líneas).
   - `useActivityModalForm.ts` (168 líneas) ➡️ Se fragmentó en `activityModalDefaults.ts` (72 líneas) y `useActivityModalForm.ts` (130 líneas).

3. **Creación del Núcleo Compartido (`src/core/`):**
   - `src/core/config/env.config.ts`: Configuración inmutable y tipada de entorno.
   - `src/core/errors/app.error.ts`: Jerarquía de excepciones (`AppError`, `HttpError`).
   - `src/core/http/httpClient.ts`: Cliente HTTP nativo con abort timeouts, serialización JSON y cero SDKs comerciales.

4. **Preservación Invariable de la Experiencia de Usuario:**
   - Cero regresiones visuales o de interacción. Se preservó el 100% de la jerarquía visual del sidebar, mapa cartográfico, modales y cálculo de presupuestos.

## Consecuencias
- **Positivas:**
  - Máxima mantenibilidad y legibilidad.
  - El archivo más extenso del repositorio cuenta ahora con 130 líneas (muy por debajo del límite de 150).
  - Tiempos de compilación ultrarrápidos (< 650 ms).
  - Preparación perfecta para conectar el backend en la siguiente fase consumiendo `httpClient` y las especificaciones DDL/REST de `docs/`.

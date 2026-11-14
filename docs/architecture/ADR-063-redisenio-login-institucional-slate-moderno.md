# ADR-063: Rediseño Visual Ejecutivo del Portal de Autenticación con Paleta Slate

## Estado
Propuesto / Pendiente de aprobación del usuario (2026-11-13)

## Contexto
El login de MISINCOL PDM presentaba elementos de prototipado rápido: foto genérica de stock, botones visibles de autocompletado de prueba y una paleta cálida con orbes de colores intensos que restaba formalidad institucional.

## Decisión
1. Adoptar la paleta neutra Slate de Tailwind (`slate-50`, `slate-100`, `slate-200`, `slate-500`, `slate-900`) para el módulo de login.
2. Reemplazar la imagen de stock por una composición vectorial corporativa oscura en `login-hero-card.component.ts`.
3. Desvincular `<app-login-quick-access-chips>` del flujo visual en `login-view.component.ts`.
4. Estandarizar inputs a `h-12` con foco en `slate-900` y estados accesibles.

## Consecuencias
* Presentación corporativa de alta fidelidad.
* Cumplimiento estricto de gobernanza y límite de 150 líneas por archivo.
* Pruebas de autenticación intactas en `verifyAuthCredentials.spec.ts`.


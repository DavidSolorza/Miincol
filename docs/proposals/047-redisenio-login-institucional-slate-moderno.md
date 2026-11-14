# Propuesta 047: Rediseño Ejecutivo e Institucional del Portal de Login (Slate Palette & Modern SaaS)

## 1. Contexto y Justificación
El portal de autenticación actual de **MISINCOL PDM** utiliza una estética cálida y artesanal (fondo beige, foto de stock con manos y una planta, y botones visibles de acceso rápido para pruebas).
Para la versión de producción pública de la plataforma, se requiere una identidad visual sobria, moderna y ejecutiva que refleje la autoridad, seguridad y control institucional del Plan de Desarrollo Ministerial.

## 2. Alcance de los Cambios
1. **Paleta Slate Ejecutiva:**
   - Fondo general: `#F8FAFC` (`bg-slate-50`).
   - Tarjeta contenedora: `#FFFFFF` (`bg-white`) con bordes `border-slate-200/90` y sombra sutil `shadow-xl shadow-slate-900/5`.
   - Acentos y botón principal: `#0F172A` (`slate-900` / `black`).
   - Tipografía principal: `slate-900` y secundaria `slate-500`.
2. **Panel Hero Izquierdo Corporativo:**
   - Sustitución de la foto de stock por un panel oscuro corporativo (`slate-950` a `slate-800`) con retícula geométrica abstracta, logotipo oficial de MISINCOL en blanco y eslogan tipográfico.
3. **Eliminación de Botones de Prueba en Producción:**
   - Se retira el botón de autocompletado de prueba para mantener la seriedad e integridad del proceso de login.
4. **Ergonomía de Formularios:**
   - Entradas de texto `h-12` con bordes nítidos y anillo de enfoque `ring-2 ring-slate-900/10`.

## 3. Beneficios
- Apariencia ejecutiva tipo SaaS moderno (Linear / Vercel).
- Mayor legibilidad y confort visual.
- Eliminación de ruido visual y mayor seguridad percibida.


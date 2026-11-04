# 🏛️ Guía Técnica y Especificación de Requerimientos (MISINCOL PDM)
**Proyecto:** MISINCOL | Plan de Desarrollo Ministerial (PDM)  
**Framework:** Angular 21+ (Standalone Components, Signals, OnPush) + Vite + Tailwind CSS v4  
**Contrato de Gobernanza:** v2026.4.0 (`< 150` líneas por archivo, Vertical Slicing, Cero SDKs Comerciales)  
**Versión de la Guía:** 2026.4.1 (Alineada con Requerimientos Oficiales de Negocio)

---

## 1. Filosofía de Arquitectura en Angular
1. **100% Standalone Components:** Sin `NgModule`. Cada componente declara sus dependencias en `imports: [...]`.
2. **Reactividad Basada en Signals:** Uso exclusivo de `signal`, `computed` e `input()` / `output()` de Angular.
3. **`ChangeDetectionStrategy.OnPush` Universal:** Rendimiento máximo y predictibilidad sin ciclos de detección ociosos.
4. **Control Flow Nativo:** Uso estricto de `@if`, `@for`, `@switch` y `@let`.
5. **Vertical Slicing:** Organización modular por feature (`domain/`, `application/`, `infrastructure/`).

---

## 2. Especificación Oficial de Módulos y Cambios Requeridos

### 2.1. Diseño Responsive y Adaptabilidad Móvil/Tablet
- **Objetivo:** Garantizar que todas las vistas (Paneles de Pilares, Objetivos, Actividades y la nueva vista de Información General) se adapten con fluidez a pantallas de tablets y móviles sin desbordamiento horizontal.
- **Directrices de Implementación:**
  - Uso de contenedores fluidos con Tailwind CSS (`w-full max-w-full overflow-x-hidden`).
  - Barras laterales y superiores con comportamiento colapsable mediante menú hamburguesa móvil desplegable (`lg:hidden`).
  - Las grillas principales deben responder a breakpoints estándar: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4`.

### 2.2. Nueva Vista: "Información General" (Reemplazo del Plan PDM)
- **Objetivo:** Centralizar los datos macro de campo y conformación de equipos, reemplazando el botón anterior de "Plan PDM" en la navegación por el botón de **"Información General"**.
- **Estructura de Datos (Basada en Hoja de Cálculo Oficial):**
  1. **Datos del Equipo:**
     - Nombre del equipo
     - Año de gestión
     - Población / Territorio
     - Líder de equipo
     - Número de congregaciones evangélicas
     - Número de evangélicos
     - Integrantes del equipo con sus respectivos datos de contacto
  2. **Información de Campo y Contacto:**
     - Personas contactadas por primera vez
     - Personas interesadas en el evangelio y personas que escucharon el evangelio
     - Personas que están buscando a Dios
     - Oportunidades de responder a Cristo, creyentes que creyeron y bautizados
     - Personas participando en estudios bíblicos regulares y mentorías personales
     - Nuevos grupos reuniéndose en el año
     - Entrenamiento ministerial, bíblico, pastoral práctico y en otras áreas
     - Desarrollo eclesial (nuevos grupos con perspectiva de iglesia, número final de iglesias y generaciones de iglesias)
  3. **Presupuesto Total y Desglose por Pilares:**
     - Presupuesto consolidado y discriminado por los 5 pilares: Investigación, Encarnación, Evangelización, Entrenamiento y Autocuidado.

### 2.3. Ajustes en "Crear / Editar Objetivo" (Área Esencial, Niveles y Autoenumeración)
- **Objetivo:** Vincular los objetivos a su respectiva Área Esencial y Nivel correspondiente, optimizando el espacio visual.
- **Acciones y Directrices:**
  - **Selector de Área Esencial y Niveles:** Incorporar casillas/selectores para asignar el Área Esencial y su nivel respectivo a cada objetivo.
  - **Remoción del Mapa en Pilares:** El mapa vectorial se mantiene en la supervisión de Coordinación Nacional (`SuperAdminViewComponent`), pero se retira de la vista de objetivos/pilares para maximizar el área de trabajo y tarjetas.
  - **Autoenumeración Dinámica de Objetivos:** Queda prohibida la numeración fija quemada en código (`OBJETIVO #1`, `OBJETIVO #2`, etc.). Los objetivos deben enumerarse dinámicamente según su índice posicional en la lista (`$index + 1`). Si un objetivo intermedio se elimina, los subsecuentes actualizan su correlativo automáticamente sin inconsistencias.

### 2.4. Ajustes en "Crear / Editar Actividad" y Formulario
- **Objetivo:** Alinear el registro de actividades con los requerimientos operativos de campo y limpiar la interfaz.
- **Acciones y Directrices:**
  - **Área Esencial en Actividades:** Aplicar la clasificación de Área Esencial y Nivel dentro del formulario y tarjetas de actividades.
  - **Eliminación de Dificultades y Obstáculos:** Suprimir por completo la sección/campo de dificultades y obstáculos del formulario de actividad.
  - **Metas Proyectadas:** Incluir en la sección de objetivos la formulación de metas proyectadas (a mediano y largo plazo).

### 2.5. Ajustes de Roles y Textos en la Interfaz
- **Coordinador de Equipos:** En toda la interfaz superior, banners y perfiles, el rol y título administrativo es **"Coordinador de Equipos"** (sustituyendo "Director Nacional").

---

## 3. Mapa de Estructura de Directorios y Vertical Slicing

```text
src/
├── app/                                       # Shell y layout principal
│   ├── app.component.ts                       # Punto de entrada <app-root>
│   ├── auth/                                  # Gestión de sesión activa (AppSessionService)
│   └── ui/                                    # Cabecera, workspace y banners
├── core/                                      # Núcleo técnico (ServiceBus, HTTP, Offline)
├── shared/                                    # Componentes compartidos (Modales, Iconos, Toasts, Badges)
└── features/                                  # Rebanadas verticales de negocio (< 150 líneas)
    ├── admin/                                 # Tablero de supervisión y mapa nacional
    ├── auth/                                  # Inicio de sesión y selección de equipos
    ├── general-info/                          # 🆕 NUEVA FEATURE: Vista "Información General"
    │   ├── domain/                            # general-info.types.ts
    │   ├── application/                       # general-info.service.ts
    │   └── infrastructure/                    # general-info-view.component.ts y subcomponentes
    ├── plans/                                 # 5 Pilares PDM, Objetivos y Actividades
    │   ├── domain/                            # plan.types.ts (Áreas esenciales, metas mediano/largo plazo)
    │   ├── application/                       # plan.service.ts, planCalculations.ts, autoenumeración
    │   └── infrastructure/                    # phase-view, objective-card, activity-modal, sidebar
    ├── notes/                                 # Agenda territorial
    ├── audit/                                 # Telemetría y auditoría de cambios
    └── reports/                               # Informes consolidados y exportación PDF
```

---

## 4. Estándares Inviolables de Código
1. **Límite Estricto de 150 Líneas:** Ningún archivo `.ts` puede superar las 150 líneas bajo ninguna circunstancia.
2. **Tipado Estricto:** Prohibido el uso de `any` sin documentar.
3. **Persistencia y Modo Offline:** Toda mutación debe sincronizarse con `localStorage` y emitir telemetría al `ServiceBus`.

# Propuesta Técnica 059: Plan Maestro y Desglose de Tareas - Reuniones Noviembre 2026

## 1. Contexto y Objetivos del Levantamiento
A partir del análisis exhaustivo de:
- Transcripción Reunión 1 (14 de noviembre de 2026 - Configuración de equipos y permisos)
- Minuta y Action Items Reunión 2 (21 de noviembre de 2026 - Respaldo y ajustes de plataforma)
- Documento de Mitigación Legal y Datos (21 de noviembre de 2026 - 21:03 GMT-05:00)
- Manuscritos y Diagramas de Campo (2 páginas de apuntes directos)

Se consolida la matriz completa de requerimientos clasificados por capas (**Frontend vs. Backend**), comparados con el estado real de la base de código actual para determinar qué ya se encuentra resuelto, qué está parcialmente abordado y qué tareas quedan pendientes para ejecución.

---

## 2. Matriz de Auditoría y Estado del Proyecto

| # | Requerimiento / Necesidad | Capa | Estado en Código Actual | Archivos Afectados |
|---|---------------------------|------|-------------------------|--------------------|
| 1 | **Mitigación Legal: Reemplazar "Supervisión" por "Acompañamiento Ministerial"** (evitar riesgos de subordinación laboral) | Frontend | ⚠️ **Parcial**: Quedan etiquetas de "Supervisión" en sidebar, modales, toasts y reportes | `sidebar-reminders-card.component.ts`, `app-session.service.ts`, `report-modal.component.ts` |
| 2 | **Eliminar texto "Modelo Excel"** de la interfaz | Frontend | ❌ **Pendiente**: Sigue apareciendo en encabezado de tabla multianual | `general-annual-table.component.ts`, `*.spec.ts` |
| 3 | **Actualizar nombres de Categorías / Pilares PDM**: <br>• 1. Investigación y Diagnóstico de Campo<br>• 2. Encarnación y Convivencia en Comunidad<br>• 5. Autocuidado Integral del Obrero | Frontend / Backend | ❌ **Pendiente**: Figuran únicamente con nombres cortos en menús, tarjetas y desglose | `sidebar-phases-list.component.ts`, `general-budget-card.component.ts`, `plan.types.ts` |
| 4 | **Formulario de Objetivos**: Quitar "Título" -> dejar sólo "Objetivo Estratégico" | Frontend | ❌ **Pendiente**: Campo etiquetado como "Título del Objetivo Estratégico" | `objective-form-fields.component.ts` |
| 5 | **Modal de Actividad**: Quitar la palabra "/ Sub-Objetivo" | Frontend | ❌ **Pendiente**: Permanece en el título del modal y en el label de descripción | `activity-modal.component.ts`, `activity-basic-fields.component.ts` |
| 6 | **Estado de Actividades: Incorporar estado "Iniciado"** (junto a Pendiente, En Proceso, Completado) | Backend + Frontend | ❌ **Pendiente**: Tanto en enum de base de datos/DTOs como en tipos de Angular y selectores | `create-activity.dto.ts`, `activity.entity.ts`, `plan.types.ts`, `activity-header-tags.component.ts` |
| 7 | **Responsable de Actividad**: Selector directo desde la lista de integrantes del equipo | Frontend | ⚠️ **Parcial**: Hay un input de texto libre duplicado junto a un subcomponente | `activity-basic-fields.component.ts`, `activity-schedule-fields.component.ts` |
| 8 | **Presupuesto en Actividades & Desglose**: <br>• Mostrar Presupuesto Inicial, Monto Usado y Saldo Disponible<br>• Restar gastos del disponible<br>• Iniciar en ceros al crear | Frontend / Backend | ⚠️ **Parcial**: Desglose presente en algunas tarjetas pero faltan etiquetas explícitas y cuadre en modal | `activity-budget-quick-edit.component.ts`, `general-budget-top.component.ts` |
| 9 | **Visibilidad de Etapa en Actividad**: Mostrar la etapa del objetivo directamente en la tarjeta de la actividad | Frontend | ❌ **Pendiente**: La etapa de enfoque no es evidente a simple vista en el item | `activity-item.component.ts`, `activity-header-tags.component.ts` |
| 10 | **Subordinación Visual de Actividades**: Indentación / sangría y asignación de color según el objetivo | Frontend | ❌ **Pendiente**: Renderizado en bloque uniforme sin subordinación clara | `phase-objective-card-item.component.ts`, `activity-item.component.ts` |
| 11 | **Notas y Agendas: Eliminar link doble redundante** (conservar avisos y botón de información) | Frontend | ❌ **Pendiente**: Dos disparadores idénticos de `openNotesModal` en el sidebar | `sidebar-footer-actions.component.ts`, `sidebar-reminders-card.component.ts` |
| 12 | **Información General: "Esenciales a desarrollar" -> "Etapas a desarrollar"**: <br>• Quitar "(Hasta 5)"<br>• Catálogo con las 8 etapas oficiales (Contacto, Comunicar, etc.) | Frontend | ❌ **Pendiente**: Catálogo obsoleto de 7 áreas y título con "(Hasta 5)" | `general-essentials.component.ts`, `general-info.types.ts` |
| 13 | **Entrenamiento Ministerial: Campo de texto libre en "Otras Áreas"** | Frontend / Backend | ❌ **Pendiente**: Solo existe un input numérico sin campo descriptivo | `general-ministerial-training.component.ts`, `general-info.types.ts` |
| 14 | **Sección / Visor de Documentos de Referencia en PDF** | Frontend | ❌ **Pendiente**: No existe visor o modal para consultar el manual PDF de apoyo | `frontend/src/features/documents/` (nuevo módulo vertical) |
| 15 | **Filtro de Etnia / Pueblo Dinámico**: Reemplazar select rígido por texto libre o lista dinámica | Frontend | ❌ **Pendiente**: Selector cartográfico limitado a 6 etnias que ignora nuevas misiones | `colombia-map-filters.component.ts` |
| 16 | **Barra de Desplazamiento (Scrollbar) de Alto Contraste** para adultos mayores | Frontend | ❌ **Pendiente**: Mide 4-5px y tiene gradiente con 80% de transparencia | `frontend/src/styles/fluidity.css` |
| 17 | **Sincronización y Persistencia sin sobreescritura de vacíos** | Backend / Frontend | ✅ **Avanzado**: Propuestas 057 y 058 resolvieron whitelist DTO y persistencia de usuarios | `admin-teams-sync.helper.ts`, `security-users-sync.helper.ts` |
| 18 | **Botón de Respaldo Manual (Backup bajo demanda)** | Backend + Frontend | ❌ **Pendiente**: Solo existe cron semanal de correo, sin trigger manual en UI | `backend/src/notifications/`, `super-admin-view.component.ts` |
| 19 | **Rol Dual Hugo Solorza (Coordinador y Líder Pastos con 1 correo)** | Frontend | ✅ **Completado**: Propuesta 056 y commit `c62f9ab` | `app-session.service.ts`, `app-top-header.component.ts` |

---

## 3. Plan de Acción y Paquetes de Trabajo

### Paquete A: Interfaz, Terminología y Mitigación Legal (Frontend)
1. Sustituir todas las referencias de "Supervisión" por "Acompañamiento Ministerial".
2. Eliminar "(Modelo Excel)" del título de seguimiento de campo.
3. Actualizar etiquetas de categorías a sus nombres completos.
4. Ajustar etiquetas en formularios: "Objetivo Estratégico" (quitar "Título") y "Descripción de la Actividad" (quitar "Sub-Objetivo").
5. Eliminar el botón duplicado de notas en el pie de la barra lateral.
6. Aumentar el grosor (8px) y contraste oscuro de las barras de scroll.

### Paquete B: Dinámica de Actividades y Presupuestos (Fullstack)
1. **Backend**: Agregar `'Iniciado'` al DTO `CreateActivityDto`, validador y entidad.
2. **Frontend**: Agregar `'Iniciado'` a `ActivityState`, actualizar tags y selector.
3. Unificar el selector de responsable de la actividad con los integrantes de la misión.
4. Mostrar la etapa del objetivo visiblemente en la cabecera de la actividad.
5. Indentar visualmente las actividades con el color distintivo de su objetivo.
6. Mostrar etiquetas explícitas: `Presupuesto Inicial`, `Monto Usado`, `Saldo Disponible`.

### Paquete C: Información General y Flexibilidad Territorial (Fullstack)
1. Renombrar "Esenciales" a "Etapas a Desarrollar" con las 8 etapas oficiales y sin límite de 5.
2. Añadir campo de texto libre para "Otras Áreas" en Entrenamiento Ministerial.
3. Convertir el filtro de etnia en el mapa cartográfico en dinámico/texto libre.

### Paquete D: Visor Documental y Respaldo Manual
1. Crear componente modal para visualización de documentos de referencia en PDF.
2. Habilitar endpoint y botón en la interfaz para descargar / disparar backup manual en cualquier momento.

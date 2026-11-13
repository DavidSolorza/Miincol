# Propuesta Técnica 041: Sistema de Notificaciones Modular por Capas (Eventos Críticos, Roles, Notas y Agenda)

## 1. Contexto y Requerimiento
El usuario ha solicitado:
> *"perfecto, ahora vamos a implementar el sistema de notificaciones quiero que sea mucho mejor más óptimo y sencillo de ensamblar usamos arquitectura por capas y en cosas importantes, cambios de rol uso de algo importante, y notas y agenda, que quede bien implementado en el back y luego replica en el front para que no haya problemas porfa"*

### Objetivos Principales:
1. **Arquitectura por Capas Limpia (Clean Architecture / POO):**
   - **Capa de Dominio:** Entidades, contratos tipados de notificaciones (`InAppNotification`, `NotificationCategory`, `NotificationSeverity`).
   - **Capa de Aplicación:** Casos de uso de emisión, consulta, filtrado por destinatario/rol y marcado de lectura (`read`/`unread`).
   - **Capa de Infraestructura:** Persistencia en `backend/data/notifications.json`, controladores REST y despacho dual (In-App + Email Google SMTP si es de alta prioridad).
2. **Eventos Clave a Cubrir:**
   - **Seguridad y Cambios de Rol:** Notificar inmediatamente al colaborador cuando su rol o permisos sean modificados por la Coordinación Nacional (ej. asignación a `Coordinador de equipos` o `Líder pastoral`).
   - **Notas y Agenda Territorial:** Notificar la fijación de notas prioritarias de misión, motivos urgentes de oración o fechas clave de agenda pastoral.
   - **Hitos Importantes y PDM:** Despliegue de nuevas misiones, advertencias presupuestales e hitos vencidos.
3. **Flujo de Integración Backend ➡️ Frontend:**
   - Implementar y probar primero el backend con endpoints REST claros y pruebas unitarias/integración.
   - Replicar en el frontend con un centro de notificaciones ergonómico (campana interactiva con contador en vivo, panel desplegable de eventos clasificados y acción "Marcar como leídas").

---

## 2. Especificación Técnica por Capas

### A. Backend (`backend/src/notifications/`)

```
backend/src/notifications/
├── domain/
│   ├── notification.types.ts           # Interfaces de eventos y DTOs (< 100 líneas)
│   └── notification-category.enum.ts   # Categorías: SECURITY, NOTES_AGENDA, SYSTEM, PDM (< 40 líneas)
├── application/
│   ├── notification-dispatcher.service.ts # Orquestador de emisión y reglas de despacho (< 120 líneas)
│   └── use-cases/                      # Casos de uso atómicos (< 100 líneas c/u)
├── infrastructure/
│   ├── notifications.controller.ts     # Endpoints GET, PATCH, POST (< 100 líneas)
│   ├── notification-storage.service.ts # Persistencia en backend/data/notifications.json (< 110 líneas)
│   └── mail-transport.service.ts       # Despacho por correo electrónico Google (< 120 líneas)
```

#### Contratos de Datos:
```typescript
export interface InAppNotification {
  id: string;
  category: 'SECURITY' | 'NOTES_AGENDA' | 'PDM_CRITICAL' | 'SYSTEM';
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  targetUserEmail?: string;
  targetRole?: string;
  teamId?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}
```

#### Endpoints REST:
- `GET /api/notifications`: Lista las notificaciones filtradas por usuario/rol/misión con paginación y conteo de no leídas.
- `PATCH /api/notifications/:id/read`: Marca una notificación individual como leída.
- `POST /api/notifications/mark-all-read`: Marca todas las notificaciones del destinatario como leídas.
- `POST /api/notifications/emit`: Emite una nueva notificación programática con soporte dual (in-app y email condicional).

---

### B. Frontend (`frontend/src/features/notifications/`)

```
frontend/src/features/notifications/
├── domain/
│   └── notification.types.ts           # Tipos alineados con el backend (< 80 líneas)
├── application/
│   └── notifications.service.ts        # Store reactivo con Signals + polling suave (< 120 líneas)
└── infrastructure/
    └── components/
        ├── notification-bell.component.ts   # Campana con badge numérico (< 110 líneas)
        ├── notification-item.component.ts   # Fila de notificación categorizada (< 95 líneas)
        └── notification-popover.component.ts # Menú desplegable con scroll y filtros (< 130 líneas)
```

#### Integraciones de Negocio:
1. **Cambio de Rol:** Al invocar `SecurityUsersService.updateUserRole()`, se despacha una notificación de categoría `SECURITY`.
2. **Notas y Agenda:** Al crear una nota fijada o evento en `TeamNotesModalComponent`, se despacha notificación `NOTES_AGENDA`.
3. **Campana en Cabecera:** Integrada en `AppHeaderComponent` tanto para la vista nacional como para la vista de campo.

---

## 3. Plan de Implementación y Ejecución por Fases

- **Fase 1 (Backend):**
  1. Extender contratos de dominio en `backend/src/notifications/domain/notification.types.ts`.
  2. Implementar `notification-storage.service.ts` para persistencia en `backend/data/notifications.json`.
  3. Implementar `notification-dispatcher.service.ts` para conectar eventos de cambio de rol, notas y agenda.
  4. Actualizar `notifications.controller.ts` y `notifications.service.ts`.
  5. Escribir pruebas unitarias e integración en backend (`notifications.service.spec.ts`).

- **Fase 2 (Frontend):**
  1. Crear vertical slice `frontend/src/features/notifications/`.
  2. Implementar servicio reactivo `NotificationsService`.
  3. Crear componentes visuales atómicos (`app-notification-bell`, `app-notification-popover`).
  4. Integrar en `AppHeaderComponent`.
  5. Conectar eventos en `SecurityUsersService` y `TeamNotesModalComponent`.
  6. Escribir pruebas unitarias frontend y verificar compilación (`npm test`, `npm run build`).

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Límite de Código:** Estricto $\le 150$ líneas por archivo.
- **Estado:** PROPUESTA TÉCNICA GENERADA - En espera de aprobación / luz verde del usuario para iniciar la Fase 1 en el backend.


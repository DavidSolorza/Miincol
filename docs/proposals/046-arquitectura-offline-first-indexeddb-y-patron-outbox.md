# Propuesta 046: Arquitectura Offline-First con IndexedDB Nativo, Patrón Outbox y Sincronización Resiliente

## 1. Contexto y Justificación
Los equipos misioneros de **MISINCOL** operan frecuentemente en zonas con cobertura móvil nula o intermitente (Tierradentro, Alta Guajira, Selva del Chocó, Sierra Nevada, Amazonía).
Actualmente la aplicación depende de peticiones HTTP directas al backend remoto (`https://misincol-api.servidor.blog/api`). Si la conexión se interrumpe, el usuario no puede registrar avances ni consultar sus planes.

La propuesta formaliza una arquitectura **Offline-First** compuesta por:
1. **Identificadores UUIDv4 nativos (`crypto.randomUUID()`):** Generación de identificadores descentralizados en el cliente para evitar colisiones de llaves primarias en la base de datos PostgreSQL.
2. **Base de Datos Local IndexedDB:** Motor asíncrono y transaccional en el navegador sin límite de 5MB, estructurado en tablas de negocio (`teams`, `plans`, `activities`, `reports`, `notes`) y tabla `outbox`.
3. **Patrón Outbox (Bandeja de Salida Local):** Escritura optimista instantánea en UI + encolado FIFO de mutaciones con reintentos exponenciales y despacho automático al recuperar señal.
4. **Indicador Visual de Sincronización:** Estado reactivo en la barra superior (Conectado / Sin conexión / Sincronizando).
5. **Caché PWA:** Refuerzo de `sw.js` para carga garantizada de la interfaz aún en modo avión.

## 2. Componentes a Implementar
* `src/core/offline/domain/offline.types.ts`: Tipos estrictos de Outbox, estados de mutación y eventos de sincronización.
* `src/core/offline/infrastructure/indexed-db.service.ts`: Envoltorio tipado sobre la API estándar W3C `indexedDB` (cero dependencias externas).
* `src/core/offline/application/outbox-queue.service.ts`: Encolado, lectura FIFO y resolución de peticiones pendientes.
* `src/core/offline/application/network-status.service.ts`: Detección en tiempo real de conectividad (`navigator.onLine` + verificación de salud).
* `src/core/offline/application/sync-coordinator.service.ts`: Coordinador de despacho de cola a la API remota.
* `src/core/offline/infrastructure/sync-status-badge.component.ts`: Píldora visual en la barra superior.

## 3. Beneficios
* Cero latencia en interfaces de campo (escritura optimista).
* Resiliencia ante caídas de red o cortes de energía en zonas rurales.
* Cero dependencias comerciales pesadas (cumplimiento de gobernanza y límite de 150 líneas).

# ADR-062: Arquitectura Offline-First con IndexedDB Nativo y Patrón Outbox

## Estado
Aprobado (2026-11-13)

## Contexto
El personal de campo misionero de MISINCOL necesita registrar actividades ministeriales, objetivos y reportes en zonas de conectividad intermitente o inexistente.
El uso de `localStorage` es inviable debido a sus limitaciones: síncrono (bloquea el hilo principal), tope de 5MB y falta de índices para búsquedas estructuradas.
El uso de SQLite WASM añade una sobrecarga de más de 1.5MB al bundle y requiere cabeceras `SharedArrayBuffer` incompatibles con despliegues estándar.

## Decisión
1. **Motor Local:** Implementar un servicio TypeScript nativo sobre la API W3C `indexedDB`, sin librerías externas adicionales. La base de datos se llamará `misincol_offline_db` (versión 1).
2. **Generación de IDs:** Los clientes generarán IDs mediante `crypto.randomUUID()` con prefijos tipados (`act-UUID`, `obj-UUID`, `rep-UUID`, `note-UUID`).
3. **Patrón Outbox:**
   - La tabla `outbox` encolará mutaciones (`CREATE`, `UPDATE`, `DELETE`) con payload completo, endpoint, método HTTP y contador de intentos.
   - Las escrituras se confirman optimistamente en la base local para actualización inmediata de la interfaz (cero latencia visual).
4. **Coordinador de Sincronización:**
   - Escucha los eventos `window.addEventListener('online')` y `offline`.
   - Al detectar red, despacha las mutaciones en orden FIFO estricto.
   - En éxito (200/201), purga la mutación de `outbox` y marca la entidad como sincronizada.
   - En fallo de red, pausa la ejecución y programa reintentos con retroceso exponencial.
5. **Estrategia de Conflictos:** Última escritura gana (*Last-Write-Wins*) gobernada por el campo `clientUpdatedAt`.

## Consecuencias
* Rendimiento instantáneo para el usuario final.
* Garantía de entrega eventual de datos sin colisión de claves primarias.
* Código 100% tipado en TypeScript respetando el límite estricto de 150 líneas por archivo.


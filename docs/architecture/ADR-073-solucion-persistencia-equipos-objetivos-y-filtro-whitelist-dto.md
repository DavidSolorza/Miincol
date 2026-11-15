# ADR-073: Sanitización Estricta de Payloads según Whitelist DTO de NestJS

## Estado
Propuesto (Pendiente de Aprobación del Usuario)

## Contexto
El servidor backend de producción ejecuta `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`. Cualquier petición HTTP que contenga campos extra no definidos explícitamente en el DTO correspondiente es rechazada con `HTTP 400 Bad Request`.
Las peticiones del frontend a `POST /teams`, `PUT /teams/:id`, `POST /objectives` y `POST /activities` contenían identificadores internos de UI (`id`, `slug`, `lastUpdate`, `objectiveNumber`, etc.) que provocaban el rechazo inmediato de la persistencia en PostgreSQL, mientras que la ruta de correos (`POST /notifications/team-created`) sí procedía por no tener dicha restricción.

## Decisión
1. **Sanitización Previa al Envío:** Todos los helpers de sincronización (`admin-teams-sync.helper.ts` y `plan-outbox.helper.ts`) filtrarán sus objetos mediante listas blancas estrictas alineadas con los DTOs del backend.
2. **Encadenamiento Secuencial:** El envío de notificaciones de creación de equipo (`POST /notifications/team-created`) dependerá de la confirmación exitosa o controlada de la creación en la base de datos (`POST /teams`).
3. **Mapeo de Pilares:** Enviar `pillarId` en las mutaciones de objetivos según la fase correspondiente.

## Consecuencias
- **Positivas:** Persistencia garantizada en PostgreSQL (HTTP 201 comprobado); erradicación de errores 400 por campos no autorizados; consistencia total entre base de datos y notificaciones enviadas.
- **Límite de Líneas:** Todos los archivos modificados permanecerán bajo el umbral estricto de 150 líneas.


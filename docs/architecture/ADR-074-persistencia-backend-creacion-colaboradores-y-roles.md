# ADR-074: Persistencia Directa de Colaboradores y Roles en Backend REST

## Estado
Propuesto (Pendiente de Aprobación del Usuario)

## Contexto
En el módulo de Seguridad y Roles, la creación de colaboradores se realizaba de manera exclusivamente local en `localStorage` mediante `SecurityUsersService.createUser()`. El frontend no emitía la petición `POST /users` al backend, lo que ocasionaba que al recargar la vista, `GET /users` sobrescribiera la memoria local y el nuevo usuario pareciera haberse borrado.
Asimismo, el cambio de rol en la matriz no utilizaba el endpoint específico `PATCH /users/:id/role`.

## Decisión
1. **Delegación de Sincronización:**
   - Crear `security-users-sync.helper.ts` para encapsular las peticiones HTTP y mapeos de roles hacia la API NestJS.
2. **Persistencia Activa en `SecurityUsersService`:**
   - Al invocar `createUser`, emitir de inmediato `POST /users` con contraseña por defecto (`${teamSlug}2026` o `misincol2026`) y mapeo a los roles nativos del enum `UserRole`.
   - Al invocar `updateUserRole`, emitir `PATCH /users/:id/role`.
3. **Fusión Inteligente en `syncFromBackend`:**
   - Combinar usuarios locales y remotos por clave única `email` para evitar pérdida de datos ante desconexiones.

## Consecuencias
- **Positivas:** Los colaboradores creados quedan registrados permanentemente en PostgreSQL; el cambio de roles se refleja en tiempo real en la base de datos central.
- **Límite de Líneas:** `security-users.service.ts` se reduce a ~125 líneas y `security-users-sync.helper.ts` a ~65 líneas, cumpliendo holgadamente el límite de 150 líneas.

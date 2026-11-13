# Propuesta Técnica 036: Actualización Global de Terminología de Rol: "Director Nacional" a "Coordinador de Equipos"

## 1. Contexto y Requerimiento
El usuario ha solicitado formalmente:
> *"cambialo por coordinar de equipos porfa"*

Previamente se había reemplazado la nomenclatura de *Director Nacional* por *Director de Equipo*. Con esta nueva directriz, el rol de máxima jerarquía y gobernanza (`national_director` / `ROLE_NACIONAL`) asume de manera definitiva la denominación **Coordinador de Equipos** (y en interfaz: `Coordinador de equipos` con distintivo `[ COORDINADOR ]`).

### Diagnóstico de Necesidades:
1. **Unificación de Nomenclatura Institucional:**
   - Rol en matriz de seguridad: `Coordinador de equipos`.
   - Distintivo visual (badge): `Coordinador`.
   - Formulario de creación de personas: `Coordinador de equipos`.
   - Selector y chips de acceso rápido en login: `👑 Coordinador de Equipos`.
2. **Impacto Transversal y Persistencia:**
   - Mapeo en `audit-logins-table.component.ts` para reconocer el nuevo título preservando compatibilidad histórica con registros previos.
   - Sincronización en backend (`SecurityService` y especificaciones).
   - Documentación técnica y credenciales de prueba (`README.md`, `docs/4_test_credentials.md`).

---

## 2. Alcance de Modificaciones Técnicas

### A. Frontend
1. **`src/features/security/domain/security.types.ts`:**
   - En `SYSTEM_ROLES`:
     - `name: 'Coordinador de equipos'`.
     - `badge: 'Coordinador'`.
2. **`src/features/security/domain/security-users.types.ts`:**
   - En `USER_ROLE_OPTIONS`:
     - `label: 'Coordinador de equipos'` para `id: 'national_director'`.
3. **`src/features/security/application/security-users.service.ts`:**
   - En `updateUserRole`: Notificación toast dinámica con `'Coordinador de equipos'`.
4. **`src/features/security/application/security-matrix.service.ts`:**
   - Mensaje toast de advertencia: *"No es posible deshabilitar permisos raíz para el Coordinador de Equipos."*
5. **`src/features/security/infrastructure/components/create-user-modal.component.ts`:**
   - `<option value="national_director">Coordinador de equipos</option>`.
6. **`src/features/auth/infrastructure/login/login-form-fields.component.ts`:**
   - `<option value="director@misincol.org">👑 Coordinador de Equipos (Supervisión General)</option>`.
7. **`src/features/auth/infrastructure/login/login-quick-access-chips.component.ts`:**
   - `label: '👑 Coordinador de Equipos'`.
8. **`src/features/audit/infrastructure/auditHistory/audit-logins-table.component.ts`:**
   - Soporte para `'Coordinador de equipos'`.
9. **`src/features/auth/application/verifyAuthCredentials.spec.ts`:**
   - Caso de prueba para *Coordinador de Equipos*.

### B. Backend
1. **`src/security/security.service.ts`:**
   - En `getRoles()`: `displayName: 'Coordinador de equipos'`.
2. **`src/security/security.service.spec.ts`:**
   - `it('debe habilitar control total para el Coordinador de Equipos', ...)`

### C. Documentación y Guías
1. **`frontend/README.md`** y **`backend/README.md`**.
2. **`docs/4_test_credentials.md`**.

---

## 3. Calidad y Cumplimiento Normativo
- **Límite Estricto:** Todos los archivos permanecen estrictamente por debajo de $\le 150$ líneas.
- **Pruebas:** 100% de suites de tests en verde en frontend y backend.
- **Estabilidad:** Los identificadores internos (`national_director`, `ROLE_NACIONAL`) se preservan intactos para compatibilidad total con tokens y almacenamiento existente.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** EJECUTADO CON ÉXITO Y VERIFICADO.

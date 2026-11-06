# 📋 Propuesta Técnica 015: Restricción de Privilegios para Usuarios de Equipo en Estructura de Árbol PDM

**Fecha:** 2026-11-06  
**Autor:** Agente 1 (Orquestador Técnico) & Agente 2 (Staff Software Architect)  
**Estado:** APROBADA (Luz verde explícita en requerimiento de usuario)

---

## 1. Justificación y Necesidad Operativa
El usuario solicita implementar un perfil de seguridad estricto para los colaboradores con rol **Usuario de Equipo** (`ROLE_USUARIO` / `member`):
- Pueden ingresar a la vista normal de su misión y ver toda la información de su territorio.
- **Acceso de solo lectura general:** No pueden crear, editar ni eliminar objetivos, ni pueden agregar o eliminar actividades ni alterar presupuestos, fechas o descripciones generales del PDM.
- **Única excepción editable permitida:** Pueden **exclusivamente actualizar el estado (`Pendiente` ➡️ `En Proceso` ➡️ `Completado`) de las actividades que tienen asignadas a su nombre**. Las actividades asignadas a otros integrantes permanecen en solo lectura.

---

## 2. Jerarquía de Árbol y Matriz de Control

```text
Territorio / Equipo (MissionaryTeam)
  └── Pilares Ministeriales (PhasePlan: 5 Fases)
        └── Objetivos Estratégicos (Objective: 1..4)  --> [Bloqueado para ROLE_USUARIO]
              └── Actividades / Tareas (Activity)
                    ├── Campos Generales (Presupuesto, metas, fechas) --> [Bloqueado]
                    └── Estado de Actividad (status)
                          ├── Asignada al usuario actual  --> [EDITABLE: Pendiente/En Proceso/Completado]
                          └── Asignada a otra persona     --> [SOLO LECTURA]
```

---

## 3. Implementación en Backend (`backend/src/`)

1. **`ActivitiesService` & `ActivitiesController`:**
   - Adición del endpoint `PATCH /activities/:id/status`.
   - Si el usuario tiene `ROLE_USUARIO`, se valida que `activity.responsible` coincida con el nombre o identidad del usuario antes de permitir la actualización. Si no coincide, se arroja `ForbiddenException`.
   - Los métodos `create()`, `update()` (campos completos) y `delete()` bloquean operaciones si el rol es `ROLE_USUARIO`.
2. **`ObjectivesController`:**
   - Métodos protegidos para rechazar mutaciones de `ROLE_USUARIO`.

---

## 4. Implementación en Frontend (`frontend/src/`)

1. **Sesión (`AppSessionService`):**
   - Soporte para rol `'member'` (`AuthSession.role: 'admin' | 'team' | 'member'`).
   - Credenciales de acceso rápido en Login para probar como Usuario de Equipo (`aida` / `aida2026` para Aída Secue en Misión Nasa).
2. **Controles Visuales en `PhaseViewComponent` y `ObjectiveCardComponent`:**
   - `@if (!isMember())`: Se ocultan los botones `+ Nuevo Objetivo` y `+ Agregar Actividad`, así como los menús de edición y eliminación de objetivos.
3. **Control de Estado en `ActivityItemComponent`:**
   - Si el usuario es `member`, el selector de estado solo es interactivo si `isAssignedToCurrentUser` es verdadero.
   - Si la actividad pertenece a otro colaborador, el estado se muestra como un badge de solo lectura con un icono de candado o indicador no editable.

---

## 5. Compromisos de Gobernanza
- Límite estricto de máximo 150 líneas por archivo `.ts`.
- Cero SDKs comerciales.
- Ejecución 100% local en la rama `featurePrueba`.

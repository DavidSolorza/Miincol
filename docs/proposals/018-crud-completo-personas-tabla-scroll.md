# 🏛️ Propuesta Técnica 018: CRUD Completo de Personas (Crear, Editar, Eliminar) y Tabla con Desplazamiento Vertical (Scroll)

**Fecha:** 2026-11-06  
**Autor:** Agente 1 (VP of Engineering) & Agente 2 (Staff Software Architect)  
**Estado:** PENDIENTE DE REVISIÓN Y FEEDBACK (Fase de Pausa)  

---

## 1. Contexto y Requerimiento del Negocio

El Director Nacional requiere que la gestión de personas en el módulo de Roles funcione como un **CRUD completo e interactivo** con óptima ergonomía visual:
1. **Contenedor de Tabla con Scroll Vertical Suave:**
   - La tabla de asignación de roles de personas debe contar con un contenedor con desplazamiento vertical (`overflow-y-auto max-h-[480px]`) y cabecera pegajosa (`sticky top-0`) con backdrop blur, evitando que la página se alargue indefinidamente cuando hay muchos colaboradores.
2. **Capacidad CRUD Completa:**
   - **Crear (C):** Registro de nuevas personas con Nombre Completo, Correo Electrónico, Rol y Misión asignada (ya existente vía modal).
   - **Editar (U):** Botón de edición rápida (icono de lápiz) en cada fila que abre el modal con los datos precargados para modificar nombre, correo institucional, rol y misión territorial.
   - **Eliminar (D):** Botón de eliminación (icono de papelera) en cada fila con diálogo modal de confirmación antes de borrar definitivamente a la persona del sistema y desvincularla de los integrantes de su equipo.

---

## 2. Arquitectura de la Solución

```mermaid
flowchart TD
    subgraph UI ["Interfaz de Roles de Personas (Angular Standalone)"]
        UsersTable["SecurityUsersTableComponent (< 145 líneas)\n[Scroll Vertical + thead Sticky]"]
        UserModal["UserFormModalComponent (< 145 líneas)\n[Modo Crear / Modo Editar]"]
        ConfirmDialog["ToastService.confirmAction\n[Confirmación Destructiva]"]
    end

    subgraph Service ["Capa de Lógica de Negocio"]
        SecUserSvc["SecurityUsersService\n- createUser()\n- updateUser()\n- deleteUser()"]
        AdminDashSvc["AdminDashboardService\n[Sincronización de Miembros]"]
    end

    UsersTable -->|Click '+ Nueva Persona'| UserModal
    UsersTable -->|Click 'Editar (Lápiz)'| UserModal
    UsersTable -->|Click 'Eliminar (Papelera)'| ConfirmDialog
    
    UserModal -->|Guardar| SecUserSvc
    ConfirmDialog -->|Confirmar Borrado| SecUserSvc
    SecUserSvc -->|Actualizar Integrantes de Misión| AdminDashSvc
```

---

## 3. Especificación Técnica por Componente

### 3.1. `SecurityUsersTableComponent`
- **Ubicación:** `frontend/src/features/security/infrastructure/components/security-users-table.component.ts`
- **Mejoras visuales:**
  - Contenedor con scroll vertical delimitado: `overflow-y-auto max-h-[480px] sidebar-scroll-smooth border border-stone-200/80 rounded-2xl shadow-2xs`.
  - Cabecera fija (`thead class="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-xs"`).
  - Nueva columna de **"Acciones"**:
    - Botón **Editar** (icono `edit-3`): Dispara la apertura del modal en modo edición con el objeto `SystemUser` seleccionado.
    - Botón **Eliminar** (icono `trash-2`): Invoca diálogo de confirmación `ToastService.confirmAction()`.
- **Líneas estimadas:** `<= 145` líneas (cumplimiento estricto de SRP).

### 3.2. Modal Unificado de Formulario: `UserFormModalComponent` (refactor de `create-user-modal.component.ts`)
- **Ubicación:** `frontend/src/features/security/infrastructure/components/create-user-modal.component.ts` (o `user-form-modal.component.ts`)
- **Entrada:** `userToEdit = input<SystemUser | null>(null)`.
- **Comportamiento:**
  - Si `userToEdit()` está presente: Título *"Editar Colaborador"*, botón *"Guardar Cambios"*, campos inicializados con los datos de la persona.
  - Si `userToEdit()` es nulo: Título *"Registrar Nueva Persona"*, botón *"Crear Persona"*.
- **Líneas estimadas:** `<= 140` líneas.

### 3.3. Servicio `SecurityUsersService`
- **Ubicación:** `frontend/src/features/security/application/security-users.service.ts`
- **Nuevos métodos:**
  - `updateUser(userId: string, updates: Partial<SystemUser>): SystemUser | undefined`: Actualiza los datos, sincroniza con `localStorage` y emite notificación toast.
  - `deleteUser(userId: string): void`: Remueve la persona de la lista activa, persiste en almacenamiento y notifica con toast informativo.
- **Líneas estimadas:** `<= 125` líneas.

### 3.4. Sincronización en `SecurityRolesViewComponent`
- Al eliminar a un colaborador que pertenezca a un equipo, se remueve de `team.members` en `AdminDashboardService` para mantener consistencia referencial absoluta.

---

## 4. Plan de Ejecución Paso a Paso

1. **Actualizar `SecurityUsersService`:** Añadir `updateUser()` y `deleteUser()`.
2. **Actualizar Modal de Usuario:** Soportar modo creación y modo edición con precarga de campos.
3. **Actualizar `SecurityUsersTableComponent`:**
   - Incorporar contenedor con scroll vertical y cabecera pegajosa.
   - Añadir botones de editar y eliminar con confirmación.
4. **Actualizar `SecurityRolesViewComponent`:** Orquestar eventos de edición y eliminación con `AdminDashboardService`.
5. **Verificación y Auditoría de Líneas:**
   - Compilación frontend y backend sin errores.
   - Verificación 100% de la regla de `<= 150` líneas por archivo.
6. **Documentación y Commit Local:**
   - Registrar ADR-037 y realizar commit local en `featurePrueba`.


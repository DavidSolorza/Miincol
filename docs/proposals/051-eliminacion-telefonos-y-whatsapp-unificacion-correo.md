# Propuesta Técnica 051: Eliminación Total de Números Telefónicos y Canales WhatsApp, Unificación Exclusiva por Correo Electrónico

**Estado:** Propuesta formal para evaluación y feedback  
**Fecha:** 2026-11-14  
**Autor:** Orquestador Técnico & Staff Software Architect  
**Módulos:** `frontend/src/features/admin/`, `frontend/src/features/auth/`, `frontend/src/features/plans/`, `frontend/src/features/general-info/`, `backend/src/teams/`

---

## 1. Requerimiento del Usuario

El usuario solicita retirar de forma integral todos los campos y enlaces de teléfonos móviles y WhatsApp:
> *"oye el tema del telefono eliminalo porfa no vamos a usar nuemor telefonicos elimina tambien la opcion de whatsap porfadejemoslo solo con el correo"*

### Objetivos:
1. **Eliminar el campo de Teléfono / WhatsApp del formulario de misiones:**
   - En `TeamLeaderFieldsComponent` (`teamModal/team-leader-fields.component.ts`), suprimir el input `"Teléfono Móvil (WhatsApp) *"`.
   - Reorganizar la cuadrícula de liderazgo para que muestre únicamente:
     - Pastor / Líder Ministerial *
     - Correo de Acceso del Líder *
2. **Eliminar enlaces y botones de WhatsApp:**
   - **Login (`login-support-footer.component.ts`):** Sustituir el enlace `https://wa.me/...` por soporte directo vía correo institucional: `mailto:soporte@misincol.org`.
   - **Barra Lateral (`sidebar-footer-actions.component.ts`):** Retirar el botón de contacto por WhatsApp al líder. Si se requiere enlace de contacto, utilizar `mailto:` con el correo del líder o dejar solo Notas e Informe PDM.
   - **Ficha General de Misión (`general-team-footer.component.ts` y `general-team-card.component.ts`):** Reemplazar `"Contacto WhatsApp"` por `"Correo Institucional"`.
3. **Ajustes de Modelo y DTO:**
   - Hacer opcional/ignorado el campo `leaderPhone` en frontend y backend para que no bloquee ninguna validación ni inserción.

---

## 2. Componentes a Modificar y Auditoría de Líneas ($\le 150$)

| Archivo | Acción | Líneas Est. |
| :--- | :--- | :---: |
| `team-leader-fields.component.ts` | Retirar input de teléfono; mostrar líder y correo | ~120 |
| `team-modal.component.ts` | Remover `leaderPhone` de campos obligatorios | ~140 |
| `login-support-footer.component.ts` | Cambiar WhatsApp por enlace de correo de soporte | ~28 |
| `sidebar-footer-actions.component.ts` | Retirar botón de WhatsApp | ~95 |
| `general-team-footer.component.ts` | Reemplazar teléfono por correo institucional | ~115 |
| `general-team-card.component.ts` | Limpiar referencias a teléfono de integrantes | ~140 |
| `app-workspace.component.ts` | Limpiar computación de `whatsappUrl` | ~120 |

---

## 3. Consecuencias y Beneficios
- **Cero bloqueos por números de teléfono:** Se elimina definitivamente el problema de campos telefónicos requeridos o incompletos.
- **Canal de comunicación unificado:** Toda la interacción, autenticación y notificaciones institucionales operan exclusivamente mediante correos `@misincol.org`.
- **Diseño más limpio:** Menos inputs y menos ruido visual en formularios y barras de herramientas.


# 📋 Propuesta Técnica 014: Filtro Rápido por Rol y Jerarquía de Ordenamiento en la Tabla de Colaboradores

**Fecha:** 2026-11-06  
**Autor:** Agente 1 (Orquestador Técnico) & Agente 2 (Staff Software Architect)  
**Estado:** PENDIENTE DE APROBACIÓN (Fase 2 de Gobernanza)

---

## 1. Resumen Ejecutivo y Necesidad del Negocio
En la vista de **Asignación de Roles por Colaborador** (`SecurityUsersTableComponent`), el usuario solicita optimizar la búsqueda y organización de las personas mediante:
1. **Filtro Rápido por Botones Segmentados:**
   - Incorporar 3 botones de filtro rápido (uno por cada rol del sistema), más un botón para ver "Todos":
     - `Todos` (conteo total)
     - `Director nacional`
     - `Líder equipo`
     - `Usuario equipo`
2. **Jerarquía Natural de Ordenamiento:**
   - Ordenar la tabla de colaboradores de forma descendente por nivel de responsabilidad:
     1. **Director nacional** (Administración central / nacional)
     2. **Líder equipo** (Pastores y líderes territoriales)
     3. **Usuario equipo** (Obreros misioneros y colaboradores)

---

## 2. Diseño e Implementación Técnica

### 2.1. Componente Impactado
- [`SecurityUsersTableComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/security/infrastructure/components/security-users-table.component.ts) (actualmente 118 líneas).

### 2.2. Lógica de Ordenamiento y Filtrado Reactivo
```typescript
const ROLE_PRIORITY: Record<SystemRoleId, number> = {
  national_director: 1,
  team_leader: 2,
  team_member: 3,
};
```
- La señal `selectedRoleFilter = signal<SystemRoleId | 'all'>('all')` filtrará la lista según el botón activo.
- La señal computada `filteredUsers` aplicará:
  1. Filtro por rol seleccionado (`role === selectedRoleFilter` si no es `'all'`).
  2. Filtro de texto por búsqueda (`searchTerm`).
  3. Ordenamiento prioritario por `ROLE_PRIORITY[a.role] - ROLE_PRIORITY[b.role]`, y secundariamente por `fullName` alfabético.

### 2.3. Estilo Visual
- Botones segmentados esbeltos al lado del buscador, con conteo de personas entre paréntesis `(N)` y estilos acordes a la paleta institucional (carbón, ámbar y esmeralda).
- Cumplimiento estricto del límite de **máximo 150 líneas por archivo**.

---

## 3. Próximo Paso
Conforme a la regla 2.2 del Contrato de Gobernanza Técnica, esperamos tu aprobación explícita (luz verde) para aplicar este ajuste inmediatamente.


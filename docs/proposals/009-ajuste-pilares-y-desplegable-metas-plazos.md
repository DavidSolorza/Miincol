# Propuesta Técnica #009: Eliminación de "Ejes Transversales" y Desplegable de Metas por Plazo (Hugo)

## 1. Contexto y Requerimientos del Usuario

El usuario ha solicitado dos ajustes clave para alinear la plataforma con las definiciones ministeriales oficiales de Hugo:

1. **Eliminar "Ejes Transversales" de la lógica y la UI**:
   - En el selector de Pilar / Área, remover la opción "Ejes Transversales" (`General`).
   - El sistema queda estrictamente con los 5 pilares fundamentales:
     1. **Investigación**
     2. **Encarnación**
     3. **Evangelización**
     4. **Entrenamiento**
     5. **Autocuidado**

2. **Desplegable de Plazos en las Metas Proyectadas (según nota de Hugo)**:
   - Nota oficial de Hugo:
     > *"metas a corto plazo: 2 meses, a mediano plazo: 6 meses y largo plazo a un año."*
   - En el modal de creación y edición de objetivos (donde antes habían campos estáticos de texto plano), reemplazar/acompañar con un selector **desplegable** con las 3 opciones exactas:
     - `Corto plazo (2 meses)`
     - `Mediano plazo (6 meses)`
     - `Largo plazo (1 año)`
   - El usuario podrá seleccionar el plazo en el desplegable e ingresar la meta correspondiente.
   - En el modal de actividades, sincronizar también las etiquetas de metas con los plazos oficiales de Hugo: `Corto Plazo (2 Meses)`, `Mediano Plazo (6 Meses)` y `Largo Plazo (1 Año)`.

---

## 2. Detalle de Cambios Técnicos

### A. Frontend
1. **Selector de Pilares**:
   - En `objective-form-fields.component.ts` y `activity-basic-fields.component.ts`, retirar la opción `<option value="General">Ejes Transversales</option>`.
   - En `plan.types.ts`, actualizar el tipo `EssentialArea = 'Investigación' | 'Encarnación' | 'Evangelización' | 'Entrenamiento' | 'Autocuidado'` y remover la clave `General` de `STAGES_BY_AREA`.

2. **Desplegable de Metas en Objetivos**:
   - En `objective-form-fields.component.ts`:
     - Agregar el selector `<select>` para **Plazo de la Meta**:
       - `Corto plazo (2 meses)`
       - `Mediano plazo (6 meses)`
       - `Largo plazo (1 año)`
     - Conectar dinámicamente el valor de la meta según el plazo seleccionado, permitiendo al usuario definir o consultar la meta para el plazo elegido sin saturar el formulario.
   - En `activity-goals-fields.component.ts`:
     - Actualizar las etiquetas a:
       - `Corto Plazo (2 Meses)`
       - `Mediano Plazo (6 Meses)`
       - `Largo Plazo (1 Año)`

### B. Backend
1. **Validadores y DTOs**:
   - En `create-objective.dto.ts`, `create-activity.dto.ts` e `is-stage-consistent.validator.ts`:
     - Restringir la lista de áreas permitidas a los 5 pilares oficiales.
     - Permitir opcionalmente `shortTermGoal`, `mediumTermGoal`, `longTermGoal` o `goalTerm` en el DTO de objetivos.

---

## 3. Gobernanza y Calidad
- Respeto estricto del límite de **< 150 líneas** por archivo en todos los archivos `.ts`.
- Validación de tipos y compilación limpia con `npm run build` en backend y frontend.
- Cero SDKs comerciales opacos.


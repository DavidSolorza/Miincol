# ADR-057: Control Administrativo del Año Ministerial Activo y Restablecimiento a 2026

## Estado
Aceptado e Implementado (2026-11-12)

## Contexto
El usuario detectó que la tabla de seguimiento multianual mostraba el año 2029 como período activo debido a avances previos del ciclo anual en el almacenamiento local. El plan nacional y las operaciones territoriales vigentes corresponden al año **2026**, y el sistema no proporcionaba a los administradores un mecanismo en la interfaz para seleccionar, corregir o restablecer el año activo de la misión.

## Decisiones de Diseño

### 1. Control Administrativo de Selección de Año (`GeneralYearCycleComponent`)
- Se implementó un selector desplegable visible para administradores que permite conmutar entre los períodos ministeriales (`2025` a `2030`), destacando `2026 (Oficial)`.
- Si el año cargado difiere de 2026, se despliega automáticamente el botón directo **"↺ Fijar Año 2026"**.

### 2. Gestión del Ciclo en `GeneralInfoService`
- Se agregó el método `setActiveYear(year: number)` que actualiza `teamData.year`, asegura `isYearClosed: false` y persiste de inmediato en `localStorage`.

### 3. Reorganización de la Tabla Multianual (`GeneralAnnualTableComponent`)
- Al quedar en 2026, la tabla presenta:
  - `Año 2025` (Histórico cerrado)
  - `Año 2026 (Activo)` (Período ministerial en curso con inputs de captura)
  - `Año 2027` (Proyección del siguiente período)

## Consecuencias
- Control total para la Dirección Nacional sobre el período de planeación y reporte.
- Corrección inmediata de desfases temporales sin necesidad de limpiar la memoria o reiniciar datos.
- Cumplimiento riguroso de la regla de máximo 150 líneas por archivo de código fuente (.ts).

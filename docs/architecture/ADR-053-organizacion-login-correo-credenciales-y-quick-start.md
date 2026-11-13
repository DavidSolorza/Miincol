# ADR-053: Organización del Login por Correo, Credenciales Predefinidas y Botones de Inicio Rápido

## Estado
Aprobado y Ejecutado

## Contexto
Se requirió rediseñar la experiencia de login para que la autenticación se realice directamente ingresando **correo electrónico** y **contraseña**, con contraseñas predefinidas oficiales por rol ministerial (Director Nacional, líderes territoriales, misioneros de campo) e incorporando una grilla de **botones de inicio rápido (Quick-Start)** para agilizar las pruebas y demostraciones previas al pase a producción.

## Decisiones Técnicas Adoptadas
1. **Formulario Unificado por Correo Electrónico:**
   - En [`LoginFormFieldsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/auth/infrastructure/login/login-form-fields.component.ts) (85 líneas), se reemplazó el select rígido por un campo abierto de texto/correo con `<datalist>` dinámico de sugerencias institucionales y visibilidad de contraseña.
2. **Botones de Inicio Rápido Estilizados:**
   - En [`LoginQuickAccessChipsComponent`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/auth/infrastructure/login/login-quick-access-chips.component.ts) (70 líneas), se implementó una grilla de botones interactivos de 1-clic:
     - 👑 **Director Nacional** (`director@misincol.org` / `director2026`)
     - 🌄 **Líder Pastos** (`pastos@misincol.org` / `pastos2026`)
     - 🏜️ **Líder Wayúu** (`wayuu@misincol.org` / `wayuu2026`)
     - 🌿 **Líder Nasa** (`marcos.chocue@misincol.org` / `nasa2026`)
     - 🤝 **Misionera Aída** (`aida.secue@misincol.org` / `nasa2026`)
     - 🌴 **Líder Émbera** (`embera@misincol.org` / `embera2026`)
3. **Lógica de Autenticación Unificada:**
   - En [`verifyAuthCredentials`](file:///c:/Users/Usuario/Desktop/personales/planMinisterial/frontend/src/features/auth/application/verifyAuthCredentials.ts) (90 líneas), se reconocen de forma prioritaria los correos de administración (`director@misincol.org`, `admin@misincol.org`) con su clave predefinida `director2026` / `admin2026`, así como cada correo territorial con su clave unificada de equipo.
4. **Gobernanza y Pruebas Unitarias:**
   - Todos los archivos son $\le 150$ líneas.
   - 100% de pruebas en verde (16 suites frontend con 55 pruebas; 11 suites backend con 45 pruebas).

## Consecuencias
- El login es uniforme, profesional e intuitivo: cada persona entra con su correo y contraseña.
- Los botones de inicio rápido facilitan pruebas instantáneas entre todos los roles sin necesidad de tipear contraseñas en cada prueba.


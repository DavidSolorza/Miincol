# Propuesta Técnica 034: Organización del Login por Correo, Credenciales Predefinidas y Botones de Inicio Rápido

## 1. Contexto y Requerimiento
El usuario ha solicitado formalizar la experiencia de inicio de sesión:
> *"oye organiza el login porfa para que se entre con el correo y la contraseña y que el correo de admin ingrese con un contraseña predefinida que solo directornacional tiene lo mismo para el resto ayudam con eso y dame botones de inicio rapido porfa mietas lanzamos a produccion, tienes todos lso permisos para que paliques los cambios porfa"*

### Objetivos:
1. **Unificación a Login por Correo y Contraseña:** Reemplazar la selección restrictiva de pestañas o menús desplegables por un formulario intuitivo donde cualquier colaborador ingrese con su correo electrónico institucional/personal y su contraseña.
2. **Credenciales Predefinidas Oficiales:**
   - **Director Nacional (Admin):**
     - Correo: `director@misincol.org` (o `admin@misincol.org`)
     - Contraseña: `director2026` (o `admin2026`)
   - **Líderes de Equipo Territorial:**
     - `pastos@misincol.org` ➡️ `pastos2026`
     - `wayuu@misincol.org` ➡️ `wayuu2026`
     - `marcos.chocue@misincol.org` (o `nasa@misincol.org`) ➡️ `nasa2026`
     - `embera@misincol.org` ➡️ `embera2026`
   - **Integrantes / Misioneros de Campo:**
     - `aida.secue@misincol.org` ➡️ `nasa2026`
     - Cualquier nuevo misionero registrado entra con su correo y la clave unificada de su misión.
3. **Botones de Inicio Rápido (Quick-Start):**
   - Incorporar botones directos en la interfaz de login que permitan autocompletar e ingresar de inmediato a cada perfil con 1 solo clic mientras se avanza hacia el despliegue en producción.

---

## 2. Alcance de la Solución Técnica

### A. Frontend (`features/auth`)
1. **`LoginFormFieldsComponent` (`login-form-fields.component.ts`):**
   - Entrada principal: Campo de texto con validación de correo (`type="email"` o texto para compatibilidad).
   - Sugerencias visuales mediante `<datalist>` con los correos oficiales disponibles.
   - Campo de contraseña con alternancia de visibilidad (ver/ocultar).
2. **`LoginQuickAccessChipsComponent` (`login-quick-access-chips.component.ts`):**
   - Tarjetas/botones estilizados de inicio rápido:
     - 👑 *Director Nacional* (`director@misincol.org`)
     - 🌄 *Líder Pastos* (`pastos@misincol.org`)
     - 🏜️ *Líder Wayúu* (`wayuu@misincol.org`)
     - 🌿 *Líder Nasa* (`marcos.chocue@misincol.org`)
     - 🤝 *Misionera Aída Secue* (`aida.secue@misincol.org`)
   - Botón directo que carga las credenciales y ejecuta el login para agilizar pruebas.
3. **`verifyAuthCredentials.ts`:**
   - Reconocer `director@misincol.org` / `admin@misincol.org` con `director2026` / `admin2026`.
   - Reconocer cada correo de líder y misionero mapeándolo a su misión y PIN correspondiente.

---

## 3. Calidad y Gobernanza
- Límite estricto de $\le 150$ líneas por archivo.
- 100% de suites de pruebas unitarias en verde.
- Cero dependencias opacas.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** AUTORIZADO (el usuario indicó *"tienes todos los permisos para que apliques los cambios porfa"*).
- Procedemos de inmediato con la ejecución técnica controlada.


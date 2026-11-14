# Propuesta Técnica 045: Configuración de API Remota en Producción y Preparación para Despliegue en Vercel

## 1. Diagnóstico y Estado del Servidor
- **URL Base Remota**: `https://misincol-api.servidor.blog/api`
- **Resultados de Conexión Inicial (Verificado Online)**:
  - `GET /api/health`: Estado `ONLINE`, motor `PostgreSQL 15`, base de datos `misincol_db`, correo `GOOGLE_SMTP_ACTIVO`.
  - `GET /api/teams/summary/kpis`: 6 equipos territoriales oficiales, presupuesto nacional $94.610.000 COP, ejecución 47%.
  - `POST /api/auth/login`: Validación exitosa con credenciales pastorales (`pastos@misincol.org`, `team-pastos`, `team-wayuu`).
- **Incidencia Detectada (Cloudflare 502)**:
  - El proxy de borde Cloudflare comenzó a responder `502 Bad Gateway`, indicando que el proceso Node.js/NestJS en el servidor de destino se detuvo, reinició o el túnel perdió enlace temporal con el puerto upstream.

## 2. Plan de Acción y Configuración para Vercel
1. **Configuración de Enrutamiento en Vercel (`vercel.json`)**:
   - Agregar regla de reescritura reversa: `/api/:path*` hacia `https://misincol-api.servidor.blog/api/:path*`.
   - Mantener reescritura SPA: `/(.*)` hacia `/index.html` para evitar errores 404 al recargar páginas profundas.
2. **Estandarización de Variables de Entorno (`.env`)**:
   - `frontend/.env.production` y `frontend/.env.example` con `VITE_API_BASE_URL=https://misincol-api.servidor.blog/api`.
   - `frontend/src/core/config/env.config.ts` con fallback predeterminado a la URL de producción.
3. **Resiliencia en Cliente HTTP (`httpClient.ts`)**:
   - Normalización de rutas para evitar colisiones `/api/api` tanto en llamadas absolutas como relativas.
   - Compatibilidad completa con tokens Bearer JWT y timeouts configurables.
4. **Sincronización de Equipos (`admin-teams-sync.helper.ts`)**:
   - Integración nativa con `ENV.apiBaseUrl` y transmisión de credenciales para todas las altas y bajas de misión.
5. **Proxy de Desarrollo Vite (`vite.config.ts`)**:
   - Proxy local redirigido hacia `https://misincol-api.servidor.blog`.


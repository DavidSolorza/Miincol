# Propuesta Técnica 033: Configuración Segura del Servicio de Notificaciones por Correo Electrónico con Google

## 1. Contexto y Requerimiento
El usuario ha expresado:
> *"oye tengo unas credenciales para los correos de notificaciones con google ayudame a configurar eso para implementar esas cosas porfa"*

### Objetivo:
Habilitar el servicio de envío de notificaciones automáticas por correo electrónico en el backend de Misincol (ej. bienvenida y entrega de accesos a nuevos misioneros, alertas críticas de campo en salud/seguridad, resúmenes de supervisión territorial), protegiendo la confidencialidad de las claves y cumpliendo estrictamente con el **Contrato de Gobernanza Técnica (versión 2026.4.0)**.

---

## 2. Tipos de Credenciales de Google y Métodos de Integración

Dependiendo de cómo se hayan generado las credenciales en Google, existen dos mecanismos estándar:

### Opción 1: Contraseña de Aplicación de Google (Google Workspace / Gmail App Password) - *Recomendada*
- **¿Qué es?:** Una clave de 16 letras generada en la configuración de seguridad de la cuenta de Google (bajo "Verificación en dos pasos" ➡️ "Contraseñas de aplicaciones").
- **Variables requeridas en `backend/.env`:**
  ```env
  MAIL_HOST=smtp.gmail.com
  MAIL_PORT=587
  MAIL_SECURE=false
  MAIL_USER=notificaciones@misincol.org (o tu_correo@gmail.com)
  MAIL_PASS=xxxx xxxx xxxx xxxx
  MAIL_FROM="Misincol Supervisión <notificaciones@misincol.org>"
  ```
- **Ventaja:** Muy rápida de configurar, estándar, altamente confiable.

### Opción 2: Google Cloud Console (OAuth2 / Service Account / Gmail API REST)
- **¿Qué es?:** Credenciales emitidas en Google Cloud Console mediante Client ID + Client Secret + Refresh Token o Service Account Key (archivo JSON).
- **Consumo:** Mediante la API REST oficial de Google (`https://gmail.googleapis.com/v1/users/me/messages/send`) usando `fetch` nativo sin librerías comerciales pesadas (cumpliendo la Regla 2.3).

---

## 3. Arquitectura y Plan de Implementación

```
backend/
├── .env.example                               # Plantilla pública de variables requeridas
├── .env                                       # Archivo local privado (ignorado por git)
└── src/
    └── notifications/                         # Módulo vertical de notificaciones
        ├── notifications.module.ts            # Módulo NestJS (< 40 líneas)
        ├── domain/
        │   └── notification.types.ts          # Interfaces de plantillas y payloads (< 60 líneas)
        ├── infrastructure/
        │   ├── mail-transport.service.ts      # Cliente de transporte seguro (< 100 líneas)
        │   └── templates/
        │       ├── welcome-team.template.ts   # Plantilla HTML de bienvenida y credenciales (< 100 líneas)
        │       └── critical-alert.template.ts # Plantilla HTML de alertas territoriales (< 100 líneas)
        └── notifications.service.ts           # Orquestador del servicio (< 100 líneas)
```

### Reglas de Seguridad Inviolables:
1. **Nunca pegar contraseñas en el chat:** Se creará el archivo `backend/.env.example` y te indicaremos exactamente cómo crear tu archivo local privado `backend/.env` para que tus claves nunca salgan de tu equipo ni queden en el historial.
2. **Límite de 150 Líneas:** Cada archivo permanecerá estrictamente $\le 150$ líneas.
3. **Cero SDKs Comerciales Opacos:** Uso de protocolos nativos y estándares de la industria.

---

## 4. Estado de Gobernanza
- **Versión:** 2026.4.0
- **Estado:** PENDIENTE DE REVISIÓN Y FEEDBACK DEL USUARIO.
- **Pausa Obligatoria:** En cumplimiento de la regla 2.2, el agente espera tu aclaración sobre el tipo de credenciales que posees antes de generar código o archivos.


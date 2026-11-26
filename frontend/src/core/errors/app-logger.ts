export interface ErrorDiagnostic {
  error: string;
  cause: string;
  suggestion: string;
}

export function getHttpDiagnostic(status: number, rawMessage?: string): ErrorDiagnostic {
  const msg = rawMessage || '';
  if (status === 400) {
    return {
      error: `Petición Inválida (HTTP 400): ${msg || 'Los datos enviados no son válidos.'}`,
      cause: 'Los datos enviados no cumplen las validaciones del servidor (DTO rechazado, campos obligatorios ausentes o tipo de dato incorrecto).',
      suggestion: 'Revisar el payload enviado contra los campos exigidos por la entidad en el backend.',
    };
  }
  if (status === 401) {
    return {
      error: `No Autorizado (HTTP 401): ${msg || 'Credenciales o token no válidos.'}`,
      cause: 'La sesión expiró, el token JWT no fue enviado o no tiene firma válida.',
      suggestion: 'Cerrar e iniciar sesión nuevamente para regenerar las credenciales en el navegador.',
    };
  }
  if (status === 403) {
    return {
      error: `Acceso Prohibido (HTTP 403): ${msg || 'Permisos insuficientes.'}`,
      cause: 'El rol actual del usuario no tiene permisos habilitados para esta operación en la matriz de seguridad.',
      suggestion: 'Verificar en el módulo de seguridad si el rol del usuario cuenta con este permiso.',
    };
  }
  if (status === 404) {
    return {
      error: `Recurso No Encontrado (HTTP 404): ${msg || 'La ruta o registro no existe.'}`,
      cause: 'El endpoint consultado no está registrado en el backend o el ID de la entidad no existe en PostgreSQL.',
      suggestion: 'Comprobar que la URL sea correcta y que el identificador corresponda a un registro existente.',
    };
  }
  if (status === 408) {
    return {
      error: `Tiempo de Espera Agotado (HTTP 408): ${msg || 'El servidor tardó demasiado.'}`,
      cause: 'La petición superó el tiempo límite configurado sin recibir respuesta del servidor.',
      suggestion: 'Revisar la estabilidad de la conexión o la carga actual en el servidor remoto.',
    };
  }
  if (status === 409) {
    return {
      error: `Conflicto de Duplicidad (HTTP 409): ${msg || 'El registro ya existe.'}`,
      cause: 'Uno de los campos únicos (correo electrónico, PIN de acceso o slug) colisiona con un registro existente.',
      suggestion: 'Utilizar valores únicos o comprobar si la entidad ya fue registrada previamente.',
    };
  }
  if (status === 422) {
    return {
      error: `Entidad No Procesable (HTTP 422): ${msg || 'Regla de negocio no satisfecha.'}`,
      cause: 'Los datos tienen formato correcto pero violan una regla lógica ministerial (ej. suma de pilares superior al presupuesto).',
      suggestion: 'Ajustar los valores numéricos para cumplir con los topes de presupuesto o reglas de validación.',
    };
  }
  if (status >= 500) {
    return {
      error: `Error Interno del Servidor (HTTP ${status}): ${msg || 'Fallo no controlado en el backend.'}`,
      cause: 'Ocurrió una excepción no controlada en NestJS, fallo de conexión a PostgreSQL o túnel Cloudflare desconectado.',
      suggestion: 'Revisar el estado de PM2 y los logs de la base de datos en el servidor.',
    };
  }
  return {
    error: `Fallo HTTP inesperado (${status}): ${msg}`,
    cause: 'Respuesta no estándar recibida del servidor.',
    suggestion: 'Inspeccionar la pestaña Red (Network) de la consola para ver la respuesta cruda.',
  };
}

export class AppLogger {
  public static logHttpError(method: string, url: string, status: number, rawMessage?: string, details?: unknown): void {
    const diag = getHttpDiagnostic(status, rawMessage);
    console.group(`%c🚨 [MISINCOL ERROR] ➔ HTTP ${method} ${url}`, 'background: #8B251E; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;');
    console.error(`%c❌ Error: %c${diag.error}`, 'color: #DC2626; font-weight: bold;', 'color: #1C1917;');
    console.warn(`%c🔍 Por qué ocurrió: %c${diag.cause}`, 'color: #D97706; font-weight: bold;', 'color: #1C1917;');
    console.info(`%c💡 Cómo resolverlo: %c${diag.suggestion}`, 'color: #2563EB; font-weight: bold;', 'color: #1C1917;');
    if (details !== undefined) {
      console.log('%c📦 Detalles Técnicos:', 'color: #6B7280; font-weight: bold;', details);
    }
    console.groupEnd();
  }

  public static logOperationalError(context: string, error: unknown, suggestion?: string, extraData?: unknown): void {
    const errText = error instanceof Error ? error.message : String(error);
    const isNetwork = errText.toLowerCase().includes('fetch') || errText.toLowerCase().includes('network');
    const cause = isNetwork
      ? 'No se pudo establecer conexión con el servidor (sin internet o backend caído/bloqueado).'
      : 'Ocurrió un fallo de lógica o procesamiento en la aplicación cliente.';
    const sol = suggestion || (isNetwork ? 'Verificar la conexión de red o el estado del túnel Cloudflare.' : 'Revisar la traza del error en la consola.');

    console.group(`%c⚠️ [MISINCOL ERROR] ➔ ${context}`, 'background: #B91C1C; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;');
    console.error(`%c❌ Error: %c${errText}`, 'color: #DC2626; font-weight: bold;', 'color: #1C1917;');
    console.warn(`%c🔍 Por qué ocurrió: %c${cause}`, 'color: #D97706; font-weight: bold;', 'color: #1C1917;');
    console.info(`%c💡 Cómo resolverlo: %c${sol}`, 'color: #2563EB; font-weight: bold;', 'color: #1C1917;');
    if (extraData !== undefined) {
      console.log('%c📦 Contexto Adicional:', 'color: #6B7280; font-weight: bold;', extraData);
    }
    console.groupEnd();
  }
}

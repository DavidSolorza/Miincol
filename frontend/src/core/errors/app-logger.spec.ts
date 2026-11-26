import { describe, it, expect, vi } from 'vitest';
import { getHttpDiagnostic, AppLogger } from './app-logger';

describe('getHttpDiagnostic', () => {
  it('returns valid diagnostic for 400 Bad Request', () => {
    const diag = getHttpDiagnostic(400, 'Payload invalido');
    expect(diag.error).toContain('HTTP 400');
    expect(diag.cause).toContain('validaciones del servidor');
    expect(diag.suggestion).toContain('Revisar el payload');
  });

  it('returns valid diagnostic for 401 Unauthorized', () => {
    const diag = getHttpDiagnostic(401);
    expect(diag.error).toContain('HTTP 401');
    expect(diag.cause).toContain('token JWT');
  });

  it('returns valid diagnostic for 403 Forbidden', () => {
    const diag = getHttpDiagnostic(403);
    expect(diag.error).toContain('HTTP 403');
    expect(diag.error).toContain('Permisos insuficientes');
    expect(diag.cause).toContain('matriz de seguridad');
  });

  it('returns valid diagnostic for 404 Not Found', () => {
    const diag = getHttpDiagnostic(404);
    expect(diag.error).toContain('HTTP 404');
    expect(diag.cause).toContain('no existe');
  });

  it('returns valid diagnostic for 408 Timeout', () => {
    const diag = getHttpDiagnostic(408);
    expect(diag.error).toContain('HTTP 408');
    expect(diag.cause).toContain('superó el tiempo límite');
  });

  it('returns valid diagnostic for 409 Conflict', () => {
    const diag = getHttpDiagnostic(409);
    expect(diag.error).toContain('HTTP 409');
    expect(diag.cause).toContain('colisiona con un registro');
  });

  it('returns valid diagnostic for 422 Unprocessable', () => {
    const diag = getHttpDiagnostic(422);
    expect(diag.error).toContain('HTTP 422');
    expect(diag.cause).toContain('regla lógica ministerial');
  });

  it('returns valid diagnostic for 500 Server Error', () => {
    const diag = getHttpDiagnostic(500);
    expect(diag.error).toContain('HTTP 500');
    expect(diag.cause).toContain('NestJS, fallo de conexión a PostgreSQL');
  });

  it('returns fallback for unusual status', () => {
    const diag = getHttpDiagnostic(418);
    expect(diag.error).toContain('418');
    expect(diag.cause).toContain('Respuesta no estándar');
  });
});

describe('AppLogger', () => {
  it('logs HTTP error to console group without throwing', () => {
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    expect(() => {
      AppLogger.logHttpError('POST', '/api/teams', 400, 'Datos invalidos', { field: 'name' });
    }).not.toThrow();

    expect(groupSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalled();
    expect(groupEndSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('logs operational error to console group without throwing', () => {
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    expect(() => {
      AppLogger.logOperationalError('Offline Sync', new Error('Failed to fetch'), 'Comprobar red');
    }).not.toThrow();

    expect(groupSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    expect(groupEndSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});

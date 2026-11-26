import { ErrorHandler, Injectable } from '@angular/core';
import { AppLogger } from './app-logger';

/**
 * Global Angular Error Handler
 * Captura excepciones no controladas en componentes, directivas y plantillas,
 * presentando diagnósticos claros en español en la consola del navegador.
 */
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    AppLogger.logOperationalError(
      'Excepción Angular Runtime / UI',
      error,
      'Verificar la plantilla HTML, el binding de componentes o posibles accesos a propiedades nulas/indefinidas.'
    );
  }
}

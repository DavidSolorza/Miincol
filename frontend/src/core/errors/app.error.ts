/**
 * Structured Application Errors & Operational HTTP Exceptions
 * Aligned with Technical Governance Contract v2026.4.0
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppErrorDetails {
  readonly code: string;
  readonly message: string;
  readonly statusCode?: number;
  readonly severity?: ErrorSeverity;
  readonly context?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly context?: Record<string, unknown>;

  constructor(details: AppErrorDetails) {
    super(details.message);
    this.name = 'AppError';
    this.code = details.code;
    this.statusCode = details.statusCode ?? 500;
    this.severity = details.severity ?? 'error';
    this.context = details.context;

    // Restore prototype chain in transpiled environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HttpError extends AppError {
  constructor(status: number, message: string, context?: Record<string, unknown>) {
    super({
      code: `HTTP_${status}`,
      message,
      statusCode: status,
      severity: status >= 500 ? 'critical' : 'warning',
      context,
    });
    this.name = 'HttpError';
  }
}

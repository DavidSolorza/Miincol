/**
 * Application Global Environment & Configuration Tokens
 * Aligned with Technical Governance Contract v2026.4.0
 */

export interface AppConfig {
  readonly appName: string;
  readonly appVersion: string;
  readonly apiBaseUrl: string;
  readonly isProduction: boolean;
  readonly requestTimeoutMs: number;
}

export const ENV: AppConfig = {
  appName: 'MISINCOL PDM',
  appVersion: '2026.4.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  isProduction: import.meta.env.PROD || false,
  requestTimeoutMs: 15000,
};

/**
 * Native Fetch HTTP Client (Zero Commercial SDKs)
 * Handles headers, timeout, JSON serialization, and structured error mapping.
 * Aligned with Technical Governance Contract v2026.4.0
 */

import { ENV } from '../config/env.config';
import { HttpError } from '../errors/app.error';

export interface HttpRequestOptions extends RequestInit {
  timeoutMs?: number;
  queryParams?: Record<string, string | number | boolean | undefined>;
}

export class NativeHttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = ENV.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public async get<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  public async post<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  private async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const { timeoutMs = ENV.requestTimeoutMs, queryParams, headers, ...rest } = options;
    const url = this.buildUrl(path, queryParams);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...rest,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        let errMessage = `HTTP request failed with status ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody && typeof errBody.message === 'string') {
            errMessage = errBody.message;
          }
        } catch {
          // Fallback to default message if body is not JSON
        }
        throw new HttpError(response.status, errMessage, { url, status: response.status });
      }

      if (response.status === 204) {
        return undefined as unknown as T;
      }

      return (await response.json()) as T;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const msg = isAbort ? `Request to ${url} timed out after ${timeoutMs}ms` : (err as Error).message;
      throw new HttpError(isAbort ? 408 : 500, msg, { originalError: err });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private buildUrl(path: string, queryParams?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = new URL(`${this.baseUrl}${cleanPath}`, window.location.origin);
    if (queryParams) {
      Object.entries(queryParams).forEach(([k, v]) => {
        if (v !== undefined) fullUrl.searchParams.set(k, String(v));
      });
    }
    return fullUrl.toString();
  }
}

export const httpClient = new NativeHttpClient();

import type { HttpResponse, RequestOptions } from './http.types';
import { buildHttpHeaders, parseHttpResponse } from './httpHelpers';

export type { HttpResponse, RequestOptions };

class NativeHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  private getUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  public async get<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const response = await fetch(this.getUrl(path), {
        method: 'GET',
        headers: buildHttpHeaders(options),
      });
      return await parseHttpResponse<T>(response);
    } catch (err: unknown) {
      return { data: null, status: 0, ok: false, error: err instanceof Error ? err.message : 'Error de red' };
    }
  }

  public async post<T, B = unknown>(path: string, body: B, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const response = await fetch(this.getUrl(path), {
        method: 'POST',
        headers: buildHttpHeaders(options),
        body: JSON.stringify(body),
      });
      return await parseHttpResponse<T>(response);
    } catch (err: unknown) {
      return { data: null, status: 0, ok: false, error: err instanceof Error ? err.message : 'Error de red' };
    }
  }

  public async patch<T, B = unknown>(path: string, body: B, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const response = await fetch(this.getUrl(path), {
        method: 'PATCH',
        headers: buildHttpHeaders(options),
        body: JSON.stringify(body),
      });
      return await parseHttpResponse<T>(response);
    } catch (err: unknown) {
      return { data: null, status: 0, ok: false, error: err instanceof Error ? err.message : 'Error de red' };
    }
  }

  public async delete<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const response = await fetch(this.getUrl(path), {
        method: 'DELETE',
        headers: buildHttpHeaders(options),
      });
      const ok = response.ok;
      return { data: null, status: response.status, ok, error: ok ? undefined : `Error HTTP ${response.status}` };
    } catch (err: unknown) {
      return { data: null, status: 0, ok: false, error: err instanceof Error ? err.message : 'Error de red' };
    }
  }
}

export const httpClient = new NativeHttpClient();

/**
 * Cliente HTTP Nativo (Cero SDKs Comerciales de Terceros)
 * Cumple estrictamente con la regla de gobernanza: uso exclusivo de fetch nativo,
 * inyección estructurada de headers (Authorization, Content-Type) y tipado estricto.
 */

export interface HttpResponse<T> {
  data: T | null;
  status: number;
  ok: boolean;
  error?: string;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  token?: string;
  timeoutMs?: number;
}

class NativeHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  private buildHeaders(options?: RequestOptions): Headers {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    const token = options?.token || localStorage.getItem('misincol_auth_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, val]) => {
        headers.set(key, val);
      });
    }

    return headers;
  }

  public async get<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.buildHeaders(options),
      });

      const ok = response.ok;
      const status = response.status;
      let data: T | null = null;
      let error: string | undefined;

      try {
        const json = await response.json();
        if (ok) {
          data = json as T;
        } else {
          error = json?.message || `Error HTTP ${status}`;
        }
      } catch {
        if (!ok) error = `Error HTTP ${status}`;
      }

      return { data, status, ok, error };
    } catch (err: unknown) {
      return {
        data: null,
        status: 0,
        ok: false,
        error: err instanceof Error ? err.message : 'Error de conexión de red',
      };
    }
  }

  public async post<T, B = unknown>(path: string, body: B, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(options),
        body: JSON.stringify(body),
      });

      const ok = response.ok;
      const status = response.status;
      let data: T | null = null;
      let error: string | undefined;

      try {
        const json = await response.json();
        if (ok) {
          data = json as T;
        } else {
          error = json?.message || `Error HTTP ${status}`;
        }
      } catch {
        if (!ok) error = `Error HTTP ${status}`;
      }

      return { data, status, ok, error };
    } catch (err: unknown) {
      return {
        data: null,
        status: 0,
        ok: false,
        error: err instanceof Error ? err.message : 'Error de conexión de red',
      };
    }
  }

  public async patch<T, B = unknown>(path: string, body: B, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.buildHeaders(options),
        body: JSON.stringify(body),
      });

      const ok = response.ok;
      const status = response.status;
      let data: T | null = null;
      let error: string | undefined;

      try {
        const json = await response.json();
        if (ok) {
          data = json as T;
        } else {
          error = json?.message || `Error HTTP ${status}`;
        }
      } catch {
        if (!ok) error = `Error HTTP ${status}`;
      }

      return { data, status, ok, error };
    } catch (err: unknown) {
      return {
        data: null,
        status: 0,
        ok: false,
        error: err instanceof Error ? err.message : 'Error de conexión de red',
      };
    }
  }

  public async delete<T>(path: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    try {
      const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.buildHeaders(options),
      });

      const ok = response.ok;
      const status = response.status;
      return {
        data: null,
        status,
        ok,
        error: ok ? undefined : `Error HTTP ${status}`,
      };
    } catch (err: unknown) {
      return {
        data: null,
        status: 0,
        ok: false,
        error: err instanceof Error ? err.message : 'Error de conexión de red',
      };
    }
  }
}

export const httpClient = new NativeHttpClient();

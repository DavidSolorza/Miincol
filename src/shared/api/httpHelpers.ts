import type { RequestOptions, HttpResponse } from './http.types';

export const buildHttpHeaders = (options?: RequestOptions): Headers => {
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
};

export const parseHttpResponse = async <T>(response: Response): Promise<HttpResponse<T>> => {
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
};

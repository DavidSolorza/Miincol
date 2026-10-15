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

import { Injectable, signal, NgZone, inject } from '@angular/core';
import { httpClient } from '../../http/httpClient';

@Injectable({ providedIn: 'root' })
export class NetworkStatusService {
  private readonly ngZone = inject(NgZone, { optional: true });
  readonly isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  readonly isServerReachable = signal<boolean>(true);
  readonly lastCheckedAt = signal<string>(new Date().toISOString());

  constructor() {
    this.initListeners();
    this.checkServerHealth();
  }

  private runInZone(fn: () => void): void {
    if (this.ngZone) this.ngZone.run(fn);
    else fn();
  }

  private initListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.runInZone(() => {
        this.isOnline.set(true);
        this.checkServerHealth();
      });
    });

    window.addEventListener('offline', () => {
      this.runInZone(() => {
        this.isOnline.set(false);
        this.isServerReachable.set(false);
        this.lastCheckedAt.set(new Date().toISOString());
      });
    });
  }

  async checkServerHealth(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.isServerReachable.set(false);
      return false;
    }

    try {
      const res = await httpClient.get<{ status?: string }>('/health');
      const ok = res?.status === 'ok' || res?.status === 'ONLINE' || Boolean(res);
      this.isServerReachable.set(ok);
      this.lastCheckedAt.set(new Date().toISOString());
      return ok;
    } catch {
      this.isServerReachable.set(false);
      this.lastCheckedAt.set(new Date().toISOString());
      return false;
    }
  }
}

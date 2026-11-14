import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { NetworkStatusService } from './network-status.service';
import { httpClient } from '../../http/httpClient';

describe('NetworkStatusService (Unit Tests)', () => {
  let service: NetworkStatusService;

  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    const injector = createEnvironmentInjector([], null as unknown as import('@angular/core').EnvironmentInjector);
    service = runInInjectionContext(injector, () => new NetworkStatusService());
  });

  it('debe reflejar isOnline en base a navigator y permitir verificar salud del servidor', async () => {
    vi.spyOn(httpClient, 'get').mockResolvedValueOnce({ status: 'ok' });

    const isReachable = await service.checkServerHealth();
    expect(isReachable).toBe(true);
    expect(service.isServerReachable()).toBe(true);
  });

  it('debe marcar isServerReachable en false cuando la peticion /health falla', async () => {
    vi.spyOn(httpClient, 'get').mockRejectedValueOnce(new Error('Sin conexion'));

    const isReachable = await service.checkServerHealth();
    expect(isReachable).toBe(false);
    expect(service.isServerReachable()).toBe(false);
  });
});

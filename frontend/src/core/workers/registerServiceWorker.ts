export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // En entorno de desarrollo (localhost), desregistra cualquier Service Worker activo
  // y limpia las cachés para evitar que intercepte peticiones de Vite con assets antiguos.
  if (!import.meta.env.PROD) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });

    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
    return;
  }

  // En producción, registra el Service Worker para soporte Offline-First
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        if (reg.installing) {
          console.debug('[ServiceWorker] Instalando cache de alto rendimiento...');
        }
      })
      .catch((err) => {
        console.debug('[ServiceWorker] Registro omitido o error:', err);
      });
  });
}

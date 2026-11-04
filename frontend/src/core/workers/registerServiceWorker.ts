export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

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

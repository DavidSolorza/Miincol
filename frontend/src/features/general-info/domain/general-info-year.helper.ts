// Helper para sincronizar el año ministerial activo en todos los equipos almacenados
export function syncGlobalMinisterialYear(storagePrefix: string, year: number): void {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(storagePrefix)) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.teamData) {
              parsed.teamData.year = year;
              parsed.teamData.isYearClosed = false;
              localStorage.setItem(key, JSON.stringify(parsed));
            }
          }
        } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
}


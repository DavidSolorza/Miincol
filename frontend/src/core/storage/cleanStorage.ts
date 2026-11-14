const CLEAN_STORAGE_VERSION_KEY = 'misincol_storage_version';
const CURRENT_CLEAN_VERSION = '2026.4.0-clean-v3';

export const OBSOLETE_KEYS_PATTERN = [
  'misincol_temp_',
  'misincol_draft_',
  'misincol_legacy_',
  'misincol_pdm_plans_',
  'misincol_team_plans_',
  'misincol_admin_teams',
  'misincol_system_users_v1',
  'misincol_security_matrix_v1',
  'misincol_general_info_',
  'misincol_special_expenses_',
];

export function sanitizeClientStorage(forceReset = false): boolean {
  try {
    const currentVersion = localStorage.getItem(CLEAN_STORAGE_VERSION_KEY);
    if (forceReset || currentVersion !== CURRENT_CLEAN_VERSION) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (OBSOLETE_KEYS_PATTERN.some((pattern) => key.startsWith(pattern)) || forceReset)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(CLEAN_STORAGE_VERSION_KEY, CURRENT_CLEAN_VERSION);
      return true;
    }
  } catch {
    /* localStorage disabled or sandbox */
  }
  return false;
}

export function resetAllStorageToCleanSeeds(): void {
  try {
    const keysToPurge = [
      'misincol_security_matrix_v1',
      'misincol_system_users_v1',
    ];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('misincol_team_plans_') || key.startsWith('misincol_pdm_plans_') || key.startsWith('misincol_general_info_') || key.startsWith('misincol_special_expenses_'))) {
        keysToPurge.push(key);
      }
    }
    keysToPurge.forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(CLEAN_STORAGE_VERSION_KEY, CURRENT_CLEAN_VERSION);
  } catch {
    /* ignore */
  }
}

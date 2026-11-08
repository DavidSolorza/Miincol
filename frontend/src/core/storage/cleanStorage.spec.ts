import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeClientStorage, resetAllStorageToCleanSeeds, OBSOLETE_KEYS_PATTERN } from './cleanStorage';

describe('cleanStorage Utility (Unit Tests)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe establecer la versión limpia y remover claves obsoletas', () => {
    localStorage.setItem('misincol_temp_draft_1', 'temp_val');
    localStorage.setItem('misincol_legacy_data', 'legacy_val');
    localStorage.setItem('keep_this_key', 'ok');

    const cleaned = sanitizeClientStorage(false);
    expect(cleaned).toBe(true);
    expect(localStorage.getItem('misincol_temp_draft_1')).toBeNull();
    expect(localStorage.getItem('misincol_legacy_data')).toBeNull();
    expect(localStorage.getItem('keep_this_key')).toBe('ok');
    expect(localStorage.getItem('misincol_storage_version')).toBeDefined();
  });

  it('debe purgar datos dinámicos al invocar resetAllStorageToCleanSeeds', () => {
    localStorage.setItem('misincol_team_plans_team-pastos', '{"plan": 1}');
    localStorage.setItem('misincol_special_expenses_team-pastos', '[]');
    localStorage.setItem('misincol_general_info_team-pastos', '{}');

    resetAllStorageToCleanSeeds();

    expect(localStorage.getItem('misincol_team_plans_team-pastos')).toBeNull();
    expect(localStorage.getItem('misincol_special_expenses_team-pastos')).toBeNull();
    expect(localStorage.getItem('misincol_general_info_team-pastos')).toBeNull();
    expect(localStorage.getItem('misincol_storage_version')).toBeDefined();
  });
});


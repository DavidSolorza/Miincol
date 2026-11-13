import { describe, it, expect } from 'vitest';
import { getRolePermissionConstraint, normalizeRolePermissions } from './security-constraints.helper';
import { DEFAULT_ROLE_PERMISSIONS_MATRIX } from '../application/securityDefaults';

describe('security-constraints.helper', () => {
  describe('Coordinador de Equipos (national_director)', () => {
    it('debe proteger privilegios raíz esenciales', () => {
      const rootSecurity = getRolePermissionConstraint('national_director', 'security.roles.manage', false);
      expect(rootSecurity.type).toBe('protected');
      expect(rootSecurity.effectiveValue).toBe(true);

      const audit = getRolePermissionConstraint('national_director', 'audit.history.view', false);
      expect(audit.type).toBe('protected');
      expect(audit.effectiveValue).toBe(true);

      const nationalReports = getRolePermissionConstraint('national_director', 'reports.national.view', false);
      expect(nationalReports.type).toBe('protected');
      expect(nationalReports.effectiveValue).toBe(true);
    });

    it('debe permitir configurar generalidades operativas', () => {
      const notes = getRolePermissionConstraint('national_director', 'notes.manage', true);
      expect(notes.type).toBe('configurable');
      expect(notes.effectiveValue).toBe(true);
    });
  });

  describe('Director General (director_general)', () => {
    it('debe restringir mutaciones de actividades, objetivos y seguridad', () => {
      const editAct = getRolePermissionConstraint('director_general', 'pdm.activities.edit', true);
      expect(editAct.type).toBe('restricted');
      expect(editAct.effectiveValue).toBe(false);

      const delAct = getRolePermissionConstraint('director_general', 'pdm.activities.delete', true);
      expect(delAct.type).toBe('restricted');
      expect(delAct.effectiveValue).toBe(false);

      const sec = getRolePermissionConstraint('director_general', 'security.roles.manage', true);
      expect(sec.type).toBe('restricted');
      expect(sec.effectiveValue).toBe(false);
    });

    it('debe mantener conmutables las generalidades de visualización y reportes', () => {
      const viewPdm = getRolePermissionConstraint('director_general', 'pdm.view', true);
      expect(viewPdm.type).toBe('configurable');
      expect(viewPdm.effectiveValue).toBe(true);
    });
  });

  describe('Usuario de Equipo (team_member)', () => {
    it('debe restringir administración de seguridad y directivas macro', () => {
      const sec = getRolePermissionConstraint('team_member', 'security.roles.manage', true);
      expect(sec.type).toBe('restricted');
      expect(sec.effectiveValue).toBe(false);

      const obj = getRolePermissionConstraint('team_member', 'pdm.objectives.manage', true);
      expect(obj.type).toBe('restricted');
      expect(obj.effectiveValue).toBe(false);
    });
  });

  describe('normalizeRolePermissions', () => {
    it('debe normalizar forzando valores protegidos en true y restringidos en false', () => {
      const modified = {
        ...DEFAULT_ROLE_PERMISSIONS_MATRIX,
        national_director: {
          ...DEFAULT_ROLE_PERMISSIONS_MATRIX.national_director,
          'security.roles.manage': false, // Intento de desactivar
        },
        director_general: {
          ...DEFAULT_ROLE_PERMISSIONS_MATRIX.director_general,
          'pdm.activities.edit': true, // Intento de activación no permitida
        },
      };

      const normalized = normalizeRolePermissions(modified);
      expect(normalized.national_director['security.roles.manage']).toBe(true);
      expect(normalized.director_general['pdm.activities.edit']).toBe(false);
    });
  });
});


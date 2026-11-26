import { describe, it, expect } from 'vitest';
import { TeamMemberInputRowComponent } from './team-member-input-row.component';
import type { TeamMemberAccount } from '../../domain/admin.types';

describe('TeamMemberInputRowComponent (Unit & Reactive Tests)', () => {
  it('debe emitir cambios al modificar el nombre o rol ministerial', () => {
    const component = new TeamMemberInputRowComponent();
    component.member = { fullName: 'Pedro', email: 'pedro@misincol.org' };
    component.index = 0;

    let emittedUpdate: { index: number; data: Partial<TeamMemberAccount> } | undefined;
    component.update.subscribe((val) => (emittedUpdate = val));

    component.onFieldChange('roleInTeam', 'Coordinador de Evangelismo');
    expect(emittedUpdate).toEqual({ index: 0, data: { roleInTeam: 'Coordinador de Evangelismo' } });
  });

  it('debe detectar y autocompletar si el correo ingresado coincide con un usuario existente', () => {
    const component = new TeamMemberInputRowComponent();
    component.member = { fullName: '', email: '' };
    component.index = 1;
    component.availableUsers = [
      { email: 'marta.perez@misincol.org', fullName: 'Marta Pérez' },
    ];

    let emittedUpdate: { index: number; data: Partial<TeamMemberAccount> } | undefined;
    component.update.subscribe((val) => (emittedUpdate = val));

    component.onEmailChange('marta.perez@misincol.org');
    expect(emittedUpdate).toEqual({
      index: 1,
      data: { email: 'marta.perez@misincol.org', fullName: 'Marta Pérez' },
    });
  });

  it('debe autocompletar al seleccionar un usuario del dropdown', () => {
    const component = new TeamMemberInputRowComponent();
    component.member = { fullName: '', email: '' };
    component.index = 0;
    component.availableUsers = [
      { email: 'carlos@misincol.org', fullName: 'Carlos Gómez' },
    ];

    let emittedUpdate: { index: number; data: Partial<TeamMemberAccount> } | undefined;
    component.update.subscribe((val) => (emittedUpdate = val));

    component.onDropdownSelect('carlos@misincol.org');
    expect(emittedUpdate).toEqual({
      index: 0,
      data: { email: 'carlos@misincol.org', fullName: 'Carlos Gómez' },
    });
  });

  it('debe resetear los campos al seleccionar crear nuevo si antes habia un existente', () => {
    const component = new TeamMemberInputRowComponent();
    component.member = { fullName: 'Carlos Gómez', email: 'carlos@misincol.org' };
    component.index = 0;
    component.availableUsers = [
      { email: 'carlos@misincol.org', fullName: 'Carlos Gómez' },
    ];

    let emittedUpdate: { index: number; data: Partial<TeamMemberAccount> } | undefined;
    component.update.subscribe((val) => (emittedUpdate = val));

    component.onDropdownSelect('__NEW__');
    expect(emittedUpdate).toEqual({
      index: 0,
      data: { fullName: '', email: '' },
    });
  });

  it('debe detectar correctamente si el usuario ya existe en base de datos', () => {
    const component = new TeamMemberInputRowComponent();
    component.member = { fullName: 'Marta', email: 'marta.perez@misincol.org' };
    component.index = 0;
    component.availableUsers = [
      { email: 'marta.perez@misincol.org', fullName: 'Marta Pérez' },
    ];

    expect(component.isExistingUser()).toBe(true);

    component.member.email = 'desconocido@misincol.org';
    expect(component.isExistingUser()).toBe(false);
  });
});

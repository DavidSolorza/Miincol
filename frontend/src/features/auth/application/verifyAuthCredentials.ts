import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';

export interface VerifyAuthParams {
  activeTab: 'admin' | 'team';
  identifier: string;
  password: string;
  allTeams: TeamSupervisionSummary[];
  onAdminSuccess: (teamContext?: TeamSupervisionSummary) => void;
  onDirectorGeneralSuccess?: () => void;
  onTeamSuccess: (team: TeamSupervisionSummary, isNationalAdmin?: boolean) => void;
  onMemberSuccess?: (team: TeamSupervisionSummary, memberName: string) => void;
  onError: (msg: string) => void;
  onDone: () => void;
}

const getStoredSysUsers = (): any[] => {
  try {
    const s = localStorage.getItem('misincol_system_users_v1');
    return s ? JSON.parse(s) : [];
  } catch { return []; }
};

export const verifyAuthCredentials = ({
  activeTab, identifier, password, allTeams, onAdminSuccess,
  onDirectorGeneralSuccess, onTeamSuccess, onMemberSuccess, onError, onDone,
}: VerifyAuthParams) => {
  const cleanUser = identifier.trim().toLowerCase();
  const cleanPass = password.trim();
  const isEmailInput = cleanUser.includes('@');
  const sysUsers = getStoredSysUsers();

  setTimeout(() => {
    onDone();
    if (isEmailInput && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(cleanUser)) {
      onError('El formato del correo electrónico no es válido (ej. usuario@misincol.org).');
      return;
    }

    const isPureAdminEmail = ['director@misincol.org', 'admin@misincol.org', 'director', 'admin'].includes(cleanUser);
    const isAdminPass = ['director2026', 'admin2026', 'misincol2026', '210910624Dj'].includes(cleanPass);

    if (isPureAdminEmail) {
      if (isAdminPass) { onAdminSuccess(); return; }
      onError('Contraseña incorrecta para la Dirección Nacional.');
      return;
    }

    if (cleanUser === 'directorgeneral' || cleanUser === 'director.general@misincol.org') {
      if (isAdminPass || cleanPass === 'dg2026') {
        if (onDirectorGeneralSuccess) onDirectorGeneralSuccess();
        else onAdminSuccess();
        return;
      }
      onError('Contraseña incorrecta para el Director General.');
      return;
    }

    if (['aida.secue@misincol.org', 'aida', 'aida.secue'].includes(cleanUser)) {
      const nasa = allTeams.find((t) => t.id === 'team-nasa' || t.slug === 'team-nasa') || allTeams[0];
      if (['nasa2026', 'aida2026'].includes(cleanPass)) {
        if (onMemberSuccess) onMemberSuccess(nasa, 'Aída Secue');
        else onTeamSuccess(nasa);
        return;
      }
      onError('Contraseña incorrecta para Aída Secue (PIN: nasa2026).');
      return;
    }

    const sysUser = sysUsers.find((u: any) =>
      u.email?.toLowerCase() === cleanUser || u.fullName?.toLowerCase() === cleanUser ||
      (cleanUser.includes('hugo') && u.fullName?.toLowerCase().includes('hugo'))
    );

    const matched = allTeams.find((t) =>
      (sysUser?.teamId && (t.id === sysUser.teamId || t.slug === sysUser.teamId)) ||
      t.leaderEmail?.toLowerCase() === cleanUser ||
      t.membersWithAccounts?.some((m) => m.email.toLowerCase() === cleanUser) ||
      t.slug?.toLowerCase() === cleanUser || t.id.toLowerCase() === cleanUser ||
      t.id.toLowerCase() === `team-${cleanUser}` || t.ethnicity.toLowerCase() === cleanUser ||
      t.name.toLowerCase().includes(cleanUser)
    );

    if (!matched) {
      onError(isEmailInput ? `El correo "${identifier}" no se encuentra registrado en la base de datos de Misincol.` : `No se encontró misión territorial con "${identifier}".`);
      return;
    }

    const isLeaderDualAdmin = sysUser?.role === 'national_director' || sysUser?.role === 'director_general' ||
      sysUsers.some((u: any) => (u.role === 'national_director' || u.role === 'director_general') && (
        (u.email && matched.leaderEmail && u.email.toLowerCase() === matched.leaderEmail.toLowerCase()) ||
        (u.fullName && matched.leader && u.fullName.toLowerCase() === matched.leader.toLowerCase()) ||
        (u.teamId && u.teamId === matched.id)
      ));

    const expectedPin = (matched.accessPin || `${(matched.slug || matched.id).replace(/^team-/, '')}2026`).toLowerCase();
    const isTeamPass = cleanPass.toLowerCase() === expectedPin || cleanPass.toLowerCase() === `${matched.id}2026`.toLowerCase();

    if (isLeaderDualAdmin && (isAdminPass || isTeamPass)) {
      if (isTeamPass) {
        onTeamSuccess(matched, false);
      } else {
        onAdminSuccess(matched);
      }
      return;
    }

    if (isTeamPass) {
      const member = matched.membersWithAccounts?.find((m) => m.email.toLowerCase() === cleanUser);
      if (member && onMemberSuccess) onMemberSuccess(matched, member.fullName);
      else onTeamSuccess(matched);
    } else {
      onError(`Contraseña incorrecta para ${matched.name}. Verifique la contraseña de su equipo.`);
    }
  }, 250);
};

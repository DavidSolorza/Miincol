import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';

export interface VerifyAuthParams {
  activeTab: 'admin' | 'team';
  identifier: string;
  password: string;
  allTeams: TeamSupervisionSummary[];
  onAdminSuccess: () => void;
  onDirectorGeneralSuccess?: () => void;
  onTeamSuccess: (team: TeamSupervisionSummary) => void;
  onMemberSuccess?: (team: TeamSupervisionSummary, memberName: string) => void;
  onError: (msg: string) => void;
  onDone: () => void;
}

export const verifyAuthCredentials = ({
  activeTab,
  identifier,
  password,
  allTeams,
  onAdminSuccess,
  onDirectorGeneralSuccess,
  onTeamSuccess,
  onMemberSuccess,
  onError,
  onDone,
}: VerifyAuthParams) => {
  const cleanUser = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  setTimeout(() => {
    onDone();

    if (cleanUser === 'director' || cleanUser === 'directorgeneral' || cleanUser === 'director.general') {
      if (cleanPass === 'director2026' || cleanPass === 'dg2026') {
        if (onDirectorGeneralSuccess) onDirectorGeneralSuccess();
        else onAdminSuccess();
      } else {
        onError('Contraseña de Director General incorrecta.');
      }
      return;
    }

    if (activeTab === 'admin' || cleanUser === 'admin') {
      if (cleanPass === '210910624Dj' || cleanPass === 'admin2026') {
        onAdminSuccess();
      } else {
        onError('Contraseña de Administrador incorrecta. Revise sus credenciales.');
      }
      return;
    }

    if (cleanUser === 'aida' || cleanUser === 'aida.secue') {
      const nasa = allTeams.find((t) => t.id === 'team-nasa' || t.slug === 'team-nasa') || allTeams[0];
      if (cleanPass === 'aida2026' || cleanPass === 'nasa2026') {
        if (onMemberSuccess) onMemberSuccess(nasa, 'Aída Secue');
        else onTeamSuccess(nasa);
      } else {
        onError('Contraseña incorrecta para usuario Aída Secue.');
      }
      return;
    }

    const matched = allTeams.find(
      (t) =>
        t.slug?.toLowerCase() === cleanUser ||
        t.id.toLowerCase() === cleanUser ||
        t.id.toLowerCase() === `team-${cleanUser}` ||
        t.ethnicity.toLowerCase() === cleanUser ||
        t.name.toLowerCase().includes(cleanUser)
    );

    if (!matched) {
      onError(`No se encontró ninguna misión territorial con "${identifier}".`);
      return;
    }

    const expected = matched.accessPin || `${(matched.slug || matched.id).replace(/^team-/, '')}2026`;
    if (cleanPass === expected) {
      onTeamSuccess(matched);
    } else {
      onError(`Contraseña incorrecta para ${matched.name}. Verifique el PIN asignado.`);
    }
  }, 250);
};

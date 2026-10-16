import React from 'react';
import type { PhasePlan } from '../../modules/plans/domain/plan.types';
import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';
import { ReportModal } from '../../modules/reports/ui/ReportModal';
import { TeamNotesModal } from '../../modules/notes/ui/TeamNotesModal';
import { TeamSelector } from '../../modules/auth/ui/TeamSelector';
import { useToast } from '../../shared/components/Toast';

interface Props {
  isReportModalOpen: boolean;
  onCloseReportModal: () => void;
  isNotesModalOpen: boolean;
  onCloseNotesModal: () => void;
  activeTeam: MissionaryTeam;
  plan: PhasePlan;
  isSuperAdmin: boolean;
  isTeamModalOpen: boolean;
  onCloseTeamModal: () => void;
  mappedTeams: MissionaryTeam[];
  activeTeamId: string;
  onSelectTeam: (id: string) => void;
}

export const AppGlobalModals: React.FC<Props> = ({
  isReportModalOpen,
  onCloseReportModal,
  isNotesModalOpen,
  onCloseNotesModal,
  activeTeam,
  plan,
  isSuperAdmin,
  isTeamModalOpen,
  onCloseTeamModal,
  mappedTeams,
  activeTeamId,
  onSelectTeam,
}) => {
  const { toast } = useToast();

  return (
    <>
      <ReportModal isOpen={isReportModalOpen} onClose={onCloseReportModal} plan={plan} />
      <TeamNotesModal isOpen={isNotesModalOpen} onClose={onCloseNotesModal} activeTeam={activeTeam} />

      {isSuperAdmin && (
        <TeamSelector
          isOpen={isTeamModalOpen}
          onClose={onCloseTeamModal}
          teams={mappedTeams}
          activeTeamId={activeTeamId}
          onSelectTeam={(selectedId) => {
            onSelectTeam(selectedId);
            const chosen = mappedTeams.find((t) => t.id === selectedId);
            if (chosen) toast.info(`Misión seleccionada: ${chosen.name}`, 'Equipo Activo');
          }}
        />
      )}
    </>
  );
};

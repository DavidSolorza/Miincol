import React, { useState, useEffect } from 'react';
import { useAdminDashboard } from '../application/useAdminDashboard';
import { TeamModal } from './TeamModal';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { useToast } from '../../../shared/components/Toast';
import { SuperAdminKpisGrid } from './superAdmin/SuperAdminKpisGrid';
import { SuperAdminFilters } from './superAdmin/SuperAdminFilters';
import { SuperAdminTeamsGrid } from './superAdmin/SuperAdminTeamsGrid';
import { ColombiaMapCard } from './map/ColombiaMapCard';

interface SuperAdminViewProps {
  onInspectTeam: (teamId: string) => void;
  onOpenReportModal?: () => void;
  dashboardHook?: ReturnType<typeof useAdminDashboard>;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  onInspectTeam, dashboardHook,
}) => {
  const { toast } = useToast();
  const {
    teams, nationalKpis, searchTerm, setSearchTerm,
    handleCreateTeam, handleUpdateTeam, handleDeleteTeam, handlePhaseChange,
  } = dashboardHook || useAdminDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamSupervisionSummary | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const openCreateModal = () => { setEditingTeam(null); setIsModalOpen(true); };
  const openEditModal = (t: TeamSupervisionSummary) => { setEditingTeam(t); setIsModalOpen(true); };

  useEffect(() => {
    const handleOpen = () => openCreateModal();
    window.addEventListener('misincol:open-create-team', handleOpen);
    return () => window.removeEventListener('misincol:open-create-team', handleOpen);
  }, []);

  const handleModalSubmit = async (dto: CreateTeamDto) => {
    if (editingTeam) {
      handleUpdateTeam(editingTeam.id, dto);
      toast.success(`Misión "${dto.name}" actualizada`, 'Supervisión');
    } else {
      handleCreateTeam(dto);
      toast.success(`Misión "${dto.name}" creada`, 'Nueva Misión');
    }
  };

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col space-y-2.5 pt-0.5">
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row items-stretch gap-4 xl:gap-5">
        <div className="w-full lg:w-1/2 flex flex-col space-y-2.5 h-full min-h-0">
          <SuperAdminKpisGrid kpis={nationalKpis} />
          <SuperAdminFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-1 custom-scrollbar">
            <SuperAdminTeamsGrid
              teams={teams} selectedTeamId={selectedTeamId} onSelectTeamId={setSelectedTeamId}
              onInspectTeam={onInspectTeam} onEditTeam={openEditModal}
              onDeleteTeam={handleDeleteTeam} onPhaseChange={handlePhaseChange}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col h-full min-h-0">
          <ColombiaMapCard
            teams={teams} selectedTeamId={selectedTeamId}
            onSelectTeamId={setSelectedTeamId} onInspectTeam={onInspectTeam}
          />
        </div>
      </div>

      <TeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingTeam} />
    </div>
  );
};

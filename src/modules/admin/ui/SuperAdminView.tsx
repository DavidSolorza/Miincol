import React, { useState } from 'react';
import { useAdminDashboard } from '../application/useAdminDashboard';
import { TeamOverviewCard } from './TeamOverviewCard';
import { TeamModal } from './TeamModal';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { useToast } from '../../../shared/components/Toast';
import { SuperAdminHeader } from './superAdmin/SuperAdminHeader';
import { SuperAdminKpisGrid } from './superAdmin/SuperAdminKpisGrid';
import { SuperAdminFilters } from './superAdmin/SuperAdminFilters';

interface SuperAdminViewProps {
  onInspectTeam: (teamId: string) => void;
  onOpenReportModal?: () => void;
  dashboardHook?: ReturnType<typeof useAdminDashboard>;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  onInspectTeam,
  onOpenReportModal,
  dashboardHook,
}) => {
  const defaultHook = useAdminDashboard();
  const { toast } = useToast();
  const {
    teams, nationalKpis, searchTerm, setSearchTerm, phaseFilter, setPhaseFilter,
    statusFilter, setStatusFilter, departmentFilter, setDepartmentFilter,
    handleCreateTeam, handleUpdateTeam, handleDeleteTeam, handlePhaseChange,
  } = dashboardHook || defaultHook;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamSupervisionSummary | null>(null);

  const openCreateModal = () => { setEditingTeam(null); setIsModalOpen(true); };
  const openEditModal = (t: TeamSupervisionSummary) => { setEditingTeam(t); setIsModalOpen(true); };

  const handleModalSubmit = async (dto: CreateTeamDto) => {
    if (editingTeam) {
      handleUpdateTeam(editingTeam.id, dto);
      toast.success(`Misión "${dto.name}" actualizada con éxito`, 'Supervisión Nacional');
    } else {
      handleCreateTeam(dto);
      toast.success(`Misión "${dto.name}" aprovisionada con éxito`, 'Nueva Misión');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm(''); setPhaseFilter('ALL'); setStatusFilter('ALL'); setDepartmentFilter('ALL');
  };

  const hasActiveFilters = Boolean(searchTerm || phaseFilter !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL');

  return (
    <div className="space-y-4 sm:space-y-5">
      <SuperAdminHeader onOpenCreate={openCreateModal} onOpenReport={onOpenReportModal} />
      <SuperAdminKpisGrid kpis={nationalKpis} />
      <SuperAdminFilters
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        phaseFilter={phaseFilter} setPhaseFilter={setPhaseFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        onReset={handleResetFilters} hasActiveFilters={hasActiveFilters}
        totalResults={teams.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
        {teams.map((team) => (
          <TeamOverviewCard
            key={team.id}
            team={team}
            onInspectTeam={onInspectTeam}
            onEditTeam={openEditModal}
            onDeleteTeam={handleDeleteTeam}
            onPhaseChange={handlePhaseChange}
          />
        ))}
      </div>

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTeam}
      />
    </div>
  );
};

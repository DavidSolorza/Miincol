import React, { useState } from 'react';
import { useAdminDashboard } from '../application/useAdminDashboard';
import { TeamModal } from './TeamModal';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { useToast } from '../../../shared/components/Toast';
import { SuperAdminHeader } from './superAdmin/SuperAdminHeader';
import { SuperAdminKpisGrid } from './superAdmin/SuperAdminKpisGrid';
import { SuperAdminFilters } from './superAdmin/SuperAdminFilters';
import { SuperAdminTeamsGrid } from './superAdmin/SuperAdminTeamsGrid';
import { ColombiaMapCard } from './map/ColombiaMapCard';
import { AdminSlimNav } from './nav/AdminSlimNav';

interface SuperAdminViewProps {
  onInspectTeam: (teamId: string) => void;
  onOpenReportModal?: () => void;
  dashboardHook?: ReturnType<typeof useAdminDashboard>;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  onInspectTeam, onOpenReportModal, dashboardHook,
}) => {
  const { toast } = useToast();
  const {
    teams, nationalKpis, searchTerm, setSearchTerm, phaseFilter, setPhaseFilter,
    statusFilter, setStatusFilter, departmentFilter, setDepartmentFilter,
    handleCreateTeam, handleUpdateTeam, handleDeleteTeam, handlePhaseChange,
  } = dashboardHook || useAdminDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamSupervisionSummary | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  const openCreateModal = () => { setEditingTeam(null); setIsModalOpen(true); };
  const openEditModal = (t: TeamSupervisionSummary) => { setEditingTeam(t); setIsModalOpen(true); };

  const handleModalSubmit = async (dto: CreateTeamDto) => {
    if (editingTeam) {
      handleUpdateTeam(editingTeam.id, dto);
      toast.success(`Misión "${dto.name}" actualizada`, 'Supervisión Nacional');
    } else {
      handleCreateTeam(dto);
      toast.success(`Misión "${dto.name}" creada`, 'Nueva Misión');
    }
  };

  const handleResetFilters = () => { setSearchTerm(''); setPhaseFilter('ALL'); setStatusFilter('ALL'); setDepartmentFilter('ALL'); };
  const hasActiveFilters = Boolean(searchTerm || phaseFilter !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL');

  return (
    <div className="flex items-start gap-3 sm:gap-4 xl:gap-5">
      <AdminSlimNav
        activeSection={activeSection}
        onSelectSection={(sec) => { setActiveSection(sec); if (sec === 'teams' && teams[0]) onInspectTeam(teams[0].id); }}
        onOpenReport={onOpenReportModal}
      />

      <div className="flex-1 min-w-0 space-y-4 sm:space-y-5">
        <SuperAdminHeader onOpenCreate={openCreateModal} onOpenReport={onOpenReportModal} />
        <SuperAdminKpisGrid kpis={nationalKpis} />
        <SuperAdminFilters
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          phaseFilter={phaseFilter} setPhaseFilter={setPhaseFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onReset={handleResetFilters} hasActiveFilters={hasActiveFilters}
          totalResults={teams.length}
        />

        <div className="flex flex-col lg:flex-row items-start gap-4 xl:gap-5">
          <SuperAdminTeamsGrid
            teams={teams} selectedTeamId={selectedTeamId} onSelectTeamId={setSelectedTeamId}
            onInspectTeam={onInspectTeam} onEditTeam={openEditModal}
            onDeleteTeam={handleDeleteTeam} onPhaseChange={handlePhaseChange}
          />

          <div className="w-full lg:w-[44%] xl:w-[42%] lg:sticky lg:top-4 self-stretch lg:self-start">
            <ColombiaMapCard
              teams={teams} selectedTeamId={selectedTeamId}
              onSelectTeamId={setSelectedTeamId} onInspectTeam={onInspectTeam}
            />
          </div>
        </div>
      </div>

      <TeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingTeam} />
    </div>
  );
};

import React, { useState } from 'react';
import { useAdminDashboard } from '../application/useAdminDashboard';
import { TeamModal } from './TeamModal';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { useToast } from '../../../shared/components/Toast';
import { SuperAdminKpisGrid } from './superAdmin/SuperAdminKpisGrid';
import { SuperAdminFilters } from './superAdmin/SuperAdminFilters';
import { SuperAdminTeamsGrid } from './superAdmin/SuperAdminTeamsGrid';
import { ColombiaMapCard } from './map/ColombiaMapCard';
import { Plus, FileDown } from 'lucide-react';

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
    teams, nationalKpis, searchTerm, setSearchTerm,
    handleCreateTeam, handleUpdateTeam, handleDeleteTeam, handlePhaseChange,
  } = dashboardHook || useAdminDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamSupervisionSummary | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const openCreateModal = () => { setEditingTeam(null); setIsModalOpen(true); };
  const openEditModal = (t: TeamSupervisionSummary) => { setEditingTeam(t); setIsModalOpen(true); };

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
    <div className="w-full space-y-3 pt-0.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-2.5 py-1 rounded-lg font-['Outfit']">
            Dirección Nacional Misincol
          </span>
          <span className="text-xs text-stone-400 font-medium hidden sm:inline">• Supervisión Estratégica PDM</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenReportModal && (
            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-[#E67324]" />
              <span className="hidden sm:inline">Informe Consolidado</span>
            </button>
          )}
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8B251E] hover:bg-[#731E18] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nueva Misión</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4 xl:gap-5 lg:h-[calc(100vh-175px)] lg:min-h-[600px]">
        <div className="w-full lg:w-1/2 flex flex-col space-y-3 h-full">
          <SuperAdminKpisGrid kpis={nationalKpis} />
          <SuperAdminFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-2 custom-scrollbar">
            <SuperAdminTeamsGrid
              teams={teams} selectedTeamId={selectedTeamId} onSelectTeamId={setSelectedTeamId}
              onInspectTeam={onInspectTeam} onEditTeam={openEditModal}
              onDeleteTeam={handleDeleteTeam} onPhaseChange={handlePhaseChange}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col h-full">
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

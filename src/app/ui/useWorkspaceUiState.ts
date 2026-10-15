import { useState } from 'react';
import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';

export const useWorkspaceUiState = (activeTeam: MissionaryTeam) => {
  const [activeObjectiveNumber, setActiveObjectiveNumber] = useState(1);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const cleanPhone = (activeTeam.leaderPhone || '').replace(/[^\d]/g, '');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hola ${activeTeam.leader}, te contacto de la Dirección Nacional de Misincol.`
      )}`
    : null;

  return {
    activeObjectiveNumber,
    setActiveObjectiveNumber,
    isReportModalOpen,
    setIsReportModalOpen,
    isTeamModalOpen,
    setIsTeamModalOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    whatsappUrl,
  };
};

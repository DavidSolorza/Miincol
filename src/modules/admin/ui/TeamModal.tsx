import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { useToast } from '../../../shared/components/Toast';
import { TeamGeneralFields } from './teamModal/TeamGeneralFields';
import { TeamLeaderFields } from './teamModal/TeamLeaderFields';
import { TeamSettingsFields } from './teamModal/TeamSettingsFields';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamData: CreateTeamDto) => Promise<void> | void;
  initialData?: TeamSupervisionSummary | null;
}

const defaultForm: CreateTeamDto = {
  name: '', ethnicity: '', region: '', department: '', leader: '', leaderPhone: '+57 ',
  members: [], currentPhaseId: 'investigacion', totalBudget: 15000000, themeColor: '#8B251E',
  healthStatus: 'Optimo', slug: '', accessPin: '', criticalAlertMessage: '', criticalAlertType: 'Logística',
};

export const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateTeamDto>(defaultForm);
  const [membersInput, setMembersInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '', ethnicity: initialData.ethnicity || '', region: initialData.region || '',
        department: initialData.department || '', leader: initialData.leader || '', leaderPhone: initialData.leaderPhone || '+57 ',
        members: initialData.members || [], currentPhaseId: initialData.currentPhaseId || 'investigacion',
        totalBudget: initialData.totalBudget || 15000000, themeColor: initialData.themeColor || '#8B251E',
        healthStatus: initialData.healthStatus || 'Optimo', slug: initialData.slug || initialData.id || '',
        accessPin: initialData.accessPin || '', criticalAlertMessage: initialData.criticalAlert?.message || '',
        criticalAlertType: initialData.criticalAlert?.type || 'Logística',
      });
      setMembersInput(initialData.members?.length ? initialData.members.join(', ') : `${initialData.leader}, 2 obreros locales`);
    } else {
      setFormData(defaultForm);
      setMembersInput('');
    }
  }, [initialData, isOpen]);

  const handleChange = (updates: Partial<CreateTeamDto>) => setFormData((prev) => ({ ...prev, ...updates }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
      toast.success(initialData ? 'Misión actualizada correctamente' : 'Nueva misión registrada exitosamente');
      onClose();
    } catch {
      toast.error('Error al guardar la misión territorial');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Editar Misión: ${initialData.name}` : 'Registrar Nueva Misión Territorial'}
      subtitle={
        initialData
          ? 'Actualice la información territorial, liderazgo pastoral y configuración de acceso'
          : 'Complete el formulario para desplegar una nueva misión indígena en el territorio nacional'
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1 py-1 custom-scrollbar">
        <TeamGeneralFields formData={formData} onChange={handleChange} />
        <TeamLeaderFields formData={formData} membersInput={membersInput} setMembersInput={setMembersInput} onChange={handleChange} />
        <TeamSettingsFields formData={formData} showPassword={showPassword} setShowPassword={setShowPassword} onChange={handleChange} />

        <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 border border-stone-200/80 transition cursor-pointer">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B251E] to-[#E67324] hover:from-[#751E18] hover:to-[#D05E12] text-white shadow-xs hover:shadow-md hover:shadow-[#8B251E]/20 transition cursor-pointer disabled:opacity-50 font-['Outfit']"
          >
            {saving ? 'Guardando...' : initialData ? 'Guardar Cambios' : 'Crear Misión'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

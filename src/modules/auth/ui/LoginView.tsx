import React from 'react';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { AlertCircle } from 'lucide-react';
import { useLoginForm } from '../application/useLoginForm';
import { LoginHeroCard } from './login/LoginHeroCard';
import { LoginCardHeader } from './login/LoginCardHeader';
import { LoginRoleTabs } from './login/LoginRoleTabs';
import { LoginFormFields } from './login/LoginFormFields';
import { LoginQuickAccessChips } from './login/LoginQuickAccessChips';
import { LoginSupportFooter } from './login/LoginSupportFooter';

interface LoginViewProps {
  onAdminSuccess: () => void;
  onTeamSuccess: (team: TeamSupervisionSummary) => void;
  allTeams: TeamSupervisionSummary[];
}

export const LoginView: React.FC<LoginViewProps> = ({ onAdminSuccess, onTeamSuccess, allTeams }) => {
  const form = useLoginForm({ allTeams, onAdminSuccess, onTeamSuccess });

  const handleSelectTab = (tab: 'admin' | 'team') => {
    form.setActiveTab(tab);
    if (tab === 'team') {
      const t = allTeams[0];
      const tSlug = t ? t.slug || t.id : 'team-wayuu';
      form.setIdentifier(tSlug);
      form.setPassword(t?.accessPin || 'wayuu2026');
      form.setSelectedQuickChip(tSlug.replace(/^team-/, '').toLowerCase());
    } else {
      form.setIdentifier('admin');
      form.setPassword('210910624Dj');
      form.setSelectedQuickChip('admin');
    }
  };

  const handleTeamSelect = (val: string) => {
    form.setIdentifier(val);
    form.setSelectedQuickChip(val.replace(/^team-/, '').toLowerCase());
    const sel = allTeams.find((t) => t.slug === val || t.id === val);
    if (sel) form.setPassword(sel.accessPin || `${(sel.slug || sel.id).replace(/^team-/, '')}2026`);
  };

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#F6F4EF] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden selection:bg-[#E67324]/20 selection:text-[#8B251E]">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#8B251E]/10 rounded-full blur-[100px] pointer-events-none gpu-layer transform-gpu" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#E67324]/12 rounded-full blur-[100px] pointer-events-none gpu-layer transform-gpu" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none gpu-layer transform-gpu" />

      <div
        className="w-full max-w-4xl lg:max-w-5xl bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-stone-200/80 p-2.5 sm:p-3.5 lg:p-4.5 flex flex-col md:flex-row gap-4 lg:gap-6 items-stretch relative z-10"
        style={{ zoom: 0.8 }}
      >
        <LoginHeroCard />

        <div className="flex-1 p-2 sm:p-3.5 lg:p-5 flex flex-col justify-between">
          <div className="space-y-3 sm:space-y-3.5">
            <LoginCardHeader />
            <LoginRoleTabs activeTab={form.activeTab} onSelectTab={handleSelectTab} />

            {form.error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="flex-1">{form.error}</span>
              </div>
            )}

            <LoginFormFields
              activeTab={form.activeTab}
              identifier={form.identifier} setIdentifier={form.setIdentifier}
              password={form.password} setPassword={form.setPassword}
              showPassword={form.showPassword} setShowPassword={setShowPassword => form.setShowPassword(setShowPassword)}
              loading={form.loading} allTeams={allTeams}
              onTeamSelect={handleTeamSelect} onSubmit={form.handleSubmit}
            />

            <LoginQuickAccessChips
              selectedQuickChip={form.selectedQuickChip}
              onFillCredentials={form.fillCredentials}
            />
          </div>

          <LoginSupportFooter />
        </div>
      </div>
    </div>
  );
};

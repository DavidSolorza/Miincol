import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

interface Props {
  activeTab: 'admin' | 'team';
  onSelectTab: (tab: 'admin' | 'team') => void;
}

export const LoginRoleTabs: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="grid grid-cols-2 p-1.5 bg-stone-100 rounded-2xl gap-1.5">
      <button
        type="button"
        onClick={() => onSelectTab('team')}
        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
          activeTab === 'team'
            ? 'bg-white text-stone-900 shadow-sm'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Compass className="w-4 h-4 text-[#E67324]" />
        <span>Misión en Campo</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('admin')}
        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
          activeTab === 'admin'
            ? 'bg-stone-900 text-white shadow-sm'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <ShieldCheck className="w-4 h-4 text-amber-400" />
        <span>Super Admin</span>
      </button>
    </div>
  );
};

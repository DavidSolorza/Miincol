import React from 'react';
import { LayoutDashboard, Map, Calendar, NotebookPen, Users, Settings } from 'lucide-react';

interface Props {
  activeSection: string;
  onSelectSection: (section: string) => void;
  onOpenReport?: () => void;
}

export const AdminSlimNav: React.FC<Props> = ({ activeSection, onSelectSection, onOpenReport }) => {
  const navItems = [
    { id: 'dashboard', label: 'Tablero Principal', icon: LayoutDashboard },
    { id: 'map', label: 'Cartografía Nacional', icon: Map },
    { id: 'agenda', label: 'Agenda & Eventos', icon: Calendar },
    { id: 'reports', label: 'Informes Ejecutivos', icon: NotebookPen, action: onOpenReport },
    { id: 'teams', label: 'Equipos Territoriales', icon: Users },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <nav className="hidden lg:flex flex-col items-center justify-between py-5 px-2 bg-[#121214] text-stone-300 w-16 xl:w-18 rounded-3xl shadow-xl border border-stone-800 shrink-0 sticky top-5 h-[calc(100vh-2.5rem)] select-none z-30">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B251E] to-[#E67324] flex items-center justify-center text-white shadow-md shadow-[#E67324]/20 cursor-pointer">
          <span className="font-extrabold text-sm tracking-tighter font-['Outfit']">M</span>
        </div>

        <div className="flex flex-col items-center gap-2.5 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.action) item.action();
                  else onSelectSection(item.id);
                }}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 relative group cursor-pointer ${
                  isActive
                    ? 'bg-stone-800 text-white shadow-inner shadow-black/40'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
                title={item.label}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#E67324] rounded-r-full" />
                )}
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="absolute left-14 bg-stone-900 text-white text-[11px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border border-stone-700/80 p-0.5 flex items-center justify-center" title="MISINCOL Colombia">
          <span className="text-[9px] font-black tracking-widest text-[#E67324] font-['Outfit']">CO</span>
        </div>
      </div>
    </nav>
  );
};

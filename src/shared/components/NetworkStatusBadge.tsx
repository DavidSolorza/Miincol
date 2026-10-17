import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useNetworkBus } from '../../core/bus/useNetworkBus';

export const NetworkStatusBadge: React.FC = () => {
  const { isOnline, effectiveType } = useNetworkBus();

  if (isOnline) {
    return (
      <div
        className="hidden md:flex items-center gap-1.5 px-2 py-0.8 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold text-emerald-700 shadow-2xs"
        title={effectiveType ? `Conexión: ${effectiveType.toUpperCase()}` : 'Conexión activa'}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden lg:inline">En línea</span>
        <Wifi className="w-3 h-3 text-emerald-600" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-black text-amber-800 shadow-xs animate-pulse"
      title="Modo sin conexión: los cambios se sincronizan en el almacenamiento local seguro"
    >
      <WifiOff className="w-3 h-3 text-amber-600" />
      <span>Modo Local</span>
    </div>
  );
};

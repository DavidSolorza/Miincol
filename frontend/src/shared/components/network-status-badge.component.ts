import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NetworkBusService } from '../../core/bus/network-bus.service';
import { AppIconComponent } from './icon/app-icon.component';

// Indicador visual de conectividad en la barra superior (En línea / Modo Local Offline)
@Component({
  selector: 'app-network-status-badge',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (network.isOnline()) {
      <div
        class="hidden md:flex items-center gap-1.5 px-2 py-0.8 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold text-emerald-700 shadow-2xs"
        [title]="network.effectiveType() ? 'Conexión: ' + network.effectiveType()!.toUpperCase() : 'Conexión activa'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="hidden lg:inline">En línea</span>
        <app-icon name="wifi" className="w-3 h-3 text-emerald-600" />
      </div>
    } @else {
      <div
        class="flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-black text-amber-800 shadow-xs animate-pulse"
        title="Modo sin conexión: los cambios se sincronizan en el almacenamiento local seguro"
      >
        <app-icon name="wifi-off" className="w-3 h-3 text-amber-600" />
        <span>Modo Local</span>
      </div>
    }
  `,
})
export class NetworkStatusBadgeComponent {
  // Servicio de monitoreo de estado de red
  readonly network = inject(NetworkBusService);
}


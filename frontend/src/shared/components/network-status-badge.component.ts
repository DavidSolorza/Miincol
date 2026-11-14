import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NetworkBusService } from '../../core/bus/network-bus.service';
import { OutboxQueueService } from '../../core/offline/application/outbox-queue.service';
import { SyncCoordinatorService } from '../../core/offline/application/sync-coordinator.service';
import { AppIconComponent } from './icon/app-icon.component';

@Component({
  selector: 'app-network-status-badge',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sync.isSyncing()) {
      <div class="flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-sky-50 border border-sky-300 text-[10px] font-bold text-sky-800 shadow-2xs">
        <div class="w-2.5 h-2.5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <span class="hidden sm:inline">Sincronizando...</span>
      </div>
    } @else if (!network.isOnline()) {
      <div
        class="flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-black text-amber-800 shadow-xs animate-pulse"
        title="Modo sin conexión: las mutaciones se guardan en la cola local de IndexedDB"
      >
        <app-icon name="wifi-off" className="w-3 h-3 text-amber-600" />
        <span>Sin Conexión @if (outbox.pendingCount() > 0) { ({{ outbox.pendingCount() }}) }</span>
      </div>
    } @else if (outbox.pendingCount() > 0) {
      <button
        type="button"
        (click)="sync.syncNow()"
        class="flex items-center gap-1.5 px-2.5 py-0.8 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-bold text-amber-800 shadow-xs hover:bg-amber-100 transition cursor-pointer"
        title="Cambios locales pendientes. Clic para sincronizar con el servidor"
      >
        <app-icon name="cloud-upload" className="w-3 h-3 text-amber-600 animate-pulse" />
        <span>{{ outbox.pendingCount() }} pendiente(s)</span>
      </button>
    } @else {
      <div
        class="hidden md:flex items-center gap-1.5 px-2 py-0.8 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold text-emerald-700 shadow-2xs"
        [title]="network.effectiveType() ? 'Conexión: ' + network.effectiveType()!.toUpperCase() : 'Conexión activa'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="hidden lg:inline">En línea</span>
        <app-icon name="wifi" className="w-3 h-3 text-emerald-600" />
      </div>
    }
  `,
})
export class NetworkStatusBadgeComponent {
  readonly network = inject(NetworkBusService);
  readonly outbox = inject(OutboxQueueService);
  readonly sync = inject(SyncCoordinatorService);
}

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SyncCoordinatorService } from '../application/sync-coordinator.service';
import { NetworkStatusService } from '../application/network-status.service';
import { OutboxQueueService } from '../application/outbox-queue.service';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-sync-status-badge',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-['Outfit'] select-none transition-all shadow-2xs border"
      [class]="badgeClass()"
    >
      @if (sync.isSyncing()) {
        <div class="w-2.5 h-2.5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Sincronizando...</span>
      } @else if (!network.isOnline()) {
        <app-icon name="wifi-off" className="w-3 h-3 text-amber-600" />
        <span>Sin Conexión @if (outbox.pendingCount() > 0) { ({{ outbox.pendingCount() }}) }</span>
      } @else if (outbox.pendingCount() > 0) {
        <button
          type="button"
          (click)="sync.syncNow()"
          class="flex items-center gap-1 cursor-pointer hover:underline"
          title="Click para sincronizar ahora con el servidor"
        >
          <app-icon name="cloud-upload" className="w-3 h-3 text-amber-600 animate-pulse" />
          <span>{{ outbox.pendingCount() }} pendiente(s)</span>
        </button>
      } @else {
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span class="text-stone-600">En línea</span>
      }
    </div>
  `,
})
export class SyncStatusBadgeComponent {
  readonly sync = inject(SyncCoordinatorService);
  readonly network = inject(NetworkStatusService);
  readonly outbox = inject(OutboxQueueService);

  badgeClass(): string {
    if (this.sync.isSyncing()) {
      return 'bg-sky-50 text-sky-800 border-sky-200';
    }
    if (!this.network.isOnline()) {
      return 'bg-amber-50 text-amber-800 border-amber-300';
    }
    if (this.outbox.pendingCount() > 0) {
      return 'bg-amber-50 text-amber-800 border-amber-300';
    }
    return 'bg-stone-50 text-stone-600 border-stone-200';
  }
}


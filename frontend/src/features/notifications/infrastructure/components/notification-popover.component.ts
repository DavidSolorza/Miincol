import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import type { InAppNotification } from '../../domain/notification.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { NotificationItemComponent } from './notification-item.component';

@Component({
  selector: 'app-notification-popover',
  standalone: true,
  imports: [AppIconComponent, NotificationItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed sm:absolute top-16 right-2 sm:right-0 w-[calc(100vw-1rem)] sm:w-88 sm:max-w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] z-50 overflow-hidden font-['Outfit'] animate-fadeIn select-none"
    >
      <div class="p-3.5 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-stone-900 text-[#E67324] flex items-center justify-center font-bold">
            <app-icon name="bell" className="w-3.5 h-3.5" />
          </div>
          <span class="text-xs font-black text-stone-900">Notificaciones</span>
          @if (unreadCount() > 0) {
            <span class="px-1.5 py-0.2 rounded-full bg-[#8B251E] text-white text-[9.5px] font-black">
              {{ unreadCount() }} nuevas
            </span>
          }
        </div>

        @if (unreadCount() > 0) {
          <button
            type="button"
            (click)="markAllAsRead.emit()"
            class="text-[10.5px] font-bold text-[#8B251E] hover:text-[#721F19] transition cursor-pointer"
            title="Marcar todas como leídas"
          >
            Leídas todas
          </button>
        }
      </div>

      <div class="max-h-80 overflow-y-auto p-2.5 space-y-2">
        @if (notifications().length === 0) {
          <div class="py-8 text-center text-stone-400 text-xs">
            <app-icon name="bell" className="w-6 h-6 mx-auto mb-1 text-stone-300" />
            <p>No tienes notificaciones pendientes.</p>
          </div>
        } @else {
          @for (notif of notifications(); track notif.id) {
            <app-notification-item
              [notification]="notif"
              (clicked)="markItemAsRead.emit($event)"
            />
          }
        }
      </div>

      <div class="p-2 bg-stone-50/50 border-t border-stone-100 text-center">
        <button
          type="button"
          (click)="close.emit()"
          class="text-[10.5px] font-bold text-stone-500 hover:text-stone-800 transition cursor-pointer"
        >
          Cerrar panel
        </button>
      </div>
    </div>
  `,
})
export class NotificationPopoverComponent {
  readonly notifications = input.required<InAppNotification[]>();
  readonly unreadCount = input.required<number>();
  readonly markItemAsRead = output<string>();
  readonly markAllAsRead = output<void>();
  readonly close = output<void>();
}


import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotificationsService } from '../../application/notifications.service';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { NotificationPopoverComponent } from './notification-popover.component';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [AppIconComponent, NotificationPopoverComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <button
        type="button"
        (click)="service.togglePopover()"
        class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer font-['Outfit']"
        title="Centro de Notificaciones y Alertas"
      >
        <app-icon name="bell" className="w-4 h-4 text-stone-700" />
        @if (service.unreadCount() > 0) {
          <span
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B251E] text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-bounce"
          >
            {{ service.unreadCount() > 9 ? '9+' : service.unreadCount() }}
          </span>
        }
      </button>

      @if (service.isOpen()) {
        <app-notification-popover
          [notifications]="service.notifications()"
          [unreadCount]="service.unreadCount()"
          (markItemAsRead)="service.markAsRead($event)"
          (markAllAsRead)="service.markAllAsRead()"
          (close)="service.closePopover()"
        />
      }
    </div>
  `,
})
export class NotificationBellComponent {
  readonly service = inject(NotificationsService);
}


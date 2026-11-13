import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import type { InAppNotification } from '../../domain/notification.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      (click)="clicked.emit(notification().id)"
      class="p-3 rounded-xl transition cursor-pointer select-none text-left border"
      [class]="notification().isRead
        ? 'bg-white hover:bg-stone-50 border-stone-100 opacity-75'
        : 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-200/60 shadow-2xs'"
    >
      <div class="flex items-start gap-2.5">
        <div
          class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          [class]="getCategoryClass(notification().category)"
        >
          <app-icon [name]="getCategoryIcon(notification().category)" className="w-3.5 h-3.5" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1 mb-0.5">
            <span class="text-xs font-bold text-stone-900 font-['Outfit'] truncate">
              {{ notification().title }}
            </span>
            @if (!notification().isRead) {
              <span class="w-2 h-2 rounded-full bg-[#E67324] shrink-0" title="No leída"></span>
            }
          </div>
          <p class="text-[11px] text-stone-600 leading-tight mb-1">
            {{ notification().message }}
          </p>
          <div class="flex items-center justify-between text-[9.5px] text-stone-400 font-mono">
            <span>{{ formatCategoryName(notification().category) }}</span>
            <span>{{ formatDate(notification().createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NotificationItemComponent {
  readonly notification = input.required<InAppNotification>();
  readonly clicked = output<string>();

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'SECURITY': return 'shield';
      case 'NOTES_AGENDA': return 'calendar';
      case 'PDM_CRITICAL': return 'alert-circle';
      default: return 'bell';
    }
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'SECURITY': return 'bg-rose-100 text-rose-700';
      case 'NOTES_AGENDA': return 'bg-blue-100 text-blue-700';
      case 'PDM_CRITICAL': return 'bg-amber-100 text-amber-800';
      default: return 'bg-stone-100 text-stone-700';
    }
  }

  formatCategoryName(category: string): string {
    switch (category) {
      case 'SECURITY': return 'Seguridad';
      case 'NOTES_AGENDA': return 'Notas y Agenda';
      case 'PDM_CRITICAL': return 'PDM Crítico';
      default: return 'Sistema';
    }
  }

  formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Hoy';
    }
  }
}


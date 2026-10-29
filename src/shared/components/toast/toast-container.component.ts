import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastConfirmItemComponent } from './toast-confirm-item.component';
import { AppIconComponent } from '../icon/app-icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastConfirmItemComponent, AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-3">
      @for (c of toastSvc.confirms(); track c.id) {
        <app-toast-confirm-item [confirmItem]="c" (dismiss)="toastSvc.removeConfirm(c.id)" />
      }

      @for (t of toastSvc.toasts(); track t.id) {
        <div
          class="pointer-events-auto flex items-center gap-2.5 bg-[#FFFDF9] text-[#1C1917] border border-[#EBDDCF] shadow-[0_10px_30px_-5px_rgba(139,37,30,0.08),0_4px_6px_-2px_rgba(0,0,0,0.03)] rounded-2xl px-4 py-2.5 font-['Outfit'] text-[13px] font-semibold tracking-tight animate-fadeIn"
        >
          @switch (t.type) {
            @case ('success') {
              <app-icon name="check-circle-2" className="w-4 h-4 text-emerald-600 shrink-0" />
            }
            @case ('error') {
              <app-icon name="alert-circle" className="w-4 h-4 text-rose-600 shrink-0" />
            }
            @case ('warning') {
              <span>⚠️</span>
            }
            @default {
              <span>ℹ️</span>
            }
          }
          <span>{{ t.title ? t.title + ': ' + t.message : t.message }}</span>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastSvc = inject(ToastService);
}


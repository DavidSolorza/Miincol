import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

// Pestañas de selección de rol en estilo cápsula claro y ergonómico
@Component({
  selector: 'app-login-role-tabs',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl gap-1.5 font-['Outfit'] border border-slate-200/60">
      <button
        type="button"
        (click)="selectTab.emit('team')"
        [class]="'py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ' + (activeTab === 'team' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80' : 'text-slate-500 hover:text-slate-800')"
      >
        <app-icon name="compass" className="w-4 h-4 text-blue-600" />
        <span>Misión en Campo</span>
      </button>

      <button
        type="button"
        (click)="selectTab.emit('admin')"
        [class]="'py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ' + (activeTab === 'admin' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80' : 'text-slate-500 hover:text-slate-800')"
      >
        <app-icon name="shield-check" className="w-4 h-4 text-amber-500" />
        <span>Super Admin</span>
      </button>
    </div>
  `,
})
export class LoginRoleTabsComponent {
  @Input({ required: true }) activeTab!: 'admin' | 'team';
  @Output() selectTab = new EventEmitter<'admin' | 'team'>();
}

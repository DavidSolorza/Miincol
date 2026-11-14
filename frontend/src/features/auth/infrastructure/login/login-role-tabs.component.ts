import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

// Pestañas de selección de rol en estilo cápsula oscura
@Component({
  selector: 'app-login-role-tabs',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 p-1.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl gap-1.5 font-['Outfit']">
      <button
        type="button"
        (click)="selectTab.emit('team')"
        [class]="'py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ' + (activeTab === 'team' ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200')"
      >
        <app-icon name="compass" className="w-4 h-4 text-blue-400" />
        <span>Misión en Campo</span>
      </button>

      <button
        type="button"
        (click)="selectTab.emit('admin')"
        [class]="'py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ' + (activeTab === 'admin' ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200')"
      >
        <app-icon name="shield-check" className="w-4 h-4 text-amber-400" />
        <span>Super Admin</span>
      </button>
    </div>
  `,
})
export class LoginRoleTabsComponent {
  @Input({ required: true }) activeTab!: 'admin' | 'team';
  @Output() selectTab = new EventEmitter<'admin' | 'team'>();
}

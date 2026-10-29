import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-login-role-tabs',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 p-1.5 bg-stone-100 rounded-2xl gap-1.5">
      <button
        type="button"
        (click)="selectTab.emit('team')"
        [class]="'py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ' + (activeTab === 'team' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800')"
      >
        <app-icon name="compass" className="w-4 h-4 text-[#E67324]" />
        <span>Misión en Campo</span>
      </button>

      <button
        type="button"
        (click)="selectTab.emit('admin')"
        [class]="'py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ' + (activeTab === 'admin' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800')"
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


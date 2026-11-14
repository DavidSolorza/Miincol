import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { verifyAuthCredentials } from '../application/verifyAuthCredentials';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import { httpClient } from '../../../core/http/httpClient';
import { LoginHeroCardComponent } from './login/login-hero-card.component';
import { LoginCardHeaderComponent } from './login/login-card-header.component';
import { LoginRoleTabsComponent } from './login/login-role-tabs.component';
import { LoginFormFieldsComponent } from './login/login-form-fields.component';
import { LoginQuickAccessChipsComponent, type QuickCredentialPayload } from './login/login-quick-access-chips.component';
import { LoginSupportFooterComponent } from './login/login-support-footer.component';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [
    AppIconComponent, LoginHeroCardComponent, LoginCardHeaderComponent,
    LoginRoleTabsComponent, LoginFormFieldsComponent, LoginQuickAccessChipsComponent,
    LoginSupportFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#F6F4EF] flex items-center justify-center p-3 sm:p-5 lg:p-8 relative overflow-x-hidden selection:bg-[#E67324]/20 selection:text-[#8B251E]">
      <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#8B251E]/10 rounded-full blur-[100px] pointer-events-none gpu-layer transform-gpu"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#E67324]/12 rounded-full blur-[100px] pointer-events-none gpu-layer transform-gpu"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none gpu-layer transform-gpu"></div>

      <div class="w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border border-stone-200/80 p-3 sm:p-4 lg:p-5 flex flex-col md:flex-row gap-5 lg:gap-8 items-stretch relative z-10" style="zoom: 0.85;">
        <app-login-hero-card />

        <div class="flex-1 p-3 sm:p-5 lg:p-7 flex flex-col justify-between">
          <div class="space-y-5">
            <app-login-card-header />
            <app-login-role-tabs [activeTab]="activeTab()" (selectTab)="handleSelectTab($event)" />

            @if (error()) {
              <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
                <app-icon name="alert-circle" className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span class="flex-1">{{ error() }}</span>
              </div>
            }

            <app-login-form-fields
              [activeTab]="activeTab()" [identifier]="identifier()" (identifierChange)="identifier.set($event)"
              [password]="password()" (passwordChange)="password.set($event)" [showPassword]="showPassword()"
              (showPasswordChange)="showPassword.set($event)" [loading]="loading()" [allTeams]="allTeams"
              (teamSelect)="handleTeamSelect($event)" (submitForm)="handleSubmit()"
            />

            <app-login-quick-access-chips [selectedQuickChip]="selectedQuickChip()" (fillCredentials)="fillCredentials($event)" />
          </div>

          <app-login-support-footer />
        </div>
      </div>
    </div>
  `,
})
export class LoginViewComponent implements OnInit, OnDestroy {
  @Input() allTeams: TeamSupervisionSummary[] = [];
  @Output() adminSuccess = new EventEmitter<TeamSupervisionSummary | undefined>();
  @Output() directorGeneralSuccess = new EventEmitter<void>();
  @Output() teamSuccess = new EventEmitter<{ team: TeamSupervisionSummary; isNationalAdmin?: boolean }>();
  @Output() memberSuccess = new EventEmitter<{ team: TeamSupervisionSummary; memberName: string }>();

  readonly activeTab = signal<'admin' | 'team'>('admin');
  readonly identifier = signal('hudisapastos@misincol.org');
  readonly password = signal('admin2026');
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedQuickChip = signal('director');

  ngOnInit() {
    if (typeof document !== 'undefined') { document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden'; }
    this.checkAutoLoginFromUrl();
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; }
  }

  private checkAutoLoginFromUrl(): void {
    if (typeof window === 'undefined') return;
    try {
      const p = new URLSearchParams(window.location.search);
      const u = p.get('user') || p.get('u'), pin = p.get('pin') || p.get('p'), tab = p.get('tab') as 'admin' | 'team' | null, auto = p.get('auto') === 'true';
      if (u) {
        this.identifier.set(u.trim());
        this.activeTab.set(tab === 'admin' ? 'admin' : 'team');
      }
      if (pin) this.password.set(pin.trim());
      if (u && pin && auto) setTimeout(() => this.handleSubmit(), 200);
    } catch { /* ignore */ }
  }

  handleSelectTab(tab: 'admin' | 'team') {
    this.activeTab.set(tab); this.error.set(null);
    if (tab === 'team') {
      const firstTeam = this.allTeams[0];
      this.identifier.set(firstTeam?.leaderEmail || '');
      this.password.set(firstTeam?.accessPin || '');
      this.selectedQuickChip.set(firstTeam?.slug || '');
    } else {
      this.identifier.set('hudisapastos@misincol.org'); this.password.set('admin2026');
      this.selectedQuickChip.set('director');
    }
  }

  handleTeamSelect(val: string) {
    this.identifier.set(val); this.selectedQuickChip.set(val.replace(/^team-/, '').toLowerCase());
  }

  fillCredentials(p: QuickCredentialPayload) {
    this.activeTab.set(p.type); this.selectedQuickChip.set(p.chipKey); this.error.set(null);
    this.identifier.set(p.user); this.password.set(p.pass);
  }

  handleSubmit() {
    this.loading.set(true); this.error.set(null);
    httpClient.post<{ accessToken?: string; token?: string }>('/auth/login', {
      identifier: this.identifier(), password: this.password(),
    }).then((res) => {
      const tok = res?.accessToken || res?.token;
      if (tok && typeof localStorage !== 'undefined') localStorage.setItem('misincol_auth_token', tok);
    }).catch(() => {});

    verifyAuthCredentials({
      activeTab: this.activeTab(), identifier: this.identifier(), password: this.password(), allTeams: this.allTeams,
      onAdminSuccess: (ctx) => this.adminSuccess.emit(ctx),
      onDirectorGeneralSuccess: () => this.directorGeneralSuccess.emit(),
      onTeamSuccess: (team, isNat) => this.teamSuccess.emit({ team, isNationalAdmin: isNat }),
      onMemberSuccess: (team, mem) => this.memberSuccess.emit({ team, memberName: mem }),
      onError: (msg) => this.error.set(msg),
      onDone: () => this.loading.set(false),
    });
  }
}

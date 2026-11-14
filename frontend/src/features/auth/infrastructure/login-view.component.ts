import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { verifyAuthCredentials } from '../application/verifyAuthCredentials';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import { httpClient } from '../../../core/http/httpClient';
import { LoginHeroCardComponent } from './login/login-hero-card.component';
import { LoginCardHeaderComponent } from './login/login-card-header.component';
import { LoginRoleTabsComponent } from './login/login-role-tabs.component';
import { LoginFormFieldsComponent } from './login/login-form-fields.component';
import { LoginSupportFooterComponent } from './login/login-support-footer.component';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [
    AppIconComponent, LoginHeroCardComponent, LoginCardHeaderComponent,
    LoginRoleTabsComponent, LoginFormFieldsComponent, LoginSupportFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 relative overflow-x-hidden selection:bg-slate-900 selection:text-white font-['Outfit']">
      <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-slate-900/5 rounded-full blur-[100px] pointer-events-none transform-gpu"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none transform-gpu"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none transform-gpu"></div>

      <div class="w-full max-w-5xl bg-white rounded-3xl sm:rounded-[32px] shadow-xl shadow-slate-900/5 border border-slate-200/90 p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch relative z-10">
        <app-login-hero-card />

        <div class="flex-1 p-2 sm:p-4 lg:p-6 flex flex-col justify-between">
          <div class="space-y-4 sm:space-y-5">
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
    } else {
      this.identifier.set('hudisapastos@misincol.org'); this.password.set('admin2026');
    }
  }

  handleTeamSelect(val: string) {
    this.identifier.set(val);
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

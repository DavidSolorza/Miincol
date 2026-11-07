import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import type { FieldMinistryMetrics, GeneralTeamData } from '../../domain/general-info.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-general-annual-table',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden select-none font-['Outfit'] text-left">
      <div class="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
            <app-icon name="table" className="w-4 h-4 text-[#E67324]" />
          </div>
          <div>
            <h3 class="text-xs sm:text-sm font-black text-stone-900 tracking-tight">Seguimiento Multianual de Campo (Modelo Excel)</h3>
            <p class="text-[10.5px] text-stone-500">Métricas comparativas por año ministerial de la misión</p>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[620px] text-xs">
          <thead>
            <tr class="bg-stone-50/90 text-stone-600 text-[10.5px] uppercase tracking-wider border-b border-stone-200">
              <th class="py-2.5 px-3.5 font-bold">Métrica Ministerial / Etapa</th>
              <th class="py-2.5 px-3 font-bold text-center">Año 2025</th>
              <th class="py-2.5 px-3 font-bold text-center bg-amber-500/10 text-stone-900">Año 2026 (Activo)</th>
              <th class="py-2.5 px-3 font-bold text-center">Año 2027</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <!-- Sección: Contacto -->
            <tr class="bg-stone-50/50 font-bold text-stone-700 text-[11px]"><td colspan="4" class="py-1 px-3.5 uppercase tracking-wide">1. Contacto Inicial</td></tr>
            <tr>
              <td class="py-2 px-3.5 text-stone-700">Personas contactadas por primera vez</td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">10</td>
              <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                @if (canEdit()) {
                  <input type="number" [value]="metrics().firstTimeContactedCount" (change)="onMetricChange('firstTimeContactedCount', $event)" class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold" />
                } @else { {{ metrics().firstTimeContactedCount }} }
              </td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
            </tr>
            <tr>
              <td class="py-2 px-3.5 text-stone-700">Personas interesadas en el evangelio</td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">4</td>
              <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                @if (canEdit()) {
                  <input type="number" [value]="metrics().interestedInGospelCount" (change)="onMetricChange('interestedInGospelCount', $event)" class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold" />
                } @else { {{ metrics().interestedInGospelCount }} }
              </td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
            </tr>

            <!-- Sección: Comunicando -->
            <tr class="bg-stone-50/50 font-bold text-stone-700 text-[11px]"><td colspan="4" class="py-1 px-3.5 uppercase tracking-wide">2. Comunicando</td></tr>
            <tr>
              <td class="py-2 px-3.5 text-stone-700">De los que escucharon, ¿cuántos buscan a Dios?</td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">1</td>
              <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                @if (canEdit()) {
                  <input type="number" [value]="metrics().seekingGodCount" (change)="onMetricChange('seekingGodCount', $event)" class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold" />
                } @else { {{ metrics().seekingGodCount }} }
              </td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
            </tr>
            <tr>
              <td class="py-2 px-3.5 text-stone-700">Tuvieron la oportunidad de responder a Cristo</td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">1</td>
              <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                @if (canEdit()) {
                  <input type="number" [value]="metrics().gospelResponseOpportunitiesCount" (change)="onMetricChange('gospelResponseOpportunitiesCount', $event)" class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold" />
                } @else { {{ metrics().gospelResponseOpportunitiesCount }} }
              </td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
            </tr>

            <!-- Sección: Respondiendo -->
            <tr class="bg-stone-50/50 font-bold text-stone-700 text-[11px]"><td colspan="4" class="py-1 px-3.5 uppercase tracking-wide">3. Respondiendo</td></tr>
            <tr>
              <td class="py-2 px-3.5 text-stone-700">Creyeron el mensaje del Evangelio</td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">1</td>
              <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                @if (canEdit()) {
                  <input type="number" [value]="metrics().newBelieversCount" (change)="onMetricChange('newBelieversCount', $event)" class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold" />
                } @else { {{ metrics().newBelieversCount }} }
              </td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
            </tr>
            <tr>
              <td class="py-2 px-3.5 text-stone-700">Creyentes que fueron bautizados</td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">0</td>
              <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                @if (canEdit()) {
                  <input type="number" [value]="metrics().baptizedCount" (change)="onMetricChange('baptizedCount', $event)" class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold" />
                } @else { {{ metrics().baptizedCount }} }
              </td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
            </tr>

            <!-- Sección: Consolidando -->
            <tr class="bg-stone-50/50 font-bold text-stone-700 text-[11px]"><td colspan="4" class="py-1 px-3.5 uppercase tracking-wide">4. Consolidando</td></tr>
            <tr>
              <td class="py-2 px-3.5 text-stone-700">Personas en estudios bíblicos regulares</td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">30</td>
              <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                @if (canEdit()) {
                  <input type="number" [value]="metrics().regularBibleStudyParticipantsCount" (change)="onMetricChange('regularBibleStudyParticipantsCount', $event)" class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold" />
                } @else { {{ metrics().regularBibleStudyParticipantsCount }} }
              </td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
            </tr>
            <tr>
              <td class="py-2 px-3.5 text-stone-700">Personas mentoreadas personalmente</td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">8</td>
              <td class="py-2 px-3 text-center font-bold bg-amber-500/5 text-stone-900 font-mono">
                @if (canEdit()) {
                  <input type="number" [value]="metrics().personalMentorshipCount" (change)="onMetricChange('personalMentorshipCount', $event)" class="w-16 text-center p-1 rounded-lg border border-stone-200 bg-white font-bold" />
                } @else { {{ metrics().personalMentorshipCount }} }
              </td>
              <td class="py-2 px-3 text-center text-stone-400 font-mono">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class GeneralAnnualTableComponent {
  readonly metrics = input.required<FieldMinistryMetrics>();
  readonly teamData = input.required<GeneralTeamData>();
  readonly canEdit = input<boolean>(false);
  readonly metricChanged = output<Partial<FieldMinistryMetrics>>();

  onMetricChange(field: keyof FieldMinistryMetrics, event: Event): void {
    const val = Number((event.target as HTMLInputElement).value) || 0;
    this.metricChanged.emit({ [field]: val });
  }
}

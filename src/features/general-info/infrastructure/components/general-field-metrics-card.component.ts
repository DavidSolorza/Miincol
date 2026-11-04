import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { FieldMinistryMetrics } from '../../domain/general-info.types';

@Component({
  selector: 'app-general-field-metrics-card',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
      <div class="flex items-center gap-2 border-b border-stone-100 pb-3">
        <div class="w-8 h-8 rounded-xl bg-orange-50 text-[#E67324] flex items-center justify-center">
          <app-icon name="flame" className="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-sm sm:text-base font-bold text-stone-900 font-['Outfit']">Información de Campo y Contacto</h3>
          <p class="text-[11px] text-stone-500">Métricas de evangelismo, discipulado y desarrollo eclesial</p>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        <div class="p-2.5 rounded-xl bg-[#FAF7F2] border border-orange-100/60">
          <span class="text-[10px] text-stone-500 block leading-tight">Contactados 1ra Vez</span>
          <span class="text-base sm:text-lg font-black text-[#8B251E] font-['Outfit'] mt-1 block">{{ metrics().firstTimeContactedCount }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-[#FAF7F2] border border-orange-100/60">
          <span class="text-[10px] text-stone-500 block leading-tight">Escucharon Evangelio</span>
          <span class="text-base sm:text-lg font-black text-[#E67324] font-['Outfit'] mt-1 block">{{ metrics().heardGospelCount }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-[#FAF7F2] border border-orange-100/60">
          <span class="text-[10px] text-stone-500 block leading-tight">Interesados / Buscan a Dios</span>
          <span class="text-base sm:text-lg font-black text-amber-600 font-['Outfit'] mt-1 block">{{ metrics().interestedInGospelCount + metrics().seekingGodCount }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <span class="text-[10px] text-emerald-800 block leading-tight">Nuevos Creyentes</span>
          <span class="text-base sm:text-lg font-black text-emerald-700 font-['Outfit'] mt-1 block">{{ metrics().newBelieversCount }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
          <span class="text-[10px] text-blue-800 block leading-tight">Bautizados</span>
          <span class="text-base sm:text-lg font-black text-blue-700 font-['Outfit'] mt-1 block">{{ metrics().baptizedCount }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
          <span class="text-[10px] text-stone-500 block leading-tight">Estudios Bíblicos Regulares</span>
          <span class="text-base sm:text-lg font-black text-stone-800 font-['Outfit'] mt-1 block">{{ metrics().regularBibleStudyParticipantsCount }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
          <span class="text-[10px] text-stone-500 block leading-tight">Mentorías Personales</span>
          <span class="text-base sm:text-lg font-black text-stone-800 font-['Outfit'] mt-1 block">{{ metrics().personalMentorshipCount }}</span>
        </div>
        <div class="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
          <span class="text-[10px] text-purple-800 block leading-tight">Nuevos Grupos en el Año</span>
          <span class="text-base sm:text-lg font-black text-purple-700 font-['Outfit'] mt-1 block">{{ metrics().newGroupsMeetingInYearCount }}</span>
        </div>
      </div>

      <div class="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
          <span class="text-[11px] font-bold text-stone-800 block uppercase tracking-wider font-['Outfit']">Entrenamiento Ministerial</span>
          <p class="text-[11px] text-stone-600">
            Ministerial: <strong>{{ metrics().ministerialTrainingCount }}</strong> • Bíblico: <strong>{{ metrics().biblicalTrainingCount }}</strong> • Pastoral práctico: <strong>{{ metrics().pastoralPracticalTrainingCount }}</strong> • Otras áreas: <strong>{{ metrics().otherAreasTrainingCount }}</strong>
          </p>
        </div>
        <div class="p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 space-y-1">
          <span class="text-[11px] font-bold text-stone-800 block uppercase tracking-wider font-['Outfit']">Desarrollo Eclesial</span>
          <p class="text-[11px] text-stone-600">
            Grupos con perspectiva: <strong>{{ metrics().newGroupsWithChurchPerspectiveCount }}</strong> • Iglesias finales: <strong>{{ metrics().finalChurchesCount }}</strong> • Generaciones: <strong>{{ metrics().churchGenerationsCount }}</strong>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class GeneralFieldMetricsCardComponent {
  readonly metrics = input.required<FieldMinistryMetrics>();
}

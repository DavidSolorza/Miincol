import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal.component';
import type { PhasePlan } from '../../plans/domain/plan.types';
import { buildReportData } from '../application/report-data.helper';
import { ReportHeaderAndSummaryComponent } from './reportModal/report-header-and-summary.component';
import { ReportObjectivesTableComponent } from './reportModal/report-objectives-table.component';
import { ReportActivitiesDetailComponent } from './reportModal/report-activities-detail.component';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ReportHeaderAndSummaryComponent,
    ReportObjectivesTableComponent,
    ReportActivitiesDetailComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Informe Ejecutivo - Plan de Desarrollo Ministerial"
      subtitle="Documento consolidado de avance operativo, metas y presupuesto para supervisión nacional"
      maxWidth="4xl"
      (close)="closed.emit()"
    >
      <div class="space-y-6 text-stone-800">
        <app-report-header-and-summary [report]="report()" (printed)="printReport()" />

        <div id="pdm-printable-report" class="print-card bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <app-report-objectives-table
            [objectivesSummary]="report().objectivesSummary"
            [totalBudget]="report().totalBudget"
          />
          <app-report-activities-detail
            [objectivesSummary]="report().objectivesSummary"
            [teamLeader]="report().teamLeader"
            [teamName]="report().teamName"
          />
        </div>

        <div class="no-print flex justify-end pt-3 border-t border-stone-200">
          <button
            type="button"
            (click)="closed.emit()"
            class="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
          >
            Cerrar Informe
          </button>
        </div>
      </div>
    </app-modal>
  `,
})
export class ReportModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly plan = input.required<PhasePlan>();
  readonly closed = output<void>();

  readonly report = computed(() => buildReportData(this.plan()));

  printReport(): void {
    window.print();
  }
}


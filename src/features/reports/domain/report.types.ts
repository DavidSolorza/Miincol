/**
 * Domain types and contracts for Executive Ministerial Reports
 * Aligned with Technical Governance Contract v2026.4.0 (< 150 lines)
 */

import type { PhasePlan } from '../../plans/domain/plan.types';
import type { MissionaryTeam } from '../../auth/domain/auth.types';

export interface ReportGenerationOptions {
  includeFinancialSummary?: boolean;
  includeDetailedActivities?: boolean;
  targetFormat?: 'html' | 'pdf' | 'print';
}

export interface ReportExecutiveSummary {
  team: MissionaryTeam;
  phase: PhasePlan;
  totalActivitiesCount: number;
  completedActivitiesCount: number;
  pendingActivitiesCount: number;
  inProgressActivitiesCount: number;
  totalEstimatedBudget: number;
  completionPercentage: number;
}

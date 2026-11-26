export type EventCallback<T = unknown> = (payload: T) => void | Promise<void>;

export interface ServiceBusSubscription {
  id: string;
  topic: string;
  unsubscribe: () => void;
}

export interface AppEventMap {
  'auth:login': { role: 'admin' | 'team'; teamId?: string };
  'auth:logout': void;
  'team:select': { teamId: string };
  'team:inspect': { teamId: string };
  'team:created': { teamId: string; name: string; leader: string };
  'team:updated': { teamId: string; updates: Record<string, unknown> };
  'team:deleted': { teamId: string };
  'plan:phase_select': { phaseId: string };
  'pdm:phase_switch': { phaseId: string };
  'pdm:plan_persisted': { teamId: string; phaseId: string };
  'activity:created': { activityId: string; teamId: string; phaseId: string };
  'activity:updated': { activityId: string; teamId: string; phaseId: string; updatedFields: Record<string, unknown> };
  'activity:deleted': { activityId: string; teamId: string; phaseId: string };
  'security:role_update': { userId: string; newRole: string };
  'security:matrix_update': { timestamp: number };
  'pwa:install_prompt': { canInstall: boolean };
  'ui:toast': {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    duration?: number;
  };
  'ui:view_change': {
    view: 'dashboard' | 'phases' | 'supervision' | 'team-space' | 'reports' | 'security' | 'general' | 'plans' | 'superadmin';
  };
  'ui:modal': {
    modal: 'team' | 'notes' | 'audit' | 'report' | 'special_expense';
    open: boolean;
    teamId?: string;
  };
  'perf:sync': { timestamp: number };
  'audit:log': {
    teamId: string;
    userName: string;
    actionType: string;
    title: string;
    detail: string;
    phaseId?: string;
  };
  'network:status': { isOnline: boolean; effectiveType?: string };
  'sync:status': { isSyncing: boolean; message?: string };
  'cycle:year_changed': { teamId: string; closingYear: number; nextYear: number };
}

export type EventTopic = keyof AppEventMap;

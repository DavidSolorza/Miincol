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
  'plan:phase_select': { phaseId: string };
  'ui:toast': {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    duration?: number;
  };
  'ui:view_change': { view: 'dashboard' | 'phases' | 'supervision' | 'team-space' | 'reports' };
  'perf:sync': { timestamp: number };
  'audit:log': {
    teamId: string;
    userName: string;
    actionType: string;
    title: string;
    detail: string;
    phaseId?: string;
  };
}

export type EventTopic = keyof AppEventMap;

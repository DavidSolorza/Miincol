export type NotificationCategory = 'SECURITY' | 'NOTES_AGENDA' | 'PDM_CRITICAL' | 'SYSTEM';
export type NotificationSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';

export interface InAppNotification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  targetUserEmail?: string;
  targetRole?: string;
  teamId?: string;
  teamName?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface EmitNotificationPayload {
  category: NotificationCategory;
  severity?: NotificationSeverity;
  title: string;
  message: string;
  targetUserEmail?: string;
  targetRole?: string;
  teamId?: string;
  teamName?: string;
  metadata?: Record<string, any>;
  sendEmail?: boolean;
}


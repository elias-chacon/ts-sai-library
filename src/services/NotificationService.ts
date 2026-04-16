import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export class NotificationService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getNotifications(): Promise<Result<unknown>> {
    return this.get('/api/notifications');
  }

  markNotificationAsRead(id: string): Promise<Result<unknown>> {
    return this.patch(`/api/notifications/${id}/read`);
  }

  markAllNotificationsAsRead(): Promise<Result<unknown>> {
    return this.patch('/api/notifications/mark-all-read');
  }

  dismissNotification(id: string): Promise<Result<unknown>> {
    return this.patch(`/api/notifications/${id}/dismiss`);
  }

  getUnreadCount(): Promise<Result<unknown>> {
    return this.get('/api/notifications/count/unread');
  }
}
import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export class ConversationService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  createConversation(
    title: string,
    templateId?: string,
    workspaceId?: string,
  ): Promise<Result<unknown>> {
    const data: Record<string, unknown> = { title };
    if (templateId) data['templateId'] = templateId;
    if (workspaceId) data['workspaceId'] = workspaceId;
    return this.post('/api/conversations', data);
  }

  getConversations(
    templateId?: string,
    workspaceId?: string,
  ): Promise<Result<unknown>> {
    const query: Record<string, unknown> = {};
    if (templateId) query['templateId'] = templateId;
    if (workspaceId) query['workspaceId'] = workspaceId;
    return this.get('/api/conversations', query);
  }

  getConversation(
    conversationId: string,
    workspaceId?: string,
  ): Promise<Result<unknown>> {
    const query: Record<string, unknown> = {};
    if (workspaceId) query['workspaceId'] = workspaceId;
    return this.get(`/api/conversations/${conversationId}`, query);
  }

  deleteConversation(conversationId: string): Promise<Result<unknown>> {
    return this.delete(`/api/conversations/${conversationId}`);
  }

  updateConversationTitle(
    conversationId: string,
    title: string,
  ): Promise<Result<unknown>> {
    return this.put(`/api/conversations/${conversationId}/title`, { title });
  }
}
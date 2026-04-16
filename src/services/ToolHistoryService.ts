import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export class ToolHistoryService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getToolHistory(
    templateId?: string,
    templateIds?: string[],
    workspaceId?: string,
  ): Promise<Result<unknown>> {
    const query: Record<string, unknown> = {};
    if (templateId) query['templateId'] = templateId;
    if (templateIds?.length) query['templateIds'] = templateIds;
    if (workspaceId) query['workspaceId'] = workspaceId;
    return this.get('/api/tool-history', query);
  }

  createToolHistory(
    templateId: string,
    inputs: Record<string, unknown> = {},
    chatMessages: Record<string, unknown>[] = [],
    workspaceId?: string,
  ): Promise<Result<unknown>> {
    const data: Record<string, unknown> = { templateId, inputs, chatMessages };
    if (workspaceId) data['workspaceId'] = workspaceId;
    return this.post('/api/tool-history', data);
  }

  getToolHistoryItem(
    id: string,
    workspaceId?: string,
  ): Promise<Result<unknown>> {
    const query: Record<string, unknown> = {};
    if (workspaceId) query['workspaceId'] = workspaceId;
    return this.get(`/api/tool-history/${id}`, query);
  }

  deleteToolHistoryItem(id: string): Promise<Result<unknown>> {
    return this.delete(`/api/tool-history/${id}`);
  }

  searchToolHistory(
    query: string,
    workspaceId: string,
    resultSize: number,
  ): Promise<Result<unknown>> {
    return this.get('/api/tool-history/search', {
      query: query,
      WorkspaceId: workspaceId,
      ResultSize: resultSize,
    });
  }

  restoreToolHistory(
    id: string,
    workspaceId?: string,
  ): Promise<Result<unknown>> {
    const data: Record<string, unknown> = {};
    if (workspaceId) data['workspaceId'] = workspaceId;
    return this.post(`/api/tool-history/${id}/restore`, data);
  }
}
import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export class WorkspaceService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getWorkspaces(resultSize: number, page: number): Promise<Result<unknown>> {
    return this.get('/api/workspaces', { ResultSize: resultSize, Page: page });
  }

  getWorkspace(id: string): Promise<Result<unknown>> {
    return this.get(`/api/workspaces/${id}`);
  }

  addTemplateToWorkspace(
    workspaceId: string,
    templateId: string,
  ): Promise<Result<unknown>> {
    return this.post(`/api/workspaces/${workspaceId}/templates/${templateId}`);
  }

  removeTemplateFromWorkspace(
    workspaceId: string,
    templateId: string,
  ): Promise<Result<unknown>> {
    return this.delete(`/api/workspaces/${workspaceId}/templates/${templateId}`);
  }
}
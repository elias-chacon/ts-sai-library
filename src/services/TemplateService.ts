import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export interface TemplateExecuteOptions {
  workspaceId?: string;
  seed?: number;
  modelOverride?: string;
  chatMessages?: Record<string, unknown>[];
  secrets?: Record<string, unknown>;
}

export class TemplateService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getTemplates(filters: Record<string, unknown> = {}): Promise<Result<unknown>> {
    return this.get('/api/templates/list', filters);
  }

  getTemplate(id: string): Promise<Result<unknown>> {
    return this.get(`/api/templates/${id}`);
  }

  getTemplateView(id: string): Promise<Result<unknown>> {
    return this.get(`/api/templates/${id}/view`);
  }

  executeTemplate(
    id: string,
    inputs: Record<string, unknown> = {},
    options: TemplateExecuteOptions = {},
  ): Promise<Result<unknown>> {
    const queryParams: Record<string, unknown> = {};
    if (options.workspaceId) queryParams['workspaceId'] = options.workspaceId;
    if (options.seed !== undefined) queryParams['seed'] = options.seed;
    if (options.modelOverride) queryParams['modelOverride'] = options.modelOverride;

    const data: Record<string, unknown> = { inputs };
    if (options.chatMessages) data['chatMessages'] = options.chatMessages;
    if (options.secrets) data['secrets'] = options.secrets;

    return this.post(`/api/templates/${id}/execute`, data, queryParams);
  }

  executeChatTemplate(
    id: string,
    messages: Record<string, unknown>[],
    workspaceId?: string,
  ): Promise<Result<unknown>> {
    const queryParams = workspaceId ? { workspaceId } : {};
    return this.post(`/api/templates/${id}/chatexecute`, { messages }, queryParams);
  }

  getSubscribedTemplates(): Promise<Result<unknown>> {
    return this.get('/api/templates/subscribed');
  }

  getOwnedTemplates(): Promise<Result<unknown>> {
    return this.get('/api/templates/owned');
  }

  subscribeToTemplate(id: string): Promise<Result<unknown>> {
    return this.put(`/api/templates/subscribe/${id}`);
  }

  unsubscribeFromTemplate(id: string): Promise<Result<unknown>> {
    return this.put(`/api/templates/unsubscribe/${id}`);
  }
}
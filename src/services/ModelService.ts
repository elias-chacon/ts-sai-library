import { IHttpClient } from '../http/IHttpClient';
import { ModelType } from '../enums/ModelType';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export class ModelService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getModels(): Promise<Result<unknown>> {
    return this.get('/api/models');
  }

  getRealtimeModels(): Promise<Result<unknown>> {
    return this.get('/api/models/realtime');
  }

  filterModelsByType(
    models: Record<string, unknown>[],
    type: ModelType,
  ): Record<string, unknown>[] {
    return models.filter((node) => {
      const nodeType = typeof node['type'] === 'number' ? node['type'] : -1;
      return nodeType === type;
    });
  }
}
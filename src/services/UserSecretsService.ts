import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export class UserSecretsService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getSecrets(): Promise<Result<unknown>> {
    return this.get('/api/secrets');
  }

  createSecret(variable: string, secret: string): Promise<Result<unknown>> {
    return this.post('/api/secrets', { variable, secret });
  }

  updateSecret(
    id: string,
    variable: string,
    secret: string,
  ): Promise<Result<unknown>> {
    return this.put(`/api/secrets/${id}`, { variable, secret });
  }

  deleteSecret(id: string): Promise<Result<unknown>> {
    return this.delete(`/api/secrets/${id}`);
  }
}
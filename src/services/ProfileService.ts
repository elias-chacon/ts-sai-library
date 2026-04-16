import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export class ProfileService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getConfig(): Promise<Result<unknown>> {
    return this.get('/api/profile/config');
  }

  getLanguage(): Promise<Result<unknown>> {
    return this.get('/api/profile/language');
  }

  setLanguage(language: string): Promise<Result<unknown>> {
    return this.put(`/api/profile/language/${encodeURIComponent(language)}`);
  }

  getName(): Promise<Result<unknown>> {
    return this.get('/api/profile/name');
  }

  getEmail(): Promise<Result<unknown>> {
    return this.get('/api/profile/email');
  }

  isDeveloper(): Promise<Result<unknown>> {
    return this.get('/api/profile/developer');
  }

  isAdmin(): Promise<Result<unknown>> {
    return this.get('/api/profile/admin');
  }
}
import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export class CategoryService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  getCategories(
    types?: number[],
    parentCategoryKeyName?: string,
    name?: string,
  ): Promise<Result<unknown>> {
    const query: Record<string, unknown> = {};
    if (types?.length) query['types'] = types;
    if (parentCategoryKeyName) query['parentCategoryKeyName'] = parentCategoryKeyName;
    if (name) query['name'] = name;
    return this.get('/api/category', query);
  }

  getCategoryTypes(): Promise<Result<unknown>> {
    return this.get('/api/category/types');
  }

  getCategory(id: string): Promise<Result<unknown>> {
    return this.get(`/api/category/${id}`);
  }
}
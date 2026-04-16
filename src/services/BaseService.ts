import { IHttpClient } from '../http/IHttpClient';
import { RequestMethod } from '../enums/RequestMethod';
import { Result } from '../models/Result';
import { UriBuilder } from '../utils/UriBuilder';

export abstract class BaseService {
  protected readonly httpClient: IHttpClient;
  protected readonly baseUrl: string;
  protected readonly headers: Record<string, string>;

  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    if (!httpClient) throw new Error('httpClient is required');
    if (!baseUrl) throw new Error('baseUrl is required');

    this.httpClient = httpClient;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.headers = { ...headers };
  }

  protected get(
    endpoint: string,
    queryParams: Record<string, unknown> = {},
  ): Promise<Result<unknown>> {
    const uri = UriBuilder.build(this.baseUrl, endpoint, queryParams);
    return this.httpClient.makeRequest(uri, RequestMethod.GET, this.headers);
  }

  protected post(
    endpoint: string,
    data?: unknown,
    queryParams: Record<string, unknown> = {},
  ): Promise<Result<unknown>> {
    const uri = UriBuilder.build(this.baseUrl, endpoint, queryParams);
    const body = this.toJson(data);
    return this.httpClient.makeRequest(uri, RequestMethod.POST, this.headers, body);
  }

  protected put(
    endpoint: string,
    data?: unknown,
    queryParams: Record<string, unknown> = {},
  ): Promise<Result<unknown>> {
    const uri = UriBuilder.build(this.baseUrl, endpoint, queryParams);
    const body = this.toJson(data);
    return this.httpClient.makeRequest(uri, RequestMethod.PUT, this.headers, body);
  }

  protected patch(
    endpoint: string,
    data?: unknown,
    queryParams: Record<string, unknown> = {},
  ): Promise<Result<unknown>> {
    const uri = UriBuilder.build(this.baseUrl, endpoint, queryParams);
    const body = this.toJson(data);
    return this.httpClient.makeRequest(uri, RequestMethod.PATCH, this.headers, body);
  }

  protected delete(
    endpoint: string,
    queryParams: Record<string, unknown> = {},
  ): Promise<Result<unknown>> {
    const uri = UriBuilder.build(this.baseUrl, endpoint, queryParams);
    return this.httpClient.makeRequest(uri, RequestMethod.DELETE, this.headers);
  }

  protected toJson(data: unknown): string | undefined {
    if (data === null || data === undefined) return undefined;
    try {
      return JSON.stringify(data);
    } catch (error) {
      throw new Error(`Failed to serialize JSON: ${error}`);
    }
  }
}
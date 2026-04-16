import { RequestMethod } from '../enums/RequestMethod';
import { IHttpClient } from './IHttpClient';
import { Result } from '../models/Result';

export class LoggingHttpClient implements IHttpClient {
  private readonly inner: IHttpClient;

  constructor(inner: IHttpClient) {
    if (!inner) throw new Error('Inner client is required');
    this.inner = inner;
  }

  get timeoutMs(): number {
    return this.inner.timeoutMs;
  }

  set timeoutMs(value: number) {
    this.inner.timeoutMs = value;
  }

  async makeRequest(
    uri: string,
    method: RequestMethod,
    headers: Record<string, string>,
    body?: string,
  ): Promise<Result<unknown>> {
    const start = Date.now();
    console.info(`🌐 ${method} ${uri}`);

    const result = await this.inner.makeRequest(uri, method, headers, body);

    const elapsedMs = Date.now() - start;
    const status = result.success ? '✅' : '❌';
    console.info(`${status} Completed in ${elapsedMs}ms`);

    return result;
  }
}
import { RequestMethod } from '../enums/RequestMethod';
import { IHttpClient } from './IHttpClient';
import { Result } from '../models/Result';

export class RetryHttpClient implements IHttpClient {
  private readonly inner: IHttpClient;
  private readonly maxRetries: number;

  constructor(inner: IHttpClient, maxRetries = 3) {
    if (!inner) throw new Error('Inner client is required');
    this.inner = inner;
    this.maxRetries = Math.max(1, maxRetries);
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
    let attempt = 0;
    let last: Result<unknown> = Result.error('No attempts made');

    do {
      attempt++;
      last = await this.inner.makeRequest(uri, method, headers, body);

      if (last.success) return last;

      if (attempt < this.maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000;
        console.info(
          `🔄 Retry ${attempt}/${this.maxRetries} in ${delayMs / 1000}s (${last.errorMessage})`,
        );
        await this.delay(delayMs);
      }
    } while (attempt < this.maxRetries);

    return last;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
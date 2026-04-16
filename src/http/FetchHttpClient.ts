import { RequestMethod } from '../enums/RequestMethod';
import { IHttpClient } from './IHttpClient';
import { Result } from '../models/Result';

export class FetchHttpClient implements IHttpClient {
  timeoutMs: number;

  constructor(timeoutMs = 30_000) {
    this.timeoutMs = timeoutMs;
  }

  async makeRequest(
    uri: string,
    method: RequestMethod,
    headers: Record<string, string>,
    body?: string,
  ): Promise<Result<unknown>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const hasBody =
        method === RequestMethod.POST ||
        method === RequestMethod.PUT ||
        method === RequestMethod.PATCH;

      const response = await fetch(uri, {
        method,
        headers,
        body: hasBody ? (body ?? '') : undefined,
        signal: controller.signal,
      });

      const text = await response.text();

      if (response.ok) {
        const json = text.trim() ? JSON.parse(text) : {};
        return Result.success(json, { status: response.status });
      }

      return Result.error(`HTTP ${response.status}: ${text}`);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return Result.error(`Request timed out after ${this.timeoutMs}ms`);
      }
      const message = error instanceof Error ? error.message : String(error);
      return Result.error(`HTTP Request failed: ${message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
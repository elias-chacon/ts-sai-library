import { RequestMethod } from '../enums/RequestMethod';
import { Result } from '../models/Result';

export interface IHttpClient {
  timeoutMs: number;
  makeRequest(
    uri: string,
    method: RequestMethod,
    headers: Record<string, string>,
    body?: string,
  ): Promise<Result<unknown>>;
}
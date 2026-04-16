import { IHttpClient } from '../http/IHttpClient';
import { Result } from '../models/Result';
import { BaseService } from './BaseService';

export interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  seed?: number;
  [key: string]: unknown;
}

export class ChatService extends BaseService {
  constructor(httpClient: IHttpClient, baseUrl: string, headers: Record<string, string>) {
    super(httpClient, baseUrl, headers);
  }

  sendCompletion(
    messages: Record<string, unknown>[],
    model: string,
    options: ChatOptions = {},
  ): Promise<Result<unknown>> {
    const data: Record<string, unknown> = {
      messages,
      model,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1000,
    };

    if (options.seed !== undefined) {
      data['seed'] = options.seed;
    }

    return this.post('/api/prompt/v1/chat/completions', data);
  }
}
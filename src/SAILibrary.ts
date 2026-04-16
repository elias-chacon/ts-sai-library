import { Env, EnvDescriptions, getEnvValue } from './enums/Env';
import { ModelType } from './enums/ModelType';
import { IHttpClient } from './http/IHttpClient';
import { FetchHttpClient } from './http/FetchHttpClient';
import { LoggingHttpClient } from './http/LoggingHttpClient';
import { RetryHttpClient } from './http/RetryHttpClient';
import { ChatMessage, ContentPart } from './models/ChatMessage';
import { Result } from './models/Result';
import { HealthService } from './services/HealthService';
import { ProfileService } from './services/ProfileService';
import { ModelService } from './services/ModelService';
import { ChatService, ChatOptions } from './services/ChatService';
import { TemplateService, TemplateExecuteOptions } from './services/TemplateService';
import { ConversationService } from './services/ConversationService';
import { WorkspaceService } from './services/WorkspaceService';
import { ToolHistoryService } from './services/ToolHistoryService';
import { CategoryService } from './services/CategoryService';
import { FileService } from './services/FileService';
import { UserSecretsService } from './services/UserSecretsService';
import { NotificationService } from './services/NotificationService';

export class SAILibrary {
  readonly health: HealthService;
  readonly profile: ProfileService;
  readonly models: ModelService;
  readonly chat: ChatService;
  readonly templates: TemplateService;
  readonly conversations: ConversationService;
  readonly workspaces: WorkspaceService;
  readonly toolHistory: ToolHistoryService;
  readonly categories: CategoryService;
  readonly files: FileService;
  readonly userSecrets: UserSecretsService;
  readonly notifications: NotificationService;

  private readonly httpClient: IHttpClient;
  private selectedModel: string | null = null;
  private availableModels: Record<string, unknown>[] = [];

  private constructor(apiKey: string, baseUrl: string, httpClient: IHttpClient) {
    const normalizedUrl = SAILibrary.normalizeBaseUrl(
      SAILibrary.resolveRequired(Env.SAI_API_BASE_URL, baseUrl),
    );
    const resolvedApiKey = SAILibrary.resolveRequired(Env.SAI_API_KEY, apiKey);

    this.httpClient = httpClient;
    const headers = SAILibrary.createDefaultHeaders(resolvedApiKey);

    this.health = new HealthService(httpClient, normalizedUrl, headers);
    this.profile = new ProfileService(httpClient, normalizedUrl, headers);
    this.models = new ModelService(httpClient, normalizedUrl, headers);
    this.chat = new ChatService(httpClient, normalizedUrl, headers);
    this.templates = new TemplateService(httpClient, normalizedUrl, headers);
    this.conversations = new ConversationService(httpClient, normalizedUrl, headers);
    this.workspaces = new WorkspaceService(httpClient, normalizedUrl, headers);
    this.toolHistory = new ToolHistoryService(httpClient, normalizedUrl, headers);
    this.categories = new CategoryService(httpClient, normalizedUrl, headers);
    this.files = new FileService(httpClient, normalizedUrl, headers);
    this.userSecrets = new UserSecretsService(httpClient, normalizedUrl, headers);
    this.notifications = new NotificationService(httpClient, normalizedUrl, headers);
  }

  static async create(apiKey: string, baseUrl?: string): Promise<SAILibrary> {
    const client = new FetchHttpClient();
    const lib = new SAILibrary(apiKey, baseUrl ?? '', client);
    await lib.loadModels();
    return lib;
  }

  static async createWithCustomHttpClient(
    apiKey: string,
    baseUrl: string,
    httpClient: IHttpClient,
  ): Promise<SAILibrary> {
    const lib = new SAILibrary(apiKey, baseUrl, httpClient);
    await lib.loadModels();
    return lib;
  }

  async testConnection(): Promise<Result<unknown>> {
    return this.health.checkHealth();
  }

  async setModel(modelName: string): Promise<void> {
    const found = this.availableModels.find(
      (m) => typeof m['name'] === 'string' && m['name'] === modelName,
    );

    if (found) {
      this.selectedModel = modelName;
      console.info(`Model set to: ${modelName}`);
      return;
    }

    const names = this.availableModels
      .map((m) => (typeof m['name'] === 'string' ? m['name'] : '<unknown>'))
      .join(', ');

    throw new Error(`Model '${modelName}' not found. Available: ${names}`);
  }

  getChatModels(): Record<string, unknown>[] {
    return this.models.filterModelsByType(this.availableModels, ModelType.Chat);
  }

  getAudioModels(): Record<string, unknown>[] {
    return this.models.filterModelsByType(this.availableModels, ModelType.Audio);
  }

  getImageModels(): Record<string, unknown>[] {
    return this.models.filterModelsByType(this.availableModels, ModelType.Image);
  }

  async sendMessage(
    message: string,
    systemPrompt?: string,
    options: ChatOptions = {},
  ): Promise<Result<unknown>> {
    this.validateModelSelected();
    const messages = this.buildMessageList(message, systemPrompt);
    return this.chat.sendCompletion(messages, this.selectedModel!, options);
  }

  async sendChatWithHistory(
    messages: Record<string, unknown>[],
    options: ChatOptions = {},
  ): Promise<Result<unknown>> {
    if (!this.selectedModel) {
      return Result.error('No model selected. Use setModel() to select a model.');
    }
    return this.chat.sendCompletion(messages, this.selectedModel, options);
  }

  createMessage(role: string, content: string): ChatMessage {
    return new ChatMessage(role, content);
  }

  createMessageWithImage(
    role: string,
    text: string,
    imageUrl: string,
    detail: string = 'auto',
  ): ChatMessage {
    const content: ContentPart[] = [
      { type: 'text', text },
      { type: 'image_url', image_url: { url: imageUrl, detail } },
    ];
    return new ChatMessage(role, content);
  }

  async refreshModels(): Promise<void> {
    await this.loadModels();
  }

  getApiInfo(): Record<string, unknown> {
    return {
      selectedModel: this.selectedModel,
      availableModelsCount: this.availableModels.length,
      chatModelsCount: this.getChatModels().length,
      audioModelsCount: this.getAudioModels().length,
      imageModelsCount: this.getImageModels().length,
      servicesLoaded: [
        'Health', 'Profile', 'Models', 'Chat', 'Templates',
        'Conversations', 'Workspaces', 'ToolHistory', 'Categories',
        'Files', 'UserSecrets', 'Notifications',
      ],
    };
  }

  private async loadModels(): Promise<void> {
    const result = await this.models.getModels();

    if (!result.success) {
      console.warn(`Failed to load models: ${result.errorMessage}`);
      this.availableModels = [];
      return;
    }

    if (Array.isArray(result.data)) {
      this.availableModels = result.data as Record<string, unknown>[];
      console.info(`Loaded ${this.availableModels.length} models`);
    } else {
      this.availableModels = [];
    }
  }

  private buildMessageList(
    userMessage: string,
    systemPrompt?: string,
  ): Record<string, unknown>[] {
    const messages: Record<string, unknown>[] = [];

    if (systemPrompt?.trim()) {
      messages.push(new ChatMessage('system', systemPrompt).toMap());
    }

    messages.push(new ChatMessage('user', userMessage).toMap());
    return messages;
  }

  private validateModelSelected(): void {
    if (!this.selectedModel) {
      throw new Error('No model selected. Use setModel() to select a model.');
    }
  }

  private static normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.replace(/\/+$/, '');
  }

  private static createDefaultHeaders(apiKey: string): Record<string, string> {
    return {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    };
  }

  private static resolveRequired(env: Env, value?: string): string {
    if (value?.trim()) return value;

    const envValue = getEnvValue(env);
    if (envValue?.trim()) return envValue;

    throw new Error(
      `${EnvDescriptions[env]} is required. Provide it as a parameter or set the ${env} environment variable.`,
    );
  }

  static get builder(): SAILibraryBuilder {
    return new SAILibraryBuilder();
  }

  static readonly extensions = SAILibraryExtensions;
}

export class SAILibraryBuilder {
  private apiKey: string = getEnvValue(Env.SAI_API_KEY) ?? '';
  private baseUrl: string = getEnvValue(Env.SAI_API_BASE_URL) ?? '';
  private timeoutMs: number = 30_000;
  private retryEnabled: boolean = false;
  private maxRetries: number = 3;
  private loggingEnabled: boolean = false;

  withApiKey(apiKey: string): this {
    this.apiKey = apiKey;
    return this;
  }

  withBaseUrl(baseUrl: string): this {
    this.baseUrl = baseUrl;
    return this;
  }

  withTimeout(ms: number): this {
    this.timeoutMs = ms;
    return this;
  }

  enableRetryLogic(maxRetries: number): this {
    this.retryEnabled = true;
    this.maxRetries = maxRetries;
    return this;
  }

  enableRequestLogging(): this {
    this.loggingEnabled = true;
    return this;
  }

  async build(): Promise<SAILibrary> {
    let httpClient: IHttpClient = new FetchHttpClient(this.timeoutMs);

    if (this.loggingEnabled) httpClient = new LoggingHttpClient(httpClient);
    if (this.retryEnabled) httpClient = new RetryHttpClient(httpClient, this.maxRetries);

    return SAILibrary.createWithCustomHttpClient(
      this.apiKey,
      this.baseUrl,
      httpClient,
    );
  }
}

class SAILibraryExtensions {
  private constructor() {}

  static async executeWithRetry<T>(
    operation: () => Promise<Result<T>>,
    maxRetries: number,
  ): Promise<Result<T>> {
    let attempt = 0;
    let last: Result<T> = Result.error('No attempts made');

    while (attempt < maxRetries) {
      attempt++;
      last = await operation();
      if (last.success) return last;

      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return last;
  }

  static async executeTemplateWithRetry(
    sai: SAILibrary,
    templateId: string,
    inputs: Record<string, unknown>,
    maxRetries: number,
  ): Promise<Result<unknown>> {
    return this.executeWithRetry(
      () => sai.templates.executeTemplate(templateId, inputs),
      maxRetries,
    );
  }

  static async sendMessageWithRetry(
    sai: SAILibrary,
    message: string,
    systemPrompt: string,
    maxRetries: number,
  ): Promise<Result<unknown>> {
    return this.executeWithRetry(
      () => sai.sendMessage(message, systemPrompt),
      maxRetries,
    );
  }

  static extractTextFromChatResponse(
    chatResult: Result<unknown>,
  ): string[] {
    if (!chatResult?.success || !chatResult.data) return [];

    const root = chatResult.data as Record<string, unknown>;
    const choices = root['choices'];

    if (!Array.isArray(choices)) return [];

    return choices
      .map((choice: unknown) => {
        const c = choice as Record<string, unknown>;
        const message = c['message'] as Record<string, unknown> | undefined;
        return message?.['content'] != null
          ? String(message['content'])
          : null;
      })
      .filter((text): text is string => text !== null);
  }

  static createConversationContext(
    messages: Record<string, unknown>[],
  ): Record<string, unknown> {
    const roles: string[] = [];
    let totalLength = 0;

    for (const m of messages ?? []) {
      const role = m['role'];
      if (typeof role === 'string') roles.push(role);

      const content = m['content'];
      if (typeof content === 'string') totalLength += content.length;
    }

    return {
      messageCount: messages?.length ?? 0,
      roles,
      totalLength,
      uniqueRoles: [...new Set(roles)],
    };
  }
}
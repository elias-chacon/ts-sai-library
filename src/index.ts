// Main library
export { SAILibrary, SAILibraryBuilder } from './SAILibrary';

// Enums
export { Env, getEnvValue } from './enums/Env';
export { ModelType } from './enums/ModelType';
export { RequestMethod } from './enums/RequestMethod';

// Models
export { Result } from './models/Result';
export { ChatMessage } from './models/ChatMessage';
export type { ContentPart } from './models/ChatMessage';

// HTTP
export type { IHttpClient } from './http/IHttpClient';
export { FetchHttpClient } from './http/FetchHttpClient';
export { LoggingHttpClient } from './http/LoggingHttpClient';
export { RetryHttpClient } from './http/RetryHttpClient';

// Services
export { BaseService } from './services/BaseService';
export { HealthService } from './services/HealthService';
export { ProfileService } from './services/ProfileService';
export { ModelService } from './services/ModelService';
export { ChatService } from './services/ChatService';
export type { ChatOptions } from './services/ChatService';
export { TemplateService } from './services/TemplateService';
export type { TemplateExecuteOptions } from './services/TemplateService';
export { ConversationService } from './services/ConversationService';
export { WorkspaceService } from './services/WorkspaceService';
export { ToolHistoryService } from './services/ToolHistoryService';
export { CategoryService } from './services/CategoryService';
export { FileService } from './services/FileService';
export { UserSecretsService } from './services/UserSecretsService';
export { NotificationService } from './services/NotificationService';

// Utils
export { UriBuilder } from './utils/UriBuilder';
export { QueryParamEncoder } from './utils/QueryParamEncoder';
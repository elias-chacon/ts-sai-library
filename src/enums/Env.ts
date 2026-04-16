export enum Env {
  SAI_API_KEY = 'SAI_API_KEY',
  SAI_API_BASE_URL = 'SAI_API_BASE_URL',
}

export const EnvDescriptions: Record<Env, string> = {
  [Env.SAI_API_KEY]: 'Api Key',
  [Env.SAI_API_BASE_URL]: 'Api Base Url',
};

export function getEnvValue(env: Env): string | undefined {
  return process.env[env];
}
import { QueryParamEncoder } from './QueryParamEncoder';

export class UriBuilder {
  private constructor() {}

  static build(
    baseUri: string,
    endpoint: string,
    queryParams?: Record<string, unknown>,
  ): string {
    const normalizedBase = baseUri.replace(/\/+$/, '');
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;

    const uri = `${normalizedBase}${normalizedEndpoint}`;

    if (!queryParams || Object.keys(queryParams).length === 0) return uri;

    const queryString = Object.entries(queryParams)
      .flatMap(([key, value]) => QueryParamEncoder.toQueryParamPairs(key, value))
      .join('&');

    return queryString ? `${uri}?${queryString}` : uri;
  }
}
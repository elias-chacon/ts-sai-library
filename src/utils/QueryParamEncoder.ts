export class QueryParamEncoder {
  private constructor() {}

  static encode(value: string): string {
    return encodeURIComponent(value);
  }

  static toQueryParamPairs(key: string, value: unknown): string[] {
    if (value === null || value === undefined) return [];

    if (Array.isArray(value)) {
      return value.map((v) => `${this.encode(key)}=${this.encode(String(v))}`);
    }

    return [`${this.encode(key)}=${this.encode(String(value))}`];
  }
}
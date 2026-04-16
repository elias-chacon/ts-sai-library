export class Result<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly errorMessage: string;
  readonly metadata: Record<string, unknown>;

  private constructor(
    success: boolean,
    data: T | null,
    errorMessage: string,
    metadata: Record<string, unknown>,
  ) {
    this.success = success;
    this.data = data;
    this.errorMessage = errorMessage;
    this.metadata = Object.freeze({ ...metadata });
  }

  static success<T>(data: T, metadata: Record<string, unknown> = {}): Result<T> {
    return new Result<T>(true, data, '', metadata);
  }

  static error<T>(message: string): Result<T> {
    return new Result<T>(false, null, message, {});
  }
}
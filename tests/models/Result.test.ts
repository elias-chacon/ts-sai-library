import { Result } from '../../src/models/Result';

describe('Result', () => {
  describe('success()', () => {
    it('should create a successful result with data', () => {
      const result = Result.success({ id: 1 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 1 });
      expect(result.errorMessage).toBe('');
      expect(result.metadata).toEqual({});
    });

    it('should create a successful result with metadata', () => {
      const result = Result.success('data', { status: 200 });

      expect(result.success).toBe(true);
      expect(result.metadata).toEqual({ status: 200 });
    });

    it('should freeze metadata to prevent mutation', () => {
      const result = Result.success('data', { status: 200 });

      expect(() => {
        (result.metadata as Record<string, unknown>)['extra'] = 'value';
      }).toThrow();
    });
  });

  describe('error()', () => {
    it('should create a failed result with an error message', () => {
      const result = Result.error('Something went wrong');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errorMessage).toBe('Something went wrong');
      expect(result.metadata).toEqual({});
    });
  });
});
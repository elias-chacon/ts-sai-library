import { QueryParamEncoder } from '../../src/utils/QueryParamEncoder';

describe('QueryParamEncoder', () => {
  describe('encode()', () => {
    it('should encode special characters', () => {
      expect(QueryParamEncoder.encode('hello world')).toBe('hello%20world');
      expect(QueryParamEncoder.encode('a&b=c')).toBe('a%26b%3Dc');
    });
  });

  describe('toQueryParamPairs()', () => {
    it('should return empty array for null value', () => {
      expect(QueryParamEncoder.toQueryParamPairs('key', null)).toEqual([]);
    });

    it('should return empty array for undefined value', () => {
      expect(QueryParamEncoder.toQueryParamPairs('key', undefined)).toEqual([]);
    });

    it('should return a single pair for scalar value', () => {
      expect(QueryParamEncoder.toQueryParamPairs('name', 'John')).toEqual(['name=John']);
    });

    it('should return multiple pairs for array value', () => {
      const pairs = QueryParamEncoder.toQueryParamPairs('ids', [1, 2, 3]);
      expect(pairs).toEqual(['ids=1', 'ids=2', 'ids=3']);
    });

    it('should encode keys and values', () => {
      const pairs = QueryParamEncoder.toQueryParamPairs('my key', 'my value');
      expect(pairs).toEqual(['my%20key=my%20value']);
    });
  });
});
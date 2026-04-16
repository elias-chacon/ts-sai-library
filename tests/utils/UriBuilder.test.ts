import { UriBuilder } from '../../src/utils/UriBuilder';

describe('UriBuilder', () => {
  it('should build a simple URI', () => {
    const uri = UriBuilder.build('https://api.example.com', '/api/health');
    expect(uri).toBe('https://api.example.com/api/health');
  });

  it('should handle trailing slash in base URL', () => {
    const uri = UriBuilder.build('https://api.example.com/', '/api/health');
    expect(uri).toBe('https://api.example.com/api/health');
  });

  it('should add leading slash to endpoint if missing', () => {
    const uri = UriBuilder.build('https://api.example.com', 'api/health');
    expect(uri).toBe('https://api.example.com/api/health');
  });

  it('should append query params', () => {
    const uri = UriBuilder.build('https://api.example.com', '/api/items', {
      page: 1,
      size: 10,
    });
    expect(uri).toBe('https://api.example.com/api/items?page=1&size=10');
  });

  it('should handle array query params', () => {
    const uri = UriBuilder.build('https://api.example.com', '/api/items', {
      ids: [1, 2, 3],
    });
    expect(uri).toBe('https://api.example.com/api/items?ids=1&ids=2&ids=3');
  });

  it('should skip null and undefined query params', () => {
    const uri = UriBuilder.build('https://api.example.com', '/api/items', {
      name: null,
      page: 1,
    });
    expect(uri).toBe('https://api.example.com/api/items?page=1');
  });

  it('should return URI without query string if no params', () => {
    const uri = UriBuilder.build('https://api.example.com', '/api/health', {});
    expect(uri).toBe('https://api.example.com/api/health');
  });
});
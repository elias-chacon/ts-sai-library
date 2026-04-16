import { FetchHttpClient } from '../../src/http/FetchHttpClient';
import { RequestMethod } from '../../src/enums/RequestMethod';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('FetchHttpClient', () => {
  let client: FetchHttpClient;

  beforeEach(() => {
    client = new FetchHttpClient(5000);
    mockFetch.mockReset();
  });

  it('should return success result on 200 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ status: 'ok' }),
    });

    const result = await client.makeRequest(
      'https://api.example.com/health',
      RequestMethod.GET,
      {},
    );

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ status: 'ok' });
    expect(result.metadata['status']).toBe(200);
  });

  it('should return error result on non-2xx response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => 'Not Found',
    });

    const result = await client.makeRequest(
      'https://api.example.com/missing',
      RequestMethod.GET,
      {},
    );

    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('404');
  });

  it('should return error result on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await client.makeRequest(
      'https://api.example.com/health',
      RequestMethod.GET,
      {},
    );

    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('Network error');
  });

  it('should return error on timeout (AbortError)', async () => {
    mockFetch.mockRejectedValueOnce(
      Object.assign(new Error('The operation was aborted'), { name: 'AbortError' }),
    );

    const result = await client.makeRequest(
      'https://api.example.com/health',
      RequestMethod.GET,
      {},
    );

    expect(result.success).toBe(false);
    expect(result.errorMessage).toContain('timed out');
  });

  it('should handle empty response body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      text: async () => '',
    });

    const result = await client.makeRequest(
      'https://api.example.com/delete',
      RequestMethod.DELETE,
      {},
    );

    expect(result.success).toBe(true);
    expect(result.data).toEqual({});
  });
});
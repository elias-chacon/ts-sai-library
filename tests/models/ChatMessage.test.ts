import { ChatMessage } from '../../src/models/ChatMessage';

describe('ChatMessage', () => {
  it('should create a text message from string', () => {
    const msg = new ChatMessage('user', 'Hello!');
    const map = msg.toMap();

    expect(map['role']).toBe('user');
    expect(map['content']).toEqual([{ type: 'text', text: 'Hello!' }]);
  });

  it('should create a message from content parts', () => {
    const parts = [
      { type: 'text', text: 'Hello' },
      { type: 'image_url', image_url: { url: 'http://example.com/img.png' } },
    ];
    const msg = new ChatMessage('user', parts);
    const map = msg.toMap();

    expect(map['content']).toEqual(parts);
  });

  it('should throw if role is empty', () => {
    expect(() => new ChatMessage('', 'Hello')).toThrow('Role is required');
  });

  it('should not mutate original content array', () => {
    const parts = [{ type: 'text', text: 'Hello' }];
    const msg = new ChatMessage('user', parts);
    parts.push({ type: 'extra', text: 'extra' });

    const map = msg.toMap();
    expect((map['content'] as unknown[]).length).toBe(1);
  });
});
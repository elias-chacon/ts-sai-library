export type ContentPart = Record<string, unknown>;

export class ChatMessage {
  private readonly role: string;
  private readonly content: ContentPart[];

  constructor(role: string, textOrContent: string | ContentPart[]) {
    if (!role) throw new Error('Role is required');

    this.role = role;
    this.content =
      typeof textOrContent === 'string'
        ? [{ type: 'text', text: textOrContent }]
        : [...textOrContent];
  }

  toMap(): Record<string, unknown> {
    return { role: this.role, content: this.content };
  }
}
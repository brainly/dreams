export class DocumentNode {
  readonly type = 'DOCUMENT';

  constructor() {}

  toJSON() {
    return {
      type: this.type,
    };
  }
}

export function createDocument() {
  return new DocumentNode();
}

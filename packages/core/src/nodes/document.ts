export class DocumentNode {
  readonly type = 'DOCUMENT';

  constructor() {}
  children: readonly SceneNode[];

  toJSON() {
    return {
      type: this.type,
    };
  }
}

export function createDocument() {
  return new DocumentNode();
}

import type { PageNode } from './page';

export class DocumentNode {
  readonly type = 'DOCUMENT';

  constructor() {}
  id: string = '0:0';
  name: string;
  readonly children: PageNode[] = [];

  appendChild(child: PageNode) {
    this.children.push(child);
    child.parent = this;
  }

  toJSON() {
    return {
      document: {
        id: this.id,
        type: this.type,
        name: this.name,
        children: this.children.map((child) => child.toJSON()),
      },
    };
  }
}

export function createDocument() {
  return new DocumentNode();
}

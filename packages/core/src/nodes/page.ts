import type { DocumentNode } from './document';
import { SceneNode } from './scene';

export class PageNode {
  readonly type = 'PAGE';

  guides: readonly Guide[] = [];
  backgrounds: readonly Paint[] = [];
  id: string = '';
  parent: DocumentNode | null = null;
  name: string = '';
  readonly children: SceneNode[] = [];

  appendChild(child: SceneNode) {
    this.children.push(child);
    child.parent = this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      guides: this.guides,
      backgrounds: this.backgrounds,
      parent: this.parent,
      children: this.children.map((child) => child.toJSON()),
    };
  }
}

export function createPage() {
  return new PageNode();
}

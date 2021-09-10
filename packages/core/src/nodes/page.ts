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
      guides: this.guides,
      backgrounds: this.backgrounds,
      id: this.id,
      parent: this.parent,
      name: this.name,
      children: this.children.map((child) => child.toJSON()),
    };
  }
}

export function createPage() {
  return new PageNode();
}

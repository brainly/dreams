import type { DocumentNode } from './document';
import { SceneNode } from './scene';

export class PageNode {
  readonly type = 'PAGE';

  guides: readonly Guide[] = [];
  backgrounds: readonly Paint[] = [
    {
      blendMode: 'NORMAL',
      color: {
        b: 0.8980392217636108,
        g: 0.8980392217636108,
        r: 0.8980392217636108,
      },
      opacity: 1,
      type: 'SOLID',
      visible: true,
    },
  ];
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
      type: 'CANVAS',
      guides: this.guides,
      backgrounds: this.backgrounds,
      children: this.children.map((child) => child.toJSON()),
    };
  }
}

export function createPage() {
  return new PageNode();
}

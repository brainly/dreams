import type { DocumentNode } from './document';
import { SceneNode } from './scene';

export class PageNode {
  static #refcount = 0;
  readonly type: SceneNodeType = 'PAGE';

  id: string = `Page:${++PageNode.#refcount}`;
  name: string = this.id;

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

  parent: DocumentNode | null = null;
  readonly children: SceneNode[] = [];

  appendChild(child: SceneNode | null | undefined) {
    if (!child) {
      return;
    }
    this.children.push(child);
    child.parent = this;
  }

  findAll(callback?: (node: SceneNode) => boolean): SceneNode[] {
    const nodes: SceneNode[] = [];
    if (callback) {
      // find all children nodes that match the callback
      for (const child of this.children) {
        if (callback(child)) {
          nodes.push(child);
        }
      }
      for (const child of this.children) {
        nodes.push(...child.findAll(callback));
      }
    }
    return nodes;
  }

  findOne(callback?: (node: SceneNode) => boolean): SceneNode | null {
    if (callback) {
      // find first child node that matches the callback
      for (const child of this.children) {
        if (callback(child)) {
          return child;
        }
      }
      for (const child of this.children) {
        const node = child.findOne(callback);
        if (node) {
          return node;
        }
      }
    }
    return null;
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

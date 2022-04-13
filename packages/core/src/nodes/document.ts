import type { PageNode } from './page';
import type { SceneNode } from './scene';

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

  findAll(
    callback?: (node: SceneNode | PageNode) => boolean
  ): (SceneNode | PageNode)[] {
    const nodes: (SceneNode | PageNode)[] = [];
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

  findOne(
    callback?: (node: SceneNode | PageNode) => boolean
  ): SceneNode | PageNode | null {
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

// example
// "components": {
//         "0:2575": {
//           "key": "8935ede070ea1ce892244103695128e794ef1eb6",
//           "name": "size=32",
//           "description": "",
//           "documentationLinks": []
//         },

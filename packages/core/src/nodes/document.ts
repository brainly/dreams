import type { PageNode } from './page';
import type { SceneNode } from './scene';
import type { ComponentNode } from './component';
import type { ComponentSetNode } from './componentset';

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
      components: this.findAll((node) => node.type === 'COMPONENT').reduce(
        (acc, node: ComponentNode) => {
          acc[node.id] = {
            key: '',
            name: node.name,
            description: node.description,
            documentationLinks: node.documentationLinks,
          };
          return acc;
        },
        {}
      ),
      name: 'Figma Dreams Document',
      created: new Date().toISOString(),
      editorType: 'figma',
    };
  }
}

export function createDocument() {
  return new DocumentNode();
}

import type { DocumentNode } from './document';
import type { PageNode } from './page';

export class SceneNode {
  static #refcount = 0;

  readonly type: SceneNodeType;
  readonly id: string = `Node:${++SceneNode.#refcount}`;
  name: string;
  parent: SceneNode | DocumentNode | PageNode | null;
  children: SceneNode[] = [];

  readonly absoluteTransform: Transform = [
    [1, 0, 0],
    [0, 1, 0],
  ];
  relativeTransform: Transform = [
    [1, 0, 0],
    [0, 1, 0],
  ];

  width: number = 100;
  height: number = 100;
  rotation: number = 0;

  get x() {
    return this.relativeTransform[0][2];
  }

  set x(value: number) {
    this.relativeTransform[0][2] = value;
  }

  get y() {
    return this.relativeTransform[1][2];
  }

  set y(value: number) {
    this.relativeTransform[1][2] = value;
  }

  appendChild(child: SceneNode | null | undefined) {
    if (!child) {
      return;
    }
    this.children.push(child);
    if (!(child.parent instanceof SceneNode)) {
      child.x -= this.x;
      child.y -= this.y;
    }
    child.parent = this;
  }

  visible: boolean;
  locked: boolean;
  expanded: boolean;

  pluginData: Map<string, string> = new Map();
  sharedPluginData: Map<string, string> = new Map();

  setPluginData(key: string, value: string) {
    this.pluginData.set(key, value);
  }

  getPluginData(key: string) {
    return this.pluginData.get(key);
  }

  getPluginDataKeys(): string[] {
    return Array.from(this.pluginData.keys());
  }

  setSharedPluginData(key: string, value: string) {
    this.sharedPluginData.set(key, value);
  }

  getSharedPluginData(key: string) {
    return this.sharedPluginData.get(key);
  }

  getSharedPluginDataKeys(): string[] {
    return Array.from(this.sharedPluginData.keys());
  }

  meta: JSONValue;

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

  clone(): this {
    const node = new (this.constructor as any)();
    // copy properties from this node
    console.log('cloning', this.constructor.name, this);
    for (const key in this as SceneNode) {
      if (
        key === 'type' ||
        key === 'id' ||
        key === 'name' ||
        key === 'parent' ||
        typeof this[key] === 'function'
      ) {
        continue;
      }

      if (key === 'children') {
        node.children = this.children.map((child) => {
          const clonedChild = child.clone();
          clonedChild.parent = node;
          return clonedChild;
        });
        continue;
      }

      // structured clone is used to handle arrays and nested objects
      try {
        node[key] = structuredClone(this[key]);
      } catch (e) {
        console.error(
          `Error while creating structred clone of ${key} in ${this.name}(${this.id}). Fallback to copy reference.`,
          e
        );
        node[key] = this[key];
      }
    }
    return node;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      children: this.children.map((child) => child.toJSON()),
      relativeTransform: this.relativeTransform,
      size: {
        x: this.width,
        y: this.height,
      },
      absoluteBoundingBox: {
        x: this.absoluteTransform[0][2],
        y: this.absoluteTransform[1][2],
        width: this.width,
        height: this.height,
      },
      visible: this.visible,
      locked: this.locked,
      expanded: this.expanded,
      pluginData: Array.from(this.pluginData.entries()),
      sharedPluginData: Array.from(this.sharedPluginData.entries()),
      meta: this.meta,
    };
  }
}

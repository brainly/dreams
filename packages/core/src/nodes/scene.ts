import type { DocumentNode } from './document';
import type { PageNode } from './page';

export class SceneNode {
  static #refcount = 0;

  readonly type: string;
  id: string = `Node:${++SceneNode.#refcount}`;
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
    };
  }
}

import { SceneNode } from './scene';

export class FrameNode extends SceneNode {
  readonly type = 'FRAME';

  constructor() {
    super();
  }

  toJSON() {
    const json = super.toJSON();
    return json;
  }
}

export function createFrameNode() {
  return new FrameNode();
}

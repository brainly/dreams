import { SceneNode } from './scene';

export class FrameNode extends SceneNode {
  readonly type = 'frame';

  constructor() {
    super();
  }
}

export function createFrameNode() {
  return new FrameNode();
}

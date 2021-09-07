import { SceneNode } from './SceneNode';

class FrameNode extends SceneNode {
  readonly type = 'frame';

  constructor() {
    super();
  }
}

export { FrameNode };

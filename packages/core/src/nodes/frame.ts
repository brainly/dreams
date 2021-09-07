import { SceneNode } from './scene';

class FrameNode extends SceneNode {
  readonly type = 'frame';

  constructor() {
    super();
  }
}

export { FrameNode };

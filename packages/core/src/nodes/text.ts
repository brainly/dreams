import { SceneNode } from './scene';

class TextNode extends SceneNode {
  readonly type = 'text';

  constructor() {
    super();
  }
}

export { TextNode };

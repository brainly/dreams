import { SceneNode } from './scene';

class SvgNode extends SceneNode {
  readonly type = 'svg';

  constructor() {
    super();
  }
}

export { SvgNode };

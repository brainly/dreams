import { SceneNode } from './scene';

class GroupNode extends SceneNode {
  readonly type = 'group';

  constructor() {
    super();
  }
}

export { GroupNode };

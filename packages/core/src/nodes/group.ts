import { SceneNode } from './scene';

export class GroupNode extends SceneNode {
  readonly type = 'GROUP';

  constructor() {
    super();
  }
}

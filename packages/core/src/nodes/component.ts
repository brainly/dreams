import { SceneNode } from './scene';
import { FrameNode } from './frame';

export class ComponentNode extends FrameNode {
  //readonly type = 'COMPONENT';

  constructor() {
    super();
  }

  toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}

export function createComponent() {
  return new ComponentNode();
}

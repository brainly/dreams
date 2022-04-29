import { FrameNode } from './frame';
import { SceneNode } from './scene';
import { applyOverrides } from '../helpers/overrides';

export class InstanceNode extends FrameNode {
  readonly type: SceneNodeType = 'INSTANCE';

  constructor() {
    super();
  }

  componentId: string;
  variantProperties: { [property: string]: string } | null;

  applyOverrides(node: SceneNode) {
    applyOverrides(this, node);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      componentId: this.componentId,
      variantProperties: this.variantProperties,
    };
  }
}

import { FrameNode } from './frame';

export class InstanceNode extends FrameNode {
  //@ts-ignore
  readonly type = 'INSTANCE';

  constructor() {
    super();
  }

  componentId: string;
  variantProperties: { [property: string]: string } | null;

  toJSON() {
    return {
      ...super.toJSON(),
      componentId: this.componentId,
      variantProperties: this.variantProperties,
    };
  }
}

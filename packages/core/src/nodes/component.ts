import { FrameNode } from './frame';

export class ComponentNode extends FrameNode {
  //@ts-ignore
  readonly type = 'COMPONENT';

  constructor() {
    super();
  }

  variantProperties: { [property: string]: string } | null;

  toJSON() {
    return {
      ...super.toJSON(),
      variantProperties: this.variantProperties,
    };
  }
}

export function createComponent() {
  return new ComponentNode();
}

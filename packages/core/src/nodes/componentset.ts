import { FrameNode } from './frame';

export class ComponentSetNode extends FrameNode {
  //@ts-ignore
  readonly type = 'COMPONENT_SET';

  constructor() {
    super();
  }

  variantGroupProperties: { [property: string]: { values: string[] } };

  toJSON() {
    return {
      ...super.toJSON(),
      variantGroupProperties: this.variantGroupProperties,
    };
  }
}

export function createComponentSet() {
  return new ComponentSetNode();
}

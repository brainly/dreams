import { FrameNode } from './frame';

export class ComponentSetNode extends FrameNode {
  readonly type: SceneNodeType = 'COMPONENT_SET';

  constructor() {
    super();
  }

  variantGroupProperties: { [property: string]: { values: string[] } };
  description: string;
  documentationLinks: DocumentationLink[];

  toJSON() {
    return {
      ...super.toJSON(),
      variantGroupProperties: this.variantGroupProperties,
      description: this.description,
      documentationLinks: this.documentationLinks,
    };
  }
}

export function createComponentSet() {
  return new ComponentSetNode();
}

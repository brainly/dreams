import { FrameNode } from './frame';

export class ComponentNode extends FrameNode {
  //@ts-ignore
  readonly type = 'COMPONENT';

  constructor() {
    super();
  }

  variantProperties: { [property: string]: string } | null;
  description: string;
  documentationLinks: DocumentationLink[];

  toJSON() {
    return {
      ...super.toJSON(),
      variantProperties: this.variantProperties,
      description: this.description,
      documentationLinks: this.documentationLinks,
    };
  }
}

export function createComponent() {
  return new ComponentNode();
}

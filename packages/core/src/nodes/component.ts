import { FrameNode } from './frame';
import { InstanceNode } from './instance';

export class ComponentNode extends FrameNode {
  //@ts-ignore
  readonly type = 'COMPONENT';

  constructor() {
    super();
  }

  variantProperties: { [property: string]: string } | null;
  description: string;
  documentationLinks: DocumentationLink[];

  createInstance() {
    const instance = new InstanceNode();
    instance.componentId = this.id;
    instance.variantProperties = { ...this.variantProperties };
    return instance;
  }

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

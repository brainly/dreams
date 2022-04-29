import { FrameNode } from './frame';
import { InstanceNode } from './instance';

export class ComponentNode extends FrameNode {
  readonly type: SceneNodeType = 'COMPONENT';

  constructor() {
    super();
  }

  variantProperties: { [property: string]: string } | null;
  description: string;
  documentationLinks: DocumentationLink[];

  createInstance() {
    const instance = new InstanceNode();
    instance.componentId = this.id;

    const copy = this.clone();

    Object.keys(this).forEach((key) => {
      if (
        key === 'type' ||
        key === 'id' ||
        key === 'relativeTransform' ||
        key === 'x' ||
        key === 'y' ||
        key === 'parent' ||
        typeof this[key] === 'function'
      ) {
        return;
      }
      instance[key] = copy[key];
    });

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

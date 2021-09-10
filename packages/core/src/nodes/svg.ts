import { SceneNode } from './scene';

export class SvgNode extends SceneNode {
  readonly type = 'SVG';

  constructor() {
    super();
  }

  content: string;

  toJSON() {
    return {
      ...super.toJSON(),
      content: this.content,
    };
  }
}

export function createSvg() {
  return new SvgNode();
}

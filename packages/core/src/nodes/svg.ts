import { FrameNode } from './frame';

export class SvgNode extends FrameNode {
  readonly type: SceneNodeType = 'SVG';

  constructor() {
    super();
  }

  content: string;
  flatten: boolean;

  toJSON() {
    return {
      ...super.toJSON(),
      content: this.content,
      flatten: this.flatten,
    };
  }
}

export function createSvg() {
  return new SvgNode();
}

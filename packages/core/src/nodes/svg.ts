import { FrameNode } from './frame';

export class SvgNode extends FrameNode {
  // @ts-ignore
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

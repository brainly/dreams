import { SceneNode } from './scene';

export class SvgNode extends SceneNode {
  readonly type = 'SVG';

  constructor() {
    super();
  }

  content: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;

  toJSON() {
    const json = super.toJSON();
    return json;
  }
}

export function createSvg() {
  return new SvgNode();
}

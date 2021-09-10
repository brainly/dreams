import { SceneNode } from './scene';

export class FrameNode extends SceneNode {
  readonly type = 'FRAME';

  constructor() {
    super();
  }

  layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  primaryAxisSizingMode: 'FIXED' | 'AUTO';
  counterAxisSizingMode: 'FIXED' | 'AUTO';
  primaryAxisAlignItems: 'MIN' | 'MAX' | 'CENTER' | 'SPACE_BETWEEN';
  counterAxisAlignItems: 'MIN' | 'MAX' | 'CENTER';
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  itemSpacing: number;
  layoutGrids: readonly LayoutGrid[];
  gridStyleId: string;
  clipsContent: boolean;
  guides: readonly Guide[];

  strokeCap: StrokeCap | typeof figma.mixed;
  strokeMiterLimit: number;

  strokes: readonly Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: typeof figma.mixed | StrokeJoin;
  strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE';
  dashPattern: readonly number[];
  fills: readonly Paint[] | typeof figma.mixed;
  fillStyleId: string | typeof figma.mixed;
  cornerRadius: number | typeof figma.mixed;
  cornerSmoothing: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
  opacity: number;
  blendMode: 'PASS_THROUGH' | BlendMode;
  isMask: boolean;
  effects: readonly Effect[];
  effectStyleId: string;

  constraints: Constraints;
  constrainProportions: boolean;
  layoutAlign: 'MIN' | 'MAX' | 'CENTER' | 'STRETCH' | 'INHERIT';
  layoutGrow: number;

  overflowDirection: OverflowDirection;
  numberOfFixedChildren: number;
  overlayPositionType: OverlayPositionType;
  overlayBackground: OverlayBackground;
  overlayBackgroundInteraction: OverlayBackgroundInteraction;

  toJSON() {
    const json = super.toJSON();
    return json;
  }
}

export function createFrame() {
  return new FrameNode();
}

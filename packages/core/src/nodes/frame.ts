import { SceneNode } from './scene';

export class FrameNode extends SceneNode {
  readonly type: SceneNodeType = 'FRAME';

  constructor() {
    super();
  }

  layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';

  primaryAxisSizingMode: 'FIXED' | 'AUTO'; // applicable only for autolayout (layoutMode != "NONE)
  counterAxisSizingMode: 'FIXED' | 'AUTO'; // applicable only for autolayout
  primaryAxisAlignItems: 'MIN' | 'MAX' | 'CENTER' | 'SPACE_BETWEEN'; // applicable only for autolayout
  counterAxisAlignItems: 'MIN' | 'MAX' | 'CENTER'; // applicable only for autolayout
  paddingLeft: number; // applicable only for autolayout
  paddingRight: number; // applicable only for autolayout
  paddingTop: number; // applicable only for autolayout
  paddingBottom: number; // applicable only for autolayout
  itemSpacing: number; // applicable only for autolayout
  itemReverseZIndex: boolean; // applicable only for autolayout
  strokesIncludedInLayout: boolean; // applicable only for autolayout

  layoutGrids: readonly LayoutGrid[];
  gridStyleId: string;
  clipsContent: boolean;
  guides: readonly Guide[];

  strokeCap: StrokeCap;
  strokeMiterLimit: number;

  strokes: readonly Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: StrokeJoin;
  strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE';
  dashPattern: readonly number[];
  fills: readonly Paint[];
  fillStyleId: string;
  cornerRadius: number;
  cornerSmoothing: number;
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
  opacity: number;
  blendMode: 'PASS_THROUGH' | BlendMode = 'PASS_THROUGH';
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
    return {
      ...super.toJSON(),
      // Sort children visually to correctly hadnle auto layout.
      // When autoalyout is enabled from plugin API, children are displayed in the same order as they're present in the layers tree.
      // One one if the adjustments Figma UI applies, is to sort children visually which is not the case within Figma plugin API.
      children: this.children
        .sort((a, b) => {
          if (this.layoutMode === 'HORIZONTAL') {
            return a.x - b.x;
          }
          if (this.layoutMode === 'VERTICAL') {
            return a.y - b.y;
          }
          return 0;
        })
        .map((child) => child.toJSON()),
      layoutMode: this.layoutMode,
      primaryAxisSizingMode: this.primaryAxisSizingMode,
      counterAxisSizingMode: this.counterAxisSizingMode,
      primaryAxisAlignItems: this.primaryAxisAlignItems,
      counterAxisAlignItems: this.counterAxisAlignItems,
      paddingLeft: this.paddingLeft,
      paddingRight: this.paddingRight,
      paddingTop: this.paddingTop,
      paddingBottom: this.paddingBottom,
      itemSpacing: this.itemSpacing,
      itemReverseZIndex: this.itemReverseZIndex,
      strokesIncludedInLayout: this.strokesIncludedInLayout,
      layoutGrids: this.layoutGrids,
      gridStyleId: this.gridStyleId,
      clipsContent: this.clipsContent,
      guides: this.guides,
      strokeCap: this.strokeCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokes: this.strokes,
      strokeStyleId: this.strokeStyleId,
      strokeWeight: this.strokeWeight,
      strokeJoin: this.strokeJoin,
      strokeAlign: this.strokeAlign,
      dashPattern: this.dashPattern,
      fills: this.fills?.map((fill) =>
        fill.type === 'IMAGE'
          ? {
              type: fill.type,
              blendMode: fill.blendMode,
              scaleMode: fill.scaleMode,
              imageRef: fill.imageHash,
            }
          : fill
      ),
      fillStyleId: this.fillStyleId,
      cornerRadius: this.cornerRadius,
      cornerSmoothing: this.cornerSmoothing,
      topLeftRadius: this.topLeftRadius,
      topRightRadius: this.topRightRadius,
      bottomLeftRadius: this.bottomLeftRadius,
      bottomRightRadius: this.bottomRightRadius,
      opacity: this.opacity,
      blendMode: this.blendMode,
      isMask: this.isMask,
      effects: this.effects,
      effectStyleId: this.effectStyleId,
      constraints: this.constraints,
      constrainProportions: this.constrainProportions,
      layoutAlign: this.layoutAlign,
      layoutGrow: this.layoutGrow,
      overflowDirection: this.overflowDirection,
      numberOfFixedChildren: this.numberOfFixedChildren,
      overlayPositionType: this.overlayPositionType,
      overlayBackground: this.overlayBackground,
      overlayBackgroundInteraction: this.overlayBackgroundInteraction,
    };
  }
}

export function createFrame() {
  return new FrameNode();
}

import { SceneNode } from './scene';

export class TextNode extends SceneNode {
  readonly type = 'TEXT';

  constructor() {
    super();
  }

  textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical: 'CENTER' | 'TOP' | 'BOTTOM';
  textAutoResize: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT';
  paragraphIndent: number;
  paragraphSpacing: number;
  autoRename: boolean;
  textStyleId: string | typeof figma.mixed;

  id: string;
  parent: (BaseNode & ChildrenMixin) | null;
  name: string;
  removed: boolean;

  visible: boolean;
  locked: boolean;
  reactions: readonly Reaction[];
  opacity: number;
  blendMode: 'PASS_THROUGH' | BlendMode;
  isMask: boolean;
  effects: readonly Effect[];
  effectStyleId: string;
  strokeCap: typeof figma.mixed | StrokeCap;
  strokeMiterLimit: number;

  strokes: readonly Paint[];
  strokeStyleId: string;
  strokeWeight: number;
  strokeJoin: typeof figma.mixed | StrokeJoin;
  strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE';
  dashPattern: readonly number[];
  fills: typeof figma.mixed | readonly Paint[];
  fillStyleId: string | typeof figma.mixed;
  absoluteTransform: Transform;
  relativeTransform: Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: 'CENTER' | 'MIN' | 'MAX' | 'STRETCH' | 'INHERIT';
  layoutGrow: number;

  constraints: Constraints;
  hasMissingFont: boolean;
  fontSize: number | typeof figma.mixed;
  fontName: typeof figma.mixed | FontName;
  textCase: typeof figma.mixed | TextCase;
  textDecoration: typeof figma.mixed | TextDecoration;
  letterSpacing: typeof figma.mixed | LetterSpacing;
  lineHeight: typeof figma.mixed | LineHeight;
  hyperlink: typeof figma.mixed | HyperlinkTarget | null;
  characters: string;

  toJSON() {
    const json = super.toJSON();
    return json;
  }
}

export function createText() {
  return new TextNode();
}

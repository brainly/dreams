import { SceneNode } from './scene';

export class TextNode extends SceneNode {
  readonly type: SceneNodeType = 'TEXT';

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

  reactions: readonly Reaction[];
  opacity: number;
  blendMode: 'PASS_THROUGH' | BlendMode = 'PASS_THROUGH';
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
  constrainProportions: boolean;
  layoutAlign: 'CENTER' | 'MIN' | 'MAX' | 'STRETCH' | 'INHERIT';
  layoutGrow: number;

  constraints: Constraints;
  hasMissingFont: boolean;
  fontSize: number;
  fontName: FontName;
  fontWeight: number;
  textCase: TextCase;
  textDecoration: TextDecoration;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;
  hyperlink: HyperlinkTarget | null;
  characters: string;

  toJSON() {
    return {
      ...super.toJSON(),
      paragraphIndent: this.paragraphIndent,
      paragraphSpacing: this.paragraphSpacing,
      autoRename: this.autoRename,
      textStyleId: this.textStyleId,
      reactions: this.reactions,
      opacity: this.opacity,
      blendMode: this.blendMode,
      isMask: this.isMask,
      effects: this.effects,
      effectStyleId: this.effectStyleId,
      strokeCap: this.strokeCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokes: this.strokes,
      strokeStyleId: this.strokeStyleId,
      strokeWeight: this.strokeWeight,
      strokeJoin: this.strokeJoin,
      strokeAlign: this.strokeAlign,
      dashPattern: this.dashPattern,
      fills: this.fills,
      fillStyleId: this.fillStyleId,
      constrainProportions: this.constrainProportions,
      layoutAlign: this.layoutAlign,
      layoutGrow: this.layoutGrow,
      constraints: this.constraints,
      textDecoration: this.textDecoration,

      hyperlink: this.hyperlink,
      characters: this.characters,
      style: {
        fontFamily: this.fontName.family,
        fontWeight: this.fontWeight,
        textCase: this.textCase,
        textAutoResize: this.textAutoResize,
        fontSize: this.fontSize,
        textAlignHorizontal: this.textAlignHorizontal,
        textAlignVertical: this.textAlignVertical,
        letterSpacing: this.letterSpacing.value,
        lineHeightPx:
          this.lineHeight.unit === 'PIXELS'
            ? this.lineHeight.value
            : this.lineHeight.unit === 'PERCENT'
            ? this.lineHeight.value * this.fontSize
            : 0,
        lineHeightPercent:
          this.lineHeight.unit === 'PERCENT' ? this.lineHeight.value : 0,
        lineHeightUnit: this.lineHeight.unit,
      },
    };
  }
}

export function createText() {
  return new TextNode();
}

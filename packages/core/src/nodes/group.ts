import { SceneNode } from './scene';

export class GroupNode extends SceneNode {
  readonly type = 'GROUP';

  constructor() {
    super();
  }
  id: string;
  parent: SceneNode | null;
  name: string;
  removed: boolean;

  visible: boolean;
  locked: boolean;
  reactions: readonly Reaction[];
  children: readonly SceneNode[];

  expanded: boolean;

  opacity: number;
  blendMode: 'PASS_THROUGH' | BlendMode;
  isMask: boolean;
  effects: readonly Effect[];
  effectStyleId: string;

  absoluteTransform: Transform;
  relativeTransform: Transform;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  constrainProportions: boolean;
  layoutAlign: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT';
  layoutGrow: number;
}

export function createGroup(): GroupNode {
  return new GroupNode();
}

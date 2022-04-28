import { SceneNode } from './scene';

export class GroupNode extends SceneNode {
  readonly type: NodeType = 'GROUP';

  constructor() {
    super();
  }

  reactions: readonly Reaction[];

  opacity: number;
  blendMode: 'PASS_THROUGH' | BlendMode = 'PASS_THROUGH';
  isMask: boolean;
  effects: readonly Effect[];
  effectStyleId: string;

  constrainProportions: boolean;
  layoutAlign: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT';
  layoutGrow: number;
}

export function createGroup(): GroupNode {
  return new GroupNode();
}

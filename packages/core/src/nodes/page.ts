import { SceneNode } from './scene';

export class PageNode extends SceneNode {
  readonly type = 'PAGE';

  constructor() {
    super();
  }

  guides: readonly Guide[];
  backgrounds: readonly Paint[];
  id: string;
  parent: (BaseNode & ChildrenMixin) | null;
  name: string;
  removed: boolean;

  children: readonly SceneNode[];

  toJSON() {
    const json = super.toJSON();
    return json;
  }
}

export function createPage() {
  return new PageNode();
}

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

type SceneNodeType =
  | 'DOCUMENT'
  | 'PAGE'
  | 'FRAME'
  | 'INSTANCE'
  | 'GROUP'
  | 'SVG'
  | 'COMPONENT'
  | 'TEXT'
  | 'COMPONENT_SET';

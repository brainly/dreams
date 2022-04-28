type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

type NodeType =
  | 'DOCUMENT'
  | 'PAGE'
  | 'FRAME'
  | 'INSTANCE'
  | 'GROUP'
  | 'SVG'
  | 'COMPONENT'
  | 'TEXT'
  | 'COMPONENT_SET';

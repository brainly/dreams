import { SceneNode } from '../nodes/scene';
// TODO: this is a mess, need to clean up
export function applyOverrides(dest: SceneNode, source: SceneNode) {
  for (const key in source) {
    if (key in dest) {
      if (
        key === 'type' ||
        key === 'id' ||
        key === 'name' ||
        typeof source[key] === 'function'
      ) {
        continue;
      }

      // apply overrides within children nodes
      if (key === 'children') {
        dest[key] = dest[key].map((child, index) => {
          if (source[key][index]) {
            return applyOverrides(child, source[key][index]);
          } else {
            return child;
          }
        });
      } else {
        dest[key] = source[key];
      }
    }
  }
  return dest;
}

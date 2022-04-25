import { FrameNode } from './frame';
import { InstanceNode } from './instance';
import { SceneNode } from './scene';

export function applyOverrides(dest: SceneNode, source: SceneNode) {
  for (const key in source) {
    if (key in dest && key in source) {
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

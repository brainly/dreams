import { SceneNode } from '../nodes/scene';

// TODO: use strucuredClone or SceneNode.clone() instead
export function applyOverrides(dest: SceneNode, source: SceneNode) {
  for (const key in source) {
    if (
      key === 'type' ||
      key === 'id' ||
      key === 'name' ||
      key === 'parent' ||
      typeof source[key] === 'function'
    ) {
      continue;
    }

    // apply overrides within children nodes
    if (key === 'children') {
      source[key].forEach((child, index) => {
        applyOverrides(child, source[key][index]);
      });
    } else {
      dest[key] = source[key];
    }
  }

  return dest;
}

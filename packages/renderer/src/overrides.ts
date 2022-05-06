// TODO: This is similar function to the one in core package but with more robust setter.
// Consider moving to shared package.
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
      try {
        dest[key] = source[key];
      } catch (e) {
        console.info(
          `Cannot to set property ${key} on node ${dest.id}. Skiping.`
        );
      }
    }
  }

  return dest;
}

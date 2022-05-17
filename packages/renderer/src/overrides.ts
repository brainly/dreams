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
      dest[key].forEach((child, index) => {
        applyOverrides(child, source[key][index]);
      });
    } else {
      try {
        // This is a workaround for the fact that overriding 'fills'
        // doesn't work correctly when applying to instance with 'fillStyleId' defined
        // and 'fillStyleId' within overrides wasn't set before.
        console.log('overriding', key, source[key], dest[key]);
        if (key === 'fills') {
          const paintStyle = figma.createPaintStyle();
          paintStyle.paints = source[key];
          paintStyle.name = 'override';
          dest['fillStyleId'] = paintStyle.id;
          dest['fillStyleId'] = '';
          paintStyle.remove();
        } else {
          dest[key] = source[key];
        }
      } catch {
        /* ... */
      }
    }
  }

  return dest;
}

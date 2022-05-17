function updateNode(dest, source) {
  for (const key in source) {
    if (
      key === 'type' ||
      key === 'id' ||
      key === 'name' ||
      key === 'parent' ||
      key === 'relativeTransform' ||
      key === 'x' ||
      key === 'y' ||
      key === 'textTruncation' ||
      key === 'horizontalPadding' ||
      key === 'verticalPadding' ||
      typeof source[key] === 'function'
    ) {
      continue;
    }

    // apply overrides within children nodes
    if (key === 'children') {
      console.log('cloning', key, source[key], dest[key], dest.type);
      const newChildren = source.children.map((child) => child.clone());
      dest.children.forEach((child) => child.remove());
      newChildren.forEach((child) => dest.appendChild(child));
    } else {
      try {
        console.log('updating', key, source[key], dest[key], dest.type);
        dest[key] = source[key];
      } catch {
        /* ... */
      }
    }
  }

  return dest;
}

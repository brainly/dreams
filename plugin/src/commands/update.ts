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

// compare variant properties between components and return tru if components match
function compareProperties(
  propertiesA: Record<string, string> | null = {},
  propertiesB: Record<string, string> | null = {},
  propertiesMap: Record<string, Record<string, string>> = {}
) {
  if (!propertiesA || !propertiesB) {
    return false;
  }

  const propertiesAKeys = Object.keys(propertiesA);
  const propertiesBKeys = Object.keys(propertiesB);

  if (propertiesAKeys.length === 0 || propertiesBKeys.length === 0) {
    console.log(
      'Properties should have at least on key.',
      propertiesA,
      propertiesB
    );
    return false;
  }

  if (propertiesAKeys.length !== propertiesBKeys.length) {
    console.log(
      "Number of properties doesn't match.",
      propertiesAKeys,
      propertiesBKeys
    );
    return false;
  }

  for (const key of propertiesAKeys) {
    if (propertiesMap[key]) {
      if (propertiesMap[key][propertiesA[key]] !== propertiesB[key]) {
        return false;
      }
    } else {
      if (propertiesA[key] !== propertiesB[key]) {
        return false;
      }
    }
  }

  return true;
}

// Update current component set with the components from new component set
function update(
  currentSet: ComponentSetNode,
  newSet: ComponentSetNode,
  propertiesMap: Record<string, Record<string, string>>
) {
  // iterate through new components children and update current components childrenś
  newSet.children.forEach((updated) => {
    const found = currentSet.children.find((component: ComponentNode) => {
      return (
        component.type === updated.type &&
        compareProperties(
          component.variantProperties,
          updated.variantProperties,
          propertiesMap
        )
      );
    });
    if (found) {
      console.log('updating', found.name, updated.name);
      updateNode(found, updated);
    } else {
      //currentSet.appendChild(newChild);
    }
  });
}

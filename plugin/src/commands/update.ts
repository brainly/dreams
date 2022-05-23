figma.parameters.on('input', ({ key, query, result, parameters }) => {
  const selection = figma.currentPage.selection;

  switch (key) {
    case 'update_version': {
      if (
        selection.filter((node) => node.type === 'COMPONENT_SET').length !== 2
      ) {
        result.setError('Select 2 component sets.');
        return;
      }

      const componentSetA = selection[0] as ComponentSetNode;
      const componentSetB = selection[1] as ComponentSetNode;

      const suggestions = [componentSetB, componentSetA].map((set) => {
        const version =
          set.getSharedPluginData('dreams', 'version') || 'unversioned';
        const name = `-> ${version}`;

        return {
          name: name,
          data: {
            id: set.id,
          },
        };
      });

      result.setSuggestions(suggestions.filter((s) => s.name.includes(query)));

      break;
    }
    case 'update_map': {
      const suggestions: Array<{ name: string; data: any }> = [
        {
          name: 'No mapping',
          data: {
            type: 'none',
          },
        },
      ];

      const componentSetA = selection[0] as ComponentSetNode;
      const componentSetB = selection[1] as ComponentSetNode;

      let newComponentSet = componentSetA;
      let currentComponentSet = componentSetB;

      console.log(parameters);
      if (parameters.update_version) {
        const updateTo = parameters.update_version.id;
        if (updateTo === componentSetB.id) {
          newComponentSet = componentSetB;
          currentComponentSet = componentSetA;
        }
      }

      // const autoMap = Object.keys(
      //   currentComponentSet.variantGroupProperties
      // ).flatMap((key) => {
      //   const currentVariantGroup =
      //     currentComponentSet.variantGroupProperties[key].values;
      //   const newVariantGroup =
      //     newComponentSet.variantGroupProperties[key]?.values;

      //   if (!newVariantGroup) {
      //     return null;
      //   }

      //   if (compareArrays(currentVariantGroup, newVariantGroup)) {
      //     return null;
      //   }

      //   return currentVariantGroup.map((value, index) => {
      //     return {
      //       description: `${key}: ${value} -> ${newVariantGroup[index]}`,
      //       map: {
      //         [key]: {
      //           [value]: newVariantGroup[index],
      //         },
      //       },
      //     };
      //   });
      // });

      suggestions.push({
        name: 'toggle: peach -> red, mustard -> yellow',
        data: {
          type: 'auto',
          map: {
            toggle: {
              peach: 'red',
              mustard: 'yellow',
            },
          },
        },
      });

      result.setSuggestions(suggestions.filter((s) => s.name.includes(query)));

      break;
    }
  }
});

export async function update(parameters: ParameterValues = {}) {
  const selection = figma.currentPage.selection;
  const componentSetA = selection[0] as ComponentSetNode;
  const componentSetB = selection[1] as ComponentSetNode;

  let newComponentSet = componentSetA;
  let currentComponentSet = componentSetB;

  console.log(parameters);
  if (parameters.update_version) {
    const updateTo = parameters.update_version.id;
    if (updateTo === componentSetB.id) {
      newComponentSet = componentSetB;
      currentComponentSet = componentSetA;
    }
  }

  updateVariant(
    currentComponentSet,
    newComponentSet,
    parameters.update_map.map
  );
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

function compareArrays(arrayA: string[], arrayB: string[]) {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (const item of arrayA) {
    if (!arrayB.includes(item)) {
      return false;
    }
  }

  return true;
}

// Update current component set with the components from new component set
function updateVariant(
  currentSet: ComponentSetNode,
  newSet: ComponentSetNode,
  propertiesMap: Record<string, Record<string, string>>
) {
  // compare variant group properties
  const currentVariantKeys = Object.keys(currentSet.variantGroupProperties);
  const newVariantKeys = Object.keys(newSet.variantGroupProperties);

  if (!compareArrays(currentVariantKeys, currentVariantKeys)) {
    console.log(
      'Variant group properties do not match.',
      currentVariantKeys,
      newVariantKeys
    );
    return;
  }

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
      console.log('Updating component', found.name, updated.name);
      updateNode(found, updated);
    } else {
      console.log(
        'Existing component not found. New component should be addded',
        updated.name
      );

      // TODO: this need to be implemented
      //currentSet.appendChild(updated.clone());
    }
  });
}

function updateNode(dest, source) {
  for (const key in source) {
    if (
      key === 'type' ||
      key === 'id' ||
      key === 'key' ||
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
      console.log('Cloning children', source[key], dest[key], dest.type);
      const newChildren = source.children.map((child) => child.clone());
      dest.children.forEach((child) => child.remove());
      newChildren.forEach((child) => dest.appendChild(child));
    } else {
      try {
        console.log(
          'Updating property',
          key,
          source[key],
          dest[key],
          dest.type
        );
        dest[key] = source[key];
      } catch {
        /* ... */
      }
    }
  }

  return dest;
}

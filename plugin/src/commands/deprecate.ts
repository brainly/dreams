const DEPRECATED_IMAGE_DATA =
  'iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACYSURBVHgB7ddLCoQwFETRu/N+O69W0Ikg/mpQg7qQqRyEJC9gTOi3LBnX4Kq44oorrrjiiiuuuOKKi8NtwFjc+vNIxq3fJRnnAg7GdNgTJOO+AgdjOjlNSMa9BQ7GdHEOk4x7ChyM6eYNRjLuLnAwpod3P8m4K+BgTC+nJpJxZ8DBmD7OmyTjjsDBmEyTOsm4HTgYk/mN8we1u6bYm03lggAAAABJRU5ErkJggg==';

const deprecatedImageArray = figma.base64Decode(DEPRECATED_IMAGE_DATA);
const deprecatedImage = figma.createImage(deprecatedImageArray);

figma.parameters.on('input', ({ key, query, result }) => {
  switch (key) {
    case 'deprecate_type': {
      const selection = figma.currentPage.selection;
      if (selection.length === 0) {
        result.setError('Select component set.');
        return;
      }

      if (selection.length > 1) {
        if (!selection.every((node) => node.type === 'COMPONENT')) {
          result.setError('Select only one component set.');
          return;
        }
      }

      if (selection.length === 1) {
        if (
          selection[0].type !== 'COMPONENT_SET' &&
          selection[0].type !== 'COMPONENT'
        ) {
          result.setError(
            'Selected item must be a componnet or a component set.'
          );
          return;
        }
      }

      if (selection.length === 1) {
        if (selection[0].type === 'COMPONENT_SET') {
          const componentSet = selection[0] as ComponentSetNode;

          const suggestions = [
            {
              name: 'All variants',
              data: {
                kind: 'component_set',
              },
            },
          ];

          suggestions.push(
            ...Object.keys(componentSet.variantGroupProperties).flatMap(
              (key) => {
                const array = componentSet.variantGroupProperties[key].values;
                const result = array.map((item) => {
                  return {
                    name: `${key} -> ${item}`,
                    data: {
                      kind: 'variant',
                      key,
                      value: item,
                    },
                  };
                });

                return result;
              }
            )
          );

          console.log('suggestions', suggestions);

          result.setSuggestions(
            suggestions.filter((s) => s.name.includes(query))
          );
        }
      }

      break;
    }
  }
});

export async function deprecate(parameters: ParameterValues = {}) {
  const selection = figma.currentPage.selection;

  if (selection.length !== 1) {
    figma.notify('Select component set.');
    return;
  }

  const type = parameters['deprecate_type'];

  switch (type.kind) {
    case 'component_set': {
      const componentSet = selection[0] as ComponentSetNode;
      const components = componentSet.children.filter(
        (component: ComponentNode): component is ComponentNode =>
          component.type === 'COMPONENT'
      );

      // Mark the component set as deprecated
      // without changing the name of all variants
      if (!componentSet.name.includes('DEPRECATED')) {
        componentSet.name = `${componentSet.name} ⚠️ [DEPRECATED]`;
      }
      const changed = deprecateComponents(components);

      figma.notify(`${changed.length} variants deprecated.`);
      break;
    }
    case 'variant': {
      if (selection.length !== 1 && selection[0].type !== 'COMPONENT_SET') {
        figma.notify('Select component set.');
        return;
      }

      const componentSet = selection[0] as ComponentSetNode;
      const variantGroupProperty =
        componentSet.variantGroupProperties[type.key];

      if (!variantGroupProperty.values.includes(type.value)) {
        figma.notify('Variant does not exist.');
        return;
      }

      const components = componentSet.children.filter(
        (component: ComponentNode): component is ComponentNode =>
          component.variantProperties?.[type.key] === type.value
      );

      // Mark component variant property as deprecated
      components.forEach((component) => {
        // skip if component is already deprecated
        if (component.variantProperties?.[type.key].includes('DEPRECATED')) {
          return;
        }

        // replace component name where applicable in a format key1=value1, key2=value2
        component.name = component.name.replace(
          `${type.key}=${type.value}`,
          `${type.key}=(DEPRECATED) ${type.value}`
        );
      });

      const changed = deprecateComponents(components);
      figma.notify(`${changed.length} variants deprecated.`);

      break;
    }
  }

  console.log('Run deprecate', parameters);
}

function deprecateComponents(components: ComponentNode[]) {
  const deprecatedName = '[DEPRECATED]';
  const found = components.filter((component) => {
    return !component.findOne((node) => node.name === deprecatedName);
  });

  found.forEach((component) => {
    const overlay = figma.createFrame();
    overlay.name = deprecatedName;
    overlay.resize(component.width, component.height);

    overlay.fills = [
      {
        blendMode: 'NORMAL',
        imageHash: deprecatedImage.hash,
        scaleMode: 'TILE',
        opacity: 0.7,
        type: 'IMAGE',
        visible: true,
      },
    ];

    component.appendChild(overlay);

    if (
      component.layoutMode === 'HORIZONTAL' ||
      component.layoutMode === 'VERTICAL'
    ) {
      //@ts-ignore
      overlay.layoutPositioning = 'ABSOLUTE';
    }

    overlay.constraints = {
      horizontal: 'STRETCH',
      vertical: 'STRETCH',
    };

    overlay.x = 0;
    overlay.y = 0;
  });

  return found;
}

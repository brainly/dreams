figma.parameters.on('input', ({ key, query, result }) => {
  switch (key) {
    case 'deprecate_type': {
      const selection = figma.currentPage.selection;
      if (selection.length === 0) {
        result.setError('Select component set.');
      }

      if (selection.length > 1) {
        if (!selection.every((node) => node.type === 'COMPONENT')) {
          result.setError(
            'All selected items must be a componnet or a component set.'
          );
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

          console.log(suggestions);

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
      figma.notify('All variants are not supported yet.');
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
        figma.notify('Variant does not exist.', { error: true });
        return;
      }

      const components = componentSet.children.filter(
        (component: ComponentNode): component is ComponentNode =>
          component.variantProperties?.[type.key] === type.value
      );

      // Mark component variant property as deprecated
      components.forEach((component) => {
        // replace component name where applicable in a format key1=value1, key2=value2
        component.name = component.name.replace(
          `${type.key}=${type.value}`,
          `${type.key}=(DEPRECATED) ${type.value}`
        );
      });

      deprecateComponents(components);

      break;
    }
  }

  console.log('Run deprecate', parameters);
}

function deprecateComponents(components: ComponentNode[]) {
  components.forEach((component) => {
    const overlay = figma.createFrame();
    overlay.name = 'Overlay';
    overlay.resize(component.width, component.height);

    overlay.fills = [
      {
        blendMode: 'NORMAL',
        color: {
          r: 1,
          g: 0,
          b: 1,
        },
        opacity: 0.7,
        type: 'SOLID',
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

    overlay.x = 0;
    overlay.y = 0;
  });
}

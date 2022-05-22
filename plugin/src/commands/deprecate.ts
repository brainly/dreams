figma.parameters.on('input', ({ key, query, result }) => {
  console.log('Received input', query, result);

  switch (key) {
    case 'deprecate_type': {
      //result.setSuggestions(numbers.filter((s) => s.includes(query)));
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
                type: 'component_set',
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
                      type: 'variant',
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
  const components = selection.filter(
    (node) => node.type === 'COMPONENT'
  ) as ComponentNode[];

  if (components.length === 0) {
    figma.notify(
      'Select at least one component. Components sets are not yet supported.'
    );
    return;
  }

  deprecateComponents(components);
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
        opacity: 0.5,
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

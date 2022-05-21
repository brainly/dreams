export async function deprecate() {
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

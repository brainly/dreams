// @ts-nocheck

const fontWeightMap = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
};

const loadedFonts = new Set();

async function createImageHash(base64string) {
  figma.ui.postMessage({ type: 'createImageFromString', data: base64string });

  // wait for the ui worker to finish
  const newBytes: Uint8Array = await new Promise((resolve) => {
    figma.ui.on('message', function callback(message) {
      if (message.type === 'createImageFromString') {
        console.log('createImageFromString', message);
        resolve(message.imageData);
        figma.ui.off('message', callback);
      }
    });
  });
  console.log('newBytes', newBytes);
  const { hash } = figma.createImage(newBytes);
  console.log('createImageHash', hash);
  return hash;
}

async function traverse(parent, options) {
  console.log('traverse', parent, options);
  if (parent.nodes) {
    for (const node of Object.values(parent.nodes)) {
      await traverse(node, options);
    }
  }

  if (parent.document) {
    await traverse(
      {
        ...parent.document,
        _document: parent.document,
      },
      options
    );
  }

  if (parent.children) {
    for (const child of parent.children) {
      await traverse(
        {
          ...child,
          _document: parent._document,
        },
        options
      );
    }
  }

  parent.type && (await options?.visit(parent));
}

function mapDataToConstraints(constraints) {
  let horizontal = constraints.horizontal;
  if (horizontal === 'LEFT') {
    horizontal = 'MIN';
  } else if (horizontal === 'RIGHT') {
    horizontal = 'MAX';
  } else if (horizontal === 'CENTER') {
    horizontal = 'CENTER';
  } else if (horizontal === 'LEFT_RIGHT') {
    horizontal = 'STRETCH';
  } else if (horizontal === 'SCALE') {
    horizontal = 'SCALE';
  } else {
    horizontal = 'MIN';
  }

  let vertical = constraints.vertical;
  if (vertical === 'TOP') {
    vertical = 'MIN';
  } else if (vertical === 'BOTTOM') {
    vertical = 'MAX';
  } else if (vertical === 'CENTER') {
    vertical = 'CENTER';
  } else if (vertical === 'TOP_BOTTOM') {
    vertical = 'STRETCH';
  } else if (vertical === 'SCALE') {
    vertical = 'SCALE';
  } else {
    vertical = 'MIN';
  }
  console.log('mapDataToConstraints', { horizontal, vertical });
  return { horizontal, vertical };
}

async function mapDataToNodeProps(data) {
  // remove read only props
  const { id, type, children, layoutGrids, variantProperties, ...writable } =
    data;

  const props = {
    ...writable,
    ...(data.constraints && {
      constraints: mapDataToConstraints(data.constraints),
    }),
    fills: await Promise.all(
      data.fills?.map(async (fill) => {
        return fill.type === 'SOLID'
          ? {
              ...fill,
              opacity: fill.color.a,
              color: {
                r: fill.color.r,
                g: fill.color.g,
                b: fill.color.b,
              },
            }
          : fill.type === 'IMAGE'
          ? {
              type: fill.type,
              scaleMode: fill.scaleMode,
              imageHash: await createImageHash(fill.imageRef),
              scalingFactor: fill.scalingFactor,
              imageTransform: fill.imageTransform,
              filters: fill.filters,
              visible: fill.visible,
              opacity: fill.opacity,
              blendMode: fill.blendMode,
            }
          : fill;
      }) ?? []
    ),
    strokes:
      data.strokes?.map((stroke) => ({
        ...stroke,
        opacity: stroke.color.a,
        color: {
          r: stroke.color.r,
          g: stroke.color.g,
          b: stroke.color.b,
        },
      })) ?? [],
    ...(data.size && {
      size: {
        x: data.size?.x ?? 100,
        y: data.size?.y ?? 100,
      },
    }),
    ...(data.layoutGrids
      ? {
          layoutGrids: data.layoutGrids.map(({ offset, ...grid }) => ({
            ...grid,
            ...(grid.alignment !== 'CENTER' ? { offset } : {}),
          })),
        }
      : {}),
    ...(data.style
      ? { textAutoResize: data.style?.textAutoResize ?? 'NONE' }
      : {}),
  };
  return props;
}

async function assignBasicProps(node, data) {
  console.log('assignBasicProps', data);
  const props = await mapDataToNodeProps(data);
  console.log({ props });

  // Layout related setters
  // It's important to set size before any other layout related props
  if (props.size != null && props.size.x > 0 && props.size.y > 0) {
    node.resize(props.size.x, props.size.y);
  }

  // Common properties
  Object.entries(props).forEach(([key, value]) => {
    if (key in node) {
      console.log(`set key`, key, value);
      node[key] = value;
    }
  });

  // Variant related properties
  if (data.variantProperties) {
    console.log('variantProperties', data.variantProperties);
    node.name = variantPropertiesToName(data.variantProperties);
  }

  return node;
}

function variantPropertiesToName(variantProperties) {
  return Object.entries(variantProperties)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ');
}

async function createNode(data) {
  let node;

  switch (data.type) {
    case 'BOOLEAN_OPERATION':
    case 'COMPONENT_SET':
    case 'DOCUMENT':
    case 'GROUP':
      console.error(
        `Creating ''${data.type}'' not supported! Frame created instead.`
      );
      node = figma.createFrame();
      break;
    case 'CANVAS':
    case 'PAGE': {
      node = figma.createPage();
      break;
    }
    case 'COMPONENT': {
      node = figma.createComponent();
      break;
    }
    case 'ELLIPSE': {
      node = figma.createEllipse();
      break;
    }
    case 'FRAME': {
      node = figma.createFrame();
      break;
    }
    case 'INSTANCE': {
      node = figma.createFrame();
      break;
    }
    case 'LINE': {
      node = figma.createLine();
      break;
    }
    case 'POLYGON': {
      node = figma.createPolygon();
      break;
    }
    case 'RECTANGLE': {
      node = figma.createRectangle();
      break;
    }
    case 'SLICE': {
      node = figma.createSlice();
      break;
    }
    case 'STAR': {
      node = figma.createStar();
      break;
    }
    case 'TEXT': {
      node = figma.createText();

      //We need to always set the family and style to something,
      //otherwise text styles set later will be ignored.
      const family =
        data.style.fontFamily === 'ProximaNova'
          ? 'Proxima Nova'
          : data?.style?.fontFamily || 'Roboto';
      const style = fontWeightMap[data?.style?.fontWeight] || 'Regular';
      console.log('style', {
        style,
      });

      const fontToLoad = `${family}-${style}`;
      if (!loadedFonts.has(fontToLoad)) {
        console.log('loading font', family, style);
        await figma.loadFontAsync({
          family,
          style,
        });
        loadedFonts.add(fontToLoad);
      }

      node.fontName = {
        family,
        style,
      };

      node.textAlignHorizontal = data.style?.textAlignHorizontal ?? 'LEFT';
      node.textAlignVertical = data.style?.textAlignVertical ?? 'TOP';
      node.fontSize = data.style?.fontSize ?? 14;
      node.textCase = data.style.textCase ?? 'ORIGINAL';

      // We need to explicitly disable autoresize during this phase to keep correct placement after setting x,y props.
      node.textAutoResize = 'NONE';

      node.letterSpacing = {
        unit: 'PIXELS',
        value: data.style.letterSpacing,
      };

      if (data.style.lineHeightUnit === 'AUTO') {
        node.lineHeight = {
          unit: 'AUTO',
        };
      } else {
        node.lineHeight = {
          unit:
            data.style.lineHeightUnit === 'FONT_SIZE_%' ? 'PERCENT' : 'PIXELS',
          value:
            data.style.lineHeightUnit === 'PIXELS'
              ? data.style.lineHeightPx
              : data.style.lineHeightPercentFontSize,
        };
      }

      break;
    }
    case 'VECTOR': {
      if (data.fillGeometry?.[0]?.path) {
        const svg = `<path fill-rule="${data.fillGeometry[0].windingRule.toLowerCase()}" d="${
          data.fillGeometry[0].path
        }" fill="currentColor" />`;
        console.log('VECTOR case', { svg });
        node = figma.createNodeFromSvg(svg);
      } else {
        node = figma.createVector();
      }
      break;
    }
    case 'SVG': {
      node = figma.createNodeFromSvg(data.content);
      break;
    }
    default: {
      node = figma.createFrame();
    }
  }

  console.log('node created', node.type, node.id);
  await assignBasicProps(node, data);

  // SVG-generated vectos.
  // Vector flattening is useful in the context of icon-related components because it produces a cleaner hierarchy.
  if (data.flatten) {
    try {
      console.log('flattening node', node.id);

      // We need to reset position of the originalNode to 0,0 before flattening
      // because it will be positioned by its new parent.
      const originalNode = node;
      originalNode.x = 0;
      originalNode.y = 0;
      const vector = figma.flatten([originalNode]);

      node = figma.createFrame();
      await assignBasicProps(node, data);
      node.appendChild(vector);

      // Flattened vector need to scale relative to its parent which reflects default svg behaviour.
      vector.constraints = {
        horizontal: 'SCALE',
        vertical: 'SCALE',
      };
    } catch (error) {
      console.error(
        `Error while flattening Node id: ${node.id}, name: ${node.name}`,
        error
      );
    }
  }

  return node;
}

let scrollAndZoom = {};

export async function render(json) {
  // Load default font.
  await figma.loadFontAsync({
    family: 'Roboto',
    style: 'Regular',
  });

  console.log('render', json);

  const nodes = new Map();
  await traverse(json, {
    visit: async (node) => {
      if (node.type === 'COMPONENT_SET') {
        // component set need to be handled separately as it is a special case
        // where all children components need to be passed to the component set during creation.
        const children = node.children?.map((child) => {
          const sceneChild = nodes.get(child.id);
          if (sceneChild) {
            if (sceneChild.type !== 'COMPONENT') {
              console.error(
                'Only component might be added to component set, ommiting.',
                sceneChild
              );
              // TODO: return error node to mark visually that this node is not added to component set.
              return null;
            }
            return nodes.get(child.id);
          }
        });

        const baseNode = figma.combineAsVariants(children, figma.currentPage);

        console.log('variant created', baseNode.type, baseNode.id);
        baseNode.name = node.name;

        nodes.set(node.id, baseNode);
      } else if (node.type !== 'DOCUMENT') {
        // Create all types of nodes beside DOCUMENT which represent the root node hadnled specificaly while traversing
        const baseNode = await createNode(node);
        if (!baseNode) {
          return;
        }

        nodes.set(node.id, baseNode);

        if (node.children.length === 1) {
          const sceneChild = nodes.get(node.children[0].id);
        }

        node.children?.forEach((child) => {
          const sceneChild = nodes.get(child.id);
          if (sceneChild) {
            if (
              node.children.length === 1 &&
              sceneChild.type === 'FRAME' &&
              sceneChild.width === baseNode.width &&
              sceneChild.height === baseNode.height &&
              sceneChild.x === 0 &&
              sceneChild.y === 0
            ) {
              // Merging parent and single child frame if they share the same size (and the child has no offset)
              // That way we can avoid creating unnecessary frames. One example of such situation is component with single svg-generated frame.
              console.log('merging parent and child', {
                parent: baseNode.id,
                child: sceneChild.id,
              });

              // Moving chilren of to-be-removed frame to the base
              sceneChild.children?.forEach((child) => {
                baseNode.appendChild(child);
              });

              // TODO: merge parent and child properties before removing sceneChild
              sceneChild.remove();
            } else {
              baseNode.appendChild(sceneChild);
            }
          }
        });
      }
    },
  });
}

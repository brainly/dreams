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

function mapDataToNodeProps(data) {
  // remove read only props
  const { id, type, children, layoutGrids, ...writable } = data;

  const props = {
    ...writable,
    primaryAxisSizingMode: data.primaryAxisSizingMode ?? 'AUTO',
    counterAxisSizingMode: data.counterAxisSizingMode ?? 'AUTO',
    ...(data.constraints && {
      constraints: {
        horizontal: data.constraints.horizontal === 'LEFT' ? 'MIN' : 'MAX',
        vertical: data.constraints.vertical === 'TOP' ? 'MIN' : 'MAX',
      },
    }),
    fills:
      data.fills?.map((fill) => {
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
          : fill;
      }) ?? [],
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
  };
  return props;
}

function assignBasicProps(node, data) {
  console.log('assignBasicProps', data);
  const props = mapDataToNodeProps(data);
  console.log({ props });

  // Common props.
  Object.entries(props).forEach(([key, value]) => {
    if (key in node) {
      console.log(`set key`, key, value);
      node[key] = value;
    }
  });

  // Layout related setters
  if (props.size != null && props.size.x > 0 && props.size.y > 0) {
    node.resize(props.size.x, props.size.y);
  }

  return node;
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

      // We need to always set the family and style to something,
      // otherwise text styles set later will be ignored.
      // const family =
      //   data.style.fontFamily === 'ProximaNova'
      //     ? 'Proxima Nova'
      //     : data?.style?.fontFamily || 'Roboto';
      // const style = fontWeightMap[data?.style?.fontWeight] || 'Regular';
      // console.log('style', {
      //   style,
      // });
      // await figma.loadFontAsync({
      //   family,
      //   style,
      // });
      node.fontName = {
        family: 'Roboto',
        style: 'Regular',
      };

      node.textAlignHorizontal = data.style?.textAlignHorizontal ?? 'LEFT';
      node.textAlignVertical = data.style?.textAlignVertical ?? 'TOP';
      node.fontSize = data.style?.fontSize ?? 14;
      node.textCase = data.style.textCase ?? 'ORIGINAL';
      node.textAutoResize = data.style?.textAutoResize ?? 'NONE';

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
  assignBasicProps(node, data);

  return node;
}

export async function render(json) {
  // Load default font.
  await figma.loadFontAsync({
    family: 'Roboto',
    style: 'Regular',
  });

  console.log('render', json);

  const nodes = new Map();
  traverse(json, {
    visit: async (node) => {
      let baseNode;
      if (node.type !== 'DOCUMENT') {
        baseNode = await createNode(node);
        if (!baseNode) {
          return;
        }

        nodes.set(node.id, baseNode);
        node.children?.forEach((child) => {
          const sceneChild = nodes.get(child.id);
          if (sceneChild) {
            baseNode.appendChild(nodes.get(child.id));
          }
        });
      }
    },
  });
}

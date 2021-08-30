// @ts-nocheck

async function traverse(parent, options) {
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
    for (child of parent.children) {
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
  const props = {
    ...data,
    primaryAxisSizingMode: data.primaryAxisSizingMode ?? 'AUTO',
    counterAxisSizingMode: data.counterAxisSizingMode ?? 'AUTO',
    constraints: {
      horizontal: data.constraints.horizontal === 'LEFT' ? 'MIN' : 'MAX',
      vertical: data.constraints.vertical === 'TOP' ? 'MIN' : 'MAX',
    },
    fills: data.fills.map((fill) => ({
      ...fill,
      opacity: fill.color.a,
      color: {
        r: fill.color.r,
        g: fill.color.g,
        b: fill.color.b,
      },
    })),
    strokes: data.strokes.map((stroke) => ({
      ...stroke,
      opacity: stroke.color.a,
      color: {
        r: stroke.color.r,
        g: stroke.color.g,
        b: stroke.color.b,
      },
    })),
  };
  return props;
}

function assignBasicProps(node, data) {
  console.log(data);
  const props = mapDataToNodeProps(data);
  console.log(props);

  // Common props.
  Object.entries(props).forEach(([key, value]) => {
    if (key in node) {
      console.log(`set key`, key, value);
      node[key] = value;
    }
  });

  // Layout related setters
  node.resize(props.size.x, props.size.y);
  node.x = props.absoluteBoundingBox.x;
  node.y = props.absoluteBoundingBox.y;

  return node;
}

async function createNode(data) {
  let node;

  switch (data.type) {
    case 'BOOLEAN_OPERATION':
    case 'COMPONENT_SET':
    case 'DOCUMENT':
    case 'GROUP':
      console.error(`Creating ''${data.type}'' not supported!`);
      return;
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
    case 'PAGE': {
      node = figma.createPage();
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

      // Uhm, the order of setting props matters.
      // We need to duplicate setting some of them before and some after.
      // TODO: Check what settings should be placed here instead of assigning all of them twice.
      assignBasicProps(node, data);

      const family = data.style.fontFamily;
      const style = data.style.fontPostScriptName.split('-')[1] || 'Regular';
      console.log({
        style,
      });
      await figma.loadFontAsync({
        family,
        style,
      });
      node.fontName = {
        family,
        style,
      };

      node.textAlignHorizontal = data.style.textAlignHorizontal;
      node.textAlignVertical = data.style.textAlignVertical;
      node.fontSize = data.style.fontSize;
      node.textCase = data.style.textCase ?? 'ORIGINAL';
      node.textAutoResize = data.style.textAutoResize;

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
          unit: data.style.lineHeightUnit,
          value:
            data.style.lineHeightUnit === 'PIXELS'
              ? data.style.lineHeightPx
              : data.style.lineHeightPercentFontSize,
        };
      }

      break;
    }
    case 'VECTOR': {
      const svg = `<path fill-rule="${data.fillGeometry[0].windingRule.toLowerCase()}" d="${
        data.fillGeometry[0].path
      }" fill="currentColor" />`;
      console.log(svg);
      node = figma.createNodeFromSvg(svg);
      break;
    }
    default: {
      node = figma.createFrame();
    }
  }

  assignBasicProps(node, data);

  return node;
}

async function render(json) {
  // Load default font.
  await figma.loadFontAsync({
    family: 'Roboto',
    style: 'Regular',
  });

  nodes = new Map();
  traverse(json, {
    visit: async (node) => {
      let baseNode;
      if (!['CANVAS', 'DOCUMENT'].includes(node.type)) {
        baseNode = await createNode(node);
        if (!baseNode) {
          return;
        }

        node.id = node.id || nodes.size++;
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

import { createFrame } from '../nodes/frame';
import { TextNode } from '../nodes/text';
import { createXPathFromElement } from '../helpers/xpath';
import { getGroupBCR } from '../helpers/bcr';
import { isNodeVisible, isTextVisible } from '../helpers/visibility';
import { getRgba } from '../helpers/color';

const DEFAULT_VALUES = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  backgroundImage: 'none',
  borderWidth: '0px',
  boxShadow: 'none',
};

function hasOnlyDefaultStyles(styles) {
  return Object.keys(DEFAULT_VALUES).every((key) => {
    const defaultValue = DEFAULT_VALUES[key];
    const value = styles[key];

    return defaultValue === value;
  });
}

function parseBorderRadius(borderRadius, width, height) {
  const matches = borderRadius.match(/^([0-9.]+)(.+)$/);

  if (matches && matches[2] === '%') {
    const baseVal = Math.max(width, height);
    const percentageApplied = baseVal * (parseInt(matches[1], 10) / 100);

    return Math.round(percentageApplied);
  }
  return parseInt(borderRadius, 10);
}

function isSVGDescendant(element) {
  return element instanceof SVGElement && element.matches('svg *');
}

/**
 * @param {string} fontWeight font weight as provided by the browser
 * @return {number} normalized font weight
 */
function parseFontWeight(fontWeight) {
  // Support 'bold' and 'normal' for Electron compatibility.
  if (fontWeight === 'bold') {
    return 700;
  } else if (fontWeight === 'normal') {
    return 400;
  }
  return parseInt(fontWeight, 10);
}

export function createSceneNodeFromElement(element) {
  let sceneNode = createFrame();

  const bcr = element.getBoundingClientRect();
  const { x, y, width, height } = bcr;

  const styles = getComputedStyle(element);

  // skip SVG child nodes as they are already covered by `new SVG(…)`
  if (isSVGDescendant(element)) {
    return sceneNode;
  }

  if (!isNodeVisible(element, bcr, styles)) {
    return sceneNode;
  }

  sceneNode.name = createXPathFromElement(element);

  // opaque props
  sceneNode.x = x;
  sceneNode.y = y;
  sceneNode.width = width;
  sceneNode.height = height;

  // fill props
  const backgroundColor = getRgba(styles.backgroundColor);

  if (backgroundColor) {
    sceneNode.fills = [
      {
        type: 'SOLID',
        color: {
          r: backgroundColor.r,
          g: backgroundColor.g,
          b: backgroundColor.b,
        },
        opacity: backgroundColor.a || 1,
      },
    ];
  }

  // corners
  sceneNode.topLeftRadius = parseBorderRadius(
    styles.borderTopLeftRadius,
    width,
    height
  );

  sceneNode.topRightRadius = parseBorderRadius(
    styles.borderTopRightRadius,
    width,
    height
  );

  sceneNode.bottomLeftRadius = parseBorderRadius(
    styles.borderBottomLeftRadius,
    width,
    height
  );

  sceneNode.bottomRightRadius = parseBorderRadius(
    styles.borderBottomRightRadius,
    width,
    height
  );

  return sceneNode;
}

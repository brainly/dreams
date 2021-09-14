import { createFrame } from '../nodes/frame';
import { createSvg } from '../nodes/svg';
import { createText } from '../nodes/text';
import { createXPathFromElement } from '../helpers/xpath';
import { isNodeVisible, isTextVisible } from '../helpers/visibility';
import { getRgba } from '../helpers/color';
import { getSVGString } from '../helpers/svg';
import { fixWhiteSpace } from '../helpers/text';

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
  const bcr = element.getBoundingClientRect();
  const { x, y, width, height } = bcr;

  const styles = getComputedStyle(element);

  // skip SVG child nodes as they are already covered by `new SVG(…)`
  if (isSVGDescendant(element)) {
    return null;
  }

  if (!isNodeVisible(element, bcr, styles)) {
    return null;
  }

  const isSVG = element.nodeName === 'svg';

  let sceneNode;

  if (isSVG) {
    console.log('SVG!!!');
    sceneNode = createSvg();
    sceneNode.content = getSVGString(element);
  } else {
    console.log('NO SVG!!!');
    sceneNode = createFrame();
  }

  sceneNode.name = createXPathFromElement(element);

  // position
  sceneNode.x = x;
  sceneNode.y = y;
  sceneNode.width = width;
  sceneNode.height = height;

  // background
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

  // border radius
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

  // borders
  if (!styles.borderWidth.includes(' ')) {
    const borderColor = getRgba(styles.borderColor);
    if (borderColor) {
      sceneNode.strokes = [
        {
          type: 'SOLID',
          color: {
            r: borderColor.r,
            g: borderColor.g,
            b: borderColor.b,
          },
          opacity: borderColor.a || 1,
        },
      ];
      sceneNode.strokeWeight = parseFloat(styles.borderWidth);
    }
  } else {
    // TODO(coderitual): one side borders using inset shadow effect
    const borderTopWidthFloat = parseFloat(styles.borderTopWidth);
    const borderRightWidthFloat = parseFloat(styles.borderRightWidth);
    const borderBottomWidthFloat = parseFloat(styles.borderBottomWidth);
    const borderLeftWidthFloat = parseFloat(styles.borderLeftWidth);
  }

  // text nodes
  if (!isTextVisible(styles)) {
    return sceneNode;
  }

  // Text
  const rangeHelper = document.createRange();
  Array.from(element.childNodes)
    .filter(
      (child: any) => child.nodeType === 3 && child.nodeValue.trim().length > 0
    )
    .forEach((textNode: any) => {
      rangeHelper.selectNodeContents(textNode);
      const textRanges = Array.from(rangeHelper.getClientRects());
      const numberOfLines = textRanges.length;
      const textBCR = rangeHelper.getBoundingClientRect();
      const lineHeightInt = parseInt(styles.lineHeight, 10);
      const textBCRHeight = textBCR.bottom - textBCR.top;

      const textValue = fixWhiteSpace(textNode.nodeValue, styles.whiteSpace);

      const text = createText();
      text.characters = textValue;
      text.fontName = {
        family: styles.fontFamily,
        style: 'Regular',
      };
      text.fontSize = parseFloat(styles.fontSize);
      text.lineHeight = {
        value: lineHeightInt,
        unit: 'PIXELS',
      };

      sceneNode.appendChild(text);
    });

  return sceneNode;
}

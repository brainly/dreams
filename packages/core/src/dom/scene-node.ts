import { createFrame } from '../nodes/frame';
import type { FrameNode } from '../nodes/frame';
import { createComponent } from '../nodes/component';
import type { ComponentNode } from '../nodes/component';
import { createSvg } from '../nodes/svg';
import type { SvgNode } from '../nodes/svg';
import { createText } from '../nodes/text';
import type { TextNode } from '../nodes/text';
import { isNodeVisible, isTextVisible } from '../helpers/visibility';
import { getRgba } from '../helpers/color';
import { getSVGString } from '../helpers/svg';
import { fixWhiteSpace, getFirstFont, mapTextTransform } from '../helpers/text';
import { toDataURL } from '../helpers/image';

const DEFAULT_VALUES = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  backgroundImage: 'none',
  borderWidth: '0px',
  boxShadow: 'none',
};

function hasVisualStyles(styles) {
  return Object.keys(DEFAULT_VALUES).some((key) => {
    const defaultValue = DEFAULT_VALUES[key];
    const value = styles[key];

    return defaultValue !== value;
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

function parseFontWeight(fontWeight) {
  if (fontWeight === 'bold') {
    return 700;
  } else if (fontWeight === 'normal') {
    return 400;
  }
  return parseInt(fontWeight, 10);
}

function getNameFromNodeType(nodeType) {
  switch (nodeType) {
    case 'FRAME':
      return 'Frame';
    case 'COMPONENT':
      return 'Component';
    case 'SVG':
      return 'Vector';
    case 'TEXT':
      return 'Text';
    default:
      return 'Frame';
  }
}

export async function sceneNodeFromDOM(
  element,
  rootNodeType: 'FRAME' | 'COMPONENT' = 'FRAME',
  flattenSVG: boolean = false
): Promise<FrameNode | ComponentNode | SvgNode | TextNode | null> {
  const bcr = element.getBoundingClientRect();
  const { x, y, width, height } = bcr;
  const styles = getComputedStyle(element);

  if (isSVGDescendant(element)) {
    return null;
  }

  if (!isNodeVisible(element, bcr, styles)) {
    return null;
  }

  const isSVG = element.nodeName === 'svg';
  const isImage = element.nodeName === 'IMG' && element.currentSrc;

  let sceneNode: FrameNode | ComponentNode | SvgNode | TextNode | null = null;

  if (isSVG) {
    const svg = createSvg();
    svg.content = getSVGString(element);
    svg.flatten = flattenSVG;
    svg.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    sceneNode = svg;
  } else if (rootNodeType === 'COMPONENT') {
    sceneNode = createComponent();
  } else if (isImage || hasVisualStyles(styles)) {
    sceneNode = createFrame();
  }

  if (sceneNode) {
    sceneNode.name = getNameFromNodeType(sceneNode.type);

    // layout
    sceneNode.x = x;
    sceneNode.y = y;
    sceneNode.width = width;
    sceneNode.height = height;

    // autolayout
    if (['flex', 'inline-flex'].includes(styles.display)) {
      const { flexDirection, alignItems, justifyContent } = styles;
      sceneNode.primaryAxisSizingMode = 'AUTO';
      sceneNode.counterAxisSizingMode = 'AUTO';

      let axisAlignItems: typeof sceneNode.primaryAxisAlignItems;
      switch (alignItems) {
        case 'flex-start':
        case 'start':
          axisAlignItems = 'MIN';
          break;
        case 'flex-end':
        case 'end':
          axisAlignItems = 'MAX';
          break;
        case 'center':
          axisAlignItems = 'CENTER';
          break;
        default:
          axisAlignItems = 'MIN';
      }

      let axisJustifyContent: typeof sceneNode.primaryAxisAlignItems;
      switch (justifyContent) {
        case 'flex-start':
        case 'start':
        case 'left':
          axisJustifyContent = 'MIN';
          break;
        case 'flex-end':
        case 'end':
        case 'right':
          axisJustifyContent = 'MAX';
          break;
        case 'center':
          axisJustifyContent = 'CENTER';
          break;
        default:
          axisJustifyContent = 'MIN';
      }

      // item spacing
      // Calculate unified gap between childrens using bounding client rect.
      // First we need to remove invisible childrens and sort them by their visual position to handle reverse order correctly
      let childrenBcr = Array.from(element.children)
        .filter((child) => isNodeVisible(child))
        .map((child: HTMLElement) => child.getBoundingClientRect())
        .sort((a, b) => {
          if (['column', 'column-reverse'].includes(flexDirection)) {
            return a.top - b.top;
          }
          return a.left - b.left;
        });

      // then we can calculate spacing between childrens.
      // This method only works for evenly spaced childrens.
      // TODO: handle uneven spacing
      const { spacingVertical = 0, spacingHorizontal = 0 } =
        childrenBcr.reduce<{
          right: number;
          bottom: number;
          spacingVertical: number;
          spacingHorizontal: number;
        } | null>((acc, childBcr) => {
          let spacingHorizontal = 0;
          let spacingVertical = 0;
          if (acc) {
            spacingHorizontal = childBcr.left - acc.right;
            spacingVertical = childBcr.top - acc.bottom;
          }

          return {
            right: childBcr.right,
            bottom: childBcr.bottom,
            spacingHorizontal: spacingHorizontal,
            spacingVertical: spacingVertical,
          };
        }, null) || {};

      // apply padding only for flex containers
      sceneNode.paddingLeft = parseInt(styles.paddingLeft, 10);
      sceneNode.paddingRight = parseInt(styles.paddingRight, 10);
      sceneNode.paddingTop = parseInt(styles.paddingTop, 10);
      sceneNode.paddingBottom = parseInt(styles.paddingBottom, 10);

      // Apply visually correct padding for flex container.
      // Children may poistion themselves outside of normal flow resulting in different actual padding in container
      // to mitigate this we can verify if bounding box of children fits into container with padding applied on CSS level
      // and if not we can apply adjust it.
      const childrenGroupBcr = childrenBcr.reduce(
        (acc, childBcr) => {
          acc.left = Math.min(acc?.left, childBcr.left);
          acc.right = Math.max(acc.right, childBcr.right);
          acc.top = Math.min(acc.top, childBcr.top);
          acc.bottom = Math.max(acc.bottom, childBcr.bottom);
          return acc;
        },
        { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity }
      );

      // Bounding client rect contains borders so
      // we need to subtract when calculating padding.
      // This only works together with strokesIncludedInLayout = true.
      const borderTop = parseFloat(styles.borderTopWidth);
      const borderRight = parseFloat(styles.borderRightWidth);
      const borderBottom = parseFloat(styles.borderBottomWidth);
      const borderLeft = parseFloat(styles.borderLeftWidth);

      const distanceTop = childrenGroupBcr.top - bcr.top;
      const distanceRight = bcr.right - childrenGroupBcr.right;
      const distanceBottom = bcr.bottom - childrenGroupBcr.bottom;
      const distanceLeft = childrenGroupBcr.left - bcr.left;

      sceneNode.paddingTop = distanceTop - borderTop;
      sceneNode.paddingRight = distanceRight - borderRight;
      sceneNode.paddingBottom = distanceBottom - borderBottom;
      sceneNode.paddingLeft = distanceLeft - borderLeft;

      // The best is when strokes are included in layout calculations.
      // This basicaly reflect the padding behaviour from CSS:
      // - bounding frame of the component inside figma will contain strokes,
      // - padding will be calculated without them.
      // This only works when strokes are placed inside.
      sceneNode.strokesIncludedInLayout = true;
      sceneNode.strokeAlign = 'INSIDE';

      // apply autolayout props based on flex direction
      if (['row', 'row-reverse'].includes(flexDirection)) {
        sceneNode.layoutMode = 'HORIZONTAL';
        sceneNode.primaryAxisSizingMode = 'AUTO';
        sceneNode.counterAxisAlignItems = axisAlignItems;
        sceneNode.primaryAxisAlignItems = axisJustifyContent;
        sceneNode.itemSpacing = spacingHorizontal;
      }

      if (['column', 'column-reverse'].includes(flexDirection)) {
        sceneNode.layoutMode = 'VERTICAL';
        sceneNode.primaryAxisSizingMode = 'AUTO';
        sceneNode.counterAxisAlignItems = axisJustifyContent;
        sceneNode.primaryAxisAlignItems = axisAlignItems;
        sceneNode.itemSpacing = spacingVertical;
      }
    }

    // blending
    sceneNode.opacity = parseFloat(styles.opacity);

    // background color
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

    // background image
    if (isImage) {
      const imageUrl = new URL(element.currentSrc);
      const imageBase64 = await toDataURL(imageUrl);
      sceneNode.fills = [
        {
          type: 'IMAGE',
          blendMode: 'NORMAL',
          scaleMode: 'FIT',
          imageHash: imageBase64 as string,
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
      const borderWidth = parseFloat(styles.borderWidth);
      if (borderColor && borderWidth) {
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
        sceneNode.strokeWeight = borderWidth;
      }
    } else {
      // TODO(coderitual): one side borders using inset shadow effect
      // Figma now supports single side stroke.
      const borderTopWidthFloat = parseFloat(styles.borderTopWidth);
      const borderRightWidthFloat = parseFloat(styles.borderRightWidth);
      const borderBottomWidthFloat = parseFloat(styles.borderBottomWidth);
      const borderLeftWidthFloat = parseFloat(styles.borderLeftWidth);
    }
  }

  if (!isTextVisible(styles)) {
    return sceneNode;
  }

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
      const lineHeight = parseInt(styles.lineHeight, 10);
      const fontSize = parseInt(styles.fontSize, 10);
      const color = getRgba(styles.color);

      const textValue = fixWhiteSpace(textNode.nodeValue, styles.whiteSpace);

      const text = createText();
      text.x = textBCR.x;
      text.y = textBCR.y;
      // We use next integer value instead of float to avoid rounding errors
      text.width = Math.ceil(textBCR.width);
      text.height = Math.ceil(textBCR.height);
      text.characters = textValue;

      text.fontName = {
        family: getFirstFont(styles.fontFamily),
        style: 'Regular',
      };
      text.fontSize = fontSize;
      text.lineHeight = {
        value: lineHeight,
        unit: 'PIXELS',
      };
      text.fontWeight = parseFontWeight(styles.fontWeight);

      // center text vertically when lineheight is different than font size
      if (lineHeight !== fontSize) {
        text.textAlignVertical = 'CENTER';
      }

      if (numberOfLines === 1) {
        text.textAutoResize = 'WIDTH_AND_HEIGHT';
      }

      text.letterSpacing =
        styles.letterSpacing !== 'normal'
          ? {
              value: parseFloat(styles.letterSpacing),
              unit: 'PIXELS',
            }
          : {
              value: 0,
              unit: 'PERCENT',
            };

      text.textCase = mapTextTransform(styles.textTransform);
      if (color) {
        text.fills = [
          {
            type: 'SOLID',
            color: {
              r: color.r,
              g: color.g,
              b: color.b,
            },
            opacity: color.a || 1,
          },
        ];
      }

      // Scene node is null when no visual styles are present, in that case we directly return text node
      if (sceneNode) {
        sceneNode.appendChild(text);
      } else {
        sceneNode = text;
      }
    });

  return sceneNode;
}

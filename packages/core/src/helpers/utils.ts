import normalizeColor from 'normalize-css-color';

const safeToLower = (input) => {
  if (typeof input === 'string') {
    return input.toLowerCase();
  }

  return input;
};

// Takes colors as CSS hex, name, rgb, rgba, hsl or hsla
export const makeColorFromCSS = (input, alpha = 1) => {
  const nullableColor = normalizeColor(safeToLower(input));
  const colorInt = nullableColor === null ? 0x00000000 : nullableColor;
  const { r, g, b, a } = normalizeColor.rgba(colorInt);

  return {
    _class: 'color',
    red: r / 255,
    green: g / 255,
    blue: b / 255,
    alpha: a * alpha,
  };
};

// Solid color fill
export const makeColorFill = (cssColor, alpha) => {
  return makeColorFromCSS(cssColor, alpha);
};

const ensureBase64DataURL = (url) => {
  const imageData = url.match(/data:(.+?)(;(.+))?,(.+)/i);

  if (imageData && imageData[3] !== 'base64') {
    // Solve for an NSURL bug that can't handle plaintext data: URLs
    const type = imageData[1];
    const data = decodeURIComponent(imageData[4]);
    const encodingMatch = imageData[3] && imageData[3].match(/^charset=(.*)/);
    let buffer;

    if (encodingMatch) {
      buffer = Buffer.from(data, encodingMatch[1]);
    } else {
      buffer = Buffer.from(data);
    }

    return `data:${type};base64,${buffer.toString('base64')}`;
  }

  return url;
};

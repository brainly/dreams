const SYSTEM_FONTS = [
  // Apple
  '-apple-system',
  'BlinkMacSystemFont',

  // Microsoft
  'Segoe UI',

  // Android
  'Roboto',
];

// INPUT: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
// OUTPUT: Helvetica Neue
export function getFirstFont(fonts) {
  let regularFont = undefined;
  let systemFont = undefined;

  fonts.split(',').forEach((font) => {
    font = font.trim().replace(/^["']+|["']+$/g, '');
    if (font === '') {
      return;
    }

    // See above for a note on OS-specific fonts
    if (!regularFont && SYSTEM_FONTS.indexOf(font) < 0) {
      regularFont = font;
    }
    if (!systemFont) {
      systemFont = font;
    }
  });

  if (regularFont) {
    return regularFont;
  }

  if (systemFont) {
    return systemFont;
  }

  return '-apple-system';
}

export function fixWhiteSpace(text, whiteSpace) {
  switch (whiteSpace) {
    case 'normal':
    case 'nowrap':
      return text
        .trim()
        .replace(/\n/g, ' ') // replace newline characters with space
        .replace(/\s+/g, ' '); // collapse whitespace
    case 'pre-line':
      return text
        .replace(/(^[^\S\n]+)|([^\S\n]+$)/g, '') // trim but leave \n
        .replace(/[^\S\n]+/g, ' ') // collapse whitespace (except \n)
        .replace(/[^\S\n]?\n[^\S\n]?/g, '\n'); // remove whitespace before & after \n
    default:
    // pre, pre-wrap
  }

  return text;
}

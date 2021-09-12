export function getRgba(colorString?: string | null) {
  if (!colorString) {
    return null;
  }
  const [_1, r, g, b, _2, a] = (colorString!.match(
    /rgba?\(([\d\.]+), ([\d\.]+), ([\d\.]+)(, ([\d\.]+))?\)/
  )! || []) as string[];

  const none = a && parseFloat(a) === 0;

  if (r && g && b && !none) {
    return {
      r: parseInt(r) / 255,
      g: parseInt(g) / 255,
      b: parseInt(b) / 255,
      a: a ? parseFloat(a) : 1,
    };
  }
  return null;
}

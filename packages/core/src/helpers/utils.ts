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

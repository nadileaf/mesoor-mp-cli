/** @description like scss mix() function */
export const mixColor = (color1: string, color2: string, weight: number) => {
  if (color1.startsWith('rgb')) color1 = rgbToHex(color1);
  if (color2.startsWith('rgb')) color2 = rgbToHex(color2);
  weight = Math.max(Math.min(Number(weight), 1), 0);
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  const r = Math.round(r1 * (1 - weight) + r2 * weight)
    .toString(16)
    .padStart(2, '0');
  const g = Math.round(g1 * (1 - weight) + g2 * weight)
    .toString(16)
    .padStart(2, '0');
  const b = Math.round(b1 * (1 - weight) + b2 * weight)
    .toString(16)
    .padStart(2, '0');
  return '#' + r + g + b;
};

export const rgbToHex = (rgb: string) => {
  const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  const _rgb = rgb.substring(4).split(')')[0].split(sep);
  const r = (+_rgb[0]).toString(16).padStart(2, '0'),
    g = (+_rgb[1]).toString(16).padStart(2, '0'),
    b = (+_rgb[2]).toString(16).padStart(2, '0');
  return '#' + r + g + b;
};

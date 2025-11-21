/**
 * Generates a consistent pastel color for a given text string using hashing.
 * The same text will always produce the same color.
 *
 * @param text - The text to hash (e.g., tag name)
 * @returns A pastel color in hex format (e.g., "#FFB3BA")
 */
export function getTagColor(text: string): string {
  // Simple hash function to convert text to a number
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate soft pastel colors with very light, muted tones
  const hue = Math.abs(hash) % 360;

  // Using lower saturation (40-55%) and higher lightness (82-90%) for softer pastels
  const saturation = 40 + (Math.abs(hash >> 8) % 16); // 40-55%
  const lightness = 82 + (Math.abs(hash >> 16) % 9); // 82-90%

  return hslToHex(hue, saturation, lightness);
}

/**
 * Converts HSL color values to hex format.
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string
 */
function hslToHex(h: number, s: number, l: number): string {
  const saturation = s / 100;
  const lightness = l / 100;

  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = lightness - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

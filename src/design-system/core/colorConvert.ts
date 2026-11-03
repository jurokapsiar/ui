/** Shared core colour parsing and conversion between hex and OKLCH, plus WCAG contrast. */

export interface Rgb {
  r: number; // 0..255
  g: number;
  b: number;
}

export interface Oklch {
  l: number; // 0..1
  c: number;
  h: number; // degrees
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLinear = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  const [r, g, bl] = lin.map((v) => clamp(fromLinear(clamp(v, 0, 1)), 0, 1) * 255);
  return { r, g, b: bl };
}

export function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const [lr, lg, lb] = [r, g, b].map((v) => toLinear(v / 255));
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const c = Math.hypot(a, bb);
  // Hue is meaningless for greys; report 0 instead of numeric noise.
  const h = c < 1e-4 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l: L, c: c < 1e-4 ? 0 : c, h };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('')}`;
}

export function hexToRgb(hex: string): Rgb | null {
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const digits = m[1].length === 3 ? [...m[1]].map((d) => d + d).join('') : m[1];
  return {
    r: parseInt(digits.slice(0, 2), 16),
    g: parseInt(digits.slice(2, 4), 16),
    b: parseInt(digits.slice(4, 6), 16),
  };
}

export function parseOklch(input: string): Oklch | null {
  const m = input
    .trim()
    .match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+(none|[\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?\s*)?\)$/i);
  if (!m) return null;
  const l = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
  const c = m[2].endsWith('%') ? (parseFloat(m[2]) / 100) * 0.4 : parseFloat(m[2]);
  const h = m[3].toLowerCase() === 'none' ? 0 : parseFloat(m[3]);
  if ([l, c, h].some(Number.isNaN)) return null;
  return { l: clamp(l, 0, 1), c: Math.max(0, c), h: ((h % 360) + 360) % 360 };
}

/** Parses hex or `oklch()`; returns null for anything else (named colours, color-mix, var()). */
export function parseColor(input: string): Rgb | null {
  const value = input.trim();
  if (value.startsWith('#')) return hexToRgb(value);
  const lch = parseOklch(value);
  return lch ? oklchToRgb(lch) : null;
}

export function formatOklch({ l, c, h }: Oklch): string {
  const round = (n: number, d: number) => parseFloat(n.toFixed(d));
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`;
}

export const hexToOklchString = (hex: string): string | null => {
  const rgb = hexToRgb(hex);
  return rgb ? formatOklch(rgbToOklch(rgb)) : null;
};

/** Hex for a colour string, or null when it cannot be resolved. */
export function colorToHex(input: string): string | null {
  const rgb = parseColor(input);
  return rgb ? rgbToHex(rgb) : null;
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map((v) => toLinear(Math.round(v) / 255));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** WCAG 2.x contrast ratio between two colour strings, or null if either can't be parsed. */
export function contrastRatio(foreground: string, background: string): number | null {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (!fg || !bg) return null;
  const [hi, lo] = [relativeLuminance(fg), relativeLuminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

export interface ContrastVerdict {
  ratio: number;
  pass: boolean;
  label: string;
}

export function contrastVerdict(foreground: string, background: string, minimum: number): ContrastVerdict | null {
  const ratio = contrastRatio(foreground, background);
  if (ratio === null) return null;
  const shown = Math.floor(ratio * 100) / 100;
  const pass = ratio >= minimum;
  return {
    ratio: shown,
    pass,
    label: `${shown.toFixed(2)}:1 ${pass ? 'Pass' : 'Fail'} (needs ${minimum}:1)`,
  };
}

import React from 'react';

/*
 * Phosphor icons, bundled one weight at a time.
 * `@phosphor-icons/react` ships all six weights inside every icon component, which added ~25 kB gzip.
 * This module reads the same artwork from `@phosphor-icons/core` and only includes the weights listed below.
 * To use a new icon or weight, add it to the matching glob and to an `icon(...)` line.
 */

const ROOT = '/node_modules/@phosphor-icons/core/assets';

const regular = import.meta.glob<string>(
  '/node_modules/@phosphor-icons/core/assets/regular/{plus,download-simple,bell,file,folder,envelope,gear,share-network,star,heart,bookmark-simple,caret-down,x}.svg',
  { query: '?raw', import: 'default', eager: true },
);
const bold = import.meta.glob<string>(
  '/node_modules/@phosphor-icons/core/assets/bold/{play,sliders-horizontal,caret-right,caret-down,check,x,dots-three-vertical,info,minus}-bold.svg',
  { query: '?raw', import: 'default', eager: true },
);
const fill = import.meta.glob<string>(
  '/node_modules/@phosphor-icons/core/assets/fill/{heart,bookmark-simple}-fill.svg',
  { query: '?raw', import: 'default', eager: true },
);
const duotone = import.meta.glob<string>(
  '/node_modules/@phosphor-icons/core/assets/duotone/{text-aa,layout,palette,toggle-right,ghost,tree-structure,shapes,chat-text,path,textbox,gavel,table,info,check,x,sparkle,code,terminal,arrow-right,eye,arrows-clockwise,stack,lightning,shield-check,circle-half,sliders-horizontal,file-text,copy,arrow-square-out,caret-down,caret-up}-duotone.svg',
  { query: '?raw', import: 'default', eager: true },
);

const SOURCES = { regular, bold, fill, duotone };
type Weight = keyof typeof SOURCES;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  size?: number | string;
}

function icon<W extends Weight>(displayName: string, kebab: string, weights: readonly W[], defaultWeight: W) {
  const markup = {} as Record<W, string>;
  for (const w of weights) {
    const file = `${ROOT}/${w}/${kebab}${w === 'regular' ? '' : `-${w}`}.svg`;
    const svg = (SOURCES[w] as Record<string, string>)[file];
    if (!svg) throw new Error(`Missing Phosphor asset: ${file}`);
    markup[w] = svg.slice(svg.indexOf('>') + 1, svg.lastIndexOf('</svg>'));
  }

  const Icon = React.forwardRef<SVGSVGElement, IconProps & { weight?: W }>(
    ({ size = '1em', weight = defaultWeight, ...props }, ref) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width={size}
        height={size}
        fill="currentColor"
        {...props}
        dangerouslySetInnerHTML={{ __html: markup[weight] }}
      />
    ),
  );
  Icon.displayName = displayName;
  return Icon;
}

export type Icon = React.ComponentType<IconProps & { weight?: any }>;

export const Plus = icon('Plus', 'plus', ['regular'], 'regular');
export const DownloadSimple = icon('DownloadSimple', 'download-simple', ['regular'], 'regular');
export const Bell = icon('Bell', 'bell', ['regular'], 'regular');
export const File = icon('File', 'file', ['regular'], 'regular');
export const Folder = icon('Folder', 'folder', ['regular'], 'regular');
export const Envelope = icon('Envelope', 'envelope', ['regular'], 'regular');
export const Gear = icon('Gear', 'gear', ['regular'], 'regular');
export const ShareNetwork = icon('ShareNetwork', 'share-network', ['regular'], 'regular');
export const Star = icon('Star', 'star', ['regular'], 'regular');
export const Heart = icon('Heart', 'heart', ['regular', 'fill'], 'regular');
export const BookmarkSimple = icon('BookmarkSimple', 'bookmark-simple', ['regular', 'fill'], 'regular');
export const Play = icon('Play', 'play', ['bold'], 'bold');
export const CaretRight = icon('CaretRight', 'caret-right', ['bold'], 'bold');
export const DotsThreeVertical = icon('DotsThreeVertical', 'dots-three-vertical', ['bold'], 'bold');
export const Minus = icon('Minus', 'minus', ['bold'], 'bold');
export const CaretDown = icon('CaretDown', 'caret-down', ['regular', 'bold', 'duotone'], 'regular');
export const CaretUp = icon('CaretUp', 'caret-up', ['duotone'], 'duotone');
export const Check = icon('Check', 'check', ['bold', 'duotone'], 'bold');
export const Info = icon('Info', 'info', ['bold', 'duotone'], 'bold');
export const X = icon('X', 'x', ['regular', 'bold', 'duotone'], 'regular');
export const SlidersHorizontal = icon('SlidersHorizontal', 'sliders-horizontal', ['bold', 'duotone'], 'bold');

export const TextAa = icon('TextAa', 'text-aa', ['duotone'], 'duotone');
export const Layout = icon('Layout', 'layout', ['duotone'], 'duotone');
export const Palette = icon('Palette', 'palette', ['duotone'], 'duotone');
export const ToggleRight = icon('ToggleRight', 'toggle-right', ['duotone'], 'duotone');
export const Ghost = icon('Ghost', 'ghost', ['duotone'], 'duotone');
export const TreeStructure = icon('TreeStructure', 'tree-structure', ['duotone'], 'duotone');
export const Shapes = icon('Shapes', 'shapes', ['duotone'], 'duotone');
export const ChatText = icon('ChatText', 'chat-text', ['duotone'], 'duotone');
export const Path = icon('Path', 'path', ['duotone'], 'duotone');
export const Textbox = icon('Textbox', 'textbox', ['duotone'], 'duotone');
export const Gavel = icon('Gavel', 'gavel', ['duotone'], 'duotone');
export const Table = icon('Table', 'table', ['duotone'], 'duotone');
export const Sparkle = icon('Sparkle', 'sparkle', ['duotone'], 'duotone');
export const Code = icon('Code', 'code', ['duotone'], 'duotone');
export const Terminal = icon('Terminal', 'terminal', ['duotone'], 'duotone');
export const ArrowRight = icon('ArrowRight', 'arrow-right', ['duotone'], 'duotone');
export const Eye = icon('Eye', 'eye', ['duotone'], 'duotone');
export const ArrowsClockwise = icon('ArrowsClockwise', 'arrows-clockwise', ['duotone'], 'duotone');
export const Stack = icon('Stack', 'stack', ['duotone'], 'duotone');
export const Lightning = icon('Lightning', 'lightning', ['duotone'], 'duotone');
export const ShieldCheck = icon('ShieldCheck', 'shield-check', ['duotone'], 'duotone');
export const CircleHalf = icon('CircleHalf', 'circle-half', ['duotone'], 'duotone');
export const FileText = icon('FileText', 'file-text', ['duotone'], 'duotone');
export const Copy = icon('Copy', 'copy', ['duotone'], 'duotone');
export const ArrowSquareOut = icon('ArrowSquareOut', 'arrow-square-out', ['duotone'], 'duotone');

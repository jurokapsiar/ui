import React from 'react';
import {
  ArrowRight,
  ArrowSquareOut,
  ArrowsClockwise,
  CaretDown,
  CaretUp,
  ChatText,
  Check,
  CircleHalf,
  Code,
  Copy,
  Eye,
  FileText,
  Gavel,
  Ghost,
  Info,
  Layout,
  Lightning,
  Palette,
  Path,
  Shapes,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  Stack,
  Table,
  Terminal,
  TextAa,
  Textbox,
  ToggleRight,
  TreeStructure,
  X,
  type Icon,
} from './phosphor';

export type IconName =
  | 'typography'
  | 'layout'
  | 'chromatics'
  | 'states'
  | 'hallucination'
  | 'dom'
  | 'iconography'
  | 'microcopy'
  | 'motion'
  | 'forms'
  | 'governance'
  | 'matrix'
  | 'info'
  | 'check'
  | 'cross'
  | 'sparkles'
  | 'code'
  | 'terminal'
  | 'arrow-right'
  | 'eye'
  | 'refresh'
  | 'layers'
  | 'zap'
  | 'shield'
  | 'contrast'
  | 'sliders'
  | 'file-text'
  | 'copy'
  | 'external-link'
  | 'chevron-down'
  | 'chevron-up';

const ICONS: Record<IconName, Icon> = {
  'typography': TextAa,
  'layout': Layout,
  'chromatics': Palette,
  'states': ToggleRight,
  'hallucination': Ghost,
  'dom': TreeStructure,
  'iconography': Shapes,
  'microcopy': ChatText,
  'motion': Path,
  'forms': Textbox,
  'governance': Gavel,
  'matrix': Table,
  'info': Info,
  'check': Check,
  'cross': X,
  'sparkles': Sparkle,
  'code': Code,
  'terminal': Terminal,
  'arrow-right': ArrowRight,
  'eye': Eye,
  'refresh': ArrowsClockwise,
  'layers': Stack,
  'zap': Lightning,
  'shield': ShieldCheck,
  'contrast': CircleHalf,
  'sliders': SlidersHorizontal,
  'file-text': FileText,
  'copy': Copy,
  'external-link': ArrowSquareOut,
  'chevron-down': CaretDown,
  'chevron-up': CaretUp,
};

const TONE_COLORS = {
  default: 'currentColor',
  monochrome: '#111113',
  mint: '#047857',
  amber: '#b45309',
  lavender: '#4338ca',
  sky: '#0369a1',
  rose: '#be123c',
};

interface DuotoneIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref' | 'color'> {
  name: IconName;
  size?: number | string;
  tone?: keyof typeof TONE_COLORS;
  className?: string;
}

export const DuotoneIcon: React.FC<DuotoneIconProps> = ({
  name,
  size = 20,
  tone = 'default',
  className = '',
  ...props
}) => {
  const Glyph = ICONS[name] ?? ICONS.info;
  return (
    <Glyph
      weight="duotone"
      size={size}
      color={TONE_COLORS[tone] ?? TONE_COLORS.default}
      className={`inline-block shrink-0 transition-colors ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

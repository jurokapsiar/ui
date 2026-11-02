/**
 * Base UI Design System: OKLCH Token Engine & 12 Base Variants
 * Built in accordance with Cascade Layers (@layer theme, base, components, utilities)
 * and APCA (Advanced Perceptual Contrast Algorithm) lightness contrast specifications.
 */

export interface ThemeTokens {
  // Brand OKLCH Ramps
  colorBrandPrimary: string;
  colorBrandPrimaryHover: string;
  colorOnPrimary: string;

  // Neutral Surface Ramps
  colorNeutralBg: string;
  colorNeutralSurface: string;
  colorNeutralSurfaceHover: string;
  colorNeutralBorder: string;
  colorNeutralBorderStrong: string;
  colorNeutralText: string;
  colorNeutralTextMuted: string;

  // Semantic Status Tones
  colorAccent: string;
  colorSuccess: string;
  colorDanger: string;

  // Interaction Tones
  colorFocusRing: string;       // keyboard focus outline, must hold 3:1 against colorNeutralBg
  colorBrandTint: string;       // selected / hovered tint (chips, list selection)
  colorBrandTintBorder: string; // border paired with colorBrandTint

  // Geometry & Radii
  radiusBase: string;
  radiusSm: string;
  radiusLg: string;
  borderWidth: string;

  // Optional shape, type and motion tones. Unset means every view keeps its own built-in default,
  // so presets that omit them render exactly as before.
  radiusControl?: string;       // buttons and icon buttons
  radiusField?: string;         // text fields and select triggers
  radiusChip?: string;          // chips and tags
  fontWeightLabel?: string;     // button and chip labels
  letterSpacingLabel?: string;  // button and chip labels
  motionEasing?: string;
  motionDurationFast?: string;  // state changes
  motionDuration?: string;      // movement

  // Spacing & Touch Geometry
  spacingBase: string; // e.g., 4px
  spacingXs: string;   // calc(spacingBase * 1)
  spacingSm: string;   // calc(spacingBase * 2)
  spacingMd: string;   // calc(spacingBase * 4)
  spacingLg: string;   // calc(spacingBase * 6)
  touchTargetMin: string; // 24px, 44px, 48px

  // Shadows & Elevation
  shadowElevationLow: string;
  shadowElevationHigh: string;
  shadowStyleName: 'soft-layered' | 'flat-hairline' | 'brutalist-offset' | 'luminous-glow' | 'specular-glass';

  // Typography Family
  fontFamilyDisplay: string;
  fontFamilyBody: string;
  fontFamilyMono: string;
}

type DerivedTokenKey = 'colorFocusRing' | 'colorBrandTint' | 'colorBrandTintBorder';

interface ThemePresetSeed extends Omit<ThemePreset, 'tokens'> {
  tokens: Omit<ThemeTokens, DerivedTokenKey> & Partial<Pick<ThemeTokens, DerivedTokenKey>>;
}

export interface ThemePreset {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  colorBadge: string;
  tokens: ThemeTokens;
}

const PRESET_SEEDS: ThemePresetSeed[] = [
  {
    id: 'enterprise',
    name: 'Enterprise Steel',
    category: 'SaaS / Systems',
    tagline: 'High-contrast neutral slate with 4px micro radii and disciplined data density.',
    description: 'Engineered for developer platforms, analytics suites, and complex tabular dashboards, with clear typography and subdued cool slate surfaces.',
    colorBadge: '#2563eb',
    tokens: {
      colorBrandPrimary: 'oklch(0.55 0.22 260)',
      colorBrandPrimaryHover: 'oklch(0.48 0.22 260)',
      colorOnPrimary: 'oklch(0.99 0 0)',
      colorNeutralBg: 'oklch(0.985 0.005 260)',
      colorNeutralSurface: 'oklch(0.94 0.01 260)',
      colorNeutralSurfaceHover: 'oklch(0.91 0.015 260)',
      colorNeutralBorder: 'oklch(0.85 0.015 260)',
      colorNeutralBorderStrong: 'oklch(0.58 0.02 260)',
      colorNeutralText: 'oklch(0.18 0.02 260)',
      colorNeutralTextMuted: 'oklch(0.44 0.02 260)',
      colorAccent: 'oklch(0.60 0.18 200)',
      colorSuccess: 'oklch(0.50 0.18 145)',
      colorDanger: 'oklch(0.55 0.22 25)',
      radiusBase: '4px',
      radiusSm: '2px',
      radiusLg: '6px',
      borderWidth: '1px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '16px',
      spacingLg: '24px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 1px 2px oklch(0.20 0.02 260 / 0.08)',
      shadowElevationHigh: '0 8px 24px oklch(0.20 0.02 260 / 0.14), 0 2px 6px oklch(0.20 0.02 260 / 0.06)',
      shadowStyleName: 'soft-layered',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'nordic',
    name: 'Nordic Sage',
    category: 'Minimalist & Calm',
    tagline: 'Quiet botanical sage green with organic stone tones and calm atmospheric rest.',
    description: 'Subtle and grounding. Tinted neutrals with under 3% chroma prevent digital eye strain and deliver refined Scandinavian minimalism.',
    colorBadge: '#059669',
    tokens: {
      colorBrandPrimary: 'oklch(0.52 0.13 155)',
      colorBrandPrimaryHover: 'oklch(0.45 0.14 155)',
      colorOnPrimary: 'oklch(0.99 0 0)',
      colorNeutralBg: 'oklch(0.98 0.01 140)',
      colorNeutralSurface: 'oklch(0.93 0.02 140)',
      colorNeutralSurfaceHover: 'oklch(0.89 0.025 140)',
      colorNeutralBorder: 'oklch(0.84 0.02 140)',
      colorNeutralBorderStrong: 'oklch(0.60 0.03 140)',
      colorNeutralText: 'oklch(0.22 0.02 140)',
      colorNeutralTextMuted: 'oklch(0.48 0.025 140)',
      colorAccent: 'oklch(0.68 0.12 85)',
      colorSuccess: 'oklch(0.50 0.14 150)',
      colorDanger: 'oklch(0.55 0.18 28)',
      radiusBase: '8px',
      radiusSm: '4px',
      radiusLg: '12px',
      borderWidth: '1px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '16px',
      spacingLg: '24px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 1px 3px oklch(0.25 0.03 140 / 0.07)',
      shadowElevationHigh: '0 10px 28px oklch(0.25 0.03 140 / 0.12), 0 3px 8px oklch(0.25 0.03 140 / 0.05)',
      shadowStyleName: 'soft-layered',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'cyber',
    name: 'Cyber Amber',
    category: 'Terminal / Industrial',
    tagline: 'Warm amber glow over deep graphite obsidian with 2px precision geometric corners.',
    description: 'High-density aerospace and diagnostic console aesthetic. Crisp monospaced metrics, razor edges, and high-visibility amber state indicators.',
    colorBadge: '#f59e0b',
    tokens: {
      colorBrandPrimary: 'oklch(0.72 0.18 75)',
      colorBrandPrimaryHover: 'oklch(0.78 0.20 75)',
      colorOnPrimary: 'oklch(0.12 0.03 75)',
      colorNeutralBg: 'oklch(0.15 0.01 260)',
      colorNeutralSurface: 'oklch(0.22 0.015 260)',
      colorNeutralSurfaceHover: 'oklch(0.28 0.02 260)',
      colorNeutralBorder: 'oklch(0.34 0.02 260)',
      colorNeutralBorderStrong: 'oklch(0.55 0.05 75)',
      colorNeutralText: 'oklch(0.94 0.01 75)',
      colorNeutralTextMuted: 'oklch(0.68 0.03 75)',
      colorAccent: 'oklch(0.78 0.16 195)',
      colorSuccess: 'oklch(0.72 0.18 140)',
      colorDanger: 'oklch(0.65 0.22 30)',
      radiusBase: '2px',
      radiusSm: '0px',
      radiusLg: '4px',
      borderWidth: '1px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '14px',
      spacingLg: '20px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 0 0 1px oklch(0.34 0.02 260)',
      shadowElevationHigh: '0 8px 30px oklch(0.05 0 0 / 0.6), 0 0 15px oklch(0.72 0.18 75 / 0.15)',
      shadowStyleName: 'luminous-glow',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian Monolith',
    category: 'Dark Mode / Premium',
    tagline: 'OLED deep black canvas with luminous electric violet and low-specular surfaces.',
    description: 'Designed for studio media tools, audio production, and late-night creative software. Polarity-compensated typography prevents spindly glyph rendering.',
    colorBadge: '#8b5cf6',
    tokens: {
      colorBrandPrimary: 'oklch(0.64 0.22 285)',
      colorBrandPrimaryHover: 'oklch(0.70 0.24 285)',
      colorOnPrimary: 'oklch(0.14 0.02 285)',
      colorNeutralBg: 'oklch(0.12 0.01 280)',
      colorNeutralSurface: 'oklch(0.18 0.015 280)',
      colorNeutralSurfaceHover: 'oklch(0.24 0.02 280)',
      colorNeutralBorder: 'oklch(0.28 0.02 280)',
      colorNeutralBorderStrong: 'oklch(0.54 0.04 285)',
      colorNeutralText: 'oklch(0.96 0.01 280)',
      colorNeutralTextMuted: 'oklch(0.66 0.02 280)',
      colorAccent: 'oklch(0.72 0.16 320)',
      colorSuccess: 'oklch(0.68 0.18 150)',
      colorDanger: 'oklch(0.62 0.22 25)',
      radiusBase: '8px',
      radiusSm: '4px',
      radiusLg: '14px',
      borderWidth: '1px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '16px',
      spacingLg: '24px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 2px 4px oklch(0 0 0 / 0.4)',
      shadowElevationHigh: '0 12px 36px oklch(0 0 0 / 0.65), 0 0 1px oklch(1 0 0 / 0.1)',
      shadowStyleName: 'soft-layered',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'editorial',
    name: 'Editorial Ink',
    category: 'Publishing & Luxury',
    tagline: 'Warm newsprint paper with carbon ink, terracotta accent, and disciplined typography.',
    description: 'Rooted in classic editorial broadsheet design. Clean hairline rules, warm tactile neutral canvas, and high measure legibility for long-form reading.',
    colorBadge: '#b91c1c',
    tokens: {
      colorBrandPrimary: 'oklch(0.48 0.18 35)',
      colorBrandPrimaryHover: 'oklch(0.42 0.18 35)',
      colorOnPrimary: 'oklch(0.99 0 0)',
      colorNeutralBg: 'oklch(0.975 0.012 80)',
      colorNeutralSurface: 'oklch(0.93 0.018 80)',
      colorNeutralSurfaceHover: 'oklch(0.89 0.022 80)',
      colorNeutralBorder: 'oklch(0.82 0.02 80)',
      colorNeutralBorderStrong: 'oklch(0.55 0.03 80)',
      colorNeutralText: 'oklch(0.18 0.01 80)',
      colorNeutralTextMuted: 'oklch(0.45 0.015 80)',
      colorAccent: 'oklch(0.52 0.15 60)',
      colorSuccess: 'oklch(0.50 0.12 140)',
      colorDanger: 'oklch(0.48 0.18 35)',
      radiusBase: '3px',
      radiusSm: '1px',
      radiusLg: '6px',
      borderWidth: '1px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '18px',
      spacingLg: '28px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 1px 2px oklch(0.2 0.02 80 / 0.06)',
      shadowElevationHigh: '0 10px 30px oklch(0.2 0.02 80 / 0.10)',
      shadowStyleName: 'flat-hairline',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'neon',
    name: 'Hyper-Vibrant Neon',
    category: 'Creative & Dynamic',
    tagline: 'Electric cyan and neon magenta on deep midnight with high-visibility focus borders.',
    description: 'Electric energy for Web3, generative audio, and modern indie hacker interfaces. Ultra-crisp interactive state feedback with zero blurry pill cliches.',
    colorBadge: '#06b6d4',
    tokens: {
      colorBrandPrimary: 'oklch(0.75 0.20 210)',
      colorBrandPrimaryHover: 'oklch(0.80 0.22 210)',
      colorOnPrimary: 'oklch(0.12 0.03 210)',
      colorNeutralBg: 'oklch(0.13 0.02 240)',
      colorNeutralSurface: 'oklch(0.19 0.03 240)',
      colorNeutralSurfaceHover: 'oklch(0.26 0.04 240)',
      colorNeutralBorder: 'oklch(0.32 0.04 240)',
      colorNeutralBorderStrong: 'oklch(0.65 0.15 210)',
      colorNeutralText: 'oklch(0.96 0.01 240)',
      colorNeutralTextMuted: 'oklch(0.65 0.03 240)',
      colorAccent: 'oklch(0.70 0.24 330)',
      colorSuccess: 'oklch(0.75 0.20 150)',
      colorDanger: 'oklch(0.65 0.24 25)',
      radiusBase: '6px',
      radiusSm: '3px',
      radiusLg: '10px',
      borderWidth: '1.5px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '16px',
      spacingLg: '24px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 0 0 1px oklch(0.75 0.20 210 / 0.2)',
      shadowElevationHigh: '0 10px 30px oklch(0 0 0 / 0.7), 0 0 20px oklch(0.75 0.20 210 / 0.25)',
      shadowStyleName: 'luminous-glow',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'quartz',
    name: 'Glassmorphic Quartz',
    category: 'Translucent & Specular',
    tagline: 'Specular hairline borders, frosted translucent layers, and pristine optical depths.',
    description: 'Disciplined glassmorphism. Uses backdrop-filter: blur(12px) with 1px specular highlight borders, avoiding the low-contrast muddy gray traps of naive glass UI.',
    colorBadge: '#6366f1',
    tokens: {
      colorBrandPrimary: 'oklch(0.54 0.20 270)',
      colorBrandPrimaryHover: 'oklch(0.48 0.22 270)',
      colorOnPrimary: 'oklch(0.99 0 0)',
      colorNeutralBg: 'oklch(0.96 0.01 260)',
      colorNeutralSurface: 'oklch(0.98 0.01 260 / 0.75)',
      colorNeutralSurfaceHover: 'oklch(0.99 0.01 260 / 0.90)',
      colorNeutralBorder: 'oklch(0.86 0.02 260 / 0.65)',
      colorNeutralBorderStrong: 'oklch(0.52 0.05 270 / 0.9)',
      colorNeutralText: 'oklch(0.20 0.02 260)',
      colorNeutralTextMuted: 'oklch(0.46 0.02 260)',
      colorAccent: 'oklch(0.65 0.16 220)',
      colorSuccess: 'oklch(0.50 0.16 150)',
      colorDanger: 'oklch(0.54 0.20 28)',
      radiusBase: '12px',
      radiusSm: '6px',
      radiusLg: '18px',
      borderWidth: '1px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '16px',
      spacingLg: '26px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 2px 8px oklch(0.20 0.02 260 / 0.06)',
      shadowElevationHigh: '0 16px 40px oklch(0.20 0.02 260 / 0.12), inset 0 1px 0 oklch(1 0 0 / 0.6)',
      shadowStyleName: 'specular-glass',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'brutalist',
    name: 'Industrial Brutalist',
    category: 'Architectural & Bold',
    tagline: 'Thick 2px borders, 0px sharp corners, hard offset drop shadows, and hazard yellow punch.',
    description: 'High-impact physical tactile software. No blurs, no rounded corners, no gradients. Mechanical precision with unapologetic contrast and instant tactile response.',
    colorBadge: '#eab308',
    tokens: {
      colorBrandPrimary: 'oklch(0.85 0.18 90)',
      colorBrandPrimaryHover: 'oklch(0.80 0.20 90)',
      colorOnPrimary: 'oklch(0.12 0.02 90)',
      colorNeutralBg: 'oklch(0.96 0.005 90)',
      colorNeutralSurface: 'oklch(1 0 0)',
      colorNeutralSurfaceHover: 'oklch(0.92 0.01 90)',
      colorNeutralBorder: 'oklch(0.15 0.01 90)',
      colorNeutralBorderStrong: 'oklch(0.10 0 0)',
      colorNeutralText: 'oklch(0.12 0.01 90)',
      colorNeutralTextMuted: 'oklch(0.38 0.01 90)',
      colorAccent: 'oklch(0.60 0.22 25)',
      colorSuccess: 'oklch(0.50 0.18 145)',
      colorDanger: 'oklch(0.55 0.22 25)',
      radiusBase: '0px',
      radiusSm: '0px',
      radiusLg: '0px',
      borderWidth: '2px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '16px',
      spacingLg: '24px',
      touchTargetMin: '44px',
      shadowElevationLow: '2px 2px 0px oklch(0.10 0 0)',
      shadowElevationHigh: '4px 4px 0px oklch(0.10 0 0)',
      shadowStyleName: 'brutalist-offset',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'pastel',
    name: 'Pastel Confection',
    category: 'Friendly & Playful',
    tagline: 'Lilac and blush rose pastel accents with 16px soft radii and airy, spacious padding.',
    description: 'Welcoming consumer wellness, education, and creative social platforms. Generous whitespace math prevents visual crowding while maintaining WCAG AA contrast.',
    colorBadge: '#a855f7',
    tokens: {
      colorBrandPrimary: 'oklch(0.54 0.18 300)',
      colorBrandPrimaryHover: 'oklch(0.48 0.20 300)',
      colorOnPrimary: 'oklch(0.99 0 0)',
      colorNeutralBg: 'oklch(0.985 0.01 300)',
      colorNeutralSurface: 'oklch(0.94 0.02 300)',
      colorNeutralSurfaceHover: 'oklch(0.90 0.025 300)',
      colorNeutralBorder: 'oklch(0.86 0.02 300)',
      colorNeutralBorderStrong: 'oklch(0.58 0.04 300)',
      colorNeutralText: 'oklch(0.20 0.02 300)',
      colorNeutralTextMuted: 'oklch(0.48 0.025 300)',
      colorAccent: 'oklch(0.72 0.14 350)',
      colorSuccess: 'oklch(0.50 0.15 150)',
      colorDanger: 'oklch(0.58 0.20 25)',
      radiusBase: '16px',
      radiusSm: '8px',
      radiusLg: '22px',
      borderWidth: '1px',
      spacingBase: '5px',
      spacingXs: '5px',
      spacingSm: '10px',
      spacingMd: '18px',
      spacingLg: '28px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 2px 6px oklch(0.20 0.03 300 / 0.06)',
      shadowElevationHigh: '0 12px 32px oklch(0.20 0.03 300 / 0.10)',
      shadowStyleName: 'soft-layered',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  {
    id: 'accessible',
    name: 'Accessible APCA High-Contrast',
    category: 'Perceptual Accessibility',
    tagline: 'APCA Lc ≥ 85 body text, WCAG AAA 7:1 on text and on-primary pairs, and 48px touch targets.',
    description: 'Engineered strictly for mission-critical medical, government, and universal access software. Passes APCA 0.98G-4g contrast standards for both positive and negative polarity.',
    colorBadge: '#0284c7',
    tokens: {
      colorBrandPrimary: 'oklch(0.45 0.20 250)',
      colorBrandPrimaryHover: 'oklch(0.38 0.22 250)',
      colorOnPrimary: 'oklch(1 0 0)',
      colorNeutralBg: 'oklch(0.99 0 0)',
      colorNeutralSurface: 'oklch(0.94 0.01 250)',
      colorNeutralSurfaceHover: 'oklch(0.89 0.015 250)',
      colorNeutralBorder: 'oklch(0.70 0.02 250)',
      colorNeutralBorderStrong: 'oklch(0.35 0.03 250)',
      colorNeutralText: 'oklch(0.12 0.01 250)',
      colorNeutralTextMuted: 'oklch(0.32 0.02 250)',
      colorAccent: 'oklch(0.48 0.18 190)',
      colorSuccess: 'oklch(0.44 0.18 145)',
      colorDanger: 'oklch(0.46 0.22 25)',
      radiusBase: '6px',
      radiusSm: '4px',
      radiusLg: '10px',
      borderWidth: '1.5px',
      spacingBase: '5px',
      spacingXs: '5px',
      spacingSm: '10px',
      spacingMd: '18px',
      spacingLg: '26px',
      touchTargetMin: '48px',
      shadowElevationLow: '0 1px 3px oklch(0 0 0 / 0.15)',
      shadowElevationHigh: '0 8px 24px oklch(0 0 0 / 0.2)',
      shadowStyleName: 'soft-layered',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
  },
  /*
   * Fluently: values sourced from two places.
   *  - t3code commit 6c1bfe7 (apps/factory/src/design-system/tokens.css, Button, FormControls,
   *    Tag, ToggleButton modules): hex colours below (surface #f5f5f5, hover #ebebeb, stroke #ebebeb,
   *    ink #242424, brand #0f6cbd / #115ea3, success #0e700e, danger #b10e1c, tint #ebf3fc / #b4d6fa,
   *    focus ring #000000), the shadow-2 / shadow-5 elevation ramp, 12px control radius, 16px popover
   *    radius, 6px inner radius, 36/44px control heights, the Segoe UI font stack and the 2px focus outline.
   *  - @fluentui-contrib/react-cap-theme 0.5.1 (verified in its source): borderRadius2XLarge 12px,
   *    3XLarge 16px, 4XLarge 24px and colorNeutralStroke4 #ebebeb, which t3code re-themes to.
   *  Deviation: control borders use CAP's accessible stroke #616161 (t3code --border-stronger) rather than
   *  the soft #ebebeb, so input and checkbox boundaries hold the 3:1 non-text contrast; #ebebeb stays
   *  the decorative card and divider border. Colours are converted from hex to OKLCH so the APCA readout works.
   */
  {
    id: 'fluently',
    name: 'Fluently',
    category: 'Fluent / CAP',
    tagline: 'Soft neutral greys, 12px controls and a calm Fluent blue, after the CAP theme.',
    description: 'Fluent web light neutrals with CAP rounding: 12px controls, 16px popovers, hairline #ebebeb dividers, an accessible grey control stroke and a black keyboard focus ring.',
    colorBadge: '#0f6cbd',
    tokens: {
      colorBrandPrimary: 'oklch(0.526 0.149 252)',
      colorBrandPrimaryHover: 'oklch(0.476 0.131 251)',
      colorOnPrimary: 'oklch(1 0 0)',
      colorNeutralBg: 'oklch(1 0 0)',
      colorNeutralSurface: 'oklch(0.970 0 0)',
      colorNeutralSurfaceHover: 'oklch(0.940 0 0)',
      colorNeutralBorder: 'oklch(0.940 0 0)',
      colorNeutralBorderStrong: 'oklch(0.493 0 0)',
      colorNeutralText: 'oklch(0.260 0 0)',
      colorNeutralTextMuted: 'oklch(0.493 0 0)',
      colorAccent: 'oklch(0.476 0.131 251)',
      colorSuccess: 'oklch(0.475 0.153 143)',
      colorDanger: 'oklch(0.483 0.190 26)',
      colorFocusRing: 'oklch(0 0 0)',
      colorBrandTint: 'oklch(0.961 0.015 251)',
      colorBrandTintBorder: 'oklch(0.863 0.062 250)',
      radiusBase: '12px',
      radiusSm: '6px',
      radiusLg: '16px',
      borderWidth: '1px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '16px',
      spacingLg: '24px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14)',
      shadowElevationHigh: '0 0 8px rgba(0, 0, 0, 0.12), 0 14px 28px rgba(0, 0, 0, 0.14)',
      shadowStyleName: 'soft-layered',
      fontFamilyDisplay: 'Inter, sans-serif',
      fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: '"JetBrains Mono", Consolas, "Courier New", ui-monospace, monospace',
    },
  },
  /*
   * Substance: Material Design 3 (baseline light scheme), checked against
   *  - material-web.dev/theming/color and /theming/material-theming (role names, token structure) and
   *  - the Material Web token sources (tokens/versions/v0_192, _md-ref-palette.scss, _md-sys-color.scss),
   *    which give the light baseline roles: primary #6750A4 (primary40), on-primary #FFFFFF, secondary #625B71,
   *    secondary-container #E8DEF8, on-secondary-container #1D192B, surface-container #F3EDF7 (neutral94),
   *    surface-container-high #ECE6F0 (neutral92), on-surface #1D1B20, on-surface-variant #49454F,
   *    outline #79747E, outline-variant #CAC4D0, error #B3261E.
   *  Taken from the M3 spec at m3.material.io (shape, elevation, state layers, motion): surface #FEF7FF,
   *  corner scale 4 / 8 / 12 / 28px and full pills, elevation levels 1 and 3 as two-part shadows,
   *  state layers of 8% hover, 10% focus and pressed (hover is pre-mixed into colorBrandPrimaryHover),
   *  the 3px secondary focus ring with 2px offset, emphasized easing cubic-bezier(0.2, 0, 0, 1),
   *  label-large 14px / 500 / 0.1px, and the Roboto family.
   *  Colours are converted from hex to OKLCH so the APCA readout works. Flat tonal colour only: no glow, no gradient.
   *  Substance is an original name; it uses no Google logos, fonts or assets.
   */
  {
    id: 'substance',
    name: 'Substance',
    category: 'Material / Tonal',
    tagline: 'Flat tonal violet with pill buttons, 12px cards, 28px dialogs and emphasized motion, after Material 3.',
    description: 'Material Design 3 inspired: a baseline #6750A4 tonal palette, secondary-container tints, 3px secondary focus rings, low tonal elevation and 8% state layers. No glow, no gradients.',
    colorBadge: '#6750a4',
    tokens: {
      colorBrandPrimary: 'oklch(0.496 0.130 293.7)',
      colorBrandPrimaryHover: 'oklch(0.537 0.119 294.6)',
      colorOnPrimary: 'oklch(1 0 0)',
      colorNeutralBg: 'oklch(0.984 0.013 321.9)',
      colorNeutralSurface: 'oklch(0.954 0.015 312.2)',
      colorNeutralSurfaceHover: 'oklch(0.933 0.015 312.2)',
      colorNeutralBorder: 'oklch(0.829 0.018 308.2)',
      colorNeutralBorderStrong: 'oklch(0.567 0.016 308.1)',
      colorNeutralText: 'oklch(0.227 0.010 303.7)',
      colorNeutralTextMuted: 'oklch(0.398 0.017 303.7)',
      colorAccent: 'oklch(0.486 0.036 299.6)',
      colorSuccess: 'oklch(0.472 0.118 137.2)',
      colorDanger: 'oklch(0.501 0.178 28.7)',
      colorFocusRing: 'oklch(0.486 0.036 299.6)',
      colorBrandTint: 'oklch(0.916 0.037 303.1)',
      colorBrandTintBorder: 'oklch(0.830 0.037 303.0)',
      radiusBase: '12px',
      radiusSm: '4px',
      radiusLg: '28px',
      radiusControl: '9999px',
      radiusField: '4px',
      radiusChip: '8px',
      borderWidth: '1px',
      spacingBase: '4px',
      spacingXs: '4px',
      spacingSm: '8px',
      spacingMd: '16px',
      spacingLg: '24px',
      touchTargetMin: '44px',
      shadowElevationLow: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
      shadowElevationHigh: '0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)',
      shadowStyleName: 'soft-layered',
      fontWeightLabel: '500',
      letterSpacingLabel: '0.1px',
      motionEasing: 'cubic-bezier(0.2, 0, 0, 1)',
      motionDurationFast: '150ms',
      motionDuration: '250ms',
       fontFamilyDisplay: 'Inter, sans-serif',
       fontFamilyBody: 'Inter, sans-serif',
      fontFamilyMono: '"Roboto Mono", "JetBrains Mono", ui-monospace, monospace',
    },
  },
];

/** Presets that omit the interaction tones get defaults derived from their own brand, text and background. */
export const THEME_PRESETS: ThemePreset[] = PRESET_SEEDS.map((seed) => {
  const t = seed.tokens;
  return {
    ...seed,
    tokens: {
      ...t,
      colorFocusRing: t.colorFocusRing ?? t.colorNeutralText,
      colorBrandTint: t.colorBrandTint ?? `color-mix(in oklch, ${t.colorBrandPrimary} 12%, ${t.colorNeutralBg})`,
      colorBrandTintBorder: t.colorBrandTintBorder ?? `color-mix(in oklch, ${t.colorBrandPrimary} 40%, ${t.colorNeutralBg})`,
    },
  };
});

/**
 * APCA Lightness Contrast (Lc) Approximation Function
 * Computes estimated perceptual contrast between text luminance and background luminance.
 * APCA version 0.98G-4g:
 * Dark text on light: S_APC = (Y_bg^0.56 - Y_text^0.57) * 1.14; Lc = (S_APC - 0.027) * 100
 * Light text on dark: S_APC = (Y_bg^0.65 - Y_text^0.62) * 1.14; Lc = (S_APC - 0.027) * 100
 */
export function estimateLightnessFromOklch(oklchStr: string): number {
  const match = oklchStr.match(/oklch\(\s*([\d.]+)/i);
  if (match) {
    return parseFloat(match[1]); // returns L between 0 and 1
  }
  return 0.5;
}

export function calculateAPCA(textOklch: string, bgOklch: string): { lc: number; rating: 'PASS' | 'WARN' | 'FAIL'; note: string } {
  const L_text = estimateLightnessFromOklch(textOklch);
  const L_bg = estimateLightnessFromOklch(bgOklch);

  // Convert OKLCH L roughly to relative luminance Y
  const Y_text = Math.pow(L_text, 2.5);
  const Y_bg = Math.pow(L_bg, 2.5);

  let Sapc = 0;
  if (Y_bg > Y_text) {
    // Dark text on light background
    Sapc = (Math.pow(Y_bg, 0.56) - Math.pow(Y_text, 0.57)) * 1.14;
  } else {
    // Light text on dark background
    Sapc = (Math.pow(Y_bg, 0.65) - Math.pow(Y_text, 0.62)) * 1.14;
  }

  const Lc = Math.round(Math.abs(Sapc - 0.027) * 100);

  if (Lc >= 75) {
    return { lc: Lc, rating: 'PASS', note: 'Exceeds APCA Lc ≥ 75 (Body text ready)' };
  } else if (Lc >= 60) {
    return { lc: Lc, rating: 'WARN', note: 'Meets APCA Lc ≥ 60 (Headlines / Large text)' };
  } else {
    return { lc: Lc, rating: 'FAIL', note: 'Below APCA threshold (< 60 Lc)' };
  }
}

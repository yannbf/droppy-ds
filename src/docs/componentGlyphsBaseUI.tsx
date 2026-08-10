import * as React from 'react'

/**
 * Archetype glyphs ported from the Base UI Storybook's component browser: a
 * small shared vocabulary of schematic previews (one 152x84 viewBox, pure
 * `currentColor` at fixed opacities) that several components map onto, rather
 * than bespoke art per component. Droppy components reuse the source's own
 * archetype choices wherever a component corresponds (Modal -> dialog like
 * Dialog, Sidebar -> dialog like Drawer, NumberField -> input); Droppy-only
 * components take the nearest archetype.
 */

type Archetype =
  | 'accordion'
  | 'avatar'
  | 'bar'
  | 'button'
  | 'buttons'
  | 'checkbox'
  | 'dialog'
  | 'input'
  | 'lines'
  | 'list'
  | 'radio'
  | 'slider'
  | 'switch'
  | 'tabs'

function GlyphArt({ glyph }: { glyph: Archetype }) {
  const line = { fill: 'currentColor', opacity: 0.45 }
  const solid = { fill: 'currentColor', opacity: 0.85 }
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, opacity: 0.55 } as const
  const strokeStrong = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    opacity: 0.85,
  } as const

  switch (glyph) {
    case 'accordion':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="20" y="8" width="112" height="18" rx="4" {...stroke} />
          <path d="M116 15 l4 4 4-4" {...strokeStrong} />
          <rect x="20" y="30" width="112" height="30" rx="4" {...stroke} />
          <path d="M116 41 l4-4 4 4" {...strokeStrong} />
          <rect x="30" y="40" width="70" height="4" rx="2" {...line} />
          <rect x="30" y="49" width="52" height="4" rx="2" {...line} />
          <rect x="20" y="64" width="112" height="14" rx="4" {...stroke} />
        </svg>
      )
    case 'avatar':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <circle cx="42" cy="42" r="22" {...stroke} />
          <circle cx="42" cy="35" r="8" {...solid} />
          <path d="M27 56 a15 13 0 0 1 30 0" {...solid} />
          <rect x="76" y="32" width="52" height="6" rx="3" {...line} />
          <rect x="76" y="46" width="38" height="6" rx="3" {...line} />
        </svg>
      )
    case 'bar':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="20" y="30" width="112" height="12" rx="6" {...stroke} />
          <rect x="20" y="30" width="66" height="12" rx="6" {...solid} />
          <rect x="20" y="52" width="30" height="5" rx="2.5" {...line} />
          <rect x="112" y="52" width="20" height="5" rx="2.5" {...line} />
        </svg>
      )
    case 'button':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="42" y="30" width="68" height="24" rx="12" {...solid} />
          <rect x="58" y="40" width="36" height="4" rx="2" fill="currentColor" opacity={0.35} />
        </svg>
      )
    case 'buttons':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="18" y="30" width="34" height="24" rx="6" {...solid} />
          <rect x="59" y="30" width="34" height="24" rx="6" {...stroke} />
          <rect x="100" y="30" width="34" height="24" rx="6" {...stroke} />
        </svg>
      )
    case 'checkbox':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="30" y="20" width="16" height="16" rx="4" {...solid} />
          <path
            d="M34 28 l3 3 5-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            opacity={0.35}
          />
          <rect x="56" y="26" width="66" height="6" rx="3" {...line} />
          <rect x="30" y="48" width="16" height="16" rx="4" {...stroke} />
          <rect x="56" y="54" width="52" height="6" rx="3" {...line} />
        </svg>
      )
    case 'dialog':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="10" y="8" width="132" height="68" rx="6" fill="currentColor" opacity={0.08} />
          <rect x="34" y="20" width="84" height="44" rx="6" {...strokeStrong} />
          <rect x="44" y="30" width="50" height="6" rx="3" {...line} />
          <rect x="44" y="42" width="64" height="4" rx="2" {...line} />
          <rect x="80" y="52" width="28" height="8" rx="4" {...solid} />
        </svg>
      )
    case 'input':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="20" y="18" width="40" height="5" rx="2.5" {...line} />
          <rect x="20" y="30" width="112" height="24" rx="6" {...stroke} />
          <rect x="30" y="40" width="46" height="5" rx="2.5" {...line} />
          <rect x="79" y="37" width="2" height="12" rx="1" {...solid} />
        </svg>
      )
    case 'lines':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="20" y="24" width="112" height="6" rx="3" {...line} />
          <rect x="20" y="39" width="96" height="6" rx="3" {...line} />
          <rect x="20" y="54" width="72" height="6" rx="3" {...line} />
        </svg>
      )
    case 'list':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="34" y="10" width="84" height="64" rx="6" {...strokeStrong} />
          <rect x="40" y="20" width="72" height="12" rx="4" {...solid} />
          <rect x="48" y="24" width="42" height="4" rx="2" fill="currentColor" opacity={0.3} />
          <rect x="48" y="42" width="52" height="5" rx="2.5" {...line} />
          <rect x="48" y="54" width="44" height="5" rx="2.5" {...line} />
          <rect x="48" y="66" width="36" height="5" rx="2.5" {...line} />
        </svg>
      )
    case 'radio':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <circle cx="38" cy="28" r="8" {...strokeStrong} />
          <circle cx="38" cy="28" r="3.5" {...solid} />
          <rect x="56" y="25" width="66" height="6" rx="3" {...line} />
          <circle cx="38" cy="56" r="8" {...stroke} />
          <rect x="56" y="53" width="52" height="6" rx="3" {...line} />
        </svg>
      )
    case 'slider':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="20" y="39" width="112" height="6" rx="3" {...stroke} />
          <rect x="20" y="39" width="60" height="6" rx="3" {...solid} />
          <circle cx="80" cy="42" r="9" {...strokeStrong} />
          <circle cx="80" cy="42" r="4" {...solid} />
        </svg>
      )
    case 'switch':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="42" y="32" width="42" height="20" rx="10" {...solid} />
          <circle cx="74" cy="42" r="7" fill="currentColor" opacity={0.35} />
          <rect x="94" y="38" width="36" height="6" rx="3" {...line} />
        </svg>
      )
    case 'tabs':
      return (
        <svg viewBox="0 0 152 84" role="presentation">
          <rect x="24" y="22" width="30" height="6" rx="3" {...solid} />
          <rect x="62" y="22" width="30" height="6" rx="3" {...line} />
          <rect x="100" y="22" width="28" height="6" rx="3" {...line} />
          <rect x="24" y="33" width="104" height="2" rx="1" fill="currentColor" opacity={0.25} />
          <rect x="24" y="30" width="30" height="3" rx="1.5" {...solid} />
          <rect x="24" y="46" width="80" height="5" rx="2.5" {...line} />
          <rect x="24" y="58" width="60" height="5" rx="2.5" {...line} />
        </svg>
      )
    default:
      return null
  }
}

export const BASEUI_GLYPHS: Record<string, React.ReactNode> = {
  Accordion: <GlyphArt glyph="accordion" />,
  Badge: <GlyphArt glyph="button" />,
  Body: <GlyphArt glyph="lines" />,
  Breadcrumb: <GlyphArt glyph="lines" />,
  Button: <GlyphArt glyph="button" />,
  Card: <GlyphArt glyph="dialog" />,
  Carousel: <GlyphArt glyph="buttons" />,
  Container: <GlyphArt glyph="lines" />,
  ErrorBlock: <GlyphArt glyph="dialog" />,
  FooterCard: <GlyphArt glyph="list" />,
  Heading: <GlyphArt glyph="lines" />,
  Icon: <GlyphArt glyph="avatar" />,
  IconButton: <GlyphArt glyph="button" />,
  Input: <GlyphArt glyph="input" />,
  Link: <GlyphArt glyph="lines" />,
  Modal: <GlyphArt glyph="dialog" />,
  NumberField: <GlyphArt glyph="input" />,
  PageSection: <GlyphArt glyph="list" />,
  PageTemplate: <GlyphArt glyph="list" />,
  Progress: <GlyphArt glyph="bar" />,
  ProgressBar: <GlyphArt glyph="bar" />,
  QuantityStepper: <GlyphArt glyph="buttons" />,
  Review: <GlyphArt glyph="radio" />,
  ScrollArea: <GlyphArt glyph="lines" />,
  Select: <GlyphArt glyph="input" />,
  Separator: <GlyphArt glyph="lines" />,
  Sidebar: <GlyphArt glyph="dialog" />,
  Skeleton: <GlyphArt glyph="lines" />,
  Spinner: <GlyphArt glyph="bar" />,
  Tabs: <GlyphArt glyph="tabs" />,
  Toast: <GlyphArt glyph="dialog" />,
  Tooltip: <GlyphArt glyph="dialog" />,
  TopBanner: <GlyphArt glyph="dialog" />,
}

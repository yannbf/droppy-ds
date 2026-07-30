/**
 * Shared building blocks for the "Design tokens" MDX pages under `src/docs/tokens/`.
 * Docs-only tooling: not exported from `src/index.ts`, not imported by any component.
 */
import * as React from 'react'
import type { CSSProperties, ReactNode } from 'react'

/** Reads the live computed value of a CSS custom property off the document root,
 * re-reading whenever `data-theme` changes so pages flip with the toolbar. */
function useComputedVar(token: string): string {
  const read = () =>
    typeof window === 'undefined'
      ? ''
      : getComputedStyle(document.documentElement).getPropertyValue(token).trim()

  const [value, setValue] = React.useState(read)

  React.useEffect(() => {
    setValue(read())

    const observer = new MutationObserver(() => setValue(read()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return value
}

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.5rem 0',
  borderBottom: '1px solid var(--ds-color-border-subtle, #e9e9e9)',
}

const monoStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.8125rem',
}

/** A single color swatch for one CSS custom property, with its live computed value. */
export function Swatch({ token, label }: { token: string; label?: string }) {
  const value = useComputedVar(token)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '9rem' }}>
      <div
        style={{
          height: '3.5rem',
          borderRadius: '8px',
          border: '1px solid var(--ds-color-border-subtle, #e9e9e9)',
          background: `var(${token})`,
        }}
      />
      <div style={{ ...monoStyle }}>{label ?? token}</div>
      <div style={{ ...monoStyle, opacity: 0.6 }}>{value || '—'}</div>
    </div>
  )
}

/** A grid of Swatches, e.g. one palette scale or one semantic group. */
export function SwatchGrid({ tokens }: { tokens: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', margin: '1rem 0' }}>
      {tokens.map((token) => (
        <Swatch key={token} token={token} />
      ))}
    </div>
  )
}

/** A table row: token name, a live rendered sample, and the current computed value. */
export function TokenRow({
  token,
  renderSample,
}: {
  token: string
  renderSample: (token: string) => ReactNode
}) {
  const value = useComputedVar(token)

  return (
    <div style={rowStyle}>
      <div style={{ ...monoStyle, width: '16rem', flexShrink: 0 }}>{token}</div>
      <div style={{ flexGrow: 1 }}>{renderSample(token)}</div>
      <div style={{ ...monoStyle, opacity: 0.6, width: '12rem', flexShrink: 0 }}>
        {value || '—'}
      </div>
    </div>
  )
}

/** A named section: heading plus its content, spaced consistently. */
export function TokenSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem' }}>{title}</h4>
      {children}
    </div>
  )
}

/** A color swatch plus its token name and computed value, for a semantic-role table row. */
export function ColorSampleCell({ token }: { token: string }) {
  const value = useComputedVar(token)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '6px',
          border: '1px solid var(--ds-color-border-subtle, #e9e9e9)',
          background: `var(${token})`,
          flexShrink: 0,
        }}
      />
      <span style={{ ...monoStyle, opacity: 0.6 }}>{value || '—'}</span>
    </div>
  )
}

/** A type specimen rendered at a token's actual computed font size. */
export function TypeSpecimen({
  token,
  sampleText = 'The quick brown fox',
  style,
}: {
  token: string
  sampleText?: string
  style?: CSSProperties
}) {
  const value = useComputedVar(token)

  return (
    <div style={rowStyle}>
      <div style={{ ...monoStyle, width: '14rem', flexShrink: 0 }}>{token}</div>
      <div style={{ fontSize: `var(${token})`, lineHeight: 1.3, ...style }}>{sampleText}</div>
      <div style={{ ...monoStyle, opacity: 0.6, width: '6rem', flexShrink: 0, textAlign: 'right' }}>
        {value || '—'}
      </div>
    </div>
  )
}

/** A horizontal bar sized by a space token, labeled with its px and rem values. */
export function SpaceBar({ token }: { token: string }) {
  const value = useComputedVar(token)

  return (
    <div style={rowStyle}>
      <div style={{ ...monoStyle, width: '10rem', flexShrink: 0 }}>{token}</div>
      <div
        style={{
          height: '1rem',
          width: `var(${token})`,
          background: 'var(--ds-color-action-primary, #202020)',
          borderRadius: '2px',
        }}
      />
      <div style={{ ...monoStyle, opacity: 0.6, marginLeft: 'auto' }}>{value || '—'}</div>
    </div>
  )
}

/** A box rendered with a radius token, for the radius ladder. */
export function RadiusBox({ token, label }: { token: string; label?: string }) {
  const value = useComputedVar(token)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          width: '5rem',
          height: '5rem',
          borderRadius: `var(${token})`,
          background: 'var(--ds-color-surface-sunken, #f5f6f7)',
          border: '1px solid var(--ds-color-border-subtle, #e9e9e9)',
        }}
      />
      <div style={{ ...monoStyle, textAlign: 'center' }}>{label ?? token}</div>
      <div style={{ ...monoStyle, opacity: 0.6 }}>{value || '—'}</div>
    </div>
  )
}

/** A card rendered with a shadow token, on a plain surface so the shadow reads clearly. */
export function ShadowCard({ token, label }: { token: string; label?: string }) {
  const value = useComputedVar(token)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '8rem',
          height: '5rem',
          borderRadius: '8px',
          background: 'var(--ds-color-surface-card, #f9f9f9)',
          boxShadow: `var(${token})`,
        }}
      />
      <div style={{ ...monoStyle, textAlign: 'center' }}>{label ?? token}</div>
      <div style={{ ...monoStyle, opacity: 0.6, textAlign: 'center', maxWidth: '16rem' }}>
        {value || '—'}
      </div>
    </div>
  )
}

/** A small square whose transform transitions on hover, using motion duration/easing tokens. */
export function MotionDemo({
  durationToken,
  easingToken = '--ds-motion-ease',
}: {
  durationToken: string
  easingToken?: string
}) {
  const duration = useComputedVar(durationToken)
  const easing = useComputedVar(easingToken)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div
        className="ds-motion-demo-box"
        style={
          {
            width: '3rem',
            height: '3rem',
            borderRadius: '6px',
            background: 'var(--ds-color-action-primary, #202020)',
            transition: `transform var(${durationToken}) var(${easingToken})`,
            '--ds-motion-demo-hover-scale': 1.3,
          } as CSSProperties
        }
      />
      <div style={monoStyle}>
        <div>{durationToken}: {duration || '—'}</div>
        <div>{easingToken}: {easing || '—'}</div>
        <div style={{ opacity: 0.6 }}>hover the square</div>
      </div>
      <style>{`.ds-motion-demo-box:hover { transform: scale(1.3); }`}</style>
    </div>
  )
}

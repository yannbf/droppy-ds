import { describe, expect, it } from 'vitest'

import { transformSource } from './source-transform'

/** Droppy's dominant shape: docs on a local type alias, doc on an exported arrow const. */
const SOURCE = [
  "import type { ComponentProps } from 'react'",
  '',
  'type DefaultProps = {',
  '  /** The label. Rendered capitalized regardless of the casing passed in. */',
  '  text: string',
  '  /** `positive` matches the look of an affirmative flag. */',
  "  variant?: 'neutral' | 'positive'",
  '  className?: string',
  '}',
  '',
  "export type BadgeProps = DefaultProps & Omit<ComponentProps<'span'>, keyof DefaultProps>",
  '',
  '/** A short status flag. */',
  'export const Badge = ({ text, variant, className }: BadgeProps) => null',
  '',
].join('\n')

const BOTH = new Set(['source-jsdoc.component', 'source-jsdoc.props'])

describe('transformSource', () => {
  it('keeps everything when both facets are kept', () => {
    const result = transformSource('Badge.tsx', SOURCE, BOTH)
    expect(result.changed).toBe(false)
    expect(result.code).toBe(SOURCE)
  })

  it('removes the component JSDoc on an exported const', () => {
    const result = transformSource('Badge.tsx', SOURCE, new Set(['source-jsdoc.props']))
    expect(result.changed).toBe(true)
    expect(result.code).not.toContain('A short status flag.')
    expect(result.code).toContain('export const Badge')
    expect(result.code).toContain('The label. Rendered capitalized')
  })

  it('removes the component JSDoc on an exported function declaration', () => {
    const code = ['/** A card. */', 'export function Card() {', '  return null', '}', ''].join('\n')
    const result = transformSource('Card.tsx', code, new Set(['source-jsdoc.props']))
    expect(result.code).not.toContain('A card.')
    expect(result.code).toContain('export function Card')
  })

  it('removes member JSDoc from a local *Props type alias', () => {
    const result = transformSource('Badge.tsx', SOURCE, new Set(['source-jsdoc.component']))
    expect(result.changed).toBe(true)
    expect(result.code).not.toContain('The label. Rendered capitalized')
    expect(result.code).not.toContain('affirmative flag')
    expect(result.code).toContain('text: string')
    expect(result.code).toContain("variant?: 'neutral' | 'positive'")
    expect(result.code).toContain('A short status flag.')
  })

  it('removes member JSDoc from an object literal inside an intersection', () => {
    const code = [
      'export type CardProps = {',
      '  /** Hover dim plus pointer cursor. */',
      '  interactive?: boolean',
      "} & ComponentProps<'div'>",
      '',
    ].join('\n')
    const result = transformSource('Card.tsx', code, new Set(['source-jsdoc.component']))
    expect(result.code).not.toContain('Hover dim plus pointer cursor.')
    expect(result.code).toContain('interactive?: boolean')
  })

  it('removes member JSDoc from an interface, for components written that way', () => {
    const code = [
      'export interface InputProps {',
      '  /** The current value. */',
      '  value?: string',
      '}',
      '',
    ].join('\n')
    const result = transformSource('Input.tsx', code, new Set(['source-jsdoc.component']))
    expect(result.code).not.toContain('The current value.')
    expect(result.code).toContain('value?: string')
  })

  it('leaves non-props types documented', () => {
    const code = [
      'type Order = {',
      '  /** Cents, not currency units. */',
      '  total: number',
      '}',
      '',
    ].join('\n')
    const result = transformSource('Review.tsx', code, new Set(['source-jsdoc.component']))
    expect(result.changed).toBe(false)
    expect(result.code).toContain('Cents, not currency units.')
  })

  it('does not mistake a documented type alias above a component for its component JSDoc', () => {
    const code = [
      '/** The props, documented as a whole. */',
      'type DefaultProps = { className?: string }',
      'export const Badge = () => null',
      '',
    ].join('\n')
    const result = transformSource('Badge.tsx', code, new Set(['source-jsdoc.props']))
    expect(result.code).toContain('The props, documented as a whole.')
  })

  it('removes both kinds when neither facet is kept', () => {
    const result = transformSource('Badge.tsx', SOURCE, new Set())
    expect(result.code).not.toContain('A short status flag.')
    expect(result.code).not.toContain('The label. Rendered capitalized')
  })
})

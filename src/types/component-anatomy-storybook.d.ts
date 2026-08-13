/**
 * Type declarations for `@component-anatomy/storybook`.
 *
 * The package's `types` field points at `dist/index.d.ts`, but the published
 * 0.0.1 tarball ships only JavaScript in `dist/` — so the module otherwise
 * resolves to `any` and `noImplicitAny` rejects the import. Mirrored here from
 * the package's own published `src/types.ts`, narrowed to the fields we use,
 * so a typo in an anatomy parameter still fails the build. Delete this once
 * upstream ships its declarations.
 *
 * @see https://github.com/julien-deramond/component-anatomy
 */
declare module '@component-anatomy/storybook' {
  export type AnatomyPartDefinition = {
    /** Matches the value of `data-part="…"` on the rendered element. */
    id: string
    /** Display name shown in the Anatomy panel and the overlay label. */
    name: string
    /** Markdown, rendered by the panel. */
    description?: string
  }

  export type AnatomyParameters = {
    /** Omit to auto-discover parts from the `data-part` attributes present. */
    parts?: AnatomyPartDefinition[]
    preset?: 'default' | 'minimal' | 'contrast' | 'blueprint'
    /** Only the shorthand token is declared; the full theme has many more. */
    theme?: { accent?: string }
    overlayLabel?: boolean
    overlayPadding?: number
    /** CSS selector narrowing the anatomy root inside the canvas. */
    root?: string
    disable?: boolean
  }
}

/** The addon's preview entry, registered in `.storybook/preview.tsx`. */
declare module '@component-anatomy/storybook/preview' {
  import type { Decorator } from '@storybook/react-vite'

  export const decorators: Decorator[]
}

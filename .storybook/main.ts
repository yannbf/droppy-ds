import type { StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // addon-docs compiles MDX without GitHub-flavored markdown, so the
      // docs pages' tables need remark-gfm supplied here to render as tables.
      options: {
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
    {
      name: '@unpunnyfuns/swatchbook-addon',
      options: {
        config: {
          // Base layer mirrors :root (primitives + light semantic values);
          // the "Dark" context overlays :root[data-theme='dark'] on top of it.
          tokens: ['src/theme/tokens/base.json'],
          axes: [
            {
              name: 'mode',
              contexts: { Light: [], Dark: ['src/theme/tokens/dark.json'] },
              default: 'Light',
            },
          ],
          // Distinct from the runtime `--ds-*` custom properties in
          // styles.css: the addon's own toolbar writes axis state to
          // `<html>` globally, and reusing `ds` would let its generated
          // `--ds-*` rules fight the real stylesheet's `data-theme` rules
          // for the same property names across the whole Storybook preview,
          // not just the tokens doc page.
          cssVarPrefix: 'token',
        },
      },
    },
  ],
  framework: '@storybook/react-vite',
  viteFinal: (config) => {
    // The inherited vite.config.ts runs vite-plugin-dts, whose api-extractor
    // pass reads dist/index.d.ts — a library-build concern that fails on a
    // clean checkout (Chromatic CI) and emits nothing Storybook uses.
    config.plugins = (config.plugins ?? [])
      .flat(3)
      .filter((plugin) => !(plugin && 'name' in plugin && plugin.name === 'vite:dts'))
    return config
  },
  features: {
    experimentalReview: true,
    experimentalReactComponentMeta: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // Overriding `exclude` replaces the plugin default (stories), so restate it.
      // The config dir has no component props, and docgen's file discovery can't
      // descend into dot-directories — left in, every run warns about preview.tsx.
      exclude: ['**/*.stories.tsx', '.storybook/**'],
    },
  },
}

export default config

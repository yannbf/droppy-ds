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
    '@component-anatomy/storybook',
    {
      name: '@unpunnyfuns/swatchbook-addon',
      options: { configPath: '../swatchbook.config.ts' },
    },
    'storybook-addon-tag-badges',
    '@github-ui/storybook-addon-performance-panel',
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
  tags: {
    anatomy: { excludeFromSidebar: true },
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

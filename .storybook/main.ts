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
  ],
  framework: '@storybook/react-vite',
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

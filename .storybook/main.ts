import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/react-vite'
import type { Manifests } from 'storybook/internal/types'
import remarkGfm from 'remark-gfm'

import { purgeDocgenFromManifests, readPurgeAllDocgen } from './docgen-purge'

// On freeze-generated experiment branches, experiment.json records whether this build must
// strip all generated docgen (see experiments.config.ts). On a regular checkout the file does
// not exist and the config below is unchanged.
const purgeAllDocgen = readPurgeAllDocgen(
  fileURLToPath(new URL('../experiment.json', import.meta.url))
)

// The public StorybookConfig type only declares experimental_manifests in its raw (resolved)
// form, but main.ts is itself a preset, so a function here composes over the framework's
// generated manifests.
const config: StorybookConfig & {
  experimental_manifests?: (existing: Manifests | undefined) => Manifests | undefined
} = {
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
    changeDetection: true,
  },
  tags: {
    anatomy: { defaultFilterSelection: 'exclude' },
  },
  // reactDocgen: false also strips the __docgenInfo the vite plugin would inline into the
  // preview bundle, so a purged branch shows no prop tables in the rendered docs either. The
  // manifest generator keeps its react-component-meta engine regardless (that feature flag
  // stays on); its output is stripped by experimental_manifests below.
  typescript: purgeAllDocgen
    ? { reactDocgen: false }
    : {
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
          // Overriding `exclude` replaces the plugin default (stories), so restate it.
          // The config dir has no component props, and docgen's file discovery can't
          // descend into dot-directories — left in, every run warns about preview.tsx.
          exclude: ['**/*.stories.tsx', '.storybook/**'],
        },
      },
  ...(purgeAllDocgen
    ? {
        experimental_manifests: (existing: Manifests | undefined) =>
          existing ? purgeDocgenFromManifests(existing) : existing,
      }
    : {}),
}

export default config

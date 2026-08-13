import { defineConfig } from 'vitest/config'

// The root vitest.config.ts is a browser-only Storybook project; these are node
// unit tests over string-in, string-out transforms, so they need their own project.
export default defineConfig({
  test: {
    name: 'storybook-freeze',
    environment: 'node',
    root: import.meta.dirname,
    include: ['src/**/*.test.ts'],
  },
})

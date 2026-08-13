import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

// The only suite is the story suite: every story runs as a test, play
// functions run as interaction tests, and the a11y addon's `test: 'error'`
// turns accessibility violations into failures — so there is nothing to keep
// in sync with the stories.
export default defineConfig({
  plugins: [storybookTest({ configDir: fileURLToPath(new URL('.storybook', import.meta.url)) })],
  optimizeDeps: {
    // react-dom is CJS and only imported from the addon-vitest setup file,
    // which Vite's dependency scanner skips — without pre-bundling, its named
    // exports (flushSync) are missing in the browser.
    include: ['react-dom', 'react-dom/client'],
  },
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})

import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

// Scratch-only copy of vitest.config.ts pinned to the sandbox's preinstalled
// Chromium (the repo's Playwright build number isn't present here).
export default defineConfig({
  plugins: [
    storybookTest({
      configDir: fileURLToPath(new URL('.storybook', new URL('file:///home/user/droppy-ds/'))),
    }),
  ],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions: { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' } }),
      instances: [{ browser: 'chromium' }],
    },
  },
})

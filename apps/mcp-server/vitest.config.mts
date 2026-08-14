import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: '@droppy/mcp',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})

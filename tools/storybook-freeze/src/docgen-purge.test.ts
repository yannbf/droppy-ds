import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// The module under test lives in .storybook/ because it runs inside the Storybook build
// (main.ts wires it into the experimental_manifests preset). It is tested here because this
// suite is the experiment machinery's node test project; the root vitest project is
// browser-only story tests.
import { purgeDocgenFromManifests, readPurgeAllDocgen } from '../../../.storybook/docgen-purge'

const manifests = {
  components: {
    v: 0,
    components: {
      'actions-button': {
        id: 'actions-button',
        name: 'Button',
        path: './src/components/Button/Button.stories.tsx',
        description: 'A button.',
        summary: 'A button, briefly.',
        jsDocTags: { deprecated: ['use IconButton'] },
        error: { name: 'DocgenError', message: 'partial extraction' },
        reactComponentMeta: { displayName: 'Button', props: { clear: { name: 'clear' } } },
        reactDocgen: { description: 'legacy engine payload' },
        reactDocgenTypescript: { description: 'legacy engine payload' },
        argTypes: { clear: { name: 'clear' } },
        stories: [{ id: 'actions-button--empty', name: 'Empty', snippet: '<Button />' }],
        import: 'import { Button } from "@droppy/design-system";',
        docs: { 'actions-button--docs': { id: 'actions-button--docs' } },
        subcomponents: {
          ButtonIcon: {
            name: 'ButtonIcon',
            path: './src/components/Button/Button.stories.tsx',
            description: 'An icon inside a button.',
            summary: 'An icon.',
            import: 'import { ButtonIcon } from "@droppy/design-system";',
            jsDocTags: { internal: [''] },
            reactComponentMeta: { displayName: 'ButtonIcon' },
            argTypes: { size: { name: 'size' } },
          },
        },
      },
    },
    meta: { docgen: 'react-component-meta', durationMs: 12 },
  },
  docs: { v: 0, docs: {} },
}

describe('purgeDocgenFromManifests', () => {
  it('removes every docgen engine payload from each component', () => {
    const purged = purgeDocgenFromManifests(manifests)
    const button = purged.components?.components['actions-button']
    expect(button).toBeDefined()
    expect(button).not.toHaveProperty('reactComponentMeta')
    expect(button).not.toHaveProperty('reactDocgen')
    expect(button).not.toHaveProperty('reactDocgenTypescript')
    expect(button).not.toHaveProperty('argTypes')
  })

  it('removes the JSDoc-derived fields docgen extracts alongside the props', () => {
    const purged = purgeDocgenFromManifests(manifests)
    const button = purged.components?.components['actions-button']
    expect(button).not.toHaveProperty('description')
    expect(button).not.toHaveProperty('summary')
    expect(button).not.toHaveProperty('error')
    expect(button?.jsDocTags).toEqual({})
  })

  it('purges subcomponents the same way as their component', () => {
    const purged = purgeDocgenFromManifests(manifests)
    const sub = purged.components?.components['actions-button']?.subcomponents?.ButtonIcon
    expect(sub).toBeDefined()
    expect(sub).not.toHaveProperty('reactComponentMeta')
    expect(sub).not.toHaveProperty('argTypes')
    expect(sub).not.toHaveProperty('description')
    expect(sub).not.toHaveProperty('summary')
    expect(sub?.jsDocTags).toEqual({})
  })

  it('keeps the CSF-derived and MDX-derived fields', () => {
    const purged = purgeDocgenFromManifests(manifests)
    const button = purged.components?.components['actions-button']
    expect(button?.id).toBe('actions-button')
    expect(button?.name).toBe('Button')
    expect(button?.path).toBe('./src/components/Button/Button.stories.tsx')
    expect(button?.stories).toHaveLength(1)
    expect(button?.import).toContain('@droppy/design-system')
    expect(button).toHaveProperty('docs')
    const sub = button?.subcomponents?.ButtonIcon
    expect(sub?.name).toBe('ButtonIcon')
    expect(sub?.path).toBe('./src/components/Button/Button.stories.tsx')
    expect(sub?.import).toContain('@droppy/design-system')
  })

  it('leaves manifests other than the components manifest alone', () => {
    expect(purgeDocgenFromManifests(manifests).docs).toEqual({ v: 0, docs: {} })
  })

  it('passes through manifests that have no components manifest', () => {
    expect(purgeDocgenFromManifests({})).toEqual({})
  })

  it('does not mutate its input', () => {
    purgeDocgenFromManifests(manifests)
    expect(manifests.components.components['actions-button']).toHaveProperty('reactComponentMeta')
    expect(manifests.components.components['actions-button'].description).toBe('A button.')
    expect(
      manifests.components.components['actions-button'].subcomponents.ButtonIcon
    ).toHaveProperty('argTypes')
  })
})

describe('readPurgeAllDocgen', () => {
  it('returns false when there is no experiment.json (a regular checkout)', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'docgen-purge-'))
    try {
      expect(readPurgeAllDocgen(path.join(dir, 'experiment.json'))).toBe(false)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('returns the recorded flag from experiment.json', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'docgen-purge-'))
    try {
      const file = path.join(dir, 'experiment.json')
      await writeFile(file, JSON.stringify({ purgeAllDocgen: true }))
      expect(readPurgeAllDocgen(file)).toBe(true)
      await writeFile(file, JSON.stringify({ purgeAllDocgen: false }))
      expect(readPurgeAllDocgen(file)).toBe(false)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('treats a pre-flag experiment.json as not purging', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'docgen-purge-'))
    try {
      const file = path.join(dir, 'experiment.json')
      await writeFile(file, JSON.stringify({ branchName: 'experiment/full' }))
      expect(readPurgeAllDocgen(file)).toBe(false)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('fails loudly on an unreadable experiment.json rather than guessing', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'docgen-purge-'))
    try {
      const file = path.join(dir, 'experiment.json')
      await writeFile(file, 'not json')
      expect(() => readPurgeAllDocgen(file)).toThrow(/experiment\.json/)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})

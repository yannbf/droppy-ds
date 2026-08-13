import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { runCorpus } from './corpus'
import { type Labels } from './labels'

const labels: Labels = {
  definedFacets: [],
  deleteFacets: new Set(['story.infra']),
  storyTags: new Set(['showcase', 'highlight', 'infra']),
  isKept: (f, keep) => f !== 'story.infra' && keep.has(f),
}

const storyFile = (exports: string[]): string =>
  [
    'const meta = { title: "X" } satisfies Meta',
    'export default meta',
    'type Story = StoryObj<typeof meta>',
    ...exports,
    '',
  ].join('\n')

let dir: string
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'freeze-corpus-'))
})
afterEach(async () => {
  await rm(dir, { recursive: true, force: true })
})

/** Create `src/components/<name>/` under the temp repo and return its absolute path. */
async function component(root: string, name: string): Promise<string> {
  const dirPath = path.join(root, 'src/components', name)
  await mkdir(dirPath, { recursive: true })
  return dirPath
}

describe('runCorpus', () => {
  it('drops unkept stories, prunes emptied files, strips mdx blocks and source jsdoc', async () => {
    const checkbox = await component(dir, 'Checkbox')
    const gallery = await component(dir, 'Gallery')

    await writeFile(
      path.join(checkbox, 'Checkbox.stories.tsx'),
      storyFile([
        "export const Hero: Story = { tags: ['showcase'], render: () => null }",
        "export const Grid: Story = { tags: ['infra'], render: () => null }",
      ])
    )
    await writeFile(
      path.join(gallery, 'Gallery.stories.tsx'),
      storyFile(["export const Only: Story = { tags: ['infra'], render: () => null }"])
    )
    await writeFile(
      path.join(checkbox, 'Checkbox.mdx'),
      [
        '{/* BEGIN: general */}',
        'keep me',
        '{/* END: general */}',
        '',
        '{/* BEGIN: styling */}',
        'drop me',
        '{/* END: styling */}',
        '',
      ].join('\n')
    )
    await writeFile(
      path.join(checkbox, 'Checkbox.tsx'),
      ['/** desc */', 'export const Checkbox = () => null', ''].join('\n')
    )

    const summary = await runCorpus(dir, new Set(['mdx.general']), labels)

    // Both story files lose every export, so both are deleted.
    await expect(access(path.join(checkbox, 'Checkbox.stories.tsx'))).rejects.toThrow()
    await expect(access(path.join(gallery, 'Gallery.stories.tsx'))).rejects.toThrow()

    // The doc has no namespace import, so nothing makes it dangle.
    const mdx = await readFile(path.join(checkbox, 'Checkbox.mdx'), 'utf8')
    expect(mdx).toContain('keep me')
    expect(mdx).not.toContain('drop me')

    const source = await readFile(path.join(checkbox, 'Checkbox.tsx'), 'utf8')
    expect(source).not.toContain('desc')

    expect(summary.storiesRemoved).toBe(3)
    expect(summary.removed).toHaveLength(2)
  })

  it('deletes MDX star-importing a pruned CSF and keeps MDX importing a surviving one', async () => {
    const button = await component(dir, 'Button')
    const radio = await component(dir, 'Radio')

    await writeFile(
      path.join(button, 'Button.stories.tsx'),
      storyFile(["export const Hero: Story = { tags: ['showcase'], render: () => null }"])
    )
    await writeFile(
      path.join(button, 'Button.mdx'),
      [
        "import * as ButtonStories from './Button.stories'",
        '',
        '<Meta of={ButtonStories} />',
        '',
      ].join('\n')
    )
    await writeFile(
      path.join(radio, 'Radio.stories.tsx'),
      storyFile(["export const Only: Story = { tags: ['infra'], render: () => null }"])
    )
    await writeFile(
      path.join(radio, 'Radio.mdx'),
      [
        "import * as RadioStories from './Radio.stories'",
        '',
        '<Meta of={RadioStories} />',
        '',
      ].join('\n')
    )

    await runCorpus(dir, new Set(['story.showcase']), labels)

    await expect(access(path.join(button, 'Button.stories.tsx'))).resolves.toBeUndefined()
    await expect(access(path.join(button, 'Button.mdx'))).resolves.toBeUndefined()
    await expect(access(path.join(radio, 'Radio.stories.tsx'))).rejects.toThrow()
    await expect(access(path.join(radio, 'Radio.mdx'))).rejects.toThrow()
  })

  it('purges Canvas invocations of removed exports in a surviving sibling doc', async () => {
    const button = await component(dir, 'Button')

    await writeFile(
      path.join(button, 'Button.stories.tsx'),
      storyFile([
        "export const Hero: Story = { tags: ['showcase'], render: () => null }",
        "export const Extra: Story = { tags: ['highlight'], render: () => null }",
      ])
    )
    await writeFile(
      path.join(button, 'Button.mdx'),
      [
        "import * as ButtonStories from './Button.stories'",
        '',
        '<Meta of={ButtonStories} />',
        '',
        '## Showcase',
        '',
        '<Canvas of={ButtonStories.Hero} />',
        '',
        '### Extra',
        '',
        '<Canvas of={ButtonStories.Extra} />',
        '',
      ].join('\n')
    )

    await runCorpus(dir, new Set(['story.showcase']), labels)

    const mdx = await readFile(path.join(button, 'Button.mdx'), 'utf8')
    expect(mdx).toContain('ButtonStories.Hero')
    expect(mdx).not.toContain('ButtonStories.Extra')
    expect(mdx).not.toContain('### Extra')
    expect(mdx).toContain('## Showcase')
  })

  it('deletes a whole-file general doc whose facet is not kept', async () => {
    const docs = path.join(dir, 'src/docs')
    await mkdir(docs, { recursive: true })
    await writeFile(
      path.join(docs, 'AccessibilityGuidelines.mdx'),
      ['<Meta', '  title="Accessibility guidelines"', "  tags={['general-a11y']}", '/>', ''].join(
        '\n'
      )
    )
    await writeFile(
      path.join(docs, 'GettingStarted.mdx'),
      ['<Meta title="Getting started" tags={[\'general-setup\']} />', ''].join('\n')
    )

    const summary = await runCorpus(dir, new Set(['general.general-setup']), labels)

    await expect(access(path.join(docs, 'AccessibilityGuidelines.mdx'))).rejects.toThrow()
    await expect(access(path.join(docs, 'GettingStarted.mdx'))).resolves.toBeUndefined()
    expect(summary.removed).toHaveLength(1)
  })
})

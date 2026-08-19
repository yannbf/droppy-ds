import MagicString from 'magic-string'

import { leadingBlockComment, parse, type Comment } from './oxc-utils'
import { type Labels } from './labels'

export interface StoryTransformResult {
  code: string
  changed: boolean
  removedStoryExports: number
  remainingStoryExports: number
  removedStoryNames: string[]
}

/** `{ … } satisfies Meta<typeof X>` and `{ … } as Meta` — read through to the object. */
function unwrapAssertions(node: any): any {
  let current = node
  while (current?.type === 'TSSatisfiesExpression' || current?.type === 'TSAsExpression') {
    current = current.expression
  }
  return current
}

function stringArray(node: any): string[] {
  if (node?.type !== 'ArrayExpression') {
    return []
  }
  return node.elements
    .filter((el: any) => el?.type === 'Literal' && typeof el.value === 'string')
    .map((el: any) => el.value as string)
}

function tagsOf(node: any): string[] {
  const objectExpression = unwrapAssertions(node)
  if (objectExpression?.type !== 'ObjectExpression') {
    return []
  }
  const prop = objectExpression.properties.find(
    (p: any) => p.type === 'Property' && p.key?.name === 'tags'
  )
  return prop ? stringArray(prop.value) : []
}

/**
 * True when the leading-comment range MagicString would remove is a JSDoc-style block comment
 * (one starting `/**`) rather than some other block comment, e.g. a lint directive. The facets
 * are `csf-jsdoc.*`, so only JSDoc is in their remit — a plain block comment must survive
 * regardless of the keep set.
 */
function isJSDocRange(
  range: { start: number; end: number } | null,
  comments: readonly Comment[]
): range is { start: number; end: number } {
  if (!range) {
    return false
  }
  const comment = comments.find((candidate) => candidate.start === range.start)
  return comment !== undefined && comment.value.startsWith('*')
}

/** The tag marking placeholder stories whose fate `keepEmptyCsf` decides. */
export const EMPTY_TAG = 'empty'

/**
 * Decide which story exports survive on this branch, and strip CSF JSDoc.
 *
 * A story's effective tags are the union of its own `tags` and the `meta`-level `tags`,
 * narrowed to `labels.storyTags` (the recognized classification vocabulary). The export
 * survives if any of those, as `story.<tag>`, is kept — otherwise the whole export is removed,
 * comment and all. Stories tagged `empty` sit outside the facet vocabulary: `keepEmptyCsf`
 * alone decides whether they survive. Independently, the `meta` docblock and each surviving
 * story's docblock are stripped unless `csf-jsdoc.meta` / `csf-jsdoc.story` is kept.
 */
export function transformStory(
  filename: string,
  code: string,
  keep: ReadonlySet<string>,
  labels: Labels,
  keepEmptyCsf = false
): StoryTransformResult {
  const { program, comments } = parse(filename, code)
  const ms = new MagicString(code)
  let changed = false
  let removedStoryExports = 0
  let remainingStoryExports = 0
  const removedStoryNames: string[] = []

  let metaNode: any = null
  let metaTags: string[] = []
  for (const node of program.body) {
    if (node.type === 'VariableDeclaration' && node.declarations[0]?.id?.name === 'meta') {
      metaNode = node
      metaTags = tagsOf(node.declarations[0].init)
    }
  }

  const keepMetaJsdoc = keep.has('csf-jsdoc.meta')
  const keepStoryJsdoc = keep.has('csf-jsdoc.story')

  if (metaNode && !keepMetaJsdoc) {
    const range = leadingBlockComment(metaNode, comments, code)
    if (isJSDocRange(range, comments)) {
      ms.remove(range.start, range.end)
      changed = true
    }
  }

  for (const node of program.body) {
    if (
      node.type !== 'ExportNamedDeclaration' ||
      node.declaration?.type !== 'VariableDeclaration'
    ) {
      continue
    }
    const declarator = node.declaration.declarations[0]
    const typeName = declarator?.id?.typeAnnotation?.typeAnnotation?.typeName?.name
    if (typeName !== 'Story' && typeName !== 'StoryObj') {
      continue
    }

    const rawTags = [...new Set([...metaTags, ...tagsOf(declarator.init)])]
    const effectiveTags = rawTags.filter((tag) => labels.storyTags.has(tag))
    const isKept = rawTags.includes(EMPTY_TAG)
      ? keepEmptyCsf
      : effectiveTags.some((tag) => labels.isKept(`story.${tag}`, keep))

    if (!isKept) {
      const lead = leadingBlockComment(node, comments, code)
      let end = node.end
      if (code[end] === '\n') {
        end += 1
      }
      ms.remove(lead ? lead.start : node.start, end)
      changed = true
      removedStoryExports += 1
      if (declarator.id?.name) {
        removedStoryNames.push(declarator.id.name)
      }
    } else {
      remainingStoryExports += 1
      if (!keepStoryJsdoc) {
        const range = leadingBlockComment(node, comments, code)
        if (isJSDocRange(range, comments)) {
          ms.remove(range.start, range.end)
          changed = true
        }
      }
    }
  }

  return {
    code: changed ? ms.toString() : code,
    changed,
    removedStoryExports,
    remainingStoryExports,
    removedStoryNames,
  }
}

import MagicString from 'magic-string'

import { leadingBlockComment, parse, type Comment } from './oxc-utils'

export interface TransformResult {
  code: string
  changed: boolean
}

/**
 * Every object-literal type reachable from a type annotation, descending through intersections
 * and unions. Droppy writes props as `DefaultProps & Omit<ComponentProps<'div'>, …>`, so the
 * documented members can sit in either operand.
 */
function typeLiterals(node: any, found: any[] = []): any[] {
  if (!node || typeof node !== 'object') {
    return found
  }
  if (node.type === 'TSTypeLiteral') {
    found.push(node)
    return found
  }
  if (node.type === 'TSIntersectionType' || node.type === 'TSUnionType') {
    for (const member of node.types ?? []) {
      typeLiterals(member, found)
    }
  }
  if (node.type === 'TSParenthesizedType') {
    typeLiterals(node.typeAnnotation, found)
  }
  return found
}

/**
 * True when the leading-comment range MagicString would remove is a JSDoc-style block comment
 * (one starting `/**`) rather than some other block comment, e.g. a lint directive. The facet is
 * `source-jsdoc.*`, so only JSDoc is in its remit — a plain block comment must survive regardless
 * of the keep set.
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

/**
 * Strip the JSDoc that documents components and their props.
 *
 * Droppy documents a component with a block comment on its exported declaration, and its props
 * on the members of a documented type — usually the local `type DefaultProps = { … }` rather
 * than the exported alias built from it, but sometimes a companion item type such as `TabItem`
 * or `FooterCardLink`. Rather than trying to name-match every such shape, every top-level type
 * alias and interface in the file is treated as fair game: this also strips member docs from
 * demo/mock-data types, which is an accepted trade for a rule that cannot silently miss a new
 * companion type.
 */
export function transformSource(
  filename: string,
  code: string,
  keep: ReadonlySet<string>
): TransformResult {
  const keepComponent = keep.has('source-jsdoc.component')
  const keepProps = keep.has('source-jsdoc.props')
  if (keepComponent && keepProps) {
    return { code, changed: false }
  }

  const { program, comments } = parse(filename, code)
  const ms = new MagicString(code)
  let changed = false

  const strip = (node: { start: number }): void => {
    const range = leadingBlockComment(node, comments, code)
    if (isJSDocRange(range, comments)) {
      ms.remove(range.start, range.end)
      changed = true
    }
  }

  for (const node of program.body) {
    const exported = node.type === 'ExportNamedDeclaration'
    const declaration = exported ? node.declaration : node
    if (!declaration) {
      continue
    }

    const isComponentDeclaration =
      declaration.type === 'VariableDeclaration' || declaration.type === 'FunctionDeclaration'
    if (!keepComponent && exported && isComponentDeclaration) {
      strip(node)
    }

    if (keepProps) {
      continue
    }
    if (declaration.type === 'TSInterfaceDeclaration') {
      for (const member of declaration.body?.body ?? []) {
        strip(member)
      }
    }
    if (declaration.type === 'TSTypeAliasDeclaration') {
      for (const literal of typeLiterals(declaration.typeAnnotation)) {
        for (const member of literal.members ?? []) {
          strip(member)
        }
      }
    }
  }

  return { code: changed ? ms.toString() : code, changed }
}

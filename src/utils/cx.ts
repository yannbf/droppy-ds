/**
 * Joins class names, dropping anything falsy.
 *
 * Every Droppy component merges an incoming `className` rather than letting it
 * win, so consumers can compose (`styled(Button)`, utility classes) without
 * dropping the design system's own chrome.
 */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

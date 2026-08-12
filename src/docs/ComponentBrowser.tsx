import * as React from 'react'
import type { CSSProperties } from 'react'

/**
 * A browsable, searchable index of every Droppy component. Each card embeds the
 * component's primary story — frozen on its finished state — shows the component name and
 * a one-line description, and links to that component's docs page.
 *
 * Rendered by the `Component browser` MDX page. Because docs pages render inside the
 * Storybook preview iframe, card links target `_top` with a manager-rooted `?path=` URL so
 * a click navigates the Storybook manager rather than just the iframe.
 *
 * Booting a preview iframe per card is expensive, so frames load through two layers:
 * an IntersectionObserver loads on-screen frames first and trickles in the rest, and in
 * dev the frozen documents are snapshotted into the Cache API so a revisit renders them
 * without booting anything (Vite HMR events invalidate the snapshots).
 */

interface ComponentEntry {
  /** Display name (matches the sidebar leaf). */
  name: string
  /** Storybook docs page id, e.g. `actions-button` (the `--docs` suffix is added). */
  id: string
  /**
   * Grouping shared with the sidebar — story titles are `<category>/<Name>`,
   * so this page's sections mirror the sidebar's own.
   */
  category: string
  /** One-line description shown on the card. */
  description: string
  /** Story id of the component's primary story — what the live preview embeds. */
  storyId: string
}

// Order the category sections top-to-bottom.
const CATEGORY_ORDER = [
  'Actions',
  'Forms & input',
  'Navigation',
  'Layout & structure',
  'Feedback & status',
  'Overlays',
  'Typography',
  'Media & content',
]

// Every component this package ships. `id` is the Storybook-slugified story title; the
// card links to `?path=/docs/${id}--docs`.
const COMPONENTS: ComponentEntry[] = [
  // Actions
  {
    name: 'Button',
    id: 'actions-button',
    storyId: 'actions-button--default',
    category: 'Actions',
    description:
      'The primary action control — chrome from the theme, variants and icon slot from Droppy.',
  },
  {
    name: 'IconButton',
    id: 'actions-iconbutton',
    storyId: 'actions-iconbutton--default',
    category: 'Actions',
    description:
      'A circular icon-only control for floating affordances like carousel arrows and dismissals.',
  },
  {
    name: 'Link',
    id: 'actions-link',
    storyId: 'actions-link--default',
    category: 'Actions',
    description:
      'An inline text link — inside a sentence or a short list, not a button and not a nav item.',
  },

  // Forms & input
  {
    name: 'Input',
    id: 'forms-input-input',
    storyId: 'forms-input-input--default',
    category: 'Forms & input',
    description: 'A labelled text field with a reserved slot for its validation message.',
  },
  {
    name: 'NumberField',
    id: 'forms-input-numberfield',
    storyId: 'forms-input-numberfield--default',
    category: 'Forms & input',
    description: 'A typeable numeric input with increment/decrement buttons and pointer scrub.',
  },
  {
    name: 'QuantityStepper',
    id: 'forms-input-quantitystepper',
    storyId: 'forms-input-quantitystepper--default',
    category: 'Forms & input',
    description: 'A minus/plus pair flanking a quantity, for adjusting the count of a single item.',
  },
  {
    name: 'Select',
    id: 'forms-input-select',
    storyId: 'forms-input-select--default',
    category: 'Forms & input',
    description: 'A single-choice control over a short, known list.',
  },

  // Navigation
  {
    name: 'Breadcrumb',
    id: 'navigation-breadcrumb',
    storyId: 'navigation-breadcrumb--default',
    category: 'Navigation',
    description:
      'A trail of ancestor pages to the current one — categories, restaurants, hierarchies.',
  },
  {
    name: 'FooterCard',
    id: 'navigation-footercard',
    storyId: 'navigation-footercard--default',
    category: 'Navigation',
    description: 'A titled column of links for a page footer — grouped footer navigation.',
  },
  {
    name: 'Tabs',
    id: 'navigation-tabs',
    storyId: 'navigation-tabs--default',
    category: 'Navigation',
    description: 'A set of panels, one visible at a time, switched by a row of tab buttons.',
  },

  // Layout & structure
  {
    name: 'Accordion',
    id: 'layout-structure-accordion',
    storyId: 'layout-structure-accordion--default',
    category: 'Layout & structure',
    description:
      'A stack of collapsible sections, each labelled by a header — an FAQ list, grouped filters.',
  },
  {
    name: 'Container',
    id: 'layout-structure-container',
    storyId: 'layout-structure-container--default',
    category: 'Layout & structure',
    description:
      'A max-width page wrapper with responsive padding, keeping content off wide screens.',
  },
  {
    name: 'PageSection',
    id: 'layout-structure-pagesection',
    storyId: 'layout-structure-pagesection--default',
    category: 'Layout & structure',
    description:
      'A titled content section — a heading with an optional "view all" action above the content.',
  },
  {
    name: 'PageTemplate',
    id: 'layout-structure-pagetemplate',
    storyId: 'layout-structure-pagetemplate--default',
    category: 'Layout & structure',
    description:
      'The page shell — header, main content area, and footer — every routed page sits inside it.',
  },
  {
    name: 'ScrollArea',
    id: 'layout-structure-scrollarea',
    storyId: 'layout-structure-scrollarea--default',
    category: 'Layout & structure',
    description: "A scrollable panel with a themed scrollbar in place of the platform's own.",
  },
  {
    name: 'Separator',
    id: 'layout-structure-separator',
    storyId: 'layout-structure-separator--horizontal',
    category: 'Layout & structure',
    description: 'A visual and semantic divider between two blocks of content.',
  },

  // Feedback & status
  {
    name: 'Badge',
    id: 'feedback-status-badge',
    storyId: 'feedback-status-badge--default',
    category: 'Feedback & status',
    description:
      'A small pill for a short, static label — a dietary tag, a category, a "new" flag.',
  },
  {
    name: 'ErrorBlock',
    id: 'feedback-status-errorblock',
    storyId: 'feedback-status-errorblock--default',
    category: 'Feedback & status',
    description:
      'A titled message with an illustration slot and a recovery action — an empty state, a 404.',
  },
  {
    name: 'Progress',
    id: 'feedback-status-progress',
    storyId: 'feedback-status-progress--default',
    category: 'Feedback & status',
    description: 'A track-and-fill indicator for progress through a known- or unknown-length task.',
  },
  {
    name: 'ProgressBar',
    id: 'feedback-status-progressbar',
    storyId: 'feedback-status-progressbar--empty',
    category: 'Feedback & status',
    description: 'A track-and-fill indicator for progress through a known number of steps.',
  },
  {
    name: 'Review',
    id: 'feedback-status-review',
    storyId: 'feedback-status-review--default',
    category: 'Feedback & status',
    description:
      'A star rating and text line, for a restaurant tile, an item card, or an order summary.',
  },
  {
    name: 'Skeleton',
    id: 'feedback-status-skeleton',
    storyId: 'feedback-status-skeleton--default',
    category: 'Feedback & status',
    description:
      'A loading placeholder that stands in for content before it arrives, shaped to match it.',
  },
  {
    name: 'Spinner',
    id: 'feedback-status-spinner',
    storyId: 'feedback-status-spinner--default',
    category: 'Feedback & status',
    description:
      "An indeterminate loading indicator — three dots crossing an arc in the brand's colors.",
  },
  {
    name: 'Toast',
    id: 'feedback-status-toast',
    storyId: 'feedback-status-toast--default',
    category: 'Feedback & status',
    description:
      "A stack of transient, self-dismissing notifications for things that don't need acting on.",
  },

  // Overlays
  {
    name: 'Modal',
    id: 'overlays-modal',
    storyId: 'overlays-modal--closed',
    category: 'Overlays',
    description: 'A centered overlay that asks for one decision before the page continues.',
  },
  {
    name: 'Sidebar',
    id: 'overlays-sidebar',
    storyId: 'overlays-sidebar--closed',
    category: 'Overlays',
    description:
      'A panel that slides in from the trailing edge, for content reviewed alongside the page.',
  },
  {
    name: 'Tooltip',
    id: 'overlays-tooltip',
    storyId: 'overlays-tooltip--default',
    category: 'Overlays',
    description: "A hover and focus hint for a control whose purpose isn't obvious from its face.",
  },

  // Typography
  {
    name: 'Body',
    id: 'typography-body',
    storyId: 'typography-body--default',
    category: 'Typography',
    description:
      'Plain-text typography for paragraph copy, captions, and labels, pairing with Heading.',
  },
  {
    name: 'Heading',
    id: 'typography-heading',
    storyId: 'typography-heading--default',
    category: 'Typography',
    description: 'Display type for page and section titles, rendered as a real semantic heading.',
  },

  // Media & content
  {
    name: 'Card',
    id: 'media-content-card',
    storyId: 'media-content-card--default',
    category: 'Media & content',
    description:
      'A rounded, clipped surface for grouping content — a restaurant tile, a food item, an order summary.',
  },
  {
    name: 'Carousel',
    id: 'media-content-carousel',
    storyId: 'media-content-carousel--default',
    category: 'Media & content',
    description:
      'A horizontally scrolling row of restaurant cards or category tiles, with drag and arrows.',
  },
  {
    name: 'Icon',
    id: 'media-content-icon',
    storyId: 'media-content-icon--default',
    category: 'Media & content',
    description:
      'The icon set, inlined as SVG so it renders anywhere, with no static asset to serve.',
  },
  {
    name: 'TopBanner',
    id: 'media-content-topbanner',
    storyId: 'media-content-topbanner--default',
    category: 'Media & content',
    description:
      'A full-width band at the top of a page, with a centered title over a color or photo.',
  },
]

/** Manager-rooted path so `_top` navigation lands on the Storybook manager, not the iframe. */
function managerBase(): string {
  try {
    return (window.top ?? window).location.pathname || '/'
  } catch {
    return '/'
  }
}

// Rules that need a real pseudo-class or pseudo-element — not expressible as inline styles.
const cardInteractionStyle = `
  .ds-component-browser-search::placeholder {
    color: var(--ds-color-text-hint);
  }
  .ds-component-browser-search:focus-visible {
    outline: none;
    box-shadow: var(--ds-shadow-focus);
  }
  .ds-component-browser-card:hover {
    border-color: var(--ds-color-text-primary);
    box-shadow: var(--ds-shadow-lift);
    transform: translateY(-2px);
  }
  .ds-component-browser-card:focus-visible {
    outline: none;
    box-shadow: var(--ds-shadow-focus);
  }
  .ds-component-browser-card:hover .ds-component-browser-card-arrow,
  .ds-component-browser-card:focus-visible .ds-component-browser-card-arrow {
    opacity: 1;
    transform: translateX(0);
  }
`

const rootStyle: CSSProperties = {
  margin: '1.5rem 0',
}

const searchRowStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 0',
}

const searchInputStyle: CSSProperties = {
  flex: '1 1 240px',
  minWidth: 0,
  padding: '0.5rem 0.75rem',
  border: '1px solid var(--ds-color-border-subtle, #e9e9e9)',
  borderRadius: 'var(--ds-radius-control)',
  backgroundColor: 'var(--ds-color-surface-sunken)',
  color: 'var(--ds-color-text-primary)',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  lineHeight: 1.4,
}

const countStyle: CSSProperties = {
  flex: 'none',
  fontSize: '0.8125rem',
  color: 'var(--ds-palette-neutral-800)',
  whiteSpace: 'nowrap',
}

const sectionStyle: CSSProperties = {
  marginTop: '1.75rem',
}

const categoryHeadingStyle: CSSProperties = {
  margin: '0 0 0.875rem',
  fontFamily: 'var(--ds-type-family-heading)',
  fontSize: 'var(--ds-type-size-2xs)',
  fontWeight: 'var(--ds-type-weight-bold)',
  color: 'var(--ds-color-text-primary)',
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(230px, 100%), 1fr))',
  gap: '1rem',
}

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
  padding: '0.875rem',
  border: '1px solid var(--ds-color-border-subtle, #e9e9e9)',
  borderRadius: 'var(--ds-radius-card)',
  backgroundColor: 'var(--ds-color-surface-card)',
  color: 'inherit',
  textDecoration: 'none',
  transition: 'all var(--ds-motion-fast) var(--ds-motion-ease)',
}

const cardStageStyle: CSSProperties = {
  // Live previews render in inert story iframes: the card's link stays the
  // only interactive surface. Top-aligned so a story taller than the stage
  // crops at the bottom, keeping labels and headers visible.
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  height: '7rem',
  overflow: 'hidden',
  backgroundColor: 'var(--ds-color-surface-sunken)',
  borderRadius: 'var(--ds-radius-control)',
  pointerEvents: 'none',
}

const cardHeadStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
}

const cardNameStyle: CSSProperties = {
  fontFamily: 'var(--ds-type-family-heading)',
  fontSize: 'var(--ds-type-size-xs)',
  fontWeight: 'var(--ds-type-weight-bold)',
  color: 'var(--ds-color-text-primary)',
}

const cardArrowStyle: CSSProperties = {
  flex: 'none',
  color: 'var(--ds-color-text-hint)',
  fontSize: '0.875rem',
  opacity: 0,
  transform: 'translateX(-3px)',
  transition: 'all var(--ds-motion-fast) var(--ds-motion-ease)',
}

const cardDescStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.8125rem',
  lineHeight: 1.4,
  color: 'var(--ds-color-text-secondary)',
}

const emptyStyle: CSSProperties = {
  margin: '2rem 0',
  fontSize: '0.875rem',
  color: 'var(--ds-color-text-secondary)',
}

/** postMessage contract shared with the preview's embed mode. */
const IFRAME_RESIZE_CONTEXT = 'iframe.resize'
const IFRAME_RESIZE_REQUEST_CONTEXT = 'iframe.resize.request'

type FrameDimensions = { width: number; height: number }

const parseResizeMessage = (data: unknown): FrameDimensions | null => {
  let payload: unknown = data
  if (typeof data === 'string') {
    try {
      payload = JSON.parse(data)
    } catch {
      return null
    }
  }
  if (!payload || typeof payload !== 'object') {
    return null
  }
  const { context, width, height } = payload as Record<string, unknown>
  if (context !== IFRAME_RESIZE_CONTEXT) {
    return null
  }
  if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) {
    return null
  }
  return { width, height }
}

const postRemeasureRequest = (iframe: HTMLIFrameElement | null) => {
  try {
    iframe?.contentWindow?.postMessage(
      JSON.stringify({ context: IFRAME_RESIZE_REQUEST_CONTEXT }),
      '*'
    )
  } catch {
    // Detached frame; the load listener retries.
  }
}

/**
 * Snapshot cache for frozen stories. A frozen story is static by construction:
 * before broadcasting its size, the preview strips every `<script>` tag and
 * pins animations to their final frame with injected CSS. Serializing the
 * frozen document therefore captures exactly what the card shows, and playing
 * it back through `srcdoc` skips the entire preview boot on the next visit.
 *
 * Dev-only (`import.meta.hot`): Vite's HMR events are the invalidation
 * signal, and a static build has no equivalent way to learn that its stories
 * changed, so it always renders live frames.
 */
const SNAPSHOT_CACHE_NAME = 'droppy-frozen-story-snapshots'

type StorySnapshot = { html: string; height: number }

const snapshotCacheEnabled = typeof caches !== 'undefined' && Boolean(import.meta.hot)

const snapshotKey = (storyId: string) => `/__droppy-frozen-story__/${encodeURIComponent(storyId)}`

async function readSnapshot(storyId: string): Promise<StorySnapshot | null> {
  if (!snapshotCacheEnabled) {
    return null
  }
  try {
    const cache = await caches.open(SNAPSHOT_CACHE_NAME)
    const response = await cache.match(snapshotKey(storyId))
    if (!response) {
      return null
    }
    const { html, height } = (await response.json()) as Record<string, unknown>
    return typeof html === 'string' && typeof height === 'number' ? { html, height } : null
  } catch {
    return null
  }
}

async function writeSnapshot(storyId: string, snapshot: StorySnapshot): Promise<void> {
  if (!snapshotCacheEnabled) {
    return
  }
  try {
    const cache = await caches.open(SNAPSHOT_CACHE_NAME)
    await cache.put(
      snapshotKey(storyId),
      new Response(JSON.stringify(snapshot), { headers: { 'Content-Type': 'application/json' } })
    )
  } catch {
    // Quota or availability trouble — the card still has its live frame.
  }
}

/** Serialize a frozen story document (script tags re-stripped as insurance). */
function serializeFrozenStory(iframe: HTMLIFrameElement): string | null {
  try {
    const root = iframe.contentDocument?.documentElement
    if (!root) {
      return null
    }
    const clone = root.cloneNode(true) as HTMLElement
    for (const script of Array.from(clone.querySelectorAll('script'))) {
      script.remove()
    }
    return `<!DOCTYPE html>${clone.outerHTML}`
  } catch {
    return null
  }
}

/**
 * Any HMR update can restyle or re-render any story, so every update drops the
 * whole snapshot cache. Mounted frames subscribe here too: a frame showing a
 * cached snapshot re-mounts its live iframe (a snapshot carries no HMR client
 * of its own), and a live frame re-serializes so the cache warms back up.
 */
const snapshotInvalidationListeners = new Set<() => void>()

if (import.meta.hot) {
  const invalidateSnapshots = () => {
    if (snapshotCacheEnabled) {
      void caches.delete(SNAPSHOT_CACHE_NAME).catch(() => {})
    }
    snapshotInvalidationListeners.forEach((listener) => listener())
  }
  import.meta.hot.on('vite:beforeUpdate', invalidateSnapshots)
  import.meta.hot.on('vite:beforeFullReload', invalidateSnapshots)
  import.meta.hot.dispose(() => {
    import.meta.hot?.off('vite:beforeUpdate', invalidateSnapshots)
    import.meta.hot?.off('vite:beforeFullReload', invalidateSnapshots)
  })
}

/**
 * Uncached frames each boot a full Storybook preview, so an
 * IntersectionObserver splits them: frames in or near the viewport start
 * loading immediately, and the rest wait in a queue that only drains — a few
 * at a time — once the visible frames have settled. A queued frame that
 * scrolls into view jumps straight to the front.
 */
const BACKGROUND_LOAD_CONCURRENCY = 3
const LOAD_SETTLE_TIMEOUT_MS = 15_000
const VIEWPORT_LOOKAHEAD = '100px'

type FrameLoadHandle = { done: () => void; dispose: () => void }

const frameLoadScheduler = (() => {
  type Entry = {
    element: Element
    start: () => void
    state: 'waiting' | 'queued' | 'loading' | 'done'
    priority: boolean
    timer: number | null
  }

  const entries = new Map<Element, Entry>()
  const queue: Entry[] = []
  let priorityLoads = 0
  let backgroundLoads = 0
  let observer: IntersectionObserver | null = null

  const settle = (entry: Entry) => {
    if (entry.state !== 'loading') {
      return
    }
    entry.state = 'done'
    if (entry.timer !== null) {
      window.clearTimeout(entry.timer)
      entry.timer = null
    }
    if (entry.priority) {
      priorityLoads -= 1
    } else {
      backgroundLoads -= 1
    }
    pump()
  }

  const begin = (entry: Entry, priority: boolean) => {
    observer?.unobserve(entry.element)
    entry.state = 'loading'
    entry.priority = priority
    if (priority) {
      priorityLoads += 1
    } else {
      backgroundLoads += 1
    }
    // A frame that never settles (broken story) must not stall the queue.
    entry.timer = window.setTimeout(() => settle(entry), LOAD_SETTLE_TIMEOUT_MS)
    entry.start()
  }

  const pump = () => {
    if (priorityLoads > 0) {
      return
    }
    while (backgroundLoads < BACKGROUND_LOAD_CONCURRENCY) {
      const entry = queue.shift()
      if (!entry) {
        return
      }
      if (entry.state === 'queued') {
        begin(entry, false)
      }
    }
  }

  const onIntersect: IntersectionObserverCallback = (records) => {
    // Visible frames first, so they claim priority before the queue pumps.
    for (const record of records.filter((r) => r.isIntersecting)) {
      const entry = entries.get(record.target)
      if (entry && (entry.state === 'waiting' || entry.state === 'queued')) {
        begin(entry, true)
      }
    }
    for (const record of records.filter((r) => !r.isIntersecting)) {
      const entry = entries.get(record.target)
      if (entry && entry.state === 'waiting') {
        entry.state = 'queued'
        queue.push(entry)
      }
    }
    pump()
  }

  const register = (element: Element, start: () => void): FrameLoadHandle => {
    const entry: Entry = { element, start, state: 'waiting', priority: false, timer: null }
    entries.set(element, entry)
    if (typeof IntersectionObserver === 'undefined') {
      begin(entry, true)
    } else {
      observer ??= new IntersectionObserver(onIntersect, { rootMargin: VIEWPORT_LOOKAHEAD })
      observer.observe(element)
    }
    return {
      done: () => settle(entry),
      dispose: () => {
        observer?.unobserve(element)
        entries.delete(element)
        if (entry.state === 'loading') {
          settle(entry) // frees the concurrency slot
        } else {
          entry.state = 'done'
        }
      },
    }
  }

  return { register }
})()

/**
 * A story rendered in its own preview iframe, the way review thumbnails embed
 * stories: `embed=true` skips manager chrome and interaction autoplay,
 * `freeze=finished` locks animations to their final frame, and the preview
 * broadcasts its content size so the frame can size to its story. With a
 * cached snapshot the same frozen document renders straight from `srcdoc`.
 */
function StoryFrame({ storyId }: { storyId: string }) {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const loadHandleRef = React.useRef<FrameLoadHandle | null>(null)
  const remeasureTimerRef = React.useRef<number | null>(null)
  const [snapshot, setSnapshot] = React.useState<StorySnapshot | null>(null)
  const [live, setLive] = React.useState(false)
  const [dims, setDims] = React.useState<FrameDimensions | null>(null)
  // Bumped when an HMR update obsoletes this frame's snapshot, to re-decide the source.
  const [generation, setGeneration] = React.useState(0)

  const liveRef = React.useRef(live)
  liveRef.current = live

  // Pick the frame's source: a cached snapshot renders instantly; otherwise
  // the load scheduler decides when the live iframe mounts.
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) {
      return undefined
    }
    let disposed = false
    void readSnapshot(storyId).then((cached) => {
      if (disposed) {
        return
      }
      if (cached) {
        setSnapshot(cached)
      } else {
        loadHandleRef.current = frameLoadScheduler.register(stage, () => setLive(true))
      }
    })
    return () => {
      disposed = true
      loadHandleRef.current?.dispose()
      loadHandleRef.current = null
    }
  }, [storyId, generation])

  React.useEffect(() => {
    const onInvalidate = () => {
      if (liveRef.current) {
        // The nested preview applies its own HMR update; once it has settled,
        // ask for a fresh measurement so the new markup is re-cached.
        if (remeasureTimerRef.current !== null) {
          window.clearTimeout(remeasureTimerRef.current)
        }
        remeasureTimerRef.current = window.setTimeout(() => {
          remeasureTimerRef.current = null
          postRemeasureRequest(iframeRef.current)
        }, 600)
      } else {
        setSnapshot(null)
        setDims(null)
        setGeneration((current) => current + 1)
      }
    }
    snapshotInvalidationListeners.add(onInvalidate)
    return () => {
      snapshotInvalidationListeners.delete(onInvalidate)
      if (remeasureTimerRef.current !== null) {
        window.clearTimeout(remeasureTimerRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!live || !iframe) {
      return undefined
    }
    const onMessage = (event: MessageEvent) => {
      if (event.source === null || event.source !== iframe.contentWindow) {
        return
      }
      const parsed = parseResizeMessage(event.data)
      if (!parsed) {
        return
      }
      setDims(parsed)
      loadHandleRef.current?.done()
      // The size broadcast happens only after the freezer has stripped and
      // pinned the document, so this is the moment a snapshot is faithful.
      const html = serializeFrozenStory(iframe)
      if (html) {
        void writeSnapshot(storyId, { html, height: parsed.height })
      }
    }
    window.addEventListener('message', onMessage)
    const requestRemeasure = () => postRemeasureRequest(iframe)
    requestRemeasure()
    iframe.addEventListener('load', requestRemeasure)
    return () => {
      window.removeEventListener('message', onMessage)
      iframe.removeEventListener('load', requestRemeasure)
    }
  }, [live, storyId])

  return (
    <div ref={stageRef} style={cardStageStyle} aria-hidden>
      {snapshot || live ? (
        <iframe
          // Snapshot and live frames must not share an element: clearing
          // `srcdoc` on a reused iframe would keep showing the old document.
          key={snapshot ? 'snapshot' : 'live'}
          ref={iframeRef}
          {...(snapshot
            ? { srcDoc: snapshot.html }
            : {
                src: `iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story&embed=true&freeze=finished`,
              })}
          title={storyId}
          tabIndex={-1}
          // Frozen frames are never scrolled; this also keeps stories wider
          // than the card from growing a horizontal scrollbar inside it.
          scrolling="no"
          style={{
            border: 0,
            pointerEvents: 'none',
            backgroundColor: 'transparent',
            // Full stage width so the story lays out at the card's real size;
            // height follows the preview's own measurement, so the aspect is the
            // story's natural one and anything taller than the stage crops.
            width: '100%',
            height: snapshot ? snapshot.height : dims ? dims.height : '100%',
            flex: 'none',
          }}
        />
      ) : null}
    </div>
  )
}

export function ComponentBrowser() {
  const [query, setQuery] = React.useState('')
  const base = managerBase()
  const q = query.trim().toLowerCase()

  const filtered = COMPONENTS.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  )

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: filtered
      .filter((c) => c.category === category)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length > 0)

  return (
    <div style={rootStyle}>
      <style>{cardInteractionStyle}</style>
      <div style={searchRowStyle}>
        <input
          className="ds-component-browser-search"
          type="search"
          placeholder="Search components…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search components"
          style={searchInputStyle}
        />
        <span style={countStyle}>
          {filtered.length} of {COMPONENTS.length}
        </span>
      </div>

      {groups.length === 0 ? <p style={emptyStyle}>No components match “{query}”.</p> : null}

      {groups.map((group) => (
        <section key={group.category} style={sectionStyle}>
          <h2 style={categoryHeadingStyle}>{group.category}</h2>
          <div style={gridStyle}>
            {group.items.map((component) => (
              <a
                key={component.id}
                className="ds-component-browser-card"
                href={`${base}?path=/docs/${component.id}--docs`}
                target="_top"
                style={cardStyle}
              >
                <StoryFrame storyId={component.storyId} />
                <div style={cardHeadStyle}>
                  <span style={cardNameStyle}>{component.name}</span>
                  <span
                    className="ds-component-browser-card-arrow"
                    aria-hidden
                    style={cardArrowStyle}
                  >
                    →
                  </span>
                </div>
                <p style={cardDescStyle}>{component.description}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

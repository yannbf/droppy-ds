import type { ReactNode } from 'react'

export type IconName =
  'arrow-right' | 'arrow-left' | 'cross' | 'cart' | 'minus' | 'plus' | 'moon' | 'sun' | 'star'

type IconDefinition = {
  viewBox: string
  content: ReactNode
}

const strokeDefaults = {
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const icons: Record<IconName, IconDefinition> = {
  'arrow-right': {
    viewBox: '0 0 24 24',
    content: (
      <g {...strokeDefaults}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </g>
    ),
  },
  'arrow-left': {
    viewBox: '0 0 24 24',
    content: (
      <g {...strokeDefaults}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </g>
    ),
  },
  cross: {
    viewBox: '0 0 24 24',
    content: (
      <g {...strokeDefaults}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </g>
    ),
  },
  cart: {
    viewBox: '0 0 24 24',
    content: (
      <g {...strokeDefaults}>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </g>
    ),
  },
  minus: {
    viewBox: '0 0 24 24',
    content: (
      <g {...strokeDefaults}>
        <line x1="5" y1="12" x2="19" y2="12" />
      </g>
    ),
  },
  plus: {
    viewBox: '0 0 24 24',
    content: (
      <g {...strokeDefaults}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </g>
    ),
  },
  moon: {
    viewBox: '0 0 24 24',
    content: (
      <g {...strokeDefaults}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </g>
    ),
  },
  sun: {
    viewBox: '0 0 24 24',
    content: (
      <g {...strokeDefaults}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    ),
  },
  star: {
    viewBox: '0 0 20 20',
    content: (
      <path d="M19.947 7.179C19.818 6.801 19.477 6.534 19.079 6.503L13.378 6.05L10.911 0.589C10.75 0.23 10.393 0 9.99998 0C9.60698 0 9.24998 0.23 9.08898 0.588L6.62198 6.05L0.920979 6.503C0.529979 6.534 0.192979 6.791 0.0599788 7.16C-0.0730212 7.529 0.0209789 7.942 0.301979 8.216L4.51498 12.323L3.02498 18.775C2.93298 19.174 3.09398 19.589 3.43098 19.822C3.60298 19.94 3.80098 20 3.99998 20C4.19298 20 4.38698 19.944 4.55498 19.832L9.99998 16.202L15.445 19.832C15.793 20.064 16.25 20.055 16.59 19.808C16.928 19.561 17.077 19.128 16.962 18.726L15.133 12.326L19.669 8.244C19.966 7.976 20.075 7.558 19.947 7.179Z" />
    ),
  },
}

export const iconNames = Object.keys(icons) as IconName[]

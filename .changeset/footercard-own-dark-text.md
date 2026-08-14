---
'@droppy/design-system': patch
---

FooterCard's on-dark text color is now documented as an intentional design decision, not an implementation detail consumers had to rediscover and restate. The component already set `--ds-color-text-on-inverse` on its root; the docs now state the dark-footer assumption directly, and the stories decorator renders against the canonical `--ds-color-surface-inverse` token instead of a hardcoded color, so the contrast claim is demonstrable.

# Badge

Passive label — status, count, classification. Not interactive. For interactive labels use `Tag`.

## Variants × Tones × Sizes

- Variants: `solid`, `soft`, `outline`, `dot` (just a coloured circle).
- Tones: `neutral`, `brand`, `info`, `success`, `warning`, `danger`.
- Sizes: `xs`, `sm` (default), `md`. The `dot` variant has no size — it's always 8px.

## API

| Prop | Type | Default |
|---|---|---|
| `variant` | `BadgeVariant` | `"soft"` |
| `tone` | `BadgeTone` | `"neutral"` |
| `size` | `BadgeSize` | `"sm"` |
| `leadingIcon` | `ReactNode` | — |
| `count` | `number` | — (renders as integer; `>99` shows `99+`) |
| `withDot` | `boolean` | `false` (small leading status dot) |

## Accessibility

- Default Badge is purely visual. If the badge carries unique meaning ("3 unread"), pass an `aria-label` describing it.
- `dot` variant is `aria-hidden` unless you supply your own `aria-label`.

## Do

- Use `soft` for inline status (default).
- Use `solid` for high-emphasis system states.
- Use `dot` when the label is unnecessary (sidebar avatars, tab indicators).

## Don't

- Don't make Badges clickable — switch to `Tag` (which has hover + focus styling).
- Don't use Badges to convey error severity that needs to be announced — pair with text.

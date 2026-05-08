# Tag

Interactive sibling of Badge — selectable, removable, or linkable.

## API

| Prop | Type | Default |
|---|---|---|
| `variant` / `tone` / `size` | same as Badge | `soft` / `neutral` / `sm` |
| `leadingIcon` | `ReactNode` | — |
| `removable` | `boolean` | `false` |
| `onRemove` | `() => void` | — |
| `href` | `string` | — (renders `<a>`) |
| `selected` | `boolean` | `false` |
| `onSelect` | `() => void` | — (renders `<button aria-pressed>`) |
| `children` | `ReactNode` | required |

## Behaviour

- With `onSelect`: renders a `<button>` toggle (`aria-pressed`).
- With `href`: renders `<a>`.
- Otherwise: renders `<span>` (acts as static label).
- `removable` shows an `×` whose click stops propagation so it doesn't also fire `onSelect`.

## Accessibility

- Remove button has `aria-label="Remove"`. If multiple tags exist, the parent should provide additional context (label the list).
- Selected toggle uses `aria-pressed`, not `aria-checked`, because it isn't a form control.

## Do

- Use Tags for filter chips (`onSelect`).
- Use `removable` for free-form keyword fields (think email recipients).

## Don't

- Don't use Tag for read-only counts — use Badge.
- Don't put both `onSelect` and `removable` interactions on a tiny `xs` tag; the targets become too small for touch.

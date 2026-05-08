# Textarea

Multi-line text input. Auto-resize or fixed-rows variants. Optional character counter.

## Anatomy

```
[ <textarea> ]
[ count? ]
```

## API

| Prop | Type | Default |
|---|---|---|
| `rows` | `number \| "auto"` | `3` |
| `showCount` | `boolean` | `false` (forced on if `maxLength`) |
| `resize` | `"vertical" \| "horizontal" \| "both" \| "none"` | `"vertical"` |
| `maxLength` | `number` | — |
| ...native `<textarea>` props | | |

## Accessibility

- Counter has `aria-live="polite"` so screen readers announce updates without interrupting.
- `aria-required` / `aria-invalid` flow from `<Field>`.

## Do

- Use `rows="auto"` for chat/comment inputs where length is unknown.
- Use `maxLength` for hard limits — pairing it with `showCount` makes the limit visible.

## Don't

- Don't auto-resize inside fixed-height containers — it'll overflow without a max-height.
- Don't disable the resize handle on the only direction the user might need.

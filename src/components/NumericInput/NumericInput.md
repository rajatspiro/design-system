# NumericInput

Text-based number input with stepper buttons, min/max/step, optional unit suffix, and locale-formatted display.

## Anatomy

```
[ <input> ] [ unit? ] [ ▴ ]
                     [ ▾ ]
```

## API

| Prop | Type | Default |
|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `value` / `defaultValue` | `number \| null` | — |
| `min` / `max` / `step` | `number` | step `1` |
| `unit` | `string` | — |
| `format` | `(n: number) => string` | `n.toLocaleString()` |
| `onChange` | `(n: number \| null) => void` | — |

## Behaviour

- Display is formatted (`12,345.67`) when blurred, raw when focused.
- ArrowUp / ArrowDown step by `step`. Steppers are not in tab order (`tabIndex={-1}`); they're a mouse affordance.
- Values are clamped to `[min, max]` on change.

## Accessibility

- Renders `role="spinbutton"` with `aria-valuenow/min/max`.
- The input itself remains the focus target. Steppers have `aria-label`.
- `inputMode="decimal"` triggers a numeric keyboard on mobile.

## Do

- Pass `min`/`max` whenever a range applies — it powers ARIA and clamping.
- Use `unit` for display suffixes; don't bake units into the value.

## Don't

- Don't use this for currency without overriding `format` to handle locale + symbol correctly.
- Don't allow `step` smaller than the `format` precision (you'll see jitter).

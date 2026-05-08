# TextInput

Single-line text input. Wired to `<Field>` via context for label / help / error.

## Anatomy

```
[ leadingIcon? ] [ prefix? ] [ <input> ] [ suffix? ] [ clear? ] [ trailingIcon? ]
```

## API

| Prop | Type | Default |
|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `leadingIcon` / `trailingIcon` | `ReactNode` | — |
| `prefix` / `suffix` | `ReactNode` | — |
| `clearable` | `boolean` | `false` |
| `invalid` | `boolean` | inherited from Field |
| `disabled` / `readOnly` | `boolean` | inherited / native |
| ...all native `<input>` props | | |

## States

`default · hover · focus-visible · disabled · read-only · error · success` (success styling lives on the Field).

## Tokens

`--input-bg`, `--input-border`, `--input-border-hover`, `--input-border-focus`, `--input-border-error`, `--input-radius`, `--input-height-{sm|md|lg}`, `--input-padding-inline-{sm|md|lg}`, `--input-focus-ring`, `--input-icon-color`.

## Accessibility

- The wrapper is purely presentational. The actual focus target is the `<input>`.
- Focus ring is on `:focus-within` of the wrapper so icons appear inside the ring.
- Clear button has `aria-label="Clear input"` and is keyboard-focusable.

## Do

- Always pair with `<Field label="...">`.
- Use `prefix`/`suffix` for static units; use icons for affordances.

## Don't

- Don't put interactive icons in `leadingIcon` / `trailingIcon` — those slots are decorative (`aria-hidden`). Use `clearable` or render a separate Button.
- Don't disable `clearable` while keeping a native browser clear; pick one source of truth.

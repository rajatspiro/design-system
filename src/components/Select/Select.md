# Select

Single-value form control replacing the native `<select>`. Searchable variant supported.

## Anatomy

```
[ trigger:  value | placeholder    ▾ ]
  └── popover ──────────────────────
      [ search? ]
      [ option ]  ← active
      [ option selected ✓ ]
      [ option disabled ]
```

## API

| Prop | Type | Default |
|---|---|---|
| `options` | `SelectOption[]` | required |
| `value` / `defaultValue` | `string \| null` | — |
| `onChange` | `(v: string \| null) => void` | — |
| `placeholder` | `string` | `"Select…"` |
| `searchable` | `boolean` | `false` |
| `matchWidth` | `boolean` | `true` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `disabled` / `invalid` | `boolean` | inherited from Field |

## Behaviour

- Trigger states: `default · hover · focus-visible · open · disabled · error`.
- Popover anchors to the trigger, flips to "above" when there's no room below, shifts on horizontal collision.
- Closes on outside click, Escape, or selection. Returns focus to trigger on close.

## Keyboard

- `Down` / `Enter` / `Space` on the trigger: open + focus first option.
- `Down` / `Up`: move active option.
- `Enter`: select active.
- `Esc`: close + restore focus to trigger.
- When `searchable`: typing filters; arrow keys + Enter still apply.

## Accessibility

- Trigger: `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`.
- List: `role="listbox"`, options: `role="option"` with `aria-selected`.
- `aria-required` / `aria-invalid` / `aria-describedby` propagated from `<Field>`.

## Do

- Use Select when the value is part of a form submission.
- Use `searchable` when there are 8+ options.

## Don't

- Don't use Select for navigation — use a Menu.
- Don't make it searchable for tiny lists; the search input adds clutter.

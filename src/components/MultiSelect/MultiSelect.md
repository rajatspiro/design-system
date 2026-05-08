# MultiSelect

Multi-value form control. Selected values render as chips inside the trigger.

## API

| Prop | Type | Default |
|---|---|---|
| `options` | `SelectOption[]` | required |
| `value` / `defaultValue` | `string[]` | `[]` |
| `onChange` | `(values: string[]) => void` | — |
| `searchable` | `boolean` | `true` |
| `selectAll` | `boolean` | `false` |
| `placeholder` | `string` | `"Select…"` |
| `matchWidth` | `boolean` | `true` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |

## Behaviour

- Listbox renders with `aria-multiselectable="true"`. Options have `aria-selected`.
- Chips inside the trigger have a remove button labelled `Remove {label}` and stop propagation so they don't reopen the popover.
- `selectAll` toggles all enabled options in one click.

## Do

- Use `searchable: true` (default) — multi-selects with 5+ options need it.
- Use `selectAll` when "all" is a meaningful default.

## Don't

- Don't show MultiSelect when the user usually picks exactly one — switch to Select.
- Don't let chips wrap into 4+ rows; cap with a "+N more" affordance in your wrapper.

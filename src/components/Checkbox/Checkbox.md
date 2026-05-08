# Checkbox · CheckboxGroup

Multi-select boolean control. Supports `unchecked`, `checked`, and `indeterminate` (mixed) states.

## API — Checkbox

| Prop | Type | Default |
|---|---|---|
| `label` | `ReactNode` | required |
| `description` | `ReactNode` | — |
| `indeterminate` | `boolean` | `false` |
| ...native `<input type="checkbox">` props | | |

## API — CheckboxGroup

| Prop | Type | Default |
|---|---|---|
| `value` / `defaultValue` | `string[]` | `[]` |
| `onChange` | `(values: string[]) => void` | — |
| `options` | `CheckboxOption[]` | required |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` |

## Accessibility

- Indeterminate is communicated as `aria-checked="mixed"` and via the native `indeterminate` DOM property.
- Tab order is by source order; arrow keys do NOT move focus inside a checkbox group (unlike radios) — that's correct, each checkbox is independent.

## Do

- Use indeterminate for "select all" rows when only some children are checked.
- Disable individual options for finer-grained control rather than the whole group.

## Don't

- Don't use a single checkbox for "I agree to terms" without an associated label — `label` is required.
- Don't omit indeterminate handling on a "select all" — it's a known a11y trap.

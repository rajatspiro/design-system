# Radio · RadioGroup

Single-select group of mutually-exclusive options.

## Anatomy (single Radio)

```
[ ◉ ]  Label
       Description?
```

## API — Radio

| Prop | Type | Default |
|---|---|---|
| `label` | `ReactNode` | required |
| `description` | `ReactNode` | — |
| `disabled` | `boolean` | `false` |
| ...native `<input type="radio">` props | | |

## API — RadioGroup

| Prop | Type | Default |
|---|---|---|
| `name` | `string` | required |
| `value` / `defaultValue` | `string` | — |
| `onChange` | `(value: string) => void` | — |
| `options` | `RadioOption[]` | required |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` |
| `disabled` | `boolean` | `false` |

## Accessibility

- Group renders `role="radiogroup"`. Provide `aria-label` or use a `<Field>` whose label is associated.
- The visible "control" dot is `aria-hidden`; the underlying native radio carries semantics and focus.
- Native arrow-key navigation between radios in the same `name` group works automatically.

## Do

- Use vertical orientation by default — easier to scan.
- Always include a description when option labels are ambiguous.

## Don't

- Don't use radios for two options if the choice has a "default + opt-out" shape — use a Checkbox or Switch.
- Don't disable a single option without explaining why; consider hiding it instead.

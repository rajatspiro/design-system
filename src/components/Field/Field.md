# Field

Wrapper that gives a form control a label, optional description, helper / error / success text, and a required indicator. Provides an ARIA-wired context to its child control(s).

## Anatomy

```
[ Label ]  [ * required indicator ]
[ Description (optional) ]
[ Control(s) ]
[ Helper / Error / Success text ]
```

## API

| Prop | Type | Default |
|---|---|---|
| `label` | `ReactNode` | required |
| `description` | `ReactNode` | — |
| `helperText` | `ReactNode` | — |
| `errorText` | `ReactNode` | — (mutually exclusive with `successText`) |
| `successText` | `ReactNode` | — |
| `required` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `htmlFor` | `string` | auto-generated |

## Behaviour

Children call `useField()` to read `controlId`, `describedById`, `errorId`, `disabled`, `invalid`. The control sets:

- `id={controlId}`
- `aria-describedby={describedById}`
- `aria-invalid={invalid || undefined}`
- `aria-required={required || undefined}`

## Accessibility

- One visible `<label>` linked to the control via `for`/`id`.
- Error message has `role="alert"` so it's announced when it appears.
- The required indicator is purely decorative — `aria-hidden` — because `aria-required` carries the semantics.

## Do

- Wrap every input with a Field, even single-control forms.
- Show only one of `errorText`, `successText`, `helperText` at a time.

## Don't

- Don't use placeholder text in place of a label.
- Don't put icons-only inside the label slot — the label must be readable.
- Don't render multiple controls in one Field unless they form a single group (e.g. RadioGroup).

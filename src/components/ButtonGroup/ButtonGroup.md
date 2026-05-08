# ButtonGroup

Connected horizontal group of Buttons sharing borders.

## Anatomy

```
[ Button ][ Button ][ Button ]
```

## API

| Prop | Type | Default |
|---|---|---|
| `variant` | `ButtonVariant` | inherits from each child |
| `size` | `ButtonSize` | inherits from each child |
| `aria-label` | `string` | required |

## Accessibility

- Renders `role="group"`; provide an `aria-label` so screen readers announce its purpose.
- Each child Button retains its own focus ring (z-index lifts it above neighbours).

## Do

- Use to express closely-related actions (e.g. text alignment).
- Set `aria-label` describing the group ("Text alignment").

## Don't

- Don't mix variants inside one group — pass `variant` on the parent instead.
- Don't combine more than 5 buttons; switch to a Menu.
- Don't include non-Button children.

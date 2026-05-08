# ProgressBar

Linear or circular progress indicator.

## Anatomy (linear)

```
[ label ]                    [ pct? ]
[───── track ───── ]
[ description? ]
```

## API

| Prop | Type | Default |
|---|---|---|
| `value` | `number` | omit for indeterminate |
| `max` | `number` | `100` |
| `shape` | `"linear" \| "circular"` | `"linear"` |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` |
| `tone` | `"brand" \| "success" \| "warning" \| "danger"` | `"brand"` |
| `segments` | `number` | — (linear only) |
| `label` | `ReactNode` | — |
| `showPercentage` | `boolean` | `false` |
| `description` | `ReactNode` | — |

## Variants

- **Linear**: determinate (value), indeterminate (no value), segmented (steps).
- **Circular**: determinate, indeterminate.

(Circular is included; it's the right primitive for inline tile loaders. Skip it if your team doesn't use it — it's small and doesn't bloat the bundle.)

## Accessibility

- Renders `role="progressbar"`.
- Determinate: `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100`.
- Indeterminate: omits `aria-valuenow`, sets `aria-busy="true"`, screen readers announce "busy".
- Pass `aria-label` if there's no visible `label`.

## Do

- Use indeterminate for unknown durations; flip to determinate as soon as you can.
- Use `segments` for step-based wizards or chunked uploads.

## Don't

- Don't animate determinate progress for trivial async (< 250ms) — it'll flash.
- Don't omit a label or `aria-label` — assistive tech needs to know what's progressing.

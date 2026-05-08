# Tabs

Switch between mutually-exclusive panels of related content.

## Anatomy

```
[ tablist ]
  [ trigger ] [ trigger ] [ trigger active ] ...
[ tabpanel ]
```

## API

| Prop | Type | Default |
|---|---|---|
| `items` | `TabItem[]` | required |
| `value` / `defaultValue` | `string` | first enabled |
| `onChange` | `(id: string) => void` | — |
| `variant` | `"underline" \| "pill" \| "segmented" \| "enclosed"` | `"underline"` |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `fullWidth` | `boolean` | `false` |
| `aria-label` | `string` | — required if no surrounding heading |

`TabItem` has `id`, `label`, `icon?`, `badge?`, `disabled?`, `content`.

## Trade-off

`segmented` + `vertical` is **automatically downgraded to `pill`**. Segmented variants assume a horizontal pill rail with a moving thumb; in vertical they read as a stack of buttons rather than a control. Pills give the same affordance vertically without the visual confusion.

## Keyboard

- `ArrowLeft` / `ArrowRight` (or `ArrowUp` / `ArrowDown` when vertical): move focus + select.
- `Home` / `End`: first / last enabled tab.
- `Enter` / `Space`: activate (native).
- Roving tabindex: only the active tab is in the tab order.

## Accessibility

- `role="tablist"`, `role="tab"` with `aria-selected`, `role="tabpanel"` with `aria-labelledby`.
- Disabled tabs render `disabled` (skipped by arrow keys).
- Each panel is focusable (`tabIndex={0}`) so screen readers can land on the content after activation.

## Do

- Use `underline` for primary in-page navigation.
- Use `segmented` for view toggles (e.g. day/week/month).
- Provide `aria-label` describing the tab group's purpose.

## Don't

- Don't put 8+ tabs — switch to a Menu or sidenav.
- Don't put long-running async content directly in `content`; prefetch or skeleton-render.
- Don't conflate Tabs with a wizard — wizards are sequential, tabs are non-sequential.

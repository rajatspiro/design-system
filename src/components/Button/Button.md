# Button

A pressable control that triggers an action.

## Anatomy

```
[ leadingIcon? ]  [ label ]  [ trailingIcon? ]
```

Parts: container (the `<button>`), label (`.ds-button__label`), icon (`.ds-button__icon`), spinner (`.ds-button__spinner`, replaces leading icon when `loading`).

## API

| Prop          | Type                                                                              | Default     | Notes |
|---------------|-----------------------------------------------------------------------------------|-------------|-------|
| `variant`     | `"primary" \| "secondary" \| "tertiary" \| "destructive" \| "destructive-secondary" \| "link"` | `"primary"` | |
| `size`        | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                                            | `"md"`      | `link` ignores size height. |
| `leadingIcon` | `ReactNode`                                                                       | —           | Replaced by spinner when `loading`. |
| `trailingIcon`| `ReactNode`                                                                       | —           | Hidden when `loading` or `iconOnly`. |
| `iconOnly`    | `boolean`                                                                         | `false`     | Requires `aria-label`. |
| `fullWidth`   | `boolean`                                                                         | `false`     | |
| `loading`     | `boolean`                                                                         | `false`     | Sets `aria-busy`, disables interaction. |
| `disabled`    | `boolean`                                                                         | `false`     | Native `disabled`. |
| `type`        | `"button" \| "submit" \| "reset"`                                                 | `"button"`  | |

All other native `<button>` attributes pass through. Refs forwarded to the underlying element.

## Variants × States

|                        | default | hover | active | focus-visible | disabled | loading |
|------------------------|:-:|:-:|:-:|:-:|:-:|:-:|
| primary                | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| secondary              | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| tertiary (ghost)       | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| destructive            | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| destructive-secondary  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| link                   | ✓ | ✓ | — | ✓ | ✓ | — |

## Component tokens

| Token | Maps to |
|---|---|
| `--button-radius` | `--radius-md` |
| `--button-font-weight` | `--text-label-m-weight` |
| `--button-primary-bg` | `--color-action-primary-bg` |
| `--button-primary-bg-hover` | `--color-action-primary-bg-hover` |
| `--button-primary-bg-active` | `--color-action-primary-bg-active` |
| `--button-primary-bg-disabled` | `--color-action-primary-bg-disabled` |
| `--button-primary-fg` | `--color-action-primary-fg` |
| `--button-secondary-*` | `--color-action-secondary-*` |
| `--button-tertiary-*` | `--color-action-tertiary-*` |
| `--button-destructive-*` | `--color-action-destructive-*` |
| `--button-link-fg` | `--color-text-link` |
| `--button-focus-ring` | (composite from `--color-border-focus`) |

(See `tokens/component-tokens.css` for the exhaustive list.)

## Accessibility

- Renders a native `<button>`. Implicit role `button`; no ARIA needed except `aria-label` for icon-only.
- `loading` sets `aria-busy="true"`; the visible label is preserved so screen readers still announce the action.
- Focus is visible via `box-shadow` ring (4px composite); never use `outline: none` without replacing the affordance.
- Disabled buttons are skipped by tab order; consider `aria-disabled` + a tooltip if you need them focusable for explanation.
- Keyboard: Enter and Space activate (native).

## Do

- Use one primary button per primary action surface (form, dialog, page).
- Use `destructive` for actions that delete or cannot be undone.
- Pair `loading` with optimistic UI in the parent so the spinner has a finite lifetime.

## Don't

- Don't use `link` variant for actual navigation — use an `<a>` styled as a link.
- Don't use icon-only buttons without `aria-label`; the build-time lint should catch this if you add a rule.
- Don't override colours inline — change the component token instead.

# Per-component Figma checklist

For each component, build the Figma Component with these variant properties and bind every visible value to a Variable from the `Design System` collection. **No raw hex.** If a tile shows a colour that isn't tied to a Variable, that's a bug — fix it before publishing.

The `Spec` column points at the markdown contract in code. The Figma component must satisfy everything listed there visually; behaviour (focus management, keyboard, ARIA) is code's job.

> Pattern that applies to every component:
>
> - Use **Figma Component Variants** for properties listed below.
> - Use **Boolean variant properties** for things that toggle (`disabled`, `loading`, `iconOnly`, `fullWidth`, `clearable`).
> - Use **Instance Swap** for slot content (icons, leading/trailing affixes).
> - Bind every fill, stroke, border-radius, padding (when supported), font, and effect to a Variable.
> - Show the component **at compact density** by default; the Density Mode flip will shift sizes automatically once Variables are bound to dimension tokens.

---

## 1. Button

- Variants: `primary`, `secondary`, `tertiary`, `destructive`, `destructive-secondary`, `link`
- Sizes: `xs`, `sm`, `md`, `lg`, `xl`
- States: `default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`
- Boolean: `iconOnly`, `fullWidth`
- Slots: leading icon, trailing icon, label

Bind: `--button-{variant}-{bg|fg|border}` per variant + state. Heights and paddings come from `--button-height-{size}` / `--button-padding-inline-{size}`.

Spec: [`../src/components/Button/Button.md`](../src/components/Button/Button.md)

## 2. ButtonGroup

- A frame containing 2-4 instances of Button with shared borders.
- No variant properties of its own — it's a layout pattern.
- Document the rule: child Buttons share variant + size; first/last get rounded outer corners.

Spec: [`../src/components/ButtonGroup/ButtonGroup.md`](../src/components/ButtonGroup/ButtonGroup.md)

## 3. Field

- A wrapper with: label, optional description, slot for control, helper / error / success text.
- Variants: `status` = `default | error | success`
- Boolean: `required`, `disabled`
- Slots: control (instance swap)

Bind: `--field-label-*`, `--field-helper-*`, `--field-error-*`, `--field-success-*`.

Spec: [`../src/components/Field/Field.md`](../src/components/Field/Field.md)

## 4. TextInput

- Sizes: `sm`, `md`, `lg`
- States: `default`, `hover`, `focus`, `error`, `success`, `disabled`, `read-only`, `with-value`
- Boolean: `clearable`, `hasLeadingIcon`, `hasTrailingIcon`, `hasPrefix`, `hasSuffix`

Bind: `--input-bg`, `--input-border`, `--input-border-{hover|focus|error|disabled}`, `--input-height-{size}`.

Spec: [`../src/components/TextInput/TextInput.md`](../src/components/TextInput/TextInput.md)

## 5. NumericInput

- Same as TextInput, plus stepper buttons and unit suffix slot.
- Variants: `state` = `default | focus | error | disabled`
- Boolean: `hasUnit`

Bind: input tokens + `--numeric-stepper-bg`, `--numeric-stepper-fg`.

Spec: [`../src/components/NumericInput/NumericInput.md`](../src/components/NumericInput/NumericInput.md)

## 6. Textarea

- Variants: `state` = `default | focus | error | disabled`
- Boolean: `showCount`
- Sizes via `rows`: 3 / 6 / auto-grow (visual only — auto-grow is a code-only behaviour, show as 3-row example)

Bind: input tokens + `--textarea-min-height`, `--textarea-padding-block`.

Spec: [`../src/components/Textarea/Textarea.md`](../src/components/Textarea/Textarea.md)

## 7. Radio

Two components on the page: a single Radio and a RadioGroup composition.

**Radio**
- Variants: `state` = `default | hover | checked | disabled | focus-visible`
- Boolean: `hasDescription`

**RadioGroup**
- Variants: `orientation` = `vertical | horizontal`
- Built from instances of Radio

Bind: `--radio-{bg|border|dot|focus-ring}` × states; `--radio-size`.

Spec: [`../src/components/Radio/Radio.md`](../src/components/Radio/Radio.md)

## 8. Checkbox

Three states matter: `unchecked`, `checked`, `indeterminate`. Plus disabled.

- Variants: `state` = `unchecked | checked | indeterminate | disabled`
- Boolean: `hasDescription`

Plus a CheckboxGroup composition (vertical and "select all" pattern).

Bind: `--checkbox-{bg|border|mark}` × states; `--checkbox-size`.

Spec: [`../src/components/Checkbox/Checkbox.md`](../src/components/Checkbox/Checkbox.md)

## 9. Toast

- Variants: `tone` = `info | success | warning | danger | neutral`
- Boolean: `hasDescription`, `hasAction`, `dismissible`
- Slots: title, description, action button

Bind: `--toast-bg`, `--toast-fg`, `--toast-border`, `--toast-{tone}-accent`, `--toast-{tone}-icon`, `--toast-shadow`.

Composition frames: stacked toasts in each of the four positions (top-right, top-center, bottom-right, bottom-center). Mark these as **Frames, not Components** — position is set by the Provider in code, not the Toast itself.

Spec: [`../src/components/Toast/Toast.md`](../src/components/Toast/Toast.md)

## 10. Badge

- Variants: `variant` = `solid | soft | outline | dot`
- Variants: `tone` = `neutral | brand | info | success | warning | danger`
- Variants: `size` = `xs | sm | md` (dot variant has no size — single 8px swatch)
- Boolean: `hasIcon`, `hasDot`

Bind: `--badge-radius`, `--badge-height-{size}`, plus computed bg/fg per variant×tone (these are *not* tokenised individually — they're combinations of primitives + semantics; use the `_solid` / `_soft` / `_outline` styling rules from `Badge.css` and bind to the same primitives the CSS uses).

Spec: [`../src/components/Badge/Badge.md`](../src/components/Badge/Badge.md)

## 11. Tag

Same matrix as Badge, plus interactive states.

- Variants: `variant`, `tone`, `size` (same as Badge)
- Variants: `state` = `default | hover | selected | focus-visible`
- Boolean: `removable`, `hasIcon`

Bind: same as Badge + `--tag-radius`, `--tag-bg-hover-tint`, `--tag-remove-hover-bg`.

Spec: [`../src/components/Tag/Tag.md`](../src/components/Tag/Tag.md)

## 12. Tabs

- Variants: `variant` = `underline | pill | segmented | enclosed`
- Variants: `orientation` = `horizontal | vertical`
- Variants: `size` = `sm | md | lg`
- Boolean: `fullWidth`

Plus separate frames showing each variant with 4 tabs, one selected.

Bind: `--tabs-list-bg-segmented`, `--tabs-trigger-fg{,-hover,-active,-disabled}`, `--tabs-underline-color`, `--tabs-pill-{bg|fg}-active`, `--tabs-segmented-bg-active`.

> Note: `segmented + vertical` is automatically downgraded to `pill` in code. Don't build a `segmented + vertical` Figma variant — it doesn't exist in the system.

Spec: [`../src/components/Tabs/Tabs.md`](../src/components/Tabs/Tabs.md)

## 13. Select

- Trigger as a Component. Open-listbox as a separate Component.
- Trigger variants: `state` = `default | hover | open | focus | disabled | error`
- Trigger sizes: `sm | md | lg`
- Listbox: per-option states (`default | active | selected | disabled`) and a separate `with search` variant

Bind: `--select-trigger-{bg|border|fg|radius}`, `--dropdown-{bg|border|radius|shadow}`, item tokens.

Spec: [`../src/components/Select/Select.md`](../src/components/Select/Select.md)

## 14. MultiSelect

- Same trigger as Select, but shows chips inside instead of a single value.
- Add a Chip component for the inline chip style.
- Listbox: same as Select, plus a "Select all" row.

Bind: select tokens + `--select-chip-{bg|fg|radius}`.

Spec: [`../src/components/MultiSelect/MultiSelect.md`](../src/components/MultiSelect/MultiSelect.md)

## 15. Menu

- A Component for the Menu container + items.
- Item variants: `kind` = `default | checkbox | submenu | divider | destructive`
- Item states: `default | hover | focus-visible | disabled`
- Slots: leading icon, label, shortcut hint

Bind: `--dropdown-*` tokens for surface; `--dropdown-item-fg{,-active,-disabled,-destructive}`, `--dropdown-item-bg-{hover,active,destructive-hover}`.

Spec: [`../src/components/Menu/Menu.md`](../src/components/Menu/Menu.md)

## 16. ProgressBar

- Variants: `shape` = `linear | circular`
- Variants: `size` = `xs | sm | md | lg`
- Variants: `tone` = `brand | success | warning | danger`
- Boolean: `hasLabel`, `showPercentage`, `hasDescription`, `indeterminate`, `segmented`

Bind: `--progress-track-bg`, `--progress-fill-{tone}`, `--progress-height-{size}`.

> Indeterminate animation can't render statically. Show a still-frame and label it "indeterminate (animated)".

Spec: [`../src/components/ProgressBar/ProgressBar.md`](../src/components/ProgressBar/ProgressBar.md)

---

## Acceptance — every component must

- [ ] Render correctly under all four Modes (light-compact, dark-compact, light-comfortable, dark-comfortable)
- [ ] Have every visible value bound to a Variable (no hex literals, no detached colour fills)
- [ ] Have an Anatomy diagram on its page with parts labelled
- [ ] Have at least one "in context" example showing realistic usage
- [ ] List the tokens it consumes
- [ ] Link to its `.md` spec and Storybook page
- [ ] Be reviewed by both design lead and eng lead before publishing

## Build order

Don't try to build all 16 in one sitting. Recommended order — by traffic and dependency:

1. **Button** (you'll discover the workflow on this one — give it a full afternoon)
2. **Field + TextInput** (most other inputs are variations of these two)
3. **Checkbox + Radio** (parallel to inputs, simple visual controls)
4. **Badge + Tag** (related, fast)
5. **Toast** (different shape, tests stacking + variants)
6. **Tabs** (four-variant exercise)
7. **Select + MultiSelect + Menu** (popover family, share patterns)
8. **NumericInput + Textarea** (variations on TextInput)
9. **ProgressBar** (last because animation)
10. **ButtonGroup** (composition only — trivial once Button exists)

Block 1-2 days per component for the first three; subsequent ones speed up as conventions settle.

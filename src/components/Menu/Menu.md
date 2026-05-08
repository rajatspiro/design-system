# Menu

Action menu (not a form control). Items can be plain, with icon, with shortcut, destructive, dividers, checkbox items, or submenus.

## API

```ts
type MenuItem =
  | { kind?: "item"; id; label; icon?; shortcut?; disabled?; destructive?; onSelect }
  | { kind: "divider"; id }
  | { kind: "checkbox"; id; label; checked; onChange; disabled? }
  | { kind: "submenu"; id; label; icon?; items: MenuItem[] };
```

## Behaviour

- Selecting a plain item invokes `onSelect` and closes the menu.
- Checkbox items toggle without closing.
- Submenus open inline; Escape closes the nearest open menu.

## Accessibility

- `role="menu"` on the list, `role="menuitem"` (or `menuitemcheckbox`) on items.
- Submenu triggers carry `aria-haspopup="menu"` and `aria-expanded`.
- Provide `aria-label` if the trigger is icon-only.
- Returns focus to the trigger on close.

## Do

- Group destructive items at the bottom, separated by a divider.
- Use `shortcut` to surface keyboard equivalents (display only).

## Don't

- Don't use a Menu where a Select fits — Menus are for actions, not form values.
- Don't nest more than one submenu deep; deep menus are unusable on touch.

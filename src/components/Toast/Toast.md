# Toast

Transient notification surfaced via `useToast()` from anywhere in the tree.

## Anatomy

```
[ icon ]  Title          [ action? ] [ × ]
          Description?
```

## API — useToast()

```ts
const { toast, dismiss, dismissAll } = useToast();

toast({
  tone: "success",            // info | success | warning | danger | neutral
  title: "Saved",
  description: "Your changes are live.",
  action: { label: "Undo", onClick: () => {} },
  duration: 5000,             // 0 = sticky
  dismissible: true,
});
```

## API — ToastProvider

| Prop | Type | Default |
|---|---|---|
| `position` | `"top-right" \| "top-center" \| "bottom-right" \| "bottom-center"` | `"top-right"` |
| `max` | `number` | `3` |

Toasts beyond `max` queue and surface as visible ones dismiss.

## Behaviour

- Auto-dismiss timer pauses on hover or focus and resumes on leave.
- `danger` and `warning` tones render with `role="alert"` + `aria-live="assertive"`; the rest use `role="status"` + `aria-live="polite"`.
- The toast region itself has `role="region"` with an accessible name ("Notifications").

## Tokens

`--toast-bg`, `--toast-fg`, `--toast-border`, `--toast-radius`, `--toast-shadow`, `--toast-{tone}-accent`, `--toast-{tone}-icon`.

## Do

- Mount `<ToastProvider>` once at the app root.
- Provide an `action` for any reversible operation (Undo, Retry).

## Don't

- Don't use Toast for blocking confirmations — use a Dialog.
- Don't use `tone="danger"` for non-error events; assistive tech treats it as urgent.
- Don't ship `duration: 0` without a dismiss button.

# Figma library structure

The Figma file mirrors the code library one-to-one. If a thing exists in Storybook, it exists in this Figma file in the same shape, with the same name, consuming the same tokens.

## File

- **Name:** `Design System Library`
- **Team:** the design team's shared team (not personal space).
- **Permissions:** Library admins (design lead + eng lead) edit; everyone else views.
- **Branching:** Use Figma Branching for any change beyond a single token tweak. Merge requests get the same two-lead review as code PRs.

## Pages

In this exact order, top to bottom:

```
1.  📘 Cover
2.  📐 Foundations / Color
3.  📐 Foundations / Typography
4.  📐 Foundations / Spacing
5.  📐 Foundations / Radius & Shadow
6.  📐 Foundations / Motion
7.  🧩 Components / Button
8.  🧩 Components / ButtonGroup
9.  🧩 Components / Field
10. 🧩 Components / TextInput
11. 🧩 Components / NumericInput
12. 🧩 Components / Textarea
13. 🧩 Components / Radio
14. 🧩 Components / Checkbox
15. 🧩 Components / Toast
16. 🧩 Components / Badge
17. 🧩 Components / Tag
18. 🧩 Components / Tabs
19. 🧩 Components / Select
20. 🧩 Components / MultiSelect
21. 🧩 Components / Menu
22. 🧩 Components / ProgressBar
23. 🎨 Patterns
24. 📜 Changelog
```

Emoji prefixes are functional — Figma's page picker is much faster to scan with them.

## Cover page

A 1440 × 1024 frame with:

- Library name + version (`Design System Library · v0.1.0` — keep in sync with `package.json`)
- One-line purpose
- Last-updated date (manually update on publish)
- Links to: Storybook URL, GitHub repo, Slack channel
- A four-quadrant preview of one component (the Button) in light-compact, dark-compact, light-comfortable, dark-comfortable, so anyone opening the file immediately understands what the modes do

## Foundations pages

Each foundations page is a visual reference, **never** the source of truth. The source is `src/tokens/source/*.json`. These pages exist so designers and stakeholders can see what's available.

### Color

Three sections, each a horizontal swatch grid:

- **Primitives** — one row per family (`neutral`, `brand`, `info`, `success`, `warning`, `danger`), 11 stops each. Each swatch shows its hex + variable name.
- **Semantic — light** — surface, text, border, action × {primary, secondary, tertiary, destructive}, feedback × {info, success, warning, danger}. Each tile shows the swatch + variable name + what primitive it resolves to.
- **Semantic — dark** — same grid, but the frame uses the Dark mode of the Variable Collection. (Two stacked frames are clearer than one frame with mode-toggle commentary.)

### Typography

One frame per role (`display-l/m/s`, `heading-1`–`6`, `body-l/m/s`, `label-l/m/s`, `caption`, `code`, `overline`). Each frame:

- Renders sample text with the role's tokens applied (size, line, weight)
- Shows the variable name and resolved values to the right

### Spacing

Visual ramp — for each `space-*` token, a horizontal bar of that width with the variable name underneath. Plus a separate "spacing roles" block showing `inset`, `stack`, `inline` semantic groupings.

### Radius & Shadow

Two columns. Left: 8 squares with progressively larger radii, labelled. Right: 6 cards with progressively larger shadows, labelled.

### Motion

Three rows of animated dots (or static if Figma can't preview easily) showing each duration × ease combination. This page is mostly text — animation is hard to convey statically.

## Components pages

One page per component. **Page name matches the component file name** in code (`Button`, `ButtonGroup`, `Field`, etc.) so the link between Figma and code is unambiguous.

Each component page is laid out as:

```
┌─────────────────────────────────────────────┐
│  Component name (heading-2)                 │
│  One-line purpose (body-m)                  │
│                                             │
│  ┌── Anatomy ──────────────────────┐       │
│  │  Labelled diagram of parts      │       │
│  └─────────────────────────────────┘       │
│                                             │
│  ┌── Component (the master) ───────┐       │
│  │  Variants × Sizes × States      │       │
│  └─────────────────────────────────┘       │
│                                             │
│  ┌── Usage ────────────────────────┐       │
│  │  Do / Don't pairs               │       │
│  └─────────────────────────────────┘       │
│                                             │
│  ┌── In context ──────────────────┐        │
│  │  Realistic use case mockup     │        │
│  └────────────────────────────────┘        │
│                                             │
│  Tokens consumed: list                      │
│  Storybook: link                            │
│  Spec: link to ComponentName.md             │
└─────────────────────────────────────────────┘
```

The **Component** block contains the actual Figma Component (the thing that gets published). Everything else is documentation around it. See `COMPONENT-CHECKLIST.md` for what variants must exist per component.

## Patterns page

For now, a stub with three placeholders: `Sign-in form`, `Settings panel`, `Empty state card`. Patterns get built once we have real product surfaces to reference.

## Changelog page

Reverse-chronological list of meaningful changes. Each entry:

- Date
- Component(s) affected
- One-sentence description
- Link to GitHub PR

This is the design-side complement to `CHANGELOG.md`. Designers update it on publish; the PR description from `main` goes here.

## Naming conventions

- **Pages:** as listed above. Don't rename without coordinating with the eng lead.
- **Component (master):** `Button` — exact match with the React component name.
- **Variants properties:** `variant`, `size`, `state`, `density` (lowercase, single word). Use Figma's variant property syntax — they show up cleanly in the panel.
- **Variant values:** match the TypeScript prop values exactly (`primary`, `sm`, `hover`). No spaces, no capitalisation differences.
- **Frames:** named `Component / Use case` (e.g., `Button / In a form`, `Button / In a toolbar`).

## Publishing

- Library is published from the file's settings panel by a library admin.
- After publish, write a one-line entry on the Changelog page.
- Bump the version on the Cover page if it's a meaningful release.

## What lives in code, not Figma

These exist in code only and don't need Figma representation:

- The token build script and CI guards
- Component implementation details (refs, props, event handlers)
- The Popover internal primitive (it's not a published component — only used by Select / MultiSelect / Menu)

Conversely, **everything visual** in code must have a Figma counterpart. If a component ships in code without a Figma component, it's a half-shipped feature.

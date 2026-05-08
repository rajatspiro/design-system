# Design System

A token-first React component library, shared by designers and developers.

## Principles carried forward

1. **Tokens are the contract.** Every visual value lives in a token. If a value isn't a token, it's a bug.
2. **Components don't decide colour, spacing, or motion** — they only *consume* component tokens.
3. **Light and dark are equal citizens.** Every semantic colour must work in both modes.
4. **Accessibility is non-negotiable.** WCAG 2.1 AA contrast, visible focus rings, full keyboard parity, RTL-safe.

## Architecture — three layers

```
PRIMITIVE          SEMANTIC                COMPONENT             COMPONENT CSS
─────────          ───────────             ─────────             ─────────────
--color-brand-700  --color-action-         --button-primary-bg   .ds-button--
                   primary-bg                                      primary { … }
```

Strict layering:

- Primitives are raw values; never consumed by components directly.
- Semantics alias primitives to intent (`--color-action-primary-bg`). Components don't read these directly either.
- Component tokens (`--button-primary-bg`) alias semantics. **Only** these are consumed by component CSS.

This means:

- Want to retheme? Change semantics.
- Want to retune one component without affecting the system? Change its component tokens.
- Want to swap to dark mode? `[data-theme="dark"]` flips semantics; components don't change.

## File layout

```
src/
  tokens/
    source/                       ← AUTHORED. Tokens Studio reads this folder.
      $metadata.json              ←   set order
      $themes.json                ←   theme combinations
      core.json                   ←   primitives + mode-agnostic semantics
      color-light.json            ←   semantic colors (light)
      color-dark.json             ←   semantic colors (dark)
      components.json             ←   component tokens (compact density default)
      components-dark.json        ←   dark-only component overrides
      density-comfortable.json    ←   touch-target overrides
      platform-{web,ios,android}.json   ← platform overrides (iOS/Android wired in Phase 4)
      README.md                   ←   authoring contract
    primitives.css                ← GENERATED — do not edit
    semantics.css                 ← GENERATED — light + [data-theme="dark"]
    component-tokens.css          ← GENERATED — light + dark + [data-density="comfortable"]
    tokens.ts                     ← GENERATED — flat maps for RN / JS consumers
    build.mjs                     ← transform: source/*.json → CSS + TS
    check-generated.mjs           ← CI guard — fails if generated files are stale
    index.ts                      ← TypeScript token types + helpers (t(), setTheme())
    colors.ts                     ← (legacy — kept for the existing Tokens story)
    spacing.ts
    typography.ts
    Tokens.stories.tsx
  components/
    Button/
    ButtonGroup/
    Field/
    TextInput/
    NumericInput/
    Textarea/
    Radio/
    Checkbox/
    Toast/
    Badge/
    Tag/
    Tabs/
    Popover/                ← internal primitive used by Select/MultiSelect/Menu
    Select/
    MultiSelect/
    Menu/
    ProgressBar/
  index.ts                  ← public barrel
  index.css                 ← imports the three token layers, sets root typography
```

Each component folder contains:

```
ComponentName.tsx          implementation
ComponentName.css          styles consuming component tokens only
ComponentName.types.ts     exported TS types
ComponentName.md           anatomy, API, variants, do/don'ts, a11y
ComponentName.stories.tsx  Storybook (where present)
```

## Naming

| Layer            | Pattern                                | Example                              |
|------------------|----------------------------------------|--------------------------------------|
| CSS custom prop  | `--<category>-<role>-<modifier>`       | `--color-action-primary-bg-hover`    |
| Component class  | `ds-<component>` / `ds-<component>--<modifier>` | `ds-button--primary`        |
| TS prop          | camelCase                              | `leadingIcon`, `fullWidth`           |
| Component file   | PascalCase                             | `Button.tsx`                         |

## Theming

```ts
import { setTheme } from "./src";
setTheme("dark");   // adds [data-theme="dark"] to <html>
setTheme("light");  // removes it
```

Tokens swap automatically; components don't change.

## RTL

All components use logical properties (`padding-inline-start`, `inset-inline-end`, etc.). Drop your app inside `<html dir="rtl">` — no component changes required.

## Responsive web

The web library handles desktop and mobile web from one codebase via three mechanisms:

1. **Density attribute.** Set `[data-density="comfortable"]` on `<html>` (or any wrapper) to bump touch targets — buttons, inputs, radio/checkbox indicators, tab triggers — to ≥ 44px. Compact (32–40px) is the default for desktop. Toggle interactively in Storybook via the **Density** toolbar.
2. **Hover-pointer guards.** Every `:hover` rule in component CSS is wrapped in `@media (hover: hover)` so taps on touch devices don't leave phantom hover states. `:focus-visible`, `:active`, and `:disabled` work on every input and stay outside the guard.
3. **Fluid display sizes.** `--text-display-{l,m,s}-size` use `clamp()` in CSS so headlines scale with viewport. The static value (the `clamp` ceiling) is what gets exported to Figma and React Native, so design tools and native consumers see a stable number.

Breakpoint primitives (`--breakpoint-{sm,md,lg,xl}` = 640 / 768 / 1024 / 1280 px) are available for component-level `@media` queries when you need them. CSS variables can't be used inside `@media()` directly — use the documented values, or import `breakpoints` from `tokens.ts` for JS-side `matchMedia` calls.

## Token build pipeline

Tokens are authored as W3C-shaped JSON in `src/tokens/source/` (Tokens Studio compatible). A zero-dep Node transform converts them to CSS variables for the web library and a flat TS map for React Native:

```
npm run tokens:build      # generate primitives.css, semantics.css, component-tokens.css, tokens.ts
npm run tokens:watch      # rebuild on source change
npm run tokens:check      # CI guard — fails if a generated file is stale or hand-edited
```

The build runs automatically before `start`, `build`, `storybook`, and `build-storybook`. Edits to the generated files are rejected by the CI guard. See `src/tokens/source/README.md` for the authoring contract.

## Figma library

The Figma side mirrors the code library one-to-one. Tokens flow from `src/tokens/source/*.json` into Figma Variables via Tokens Studio (GitHub sync). Components in Figma match components in Storybook 1:1, consume only Variables, and re-theme via Variable Modes (light/dark × compact/comfortable × web/iOS/Android).

Setup, library structure, and per-component requirements are in [`figma/`](figma/):

- [`figma/TOKENS-STUDIO-SETUP.md`](figma/TOKENS-STUDIO-SETUP.md) — one-time plugin + GitHub sync setup
- [`figma/LIBRARY-SPEC.md`](figma/LIBRARY-SPEC.md) — page structure, naming conventions, anatomy of a component page
- [`figma/COMPONENT-CHECKLIST.md`](figma/COMPONENT-CHECKLIST.md) — what every component must contain, in order of build

## Storybook & Chromatic

Run Storybook locally:

```
npm run storybook
```

Every component has stories under `Components/*` and there's a live token gallery under `Design System / CSS Tokens`. The toolbar has a **Theme** switcher (Light / Dark) — flipping it sets `data-theme="dark"` on `<html>` and the components re-theme via CSS variables.

### Visual testing on Chromatic

```
npm run chromatic         # interactive run
npm run chromatic:ci      # CI run (exits 0 on changes, exits once uploaded)
```

The project token is hardcoded in `package.json` and `chromatic.config.json`. Move it to a CI secret if you want to rotate it.

### Capturing both light and dark in Chromatic

`.storybook/preview.js` declares `parameters.chromatic.modes = { light, dark }`. To actually capture both modes per story, install the Chromatic Storybook addon:

```
npm i -D @chromatic-com/storybook
```

Then add `"@chromatic-com/storybook"` to the `addons` array in `.storybook/main.js`. Until that's installed, Chromatic captures whichever mode the toolbar defaults to (light).

### Per-story Chromatic controls

Stories that animate (indeterminate progress, toasts) opt out via:

```ts
parameters: { chromatic: { disableSnapshot: true } }
```

…to avoid flaky baselines. Found in `Toast.stories.tsx`, `ProgressBar.stories.tsx` (indeterminate variants).

## Reduced motion

`@media (prefers-reduced-motion: reduce)` collapses every duration token to `0ms`. Components don't need to opt in individually.

## Adding a new component — checklist

1. **Audit semantics first.** Does the new component need a colour, surface, or border that isn't already a semantic token? If so, add a semantic token *before* writing component CSS, and document the rationale.
2. **Define component tokens.** Add a `--<component>-…` block to `tokens/component-tokens.css`. Map only to semantic tokens. Cover every variant × state.
3. **Write the component CSS.** Use only `--<component>-…` variables. Lint rule (recommended): forbid raw hex/colour values in `src/components/**/*.css`.
4. **Implement the component.** Use logical properties. Never hardcode px in inline styles. Forward refs. Accept native attributes via `...rest`.
5. **Write the spec doc** (`ComponentName.md`) — anatomy, API, variants × states matrix, a11y, do/don'ts. Reviewers should be able to use this without reading the implementation.
6. **Add Storybook stories** covering every variant, every state, both themes. Add a Chromatic baseline.
7. **Run the a11y addon** in Storybook, fix every violation.
8. **Export it from `src/index.ts`.**

## Contribution rules

- One PR = one component (or one cross-cutting token change). Don't mix.
- Token changes require a designer review.
- Breaking changes to a component require a `BREAKING:` line in the PR description and a codemod or migration note.
- All new components ship with: implementation, types, CSS, markdown spec, Storybook stories, and dark-mode stories. No exceptions.

## Existing legacy

`tokens/colors.ts`, `tokens/spacing.ts`, `tokens/typography.ts`, `tokens/Tokens.stories.tsx` predate this architecture and are kept untouched so the existing Storybook page continues to work. New code should use the CSS-variable layer (`tokens/index.ts`). The legacy TS objects can be deleted once the existing `Tokens` story is migrated.

## Flagged additions in this expansion

These visual values were not present in the original system and were added to fill the architectural gap. Each is traceable to existing primitives where possible:

- `info` / `success` / `warning` / `danger` colour scales — chosen Tailwind-style ramps for AA contrast against the existing neutrals.
- Font families: system stack only (no web fonts) to avoid a new dependency.
- Type ramp 50–900, line heights, letter spacings, weights other than 500.
- Radius scale beyond `md` (which is the existing 6px), border widths, shadow levels 1–5, opacity scale.
- Motion durations (`fast`, `slow`, `slower`) and easings other than `ease-in-out`.
- Z-index stack.
- Dark mode mappings for every semantic colour.

The brand and neutral scales are anchored on existing values (`#3C61DD`, `#11181C`, `#697177`, `#C1C8CD`, `#D7DBDF`, `#E6E8EB`, `#F0F2F4`); spacing 1–5 and radius `md` and font-size 200 / weight medium are direct lifts from the existing tokens.

---

This README replaces the original Create-React-App scaffold notes. The original `npm start` / `npm test` / `npm run build` / `npm run storybook` scripts still work as expected (see `package.json`).

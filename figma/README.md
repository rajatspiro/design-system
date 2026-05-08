# Figma library

Everything Figma-side for the design system lives here. The token JSON in `../src/tokens/source/` is the same source Tokens Studio reads — there is exactly one source of truth for the system.

## Files in this folder

| Doc | When to read it |
|---|---|
| [`TOKENS-STUDIO-SETUP.md`](TOKENS-STUDIO-SETUP.md) | One-time setup. Connect Tokens Studio to the GitHub repo and push tokens into Figma Variables. |
| [`LIBRARY-SPEC.md`](LIBRARY-SPEC.md) | Structure of the `Design System Library` Figma file — pages, naming, anatomy of a component page. |
| [`COMPONENT-CHECKLIST.md`](COMPONENT-CHECKLIST.md) | Per-component requirements — variants, properties, tokens to bind, acceptance criteria. |

## How to use this folder

If you're **new to the system**, read in this order:

1. The top-level [`../README.md`](../README.md) for the architecture overview.
2. `TOKENS-STUDIO-SETUP.md` to wire up Figma.
3. `LIBRARY-SPEC.md` to understand the file's shape.
4. `COMPONENT-CHECKLIST.md` when you sit down to build a component.

If you're **changing a token**, you don't need any Figma work — edit `../src/tokens/source/*.json`, open a PR. Figma picks up the change after the next pull from Tokens Studio.

If you're **adding a new component**, the order is:

1. RFC + code prototype (eng + design)
2. Code component lands in `../src/components/NewThing/`
3. Add an entry to `COMPONENT-CHECKLIST.md` describing the Figma version
4. Build the Figma component to match
5. Publish library

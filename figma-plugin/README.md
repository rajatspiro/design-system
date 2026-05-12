# Design System Sync — Figma plugin

A custom Figma plugin that reads `tokens.figma-variables.json` and (soon) component specs from the GitHub repo and applies them to a Figma library file. Replaces Tokens Studio for our use case at zero cost.

## Features

- **Sync tokens** — fetches `src/tokens/tokens.figma-variables.json` from `main`, creates / updates the `Design System` Variable Collection with all 4 modes and 481 variables, resolves alias references.
- **Generate components** (coming next) — reads `src/component-specs/*.json` and constructs Figma components with full variant matrices bound to Variables.

## Installing the plugin in Figma (one-time, dev mode)

This plugin isn't published to the Figma plugin store — you install it locally as a development plugin. Anyone on the team who wants to run it does this once.

1. **Pull the repo locally** (you already have it at `~/Documents/design-system`).
2. **In Figma desktop app**, open your `Design System Library` file.
3. Top menu → **Plugins** → **Development** → **Import plugin from manifest…**
4. Navigate to `~/Documents/design-system/figma-plugin/manifest.json` and select it.
5. The plugin is now installed for your account. Run it via **Plugins** → **Development** → **Design System Sync**.

If you don't see the **Development** submenu, you may need to enable plugin development in Figma → Preferences → "Allow plugin development."

## Using the plugin

1. Open your `Design System Library` file.
2. Run **Plugins → Development → Design System Sync**.
3. Click **Sync tokens from GitHub**.
4. Watch the log. Expected output:
   - "Created Variable Collection: Design System"
   - "Added mode: Light · Compact" (+ 3 more)
   - "Pass 1 complete: 481 variables created/updated"
   - "Pass 2 complete: ~1288 alias bindings set"
   - "Sync done."
5. Open the Figma Variables panel (Design tab, with nothing selected, right sidebar) — you'll see the `Design System` collection with 4 mode columns and every variable filled in.

Re-run the sync any time you push token changes to `main`. The plugin upserts by variable name, so existing bindings on components survive.

## Troubleshooting

- **"Bad payload — no variables array"** — the JSON URL didn't return valid data. Check the repo path / branch in `ui.html`.
- **"Unresolved alias"** — a token references another token that doesn't exist. Usually means the JSON itself has a broken reference; fix in `src/tokens/source/*.json` and rebuild.
- **"Type mismatch"** — you previously created a Variable with this name as a different type. Either rename the variable or delete it from Figma and re-sync.
- **Network error** — Figma plugin network access is allow-listed. Only `raw.githubusercontent.com` is reachable. If you point at a different host, update `manifest.json`'s `networkAccess.allowedDomains`.

## Development

Plain JavaScript — no build step. Edit `code.js` or `ui.html` and Figma picks up the changes on the next plugin run.

`code.js` runs in Figma's main thread and has the `figma.*` API. `ui.html` runs in a sandboxed iframe — that's where the `fetch()` calls happen. They communicate via `postMessage`.

To debug, open the plugin in Figma → top menu → **Plugins → Development → Show/Hide console**. `console.log` from both threads shows up there.

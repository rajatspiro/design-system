# Tokens Studio — connecting Figma to this repo

This is the one-time setup. Follow it once per Figma file that consumes the design system. After it's done, every merge to `main` flows tokens into Figma Variables automatically.

## Prereqs

- Figma **Pro** or **Org** plan (Variable Modes are paid-only).
- **Tokens Studio Pro** plan (Sync, Themes, and *Push to Figma Variables* require Pro). Free works for read-only exploration.
- This repo pushed to GitHub on a branch you control (default: `main`).
- A GitHub **fine-grained Personal Access Token** with:
  - Repository access: this repo only
  - Permissions: **Contents: Read & Write**, **Pull requests: Read & Write**, **Metadata: Read**

Generate the token at GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → "Generate new token". Save it somewhere — Figma can't show it again.

## One-time setup

### 1. Install the plugin

Figma → top menu → Plugins → Browse all plugins → search **"Tokens Studio for Figma"** → Install. Then open the plugin in your library file: Plugins → Tokens Studio for Figma.

### 2. Add the GitHub sync provider

Inside the plugin:

1. Click the **gear icon** (top right) → **Sync providers** → **Add new**.
2. Choose **GitHub**.
3. Fill in:
   - **Name** — `design-system`
   - **Personal Access Token** — paste the token from prereqs
   - **Repository** — `<your-github-org>/design-system`
   - **Branch** — `main`
   - **File path** — `src/tokens/source` *(folder — Tokens Studio will read every `*.json` inside)*
   - **Base URL** — leave empty
3. Save. The plugin verifies the connection and reads `$metadata.json` to discover the sets.

### 3. Pull the tokens

Click **Pull from GitHub** (cloud-down icon). All eight token sets appear in the left sidebar:

- core
- color-light / color-dark
- components / components-dark
- density-comfortable
- platform-{web,ios,android}

### 4. Verify the themes

Click **Themes** (top-left tab). You'll see six themes from `$themes.json`:

- Light · Compact · Web (default)
- Dark · Compact · Web
- Light · Comfortable · Web
- Dark · Comfortable · Web
- Light · Comfortable · iOS *(Phase 4)*
- Light · Comfortable · Android *(Phase 4)*

For each theme, the correct sets should already be enabled. If they aren't, the `$themes.json` is the source of truth — re-pull from GitHub.

### 5. Push to Figma Variables

This is the moment Tokens Studio Pro earns its keep.

1. Click **Apply to Figma** → **Variables** (or "Push to Figma Variables").
2. Tokens Studio creates a **Variable Collection** named `Design System` with one Mode column per theme.
3. Open Figma's native **Variables** panel (right sidebar, in the Design tab when nothing is selected). You should see the collection with all six modes.
4. Spot-check: pick `color/action/primary/bg`. The Light columns show `#3C61DD`, the Dark columns show `#4567DD`. If they don't, something didn't sync — re-push.

### 6. Lock direct edits

Tokens are now in Figma. **Designers must not edit Variable values directly in Figma's panel** — those edits are local to the file and won't survive the next push. Two safeguards:

- Set the Variable Collection to **Read only** for everyone except library admins (Figma's collection settings).
- Document that the only place to author tokens is `src/tokens/source/*.json`. Any change goes through a PR.

## Ongoing workflow

### When you change a token in code

1. Edit `src/tokens/source/*.json`.
2. Open a PR. CI runs `tokens:check`. Reviewers approve.
3. Merge to `main`.
4. In Figma, anyone using the library opens Tokens Studio and clicks **Pull from GitHub** → **Apply to Figma Variables**. Updated values flow into the Variable Collection. Library users get the change on next refresh.

(If you want this automated in the background, Tokens Studio Enterprise offers GitHub Actions sync. For a small team, manual pull is fine.)

### When a designer wants to propose a token change from Figma

1. Designer edits the token value in **Tokens Studio** (not in Figma's Variable panel).
2. Click **Push to GitHub** → Tokens Studio opens a PR against `main` with the diff.
3. Engineering + design leads review. Merge or close.
4. Once merged, every consumer (web, RN, Figma) picks up the change.

This is the "designers can author tokens too" path. They never need to write code; they just describe the change in Tokens Studio and ship a PR.

## Common issues

**"401 Unauthorized" when pulling.** The PAT expired or doesn't have the right repo scope. Regenerate with `Contents: R/W` and `Pull requests: R/W`.

**Themes column doesn't appear when pushing to Variables.** You're on the free tier of Tokens Studio. Themes / multi-mode push is Pro-only.

**Variables panel shows the collection but only has one Mode.** The push happened on the free Figma tier, which caps Modes at 1. Upgrade to Pro/Org.

**Composite typography tokens (`text.body-m.size`, `.line`, `.weight`) appear as separate Variables, not a typography style.** That's expected — we use separate tokens, not the W3C `typography` composite type. If you want Figma Text styles, create them manually in the library file that reference the size/line/weight Variables.

**Push fails with "schema validation failed".** Tokens Studio is strict about `$type` values. If you added a token with an unknown type, fix it in JSON and retry.

## Reference

- Tokens Studio docs: https://tokens.studio/docs
- Figma Variables docs: https://help.figma.com/hc/en-us/articles/15145852043927
- Our authoring contract: [`../src/tokens/source/README.md`](../src/tokens/source/README.md)

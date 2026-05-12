/**
 * Design System Sync — main plugin thread.
 *
 * Receives messages from ui.html and applies them to the Figma document via
 * the figma.* API. The UI does all the network fetching; we just consume the
 * parsed JSON.
 */

figma.showUI(__html__, { width: 360, height: 520, themeColors: true });

const COLLECTION_NAME = "Design System";
const INTER_STYLES = ["Regular", "Medium", "Semi Bold", "Bold"];

/** Pre-load every Inter weight the system uses, so subsequent font assignments
 *  (and Variable-bound fontFamily / fontStyle) don't fail with unloaded-font errors. */
const fontsReady = Promise.all(
  INTER_STYLES.map((style) =>
    figma.loadFontAsync({ family: "Inter", style }).catch(() => {})
  )
);

/* ---------- helpers ---------- */

function uiLog(text, kind) {
  figma.ui.postMessage({ type: "log", text, kind: kind || "info" });
}

function uiDone() {
  figma.ui.postMessage({ type: "sync-done" });
}

/** Parse a CSS-style colour into Figma's RGBA (0..1) shape. */
function parseColor(input) {
  if (input == null) return null;
  const s = String(input).trim();

  if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  // #RRGGBB or #RRGGBBAA
  if (s.startsWith("#")) {
    const hex = s.slice(1);
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255,
        a: 1
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255,
        a: parseInt(hex.slice(6, 8), 16) / 255
      };
    }
  }

  // rgba(r, g, b, a) or rgb(r, g, b)
  const m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (m) {
    return {
      r: Number(m[1]) / 255,
      g: Number(m[2]) / 255,
      b: Number(m[3]) / 255,
      a: m[4] != null ? Number(m[4]) : 1
    };
  }

  return null;
}

/** Ensure the named collection exists; return it. */
function ensureCollection(name) {
  const collections = figma.variables.getLocalVariableCollections();
  let collection = collections.find((c) => c.name === name);
  if (!collection) {
    collection = figma.variables.createVariableCollection(name);
    uiLog("Created Variable Collection: " + name, "ok");
  } else {
    uiLog("Using existing collection: " + name, "muted");
  }
  return collection;
}

/** Ensure every desired mode exists on the collection.
 *  Returns Map<jsonModeId, figmaModeId> so callers can look up by the IDs
 *  that appear inside `values` objects in our JSON (e.g. "light-compact"),
 *  not by Figma's display names ("Light · Compact"). */
function ensureModes(collection, desiredModes) {
  const idToModeId = new Map();
  const existingByName = new Map();
  for (const m of collection.modes) existingByName.set(m.name, m.modeId);

  // Figma collections start with one default mode named "Mode 1". If we
  // haven't matched any of our desired names yet and that's the only mode,
  // rename it to our first desired mode rather than adding a 5th.
  if (
    collection.modes.length === 1 &&
    !desiredModes.some((d) => existingByName.has(d.name))
  ) {
    const onlyMode = collection.modes[0];
    const first = desiredModes[0];
    collection.renameMode(onlyMode.modeId, first.name);
    existingByName.delete(onlyMode.name);
    existingByName.set(first.name, onlyMode.modeId);
    idToModeId.set(first.id, onlyMode.modeId);
    uiLog("Renamed default mode → " + first.name, "muted");
  }

  for (const desired of desiredModes) {
    if (idToModeId.has(desired.id)) continue;
    if (existingByName.has(desired.name)) {
      idToModeId.set(desired.id, existingByName.get(desired.name));
      continue;
    }
    const newId = collection.addMode(desired.name);
    existingByName.set(desired.name, newId);
    idToModeId.set(desired.id, newId);
    uiLog("Added mode: " + desired.name, "ok");
  }
  return idToModeId;
}

/** Index of variables by name in the given collection. */
function indexVariables(collection) {
  const all = figma.variables.getLocalVariables();
  const map = new Map();
  for (const v of all) {
    if (v.variableCollectionId !== collection.id) continue;
    map.set(v.name, v);
  }
  return map;
}

/** Create-or-fetch a variable by name. If a pre-existing variable has a
 *  different resolvedType than what the JSON says (e.g. fontWeights moved
 *  FLOAT→STRING in our build), the existing one is removed and a fresh one
 *  is created. Existing bindings to the old variable will break — callers
 *  expecting to re-bind (Text Styles, regenerated components) handle this. */
function ensureVariable(name, type, collection, varIndex) {
  let v = varIndex.get(name);
  if (v) {
    if (v.resolvedType !== type) {
      uiLog("Type changed on " + name + " (" + v.resolvedType + " → " + type + "), recreating", "muted");
      try { v.remove(); } catch (e) { uiLog("  · couldn't remove " + name + ": " + e.message, "warn"); }
      varIndex.delete(name);
    } else {
      return v;
    }
  }
  v = figma.variables.createVariable(name, collection, type);
  varIndex.set(name, v);
  return v;
}

/** Set a variable's value for one mode. */
function applyValue(variable, modeId, value, type, varIndex) {
  if (!value) return;

  // Alias reference.
  if (value.alias) {
    const target = varIndex.get(value.alias);
    if (!target) {
      uiLog("Unresolved alias: " + variable.name + " → " + value.alias, "warn");
      return;
    }
    variable.setValueForMode(modeId, figma.variables.createVariableAlias(target));
    return;
  }

  // Literal value.
  if (type === "COLOR") {
    const rgba = parseColor(value.value);
    if (!rgba) {
      uiLog("Bad colour on " + variable.name + ": " + value.value, "warn");
      return;
    }
    variable.setValueForMode(modeId, rgba);
    return;
  }
  if (type === "FLOAT") {
    variable.setValueForMode(modeId, Number(value.value));
    return;
  }
  if (type === "STRING") {
    variable.setValueForMode(modeId, String(value.value));
    return;
  }
}

/* ---------- token sync ---------- */

function syncTokens(data) {
  if (!data || !data.variables) {
    uiLog("Bad payload — no variables array", "err");
    uiDone();
    return;
  }

  uiLog("Starting token sync…", "info");

  const collection = ensureCollection(data.collectionName || COLLECTION_NAME);
  const modeIds = ensureModes(collection, data.modes);
  const varIndex = indexVariables(collection);

  // Pass 1 — create every variable and apply LITERAL values.
  // Aliases are deferred to Pass 2 because their targets might not exist yet.
  let processed = 0;
  for (const entry of data.variables) {
    const v = ensureVariable(entry.name, entry.type, collection, varIndex);
    if (!v) continue;
    for (const [modeId, val] of Object.entries(entry.values)) {
      const figmaModeId = modeIds.get(modeId);
      if (!figmaModeId) continue;
      if (val.value !== undefined) {
        applyValue(v, figmaModeId, val, entry.type, varIndex);
      }
    }
    processed += 1;
  }
  uiLog("Pass 1 complete: " + processed + " variables created or updated", "ok");

  // Pass 2 — resolve aliases now that every variable exists.
  let aliasCount = 0;
  let aliasFailures = 0;
  for (const entry of data.variables) {
    const v = varIndex.get(entry.name);
    if (!v) continue;
    for (const [modeId, val] of Object.entries(entry.values)) {
      const figmaModeId = modeIds.get(modeId);
      if (!figmaModeId) continue;
      if (val && val.alias) {
        const target = varIndex.get(val.alias);
        if (!target) {
          aliasFailures += 1;
          if (aliasFailures <= 5) uiLog("  · missing alias target: " + entry.name + " → " + val.alias, "warn");
          continue;
        }
        v.setValueForMode(figmaModeId, figma.variables.createVariableAlias(target));
        aliasCount += 1;
      }
    }
  }
  uiLog("Pass 2 complete: " + aliasCount + " alias bindings set" + (aliasFailures ? " (" + aliasFailures + " unresolved)" : ""), aliasFailures ? "warn" : "ok");
  uiLog("Sync done.", "ok");
  uiDone();
}

/* ============================================================
   COMPONENT GENERATOR
   Reads a component spec and constructs a Figma Component with
   auto-layout, fills, strokes, text — all visual properties bound
   to Variables in the Design System collection.

   First version (v0.1): generates ONE representative variant per
   component. Variant matrix + variantOverrides come in v0.2 once
   we know v0.1 renders correctly.
   ============================================================ */

/** Interpolate ${expr} occurrences in a string against a variant context. */
function interpolate(input, ctx) {
  if (typeof input !== "string") return input;
  return input.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    try {
      const fn = new Function(...Object.keys(ctx), "return (" + expr + ");");
      const v = fn(...Object.values(ctx));
      return v == null ? "" : String(v);
    } catch (e) {
      return "";
    }
  });
}

function evaluateCondition(expr, ctx) {
  if (expr === true || expr === false) return expr;
  if (typeof expr !== "string") return true;
  try {
    const fn = new Function(...Object.keys(ctx), "return (" + expr.replace(/^\$\{|\}$/g, "") + ");");
    return Boolean(fn(...Object.values(ctx)));
  } catch (e) {
    return true;
  }
}

/** Pull a token name out of a "{name/path}" template, or null if not a pure ref. */
function tokenName(input, ctx) {
  const resolved = interpolate(input, ctx);
  const m = /^\{([^}]+)\}$/.exec(resolved);
  return m ? m[1] : null;
}

/** Map our alignment strings to Figma's enum. */
function mapAlign(s) {
  if (s === "center") return "CENTER";
  if (s === "start" || s === "min") return "MIN";
  if (s === "end" || s === "max") return "MAX";
  if (s === "space-between") return "SPACE_BETWEEN";
  return "CENTER";
}

/** Walk a Variable's alias chain in JS and return its raw resolved value
 *  (number or string) — caller filters by JS type. */
function resolveVariableValue(variable) {
  if (!variable) return undefined;
  const firstMode = Object.keys(variable.valuesByMode || {})[0];
  let resolved = variable.valuesByMode && variable.valuesByMode[firstMode];
  let safety = 8;
  while (resolved && typeof resolved === "object" && resolved.type === "VARIABLE_ALIAS" && safety-- > 0) {
    const target = figma.variables.getVariableById(resolved.id);
    if (!target) return undefined;
    const tm = Object.keys(target.valuesByMode || {})[0];
    resolved = target.valuesByMode && target.valuesByMode[tm];
  }
  return resolved;
}

/** Resolve a spec value (literal, {token}, or template) to a plain number. */
function resolveLiteral(input, ctx, varIndex) {
  const name = tokenName(input, ctx);
  if (name) {
    const v = varIndex.get(name);
    if (v) {
      const r = resolveVariableValue(v);
      if (typeof r === "number" && Number.isFinite(r)) return r;
    }
  }
  const literal = interpolate(input, ctx);
  const num = parseFloat(literal);
  return Number.isFinite(num) ? num : null;
}

/** Resolve a spec value to a string (via Variable alias chain or template). */
function resolveString(input, ctx, varIndex) {
  const name = tokenName(input, ctx);
  if (name) {
    const v = varIndex.get(name);
    if (v) {
      const r = resolveVariableValue(v);
      if (typeof r === "string") return r;
    }
  }
  const literal = interpolate(input, ctx);
  return typeof literal === "string" && literal.length > 0 ? literal : null;
}

/** Resolve a token-or-literal to the actual Figma Variable (for binding).
 *  Returns null if the input isn't a {token} reference. */
function variableFor(input, ctx, varIndex) {
  const name = tokenName(input, ctx);
  if (!name) return null;
  return varIndex.get(name) || null;
}

/** Apply a value to a scalar node field, binding to a Variable if the input
 *  resolves to a {token/path}. Returns true if applied, false otherwise. */
function applyScalar(node, field, input, ctx, varIndex) {
  const name = tokenName(input, ctx);
  if (name) {
    const v = varIndex.get(name);
    if (v) {
      try {
        node.setBoundVariable(field, v);
        return true;
      } catch (e) {
        uiLog("Can't bind " + field + " on " + node.name + " to " + name + ": " + e.message, "warn");
      }
    } else {
      uiLog("Missing variable for " + field + ": " + name, "warn");
    }
  }
  const literal = interpolate(input, ctx);
  const num = parseFloat(literal);
  if (Number.isFinite(num)) {
    try { node[field] = num; return true; } catch (e) { /* swallow */ }
  }
  return false;
}

function applyPadding(node, padding, ctx, varIndex) {
  if (padding == null) return;
  if (padding.inline != null) {
    applyScalar(node, "paddingLeft", padding.inline, ctx, varIndex);
    applyScalar(node, "paddingRight", padding.inline, ctx, varIndex);
  }
  if (padding.block != null) {
    applyScalar(node, "paddingTop", padding.block, ctx, varIndex);
    applyScalar(node, "paddingBottom", padding.block, ctx, varIndex);
  }
}

/** Build a SOLID paint, binding its colour to a Variable if a {token} is given. */
function buildPaint(spec, ctx, varIndex) {
  const paint = { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
  if (spec && spec.variable) {
    const name = tokenName(spec.variable, ctx);
    if (name) {
      const v = varIndex.get(name);
      if (v) return figma.variables.setBoundVariableForPaint(paint, "color", v);
      uiLog("Missing variable for paint: " + name, "warn");
    }
  }
  return paint;
}

/** Pick the first applicable paint from a list (first whose `appliesIf` evaluates truthy). */
function pickPaints(list, ctx, varIndex) {
  if (!list || list.length === 0) return [];
  for (const item of list) {
    if (!item.appliesIf || evaluateCondition(item.appliesIf, ctx)) {
      return [buildPaint(item, ctx, varIndex)];
    }
  }
  // Fall back to the first item if none matched.
  return [buildPaint(list[0], ctx, varIndex)];
}

async function buildStructure(spec, ctx, varIndex) {
  if (!spec) return null;
  if (spec.type === "frame") return await buildFrame(spec, ctx, varIndex);
  if (spec.type === "text") return await buildText(spec, ctx, varIndex);
  if (spec.type === "icon-slot") return buildIconSlot(spec, ctx);
  if (spec.type === "spinner") return buildSpinner(spec, ctx, varIndex);
  uiLog("Unknown node type: " + spec.type, "warn");
  return null;
}

async function buildFrame(spec, ctx, varIndex) {
  const frame = figma.createFrame();
  frame.name = spec.name || "Frame";
  frame.clipsContent = false;

  if (spec.autoLayout) {
    frame.layoutMode = spec.autoLayout.direction === "vertical" ? "VERTICAL" : "HORIZONTAL";
    frame.primaryAxisAlignItems = mapAlign(spec.autoLayout.primaryAlignment);
    frame.counterAxisAlignItems = mapAlign(spec.autoLayout.counterAlignment);
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    applyPadding(frame, spec.autoLayout.padding, ctx, varIndex);
    if (spec.autoLayout.gap != null) {
      applyScalar(frame, "itemSpacing", spec.autoLayout.gap, ctx, varIndex);
    }
  }

  if (spec.size) {
    // Figma's plugin API doesn't allow binding `width`/`height` directly, so
    // we resolve token references to literals through the variable index and
    // call resize(). For auto-layout containers, also flip primary/counter
    // sizing to FIXED so the explicit value is respected.
    let w = frame.width;
    let h = frame.height;
    let setW = false, setH = false;

    if (spec.size.height != null) {
      const interp = interpolate(spec.size.height, ctx);
      if (interp !== "auto" && interp !== "fill") {
        const n = resolveLiteral(spec.size.height, ctx, varIndex);
        if (n != null) { h = n; setH = true; }
      }
    }
    if (spec.size.width != null) {
      const interp = interpolate(spec.size.width, ctx);
      if (interp !== "auto" && interp !== "fill") {
        const n = resolveLiteral(spec.size.width, ctx, varIndex);
        if (n != null) { w = n; setW = true; }
      }
    }

    if (setW || setH) {
      try { frame.resize(w, h); } catch (e) { /* swallow — may fail on root frames */ }
      if (spec.autoLayout) {
        const horizontal = spec.autoLayout.direction !== "vertical";
        if (setW) frame[horizontal ? "primaryAxisSizingMode" : "counterAxisSizingMode"] = "FIXED";
        if (setH) frame[horizontal ? "counterAxisSizingMode" : "primaryAxisSizingMode"] = "FIXED";
      }
    }
  }

  frame.fills = pickPaints(spec.fills, ctx, varIndex);

  if (spec.strokes && spec.strokes.length) {
    frame.strokes = pickPaints(spec.strokes, ctx, varIndex);
    const weightInput = spec.strokes[0].weight;
    if (weightInput != null) applyScalar(frame, "strokeWeight", weightInput, ctx, varIndex);
    frame.strokeAlign = spec.strokes[0].position === "outside" ? "OUTSIDE" : "INSIDE";
  } else {
    frame.strokes = [];
  }

  if (spec.cornerRadius != null) {
    applyScalar(frame, "cornerRadius", spec.cornerRadius, ctx, varIndex);
  }

  if (spec.opacity && (spec.opacity.appliesIf == null || evaluateCondition(spec.opacity.appliesIf, ctx))) {
    // Resolve opacity to a literal float — Figma's setBoundVariable on the
    // `opacity` field treats a 0-1 Variable value as a 0-100 percentage,
    // making 0.6 render as 0.6% (essentially invisible). Reading the resolved
    // value from the Variable and assigning it literally avoids the bug.
    let lit = 0.6; // sensible default for disabled / loading
    if (spec.opacity.variable) {
      const name = tokenName(spec.opacity.variable, ctx);
      if (name) {
        const v = varIndex.get(name);
        if (v) {
          // Drill through alias chain to a literal float in the first mode.
          const firstMode = Object.keys(v.valuesByMode || {})[0];
          let resolved = v.valuesByMode && v.valuesByMode[firstMode];
          let safety = 8;
          while (resolved && typeof resolved === "object" && resolved.type === "VARIABLE_ALIAS" && safety-- > 0) {
            const target = figma.variables.getVariableById(resolved.id);
            if (!target) break;
            const tm = Object.keys(target.valuesByMode || {})[0];
            resolved = target.valuesByMode && target.valuesByMode[tm];
          }
          if (typeof resolved === "number" && Number.isFinite(resolved)) lit = resolved;
        }
      }
    }
    try { frame.opacity = lit; } catch (e) { /* swallow */ }
  }

  if (Array.isArray(spec.children)) {
    for (const childSpec of spec.children) {
      if (childSpec.appliesIf && !evaluateCondition(childSpec.appliesIf, ctx)) continue;
      const child = await buildStructure(childSpec, ctx, varIndex);
      if (child) frame.appendChild(child);
    }
  }

  return frame;
}

async function buildText(spec, ctx, varIndex) {
  // Resolve fontFamily and fontStyle via Variables (or fall back to defaults).
  // We pre-loaded all four Inter weights at plugin start; the explicit
  // loadFontAsync below covers the unlikely case of a different family.
  let family = "Inter";
  let style = "Medium";
  if (spec.fontFamily != null) {
    const f = resolveString(spec.fontFamily, ctx, varIndex);
    if (f) family = f;
  }
  if (spec.fontWeight != null) {
    const s = resolveString(spec.fontWeight, ctx, varIndex);
    if (s) style = s;
  }
  await figma.loadFontAsync({ family, style }).catch(() => {});

  const text = figma.createText();
  text.name = spec.name || "Text";
  text.fontName = { family, style };
  text.characters = interpolate(spec.content || "", ctx) || " ";

  text.fills = pickPaints(spec.fills, ctx, varIndex);

  // Bind every supported typography axis to its underlying Variable, so a
  // token change in source/ propagates through CSS, RN, and Figma uniformly.
  const tryBindRange = (field, input) => {
    const v = variableFor(input, ctx, varIndex);
    if (!v) return false;
    try {
      text.setRangeBoundVariable(0, text.characters.length, field, v);
      return true;
    } catch (e) {
      uiLog("Can't bind " + field + " on " + text.name + ": " + e.message, "warn");
      return false;
    }
  };

  if (spec.fontFamily != null) tryBindRange("fontFamily", spec.fontFamily);
  if (spec.fontWeight != null) tryBindRange("fontStyle",  spec.fontWeight);
  if (spec.fontSize   != null) {
    if (!tryBindRange("fontSize", spec.fontSize)) {
      const n = parseFloat(interpolate(spec.fontSize, ctx));
      if (Number.isFinite(n)) text.fontSize = n;
    }
  }
  if (spec.lineHeight != null) {
    if (!tryBindRange("lineHeight", spec.lineHeight)) {
      const n = parseFloat(interpolate(spec.lineHeight, ctx));
      if (Number.isFinite(n)) text.lineHeight = { value: n * 100, unit: "PERCENT" };
    }
  }

  // letterSpacing tokens are em-based strings — Figma's letterSpacing wants
  // a {value, unit} struct, not a bindable scalar. Apply as a literal for now.
  if (spec.letterSpacing != null) {
    const interp = interpolate(spec.letterSpacing, ctx);
    if (typeof interp === "string" && interp.endsWith("em")) {
      const n = parseFloat(interp);
      if (Number.isFinite(n)) text.letterSpacing = { value: n * 100, unit: "PERCENT" };
    } else {
      const n = parseFloat(interp);
      if (Number.isFinite(n)) text.letterSpacing = { value: n, unit: "PIXELS" };
    }
  }

  if (spec.textDecoration === "underline") text.textDecoration = "UNDERLINE";
  if (spec.textDecoration === "strikethrough") text.textDecoration = "STRIKETHROUGH";

  return text;
}

function buildIconSlot(spec, ctx) {
  // Placeholder rectangle. Real icons get swapped in by the designer
  // post-generation using Figma's Instance Swap.
  //
  // Spec sizes like "1em" can't be resolved here (no parent font size yet),
  // so anything that doesn't parse to a sensible pixel value falls back to 16
  // — the standard small-icon size.
  const SAFE_DEFAULT = 16;
  const resolveSize = (input) => {
    if (input == null) return SAFE_DEFAULT;
    const n = parseFloat(interpolate(String(input), ctx));
    return Number.isFinite(n) && n >= 4 ? n : SAFE_DEFAULT;
  };

  const rect = figma.createRectangle();
  rect.name = spec.name || "Icon";
  const w = resolveSize(spec.size && spec.size.width);
  const h = resolveSize(spec.size && spec.size.height);
  rect.resize(w, h);
  rect.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.2 }];
  rect.cornerRadius = 2;
  return rect;
}

function buildSpinner(spec, ctx, varIndex) {
  const ring = figma.createEllipse();
  ring.name = spec.name || "Spinner";
  ring.resize(16, 16);
  ring.fills = [];
  ring.strokes = pickPaints(spec.fills, ctx, varIndex);
  ring.strokeWeight = 2;
  ring.arcData = { startingAngle: 0, endingAngle: Math.PI * 1.5, innerRadius: 0 };
  return ring;
}

/* ---------- variant enumeration + overrides ---------- */

/** Cartesian product of variant properties. {a: [1,2], b: ['x','y']} → 4 contexts. */
function enumerateVariants(props) {
  const keys = Object.keys(props || {});
  if (keys.length === 0) return [{}];
  let out = [{}];
  for (const key of keys) {
    const next = [];
    for (const partial of out) {
      for (const value of props[key]) {
        next.push(Object.assign({}, partial, { [key]: value }));
      }
    }
    out = next;
  }
  return out;
}

/** Deep merge two objects. Arrays REPLACE (no concat). Primitives REPLACE.
 *  Used so a `variantOverride.structure.fills` cleanly replaces base fills,
 *  but `structure.autoLayout.padding.inline` overrides without losing siblings. */
function deepMerge(base, override) {
  if (override === undefined) return base;
  if (override === null) return null;
  if (Array.isArray(override)) return override;
  if (typeof override !== "object") return override;
  if (typeof base !== "object" || base === null || Array.isArray(base)) return Object.assign({}, override);
  const out = Object.assign({}, base);
  for (const k of Object.keys(override)) out[k] = deepMerge(base[k], override[k]);
  return out;
}

/** Apply every variantOverride whose `when` clause matches the context. */
function applyOverrides(structure, overrides, ctx) {
  if (!Array.isArray(overrides)) return structure;
  let merged = structure;
  for (const override of overrides) {
    const when = override.when || {};
    let matches = true;
    for (const [k, v] of Object.entries(when)) {
      if (ctx[k] !== v) { matches = false; break; }
    }
    if (matches && override.structure) merged = deepMerge(merged, override.structure);
  }
  return merged;
}

/** Encode a variant context as Figma's "prop=value, prop=value" component-name format. */
function variantName(ctx) {
  return Object.entries(ctx).map(([k, v]) => k + "=" + String(v)).join(", ");
}

/* ---------- generator entry points ---------- */

async function generateComponent(spec, varIndex) {
  uiLog("Generating " + spec.name + "…", "info");

  const pageName = spec.page || "Components / " + spec.name;
  let page = figma.root.children.find((p) => p.name === pageName);
  if (!page) {
    page = figma.createPage();
    page.name = pageName;
    uiLog("Created page: " + pageName, "muted");
  }
  if (typeof figma.setCurrentPageAsync === "function") {
    await figma.setCurrentPageAsync(page);
  } else {
    figma.currentPage = page;
  }

  // Clean up any previous run's component set / loose components named the
  // same — re-runs should be idempotent.
  for (const node of page.children.slice()) {
    if (node.name === spec.name && (node.type === "COMPONENT_SET" || node.type === "COMPONENT")) {
      node.remove();
    }
  }

  const variants = enumerateVariants(spec.variantProperties);
  uiLog("Building " + variants.length + " variant combination(s)…", "muted");

  const components = [];
  let i = 0;
  for (const ctx of variants) {
    const structure = applyOverrides(spec.structure, spec.variantOverrides, ctx);
    const root = await buildStructure(structure, ctx, varIndex);
    if (!root) continue;

    let component;
    if (typeof figma.createComponentFromNode === "function") {
      component = figma.createComponentFromNode(root);
    } else {
      component = figma.createComponent();
      component.appendChild(root);
    }
    component.name = variants.length === 1 ? spec.name : variantName(ctx);
    component.description = spec.description || "";
    components.push(component);

    i += 1;
    if (i % 50 === 0) uiLog("  · " + i + " / " + variants.length, "muted");
  }

  // Combine into a ComponentSet if there's more than one variant.
  let final;
  if (components.length > 1) {
    final = figma.combineAsVariants(components, page);
    final.name = spec.name;
    final.description = spec.description || "";
    // Lay them out in a grid so the canvas isn't a stack of overlapping nodes.
    final.layoutMode = "VERTICAL";
    final.itemSpacing = 24;
    final.paddingTop = 24; final.paddingBottom = 24;
    final.paddingLeft = 24; final.paddingRight = 24;
    final.primaryAxisSizingMode = "AUTO";
    final.counterAxisSizingMode = "AUTO";
  } else {
    final = components[0];
    page.appendChild(final);
  }

  uiLog("Done: " + spec.name + " (" + components.length + " variants)", "ok");
  return final;
}

async function generateComponents(specs) {
  const collection = figma.variables
    .getLocalVariableCollections()
    .find((c) => c.name === COLLECTION_NAME);
  if (!collection) {
    uiLog("Run 'Sync tokens' first — no '" + COLLECTION_NAME + "' Variable Collection found", "err");
    figma.ui.postMessage({ type: "generate-done" });
    return;
  }
  const varIndex = indexVariables(collection);

  for (const spec of specs) {
    try {
      const component = await generateComponent(spec, varIndex);
      if (component) figma.viewport.scrollAndZoomIntoView([component]);
    } catch (e) {
      uiLog("Error generating " + spec.name + ": " + (e && e.message ? e.message : String(e)), "err");
    }
  }
  uiLog("Generation done.", "ok");
  figma.ui.postMessage({ type: "generate-done" });
}

/* ============================================================
   TEXT STYLES
   Creates one Figma Text Style per typography role with every
   supported axis bound to the corresponding Variable. Designers
   apply "Body M" and get all five properties live-tied to tokens.
   ============================================================ */

const TYPOGRAPHY_ROLES = [
  "display-l", "display-m", "display-s",
  "heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6",
  "body-l", "body-m", "body-s",
  "label-l", "label-m", "label-s",
  "caption", "code", "overline"
];

/** "display-l" → "Display L", "heading-1" → "Heading 1", "body-m" → "Body M". */
function roleDisplayName(role) {
  return role.split("-").map((part) => {
    if (/^\d+$/.test(part)) return part;
    if (part.length === 1) return part.toUpperCase();
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join(" ");
}

async function syncTextStyles() {
  uiLog("Starting Text Styles sync…", "info");

  const collection = figma.variables
    .getLocalVariableCollections()
    .find((c) => c.name === COLLECTION_NAME);
  if (!collection) {
    uiLog("Run 'Sync tokens' first — no '" + COLLECTION_NAME + "' collection found", "err");
    figma.ui.postMessage({ type: "sync-text-styles-done" });
    return;
  }
  const varIndex = indexVariables(collection);

  const existingStyles = figma.getLocalTextStyles();

  let created = 0, updated = 0, skipped = 0;

  for (const role of TYPOGRAPHY_ROLES) {
    const styleName = "Typography/" + roleDisplayName(role);
    const sizeVar = varIndex.get("text/" + role + "/size");
    const lineVar = varIndex.get("text/" + role + "/line");
    const weightVar = varIndex.get("text/" + role + "/weight");
    // `code` role has its own fontFamily token (mono); everything else uses sans.
    const familyVar = role === "code"
      ? (varIndex.get("text/code/family") || varIndex.get("font-family/mono"))
      : varIndex.get("font-family/sans");

    if (!sizeVar || !weightVar || !familyVar) {
      uiLog("Skip " + styleName + " (missing Variables — re-run Sync tokens)", "warn");
      skipped += 1;
      continue;
    }

    // Resolve to literals up-front so we can load the right font before
    // creating / mutating the style. After loading, we set the bound vars.
    const family = (typeof resolveVariableValue(familyVar) === "string" ? resolveVariableValue(familyVar) : "Inter") || "Inter";
    const styleStr = (typeof resolveVariableValue(weightVar) === "string" ? resolveVariableValue(weightVar) : "Medium") || "Medium";
    const sizePx = (typeof resolveVariableValue(sizeVar) === "number" ? resolveVariableValue(sizeVar) : 14) || 14;

    await figma.loadFontAsync({ family, style: styleStr }).catch(() => {});

    let textStyle = existingStyles.find((s) => s.name === styleName);
    const isNew = !textStyle;
    if (!textStyle) {
      textStyle = figma.createTextStyle();
      textStyle.name = styleName;
    }

    // Set literal defaults first so the style has a sensible static state.
    try { textStyle.fontName = { family, style: styleStr }; } catch (e) {}
    try { textStyle.fontSize = sizePx; } catch (e) {}

    // Bind the underlying Variables. Wrapped individually because not every
    // Figma version exposes every binding; failures degrade gracefully.
    try { textStyle.setBoundVariable("fontFamily", familyVar); } catch (e) { uiLog("  · " + styleName + " fontFamily binding failed: " + e.message, "warn"); }
    try { textStyle.setBoundVariable("fontStyle",  weightVar); } catch (e) { uiLog("  · " + styleName + " fontStyle binding failed: " + e.message, "warn"); }
    try { textStyle.setBoundVariable("fontSize",   sizeVar);   } catch (e) { uiLog("  · " + styleName + " fontSize binding failed: "  + e.message, "warn"); }
    if (lineVar) {
      try { textStyle.setBoundVariable("lineHeight", lineVar); } catch (e) { uiLog("  · " + styleName + " lineHeight binding failed: " + e.message, "warn"); }
    }

    isNew ? (created += 1) : (updated += 1);
  }

  uiLog("Text Styles: " + created + " created, " + updated + " updated, " + skipped + " skipped.", skipped ? "warn" : "ok");
  figma.ui.postMessage({ type: "sync-text-styles-done" });
}

/* ---------- message router ---------- */

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === "sync-tokens") {
      syncTokens(msg.data);
    } else if (msg.type === "sync-text-styles") {
      await fontsReady;
      await syncTextStyles();
    } else if (msg.type === "generate-components") {
      await fontsReady;
      await generateComponents(msg.specs);
    } else {
      uiLog("Unknown message: " + msg.type, "warn");
    }
  } catch (e) {
    uiLog("Plugin error: " + (e && e.message ? e.message : String(e)), "err");
    uiDone();
  }
};

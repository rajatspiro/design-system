/**
 * Design System Sync — main plugin thread.
 *
 * Receives messages from ui.html and applies them to the Figma document via
 * the figma.* API. The UI does all the network fetching; we just consume the
 * parsed JSON.
 */

figma.showUI(__html__, { width: 360, height: 480, themeColors: true });

const COLLECTION_NAME = "Design System";

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

/** Create-or-fetch a variable by name. Type is set on creation only — if a
 *  pre-existing variable has the wrong type we leave it and warn. */
function ensureVariable(name, type, collection, varIndex) {
  let v = varIndex.get(name);
  if (v) {
    if (v.resolvedType !== type) {
      uiLog("Type mismatch on " + name + " (expected " + type + ", got " + v.resolvedType + "), skipping", "warn");
      return null;
    }
    return v;
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

/* ---------- message router ---------- */

figma.ui.onmessage = (msg) => {
  try {
    if (msg.type === "sync-tokens") {
      syncTokens(msg.data);
    } else {
      uiLog("Unknown message: " + msg.type, "warn");
    }
  } catch (e) {
    uiLog("Plugin error: " + (e && e.message ? e.message : String(e)), "err");
    uiDone();
  }
};

# Component specs

Declarative JSON descriptions of each component, consumed by the **figma-plugin** to construct Figma components programmatically. One file per component, mirroring `src/components/<Name>/<Name>.md` but in a shape a machine can act on.

## File naming

`<ComponentName>.json` — PascalCase matching the React component name. The Figma plugin maps `Button.json` → a Figma Component named `Button`.

## Spec shape

```ts
{
  "$schema": "design-system.component.v1",
  "name": "Button",                 // PascalCase
  "description": "…",                // one-line, ends up in the Figma component description
  "page": "Components / Button",     // Figma library page where the master lives

  "variantProperties": {
    "variant": ["primary", "secondary", …],     // string variants
    "size": ["xs", "sm", "md", "lg", "xl"],
    "state": ["default", "hover", "active", "focus-visible", "disabled", "loading"],
    "iconOnly": [false, true],                  // boolean variants
    "fullWidth": [false, true]
  },

  "structure": {                     // The visual structure of one instance
    "type": "frame",
    "autoLayout": {
      "direction": "horizontal",
      "padding": { "inline": "{button/padding-inline/${size}}", "block": 0 },
      "gap": "{button/icon-gap}",
      "primaryAlignment": "center",
      "counterAlignment": "center"
    },
    "size": {
      "height": "{button/height/${size}}",
      "width": "${iconOnly ? height : auto}"    // expression interpolation
    },
    "fills": [{ "type": "solid", "variable": "{button/${variant}/bg}" }],
    "strokes": [{ "variable": "{button/${variant}/border}", "weight": "{button/border-width}" }],
    "cornerRadius": "{button/radius}",
    "effects": [
      {
        "type": "drop-shadow",
        "appliesIf": "${state === 'focus-visible'}",
        "variable": "{button/focus-ring}"
      }
    ],
    "opacity": { "appliesIf": "${state === 'disabled' || state === 'loading'}", "variable": "{button/disabled-opacity}" },
    "children": [
      {
        "type": "icon-slot",
        "name": "Leading icon",
        "appliesIf": "${!iconOnly}",
        "size": "1em"
      },
      {
        "type": "text",
        "name": "Label",
        "content": "Button",
        "appliesIf": "${!iconOnly}",
        "fills": [{ "variable": "{button/${variant}/fg}" }],
        "fontSize": "{button/font-size/${size}}",
        "fontWeight": "{button/font-weight}",
        "letterSpacing": "{button/letter-spacing}"
      },
      {
        "type": "icon-slot",
        "name": "Trailing icon",
        "appliesIf": "${!iconOnly}",
        "size": "1em"
      }
    ]
  },

  "variantOverrides": [              // Per-combination tweaks the structure can't express
    {
      "when": { "state": "loading" },
      "structure": {
        "children": [
          { "type": "spinner", "name": "Spinner", "replaces": "Leading icon" }
        ]
      }
    },
    {
      "when": { "variant": "link" },
      "structure": {
        "size": { "height": "auto" },
        "autoLayout": { "padding": { "inline": 0, "block": 0 } },
        "fills": []
      }
    }
  ]
}
```

## Field reference

### `variantProperties`

A flat map from property name → list of values. The plugin generates the Cartesian product as variant combinations (Button = 6 × 5 × 6 × 2 × 2 = 720 combos — Figma handles this fine).

Property names with boolean arrays become Boolean variant properties in Figma.

### `structure`

The visual tree of one instance. Recursive; every node is either a `frame`, `text`, `icon-slot` (rectangular slot designers swap with real icons), `spinner`, or `divider`.

Token references use `{path/to/token}` matching the names in `tokens.figma-variables.json`. Variant interpolation uses `${propertyName}`. The plugin resolves these at construction time.

### `variantOverrides`

When a property combination needs to deviate from the base structure (loading state replaces leading icon with spinner; link variant has no padding), declare it here. The `when` clause matches variant property values; `structure` overrides are merged in.

### `appliesIf`

Conditional visibility/property. Plain JS-like expression evaluated by the plugin with the variant values as the scope. Use sparingly — most differences are better expressed via `variantOverrides`.

## Build order (per `figma/COMPONENT-CHECKLIST.md`)

1. Button *(first; pattern shakedown)*
2. Field, TextInput
3. Checkbox, Radio
4. Badge, Tag
5. Toast
6. Tabs
7. Select, MultiSelect, Menu
8. NumericInput, Textarea
9. ProgressBar
10. ButtonGroup *(composition; trivial)*

Once the Figma plugin renders Button correctly from `Button.json`, copy the pattern for each subsequent component.

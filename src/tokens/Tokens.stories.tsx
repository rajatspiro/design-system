import React from "react";
import type { Meta } from "@storybook/react-webpack5";
import { colors } from "./colors.ts";
import { spacing } from "./spacing.ts";
import { typography } from "./typography.ts";

const meta: Meta = {
  title: "Design System/Tokens (legacy)",
  parameters: {
    docs: {
      description: {
        component:
          "Legacy TS token gallery (preserved for reference). New code consumes the CSS variables in `tokens/{primitives,semantics,component-tokens}.css` — see the **Design System / CSS Tokens** stories.",
      },
    },
    chromatic: { disableSnapshot: false },
  },
};
export default meta;

/* ---------- Shared renderers ---------- */

const renderCard = (name: string, value: string) => (
  <div
    key={name}
    style={{
      width: 160,
      border: "1px solid #eee",
      borderRadius: 8,
      overflow: "hidden",
      background: "#fff",
    }}
  >
    <div style={{ height: 80, backgroundColor: value }} />
    <div style={{ padding: 10 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{name}</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
    </div>
  </div>
);

/** Render any primitive object as `key: value` rows. Used by Spacing & Typography. */
const renderObject = (obj: Record<string, unknown>, parentKey = ""): React.ReactNode[] => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (value && typeof value === "object") {
      return renderObject(value as Record<string, unknown>, fullKey);
    }
    return [
      <div
        key={fullKey}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "6px 0",
          borderBottom: "1px solid #f1f1f1",
        }}
      >
        <div style={{ width: 240, fontFamily: "monospace", fontSize: 13 }}>{fullKey}</div>
        <div style={{ fontSize: 13, color: "#444" }}>{String(value)}</div>
      </div>,
    ];
  });
};

/* ---------- COLORS ---------- */

export const Colors = () => {
  const renderNested = (group: any) =>
    Object.entries(group).flatMap(([key, value]) => {
      if (typeof value === "object") {
        return Object.entries(value as Record<string, string>).map(([sub, v]) =>
          renderCard(`${key}.${sub}`, v)
        );
      }
      return [];
    });

  const renderFlat = (group: any) =>
    Object.entries(group).map(([k, v]) => renderCard(k, v as string));

  return (
    <div style={{ padding: 24 }}>
      <h2>Color Tokens (legacy)</h2>

      <h3>Button</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {renderNested(colors.button)}
      </div>

      <h3 style={{ marginTop: 30 }}>Text</h3>
      <div style={{ display: "flex", gap: 16 }}>{renderFlat(colors.text)}</div>

      <h3 style={{ marginTop: 30 }}>Border</h3>
      <div style={{ display: "flex", gap: 16 }}>{renderFlat(colors.border)}</div>
    </div>
  );
};

/* ---------- SPACING ---------- */

export const Spacing = () => (
  <div style={{ padding: 20 }}>
    <h2>Spacing</h2>
    {renderObject(spacing)}
    <div style={{ marginTop: 24 }}>
      {Object.entries(spacing).map(([key, value]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
          <div style={{ width: 60, fontFamily: "monospace", fontSize: 12 }}>{key}</div>
          <div style={{ height: 12, background: "#3C61DD", width: value as string }} />
          <div style={{ fontSize: 12, color: "#666" }}>{value as string}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- TYPOGRAPHY ---------- */

export const Typography = () => (
  <div style={{ padding: 20 }}>
    <h2>Typography</h2>
    <div style={{ marginBottom: 20 }}>
      <p
        style={{
          fontSize: typography.button.fontSize,
          fontWeight: typography.button.fontWeight as any,
        }}
      >
        Button Typography Preview
      </p>
    </div>
    {renderObject(typography)}
  </div>
);

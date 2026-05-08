import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

const meta: Meta = {
  title: "Design System/CSS Tokens",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Live preview of the three-tier token system. Toggle theme in the toolbar to see semantic tokens swap.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

/* ---------- Primitives: colour scales ---------- */

const ColorRamp = ({ family, scale }: { family: string; scale: string[] }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, textTransform: "capitalize" }}>{family}</div>
    <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid var(--color-border-subtle)" }}>
      {scale.map((step) => (
        <div
          key={step}
          style={{
            flex: 1,
            height: 56,
            background: `var(--color-${family}-${step})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 6,
            fontSize: 10,
            color: Number(step) >= 500 ? "white" : "black",
            fontFamily: "var(--font-family-mono)",
          }}
        >
          {step}
        </div>
      ))}
    </div>
  </div>
);

const SCALE = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

export const ColorPrimitives: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Color primitives</h2>
      {["neutral", "brand", "info", "success", "warning", "danger"].map((f) => (
        <ColorRamp key={f} family={f} scale={SCALE} />
      ))}
    </div>
  ),
};

/* ---------- Semantic colors ---------- */

const SemanticSwatch = ({ name, token }: { name: string; token: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 12px",
      borderRadius: 6,
      border: "1px solid var(--color-border-subtle)",
    }}
  >
    <div style={{ inlineSize: 32, blockSize: 32, borderRadius: 6, background: `var(${token})`, border: "1px solid var(--color-border-subtle)" }} />
    <div>
      <div style={{ fontSize: 12, fontFamily: "var(--font-family-mono)" }}>{token}</div>
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{name}</div>
    </div>
  </div>
);

export const SemanticColors: Story = {
  render: () => {
    const groups: Record<string, string[]> = {
      Surface: [
        "--color-surface-default", "--color-surface-raised", "--color-surface-sunken",
        "--color-surface-overlay", "--color-surface-inverse", "--color-surface-brand",
        "--color-surface-info-subtle", "--color-surface-success-subtle",
        "--color-surface-warning-subtle", "--color-surface-danger-subtle",
      ],
      Text: [
        "--color-text-primary", "--color-text-secondary", "--color-text-tertiary",
        "--color-text-muted", "--color-text-disabled", "--color-text-inverse",
        "--color-text-on-brand", "--color-text-link", "--color-text-success",
        "--color-text-warning", "--color-text-danger", "--color-text-info",
      ],
      Border: [
        "--color-border-default", "--color-border-subtle", "--color-border-strong",
        "--color-border-focus", "--color-border-disabled",
        "--color-border-error", "--color-border-success",
        "--color-border-warning", "--color-border-info",
      ],
      "Action — primary": ["--color-action-primary-bg", "--color-action-primary-bg-hover", "--color-action-primary-bg-active", "--color-action-primary-bg-disabled", "--color-action-primary-fg"],
      "Action — secondary": ["--color-action-secondary-bg", "--color-action-secondary-bg-hover", "--color-action-secondary-bg-active", "--color-action-secondary-bg-disabled", "--color-action-secondary-fg"],
      "Action — tertiary": ["--color-action-tertiary-bg", "--color-action-tertiary-bg-hover", "--color-action-tertiary-bg-active", "--color-action-tertiary-bg-disabled", "--color-action-tertiary-fg"],
      "Action — destructive": ["--color-action-destructive-bg", "--color-action-destructive-bg-hover", "--color-action-destructive-bg-active", "--color-action-destructive-bg-disabled", "--color-action-destructive-fg"],
      "Feedback — info": ["--color-feedback-info-bg", "--color-feedback-info-border", "--color-feedback-info-fg", "--color-feedback-info-icon"],
      "Feedback — success": ["--color-feedback-success-bg", "--color-feedback-success-border", "--color-feedback-success-fg", "--color-feedback-success-icon"],
      "Feedback — warning": ["--color-feedback-warning-bg", "--color-feedback-warning-border", "--color-feedback-warning-fg", "--color-feedback-warning-icon"],
      "Feedback — danger": ["--color-feedback-danger-bg", "--color-feedback-danger-border", "--color-feedback-danger-fg", "--color-feedback-danger-icon"],
    };

    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Semantic colors</h2>
        <p style={{ color: "var(--color-text-tertiary)", marginTop: 0 }}>
          Toggle the Theme toolbar to see how dark mode swaps the same names.
        </p>
        {Object.entries(groups).map(([title, tokens]) => (
          <div key={title} style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 14, marginBottom: 12 }}>{title}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
              {tokens.map((t) => <SemanticSwatch key={t} name={title} token={t} />)}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/* ---------- Typography ---------- */

export const Typography: Story = {
  render: () => {
    const roles = [
      ["display-l", "The quick brown fox"],
      ["display-m", "The quick brown fox"],
      ["display-s", "The quick brown fox"],
      ["heading-1", "The quick brown fox"],
      ["heading-2", "The quick brown fox"],
      ["heading-3", "The quick brown fox"],
      ["heading-4", "The quick brown fox"],
      ["heading-5", "The quick brown fox"],
      ["heading-6", "The quick brown fox"],
      ["body-l", "The quick brown fox jumps over the lazy dog."],
      ["body-m", "The quick brown fox jumps over the lazy dog."],
      ["body-s", "The quick brown fox jumps over the lazy dog."],
      ["label-l", "Label text"],
      ["label-m", "Label text"],
      ["label-s", "Label text"],
      ["caption", "Caption / supporting text"],
      ["overline", "OVERLINE"],
    ];
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Typography roles</h2>
        {roles.map(([role, sample]) => (
          <div key={role} style={{ display: "flex", alignItems: "baseline", gap: 24, padding: "12px 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
            <div style={{ width: 120, fontFamily: "var(--font-family-mono)", fontSize: 12, color: "var(--color-text-tertiary)" }}>{role}</div>
            <div
              style={{
                fontSize: `var(--text-${role}-size)`,
                lineHeight: `var(--text-${role}-line)`,
                fontWeight: `var(--text-${role}-weight)`,
                letterSpacing: role === "overline" ? "var(--letter-spacing-wider)" : undefined,
                fontFamily: role === "code" ? "var(--font-family-mono)" : "var(--font-family-sans)",
              }}
            >
              {sample}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/* ---------- Spacing ---------- */

export const SpacingScale: Story = {
  render: () => {
    const tokens = ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24", "32"];
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Spacing</h2>
        {tokens.map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
            <div style={{ width: 80, fontFamily: "var(--font-family-mono)", fontSize: 12 }}>--space-{t}</div>
            <div style={{ height: 12, background: "var(--color-brand-700)", width: `var(--space-${t})` }} />
          </div>
        ))}
      </div>
    );
  },
};

/* ---------- Radius / Shadow ---------- */

export const RadiusAndShadow: Story = {
  render: () => {
    const radii = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "full"];
    const shadows = ["0", "1", "2", "3", "4", "5"];
    const Tile = ({ style, label }: any) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ width: 80, height: 80, background: "var(--color-surface-default)", border: "1px solid var(--color-border-subtle)", ...style }} />
        <div style={{ fontFamily: "var(--font-family-mono)", fontSize: 11 }}>{label}</div>
      </div>
    );
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Radius</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {radii.map((r) => <Tile key={r} style={{ borderRadius: `var(--radius-${r})` }} label={`--radius-${r}`} />)}
        </div>
        <h2 style={{ marginTop: 32 }}>Shadow</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {shadows.map((s) => <Tile key={s} style={{ boxShadow: `var(--shadow-${s})`, borderRadius: 8 }} label={`--shadow-${s}`} />)}
        </div>
      </div>
    );
  },
};

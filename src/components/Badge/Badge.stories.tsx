import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Badge } from "./Badge.tsx";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Badge" },
  argTypes: {
    variant: { control: "select", options: ["solid", "soft", "outline", "dot"] },
    tone:    { control: "select", options: ["neutral", "brand", "info", "success", "warning", "danger"] },
    size:    { control: "select", options: ["xs", "sm", "md"] },
  },
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Solid: Story = { args: { variant: "solid", tone: "brand" } };
export const Outline: Story = { args: { variant: "outline", tone: "warning" } };
export const Count: Story = { args: { count: 12, tone: "danger", variant: "solid" } };
export const Dot: Story = { args: { variant: "dot", tone: "success", "aria-label": "Online" } };

export const ToneMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const tones = ["neutral", "brand", "info", "success", "warning", "danger"] as const;
    const variants = ["solid", "soft", "outline"] as const;
    return (
      <div style={{ display: "grid", gridTemplateColumns: `100px repeat(${tones.length}, auto)`, gap: 12, alignItems: "center" }}>
        <div />
        {tones.map((t) => <div key={t} style={{ fontFamily: "var(--font-family-mono)", fontSize: 11 }}>{t}</div>)}
        {variants.map((v) => (
          <React.Fragment key={v}>
            <div style={{ fontFamily: "var(--font-family-mono)", fontSize: 12 }}>{v}</div>
            {tones.map((t) => <Badge key={t} variant={v} tone={t}>Label</Badge>)}
          </React.Fragment>
        ))}
      </div>
    );
  },
};

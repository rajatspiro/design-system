import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { ProgressBar } from "./ProgressBar.tsx";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  argTypes: {
    shape: { control: "select", options: ["linear", "circular"] },
    size:  { control: "select", options: ["xs", "sm", "md", "lg"] },
    tone:  { control: "select", options: ["brand", "success", "warning", "danger"] },
  },
  decorators: [(S) => <div style={{ maxWidth: 480 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = { args: { value: 60 } };
export const WithLabel: Story = { args: { value: 60, label: "Uploading", showPercentage: true } };
export const Indeterminate: Story = {
  args: { label: "Crunching numbers" },
  parameters: { chromatic: { disableSnapshot: true } }, // animated
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["xs", "sm", "md", "lg"] as const).map((s) => (
        <ProgressBar key={s} value={45} size={s} label={`Size ${s}`} showPercentage />
      ))}
    </div>
  ),
};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["brand", "success", "warning", "danger"] as const).map((t) => (
        <ProgressBar key={t} value={70} tone={t} label={t} showPercentage />
      ))}
    </div>
  ),
};

export const Segmented: Story = {
  args: { value: 60, segments: 5, label: "Step 3 of 5" },
};

export const Circular: Story = {
  args: { shape: "circular", value: 75, showPercentage: true, "aria-label": "Loading" },
};

export const CircularIndeterminate: Story = {
  args: { shape: "circular", "aria-label": "Loading" },
  parameters: { chromatic: { disableSnapshot: true } },
};

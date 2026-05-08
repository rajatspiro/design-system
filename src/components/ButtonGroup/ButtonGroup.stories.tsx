import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { ButtonGroup } from "./ButtonGroup.tsx";
import { Button } from "../Button/Button.tsx";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  args: { "aria-label": "Text alignment" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Left</Button>
      <Button variant="secondary">Center</Button>
      <Button variant="secondary">Right</Button>
    </ButtonGroup>
  ),
};

export const Primary: Story = {
  args: { "aria-label": "Save options", variant: "primary" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Save</Button>
      <Button iconOnly aria-label="More">▾</Button>
    </ButtonGroup>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["sm", "md", "lg"] as const).map((s) => (
        <ButtonGroup key={s} aria-label={`Size ${s}`} size={s} variant="secondary">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

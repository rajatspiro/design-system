import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Button } from "./Button.tsx";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: { children: "Save changes" },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "destructive", "destructive-secondary", "link"],
    },
    size: { control: { type: "select" }, options: ["xs", "sm", "md", "lg", "xl"] },
    iconOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Tertiary: Story = { args: { variant: "tertiary" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete account" } };
export const DestructiveSecondary: Story = {
  name: "Destructive (secondary)",
  args: { variant: "destructive-secondary", children: "Delete account" },
};
export const Link: Story = { args: { variant: "link", children: "Read more" } };

export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };

export const WithIcons: Story = {
  args: {
    leadingIcon: "★",
    trailingIcon: "→",
    children: "Continue",
  },
};

export const IconOnly: Story = {
  args: { iconOnly: true, leadingIcon: "★", "aria-label": "Favourite" },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
};

/** Dense matrix — every variant × every size. Useful for visual diff. */
export const Matrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const variants = ["primary", "secondary", "tertiary", "destructive", "destructive-secondary", "link"] as const;
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
    return (
      <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${sizes.length}, auto)`, gap: 12, alignItems: "center" }}>
        <div />
        {sizes.map((s) => <div key={s} style={{ fontSize: 11, fontFamily: "var(--font-family-mono)", color: "var(--color-text-tertiary)" }}>{s}</div>)}
        {variants.map((v) => (
          <React.Fragment key={v}>
            <div style={{ fontSize: 12, fontFamily: "var(--font-family-mono)" }}>{v}</div>
            {sizes.map((s) => <Button key={s} variant={v} size={s}>Button</Button>)}
          </React.Fragment>
        ))}
      </div>
    );
  },
};

/** Every state for the primary variant. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button>Default</Button>
      <Button className="pseudo-hover" data-pseudo="hover">Hover (use Storybook addon)</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
};

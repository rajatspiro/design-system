import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Tabs } from "./Tabs.tsx";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "select", options: ["underline", "pill", "segmented", "enclosed"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

const items = [
  { id: "overview", label: "Overview", content: <p>Account at a glance.</p> },
  { id: "billing",  label: "Billing",  content: <p>Manage payment methods.</p> },
  { id: "team",     label: "Team",     badge: 4, content: <p>Invite & manage teammates.</p> },
  { id: "audit",    label: "Audit log", content: <p>Recent activity.</p> },
  { id: "danger",   label: "Danger zone", disabled: true, content: <p /> },
];

export const Underline: Story = { args: { items, "aria-label": "Settings", variant: "underline" } };
export const Pill: Story = { args: { items, "aria-label": "Settings", variant: "pill" } };
export const Segmented: Story = {
  args: {
    items: [
      { id: "day", label: "Day", content: <p>Day view</p> },
      { id: "week", label: "Week", content: <p>Week view</p> },
      { id: "month", label: "Month", content: <p>Month view</p> },
    ],
    "aria-label": "Calendar range",
    variant: "segmented",
  },
};
export const Enclosed: Story = { args: { items, "aria-label": "Settings", variant: "enclosed" } };

export const Vertical: Story = {
  args: { items, "aria-label": "Settings", variant: "underline", orientation: "vertical" },
  decorators: [(S) => <div style={{ height: 240 }}><S /></div>],
};

export const FullWidth: Story = {
  args: { items: items.slice(0, 3), "aria-label": "Tabs", variant: "underline", fullWidth: true },
};

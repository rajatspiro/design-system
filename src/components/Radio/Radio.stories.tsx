import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Radio, RadioGroup } from "./Radio.tsx";
import { Field } from "../Field/Field.tsx";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

const options = [
  { value: "free", label: "Free", description: "$0 / mo" },
  { value: "pro", label: "Pro", description: "$10 / mo" },
  { value: "team", label: "Team", description: "$30 / mo / seat" },
];

export const Single: Story = {
  render: () => <Radio name="x" label="I agree to the terms" />,
};

export const Vertical: Story = {
  render: () => (
    <Field label="Plan">
      <RadioGroup name="plan" defaultValue="pro" options={options} />
    </Field>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Field label="Notifications">
      <RadioGroup
        name="notif"
        defaultValue="all"
        orientation="horizontal"
        options={[
          { value: "all", label: "All" },
          { value: "mentions", label: "Mentions" },
          { value: "none", label: "None" },
        ]}
      />
    </Field>
  ),
};

export const DisabledOption: Story = {
  render: () => (
    <Field label="Plan">
      <RadioGroup
        name="plan2"
        defaultValue="free"
        options={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
          { value: "enterprise", label: "Enterprise", disabled: true, description: "Contact sales" },
        ]}
      />
    </Field>
  ),
};

import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Select } from "./Select.tsx";
import { Field } from "../Field/Field.tsx";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 320 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "au", label: "Australia" },
  { value: "ng", label: "Nigeria", disabled: true },
];

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<string | null>(null);
    return (
      <Field label="Country">
        <Select options={options} value={v} onChange={setV} />
      </Field>
    );
  },
};

export const WithDescriptions: Story = {
  render: () => (
    <Field label="Plan">
      <Select
        defaultValue="pro"
        options={[
          { value: "free", label: "Free", description: "$0 / mo" },
          { value: "pro",  label: "Pro",  description: "$10 / mo" },
          { value: "team", label: "Team", description: "$30 / mo / seat" },
        ]}
      />
    </Field>
  ),
};

export const Searchable: Story = {
  render: () => (
    <Field label="Country">
      <Select options={options} searchable />
    </Field>
  ),
};

export const Error: Story = {
  render: () => (
    <Field label="Country" errorText="Please pick one.">
      <Select options={options} />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field label="Country" disabled>
      <Select options={options} defaultValue="us" />
    </Field>
  ),
};

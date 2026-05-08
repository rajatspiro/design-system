import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { MultiSelect } from "./MultiSelect.tsx";
import { Field } from "../Field/Field.tsx";

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof MultiSelect>;

const opts = [
  { value: "design", label: "Design" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "data", label: "Data" },
  { value: "ml", label: "ML" },
  { value: "infra", label: "Infrastructure" },
  { value: "qa", label: "QA" },
];

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<string[]>(["frontend", "design"]);
    return (
      <Field label="Skills">
        <MultiSelect options={opts} value={v} onChange={setV} />
      </Field>
    );
  },
};

export const WithSelectAll: Story = {
  render: () => (
    <Field label="Skills">
      <MultiSelect options={opts} selectAll defaultValue={[]} />
    </Field>
  ),
};

export const Empty: Story = {
  render: () => (
    <Field label="Skills" helperText="Search or pick from the list.">
      <MultiSelect options={opts} />
    </Field>
  ),
};

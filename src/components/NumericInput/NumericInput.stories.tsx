import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { NumericInput } from "./NumericInput.tsx";
import { Field } from "../Field/Field.tsx";

const meta: Meta<typeof NumericInput> = {
  title: "Components/NumericInput",
  component: NumericInput,
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 240 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof NumericInput>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<number | null>(0);
    return (
      <Field label="Quantity">
        <NumericInput value={v} onChange={setV} min={0} max={99} />
      </Field>
    );
  },
};

export const WithUnit: Story = {
  render: () => (
    <Field label="Weight">
      <NumericInput defaultValue={75} unit="kg" min={0} max={300} />
    </Field>
  ),
};

export const FormattedDisplay: Story = {
  render: () => (
    <Field label="Population">
      <NumericInput defaultValue={1234567} step={1000} />
    </Field>
  ),
};

export const MinMaxClamping: Story = {
  render: () => (
    <Field label="Temperature (0–100)" helperText="Try setting outside the range — it clamps.">
      <NumericInput defaultValue={50} min={0} max={100} />
    </Field>
  ),
};

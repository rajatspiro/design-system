import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Checkbox, CheckboxGroup } from "./Checkbox.tsx";
import { Field } from "../Field/Field.tsx";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Single: Story = { args: { label: "Email me about new features" } };
export const Checked: Story = { args: { label: "Subscribed", defaultChecked: true } };
export const Indeterminate: Story = { args: { label: "Select all", indeterminate: true } };
export const Disabled: Story = { args: { label: "Disabled", disabled: true } };

export const Group: Story = {
  render: () => (
    <Field label="Topics">
      <CheckboxGroup
        defaultValue={["product"]}
        options={[
          { value: "product", label: "Product updates" },
          { value: "engineering", label: "Engineering blog" },
          { value: "news", label: "Company news" },
          { value: "events", label: "Events", disabled: true, description: "Coming soon" },
        ]}
      />
    </Field>
  ),
};

export const SelectAllPattern: Story = {
  render: () => {
    const all = ["a", "b", "c", "d"];
    const [picked, setPicked] = useState<string[]>(["a", "b"]);
    const allChecked = picked.length === all.length;
    const indeterminate = picked.length > 0 && !allChecked;

    return (
      <Field label="Files">
        <Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={() => setPicked(allChecked ? [] : all)}
        />
        <div style={{ paddingInlineStart: 24, marginTop: 8 }}>
          <CheckboxGroup
            value={picked}
            onChange={setPicked}
            options={all.map((v) => ({ value: v, label: `File ${v.toUpperCase()}` }))}
          />
        </div>
      </Field>
    );
  },
};

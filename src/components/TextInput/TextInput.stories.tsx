import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { TextInput } from "./TextInput.tsx";
import { Field } from "../Field/Field.tsx";

const meta: Meta<typeof TextInput> = {
  title: "Components/TextInput",
  component: TextInput,
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = { args: { placeholder: "Type something" } };

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <TextInput size="sm" placeholder="Small" />
      <TextInput size="md" placeholder="Medium" />
      <TextInput size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithLeadingIcon: Story = { args: { leadingIcon: "🔍", placeholder: "Search" } };
export const WithTrailingIcon: Story = { args: { trailingIcon: "⌘K", placeholder: "Search" } };
export const WithPrefixSuffix: Story = { args: { prefix: "https://", suffix: ".com", placeholder: "yoursite" } };
export const Clearable: Story = { args: { clearable: true, defaultValue: "Hello" } };

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Field label="Default"><TextInput placeholder="Empty" /></Field>
      <Field label="With value"><TextInput defaultValue="Some value" /></Field>
      <Field label="Disabled" disabled><TextInput defaultValue="Disabled" /></Field>
      <Field label="Read-only"><TextInput readOnly defaultValue="Read-only" /></Field>
      <Field label="Error" errorText="Required"><TextInput /></Field>
      <Field label="Success" successText="Looks good!"><TextInput defaultValue="hello" /></Field>
    </div>
  ),
};

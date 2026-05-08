import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Field } from "./Field.tsx";
import { TextInput } from "../TextInput/TextInput.tsx";

const meta: Meta<typeof Field> = {
  title: "Components/Field",
  component: Field,
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Field>;

export const Basic: Story = {
  args: { label: "Email" },
  render: (args) => <Field {...args}><TextInput type="email" placeholder="you@example.com" /></Field>,
};

export const WithHelper: Story = {
  args: { label: "Email", helperText: "We'll never share your address." },
  render: (args) => <Field {...args}><TextInput type="email" /></Field>,
};

export const WithDescription: Story = {
  args: { label: "Workspace URL", description: "Lowercase letters, numbers, and dashes." },
  render: (args) => <Field {...args}><TextInput placeholder="acme" /></Field>,
};

export const Required: Story = {
  args: { label: "Full name", required: true },
  render: (args) => <Field {...args}><TextInput /></Field>,
};

export const Error: Story = {
  args: { label: "Email", errorText: "That doesn't look like a valid email." },
  render: (args) => <Field {...args}><TextInput defaultValue="not-an-email" /></Field>,
};

export const Success: Story = {
  args: { label: "Email", successText: "Available" },
  render: (args) => <Field {...args}><TextInput defaultValue="alex@example.com" /></Field>,
};

export const Disabled: Story = {
  args: { label: "Email", disabled: true },
  render: (args) => <Field {...args}><TextInput defaultValue="alex@example.com" /></Field>,
};

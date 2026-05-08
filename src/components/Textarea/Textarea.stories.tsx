import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Textarea } from "./Textarea.tsx";
import { Field } from "../Field/Field.tsx";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
  decorators: [(S) => <div style={{ maxWidth: 480 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => <Field label="Description"><Textarea placeholder="Tell us a bit about it…" /></Field>,
};

export const FixedRows: Story = {
  render: () => <Field label="Notes"><Textarea rows={6} /></Field>,
};

export const AutoResize: Story = {
  render: () => <Field label="Auto-grow"><Textarea rows="auto" defaultValue="Try typing several lines.\nIt grows with content." /></Field>,
};

export const WithCharacterCount: Story = {
  render: () => <Field label="Bio (max 140)"><Textarea maxLength={140} showCount /></Field>,
};

export const Error: Story = {
  render: () => <Field label="Description" errorText="This field is required."><Textarea /></Field>,
};

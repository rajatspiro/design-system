import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Menu } from "./Menu.tsx";
import { Button } from "../Button/Button.tsx";

const meta: Meta = {
  title: "Components/Menu",
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Menu
      aria-label="File actions"
      trigger={<Button variant="secondary" trailingIcon="▾">Actions</Button>}
      items={[
        { id: "rename", label: "Rename", shortcut: "⌘R", onSelect: () => alert("rename") },
        { id: "duplicate", label: "Duplicate", shortcut: "⌘D", onSelect: () => alert("dup") },
        { id: "div", kind: "divider" },
        { id: "delete", label: "Delete", destructive: true, onSelect: () => alert("delete") },
      ]}
    />
  ),
};

export const WithCheckbox: Story = {
  render: () => {
    const [grid, setGrid] = useState(true);
    const [labels, setLabels] = useState(false);
    return (
      <Menu
        aria-label="View options"
        trigger={<Button variant="secondary" trailingIcon="▾">View</Button>}
        items={[
          { id: "grid",   kind: "checkbox", label: "Show grid",   checked: grid,   onChange: setGrid },
          { id: "labels", kind: "checkbox", label: "Show labels", checked: labels, onChange: setLabels },
        ]}
      />
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <Menu
      aria-label="More"
      trigger={<Button iconOnly aria-label="More" variant="tertiary">⋯</Button>}
      items={[
        { id: "open", label: "Open", onSelect: () => {} },
        {
          id: "share", kind: "submenu", label: "Share",
          items: [
            { id: "link", label: "Copy link", onSelect: () => {} },
            { id: "email", label: "Email", onSelect: () => {} },
          ],
        },
        { id: "div", kind: "divider" },
        { id: "delete", label: "Delete", destructive: true, onSelect: () => {} },
      ]}
    />
  ),
};

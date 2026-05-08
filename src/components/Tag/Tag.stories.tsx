import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Tag } from "./Tag.tsx";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
  args: { children: "engineering" },
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};

export const Removable: Story = {
  render: () => {
    const [tags, setTags] = useState(["alex@example.com", "sam@example.com", "lee@example.com"]);
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {tags.map((t) => (
          <Tag key={t} removable onRemove={() => setTags((xs) => xs.filter((x) => x !== t))}>
            {t}
          </Tag>
        ))}
      </div>
    );
  },
};

export const Selectable: Story = {
  render: () => {
    const [picked, setPicked] = useState<string[]>(["frontend"]);
    const opts = ["frontend", "backend", "design", "devops"];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {opts.map((o) => (
          <Tag
            key={o}
            tone={picked.includes(o) ? "brand" : "neutral"}
            selected={picked.includes(o)}
            onSelect={() =>
              setPicked((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]))
            }
          >
            {o}
          </Tag>
        ))}
      </div>
    );
  },
};

export const AsLink: Story = {
  args: { href: "#", tone: "info" },
};

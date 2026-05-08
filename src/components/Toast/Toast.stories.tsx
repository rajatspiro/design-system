import React from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { ToastProvider, useToast } from "./Toast.tsx";
import { Button } from "../Button/Button.tsx";

const meta: Meta = {
  title: "Components/Toast",
  parameters: {
    layout: "padded",
    // Auto-dismissing toasts make snapshots flaky.
    chromatic: { disableSnapshot: true },
  },
};
export default meta;
type Story = StoryObj;

const Demo = ({ tone, title, description, action }: any) => {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          tone,
          title,
          description,
          action: action ? { label: "Undo", onClick: () => {} } : undefined,
          duration: 0, // sticky inside Storybook so reviewers can inspect it
        })
      }
    >
      Show {tone} toast
    </Button>
  );
};

export const Info: Story = {
  render: () => (
    <ToastProvider>
      <Demo tone="info" title="New version available" description="Refresh to get the latest." />
    </ToastProvider>
  ),
};

export const Success: Story = {
  render: () => (
    <ToastProvider>
      <Demo tone="success" title="Saved" description="Your changes are live." action />
    </ToastProvider>
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastProvider>
      <Demo tone="warning" title="You're offline" description="Changes will sync when reconnected." />
    </ToastProvider>
  ),
};

export const Danger: Story = {
  render: () => (
    <ToastProvider>
      <Demo tone="danger" title="Couldn't save" description="The server returned 500." action />
    </ToastProvider>
  ),
};

export const StackingAndPositioning: Story = {
  render: () => {
    const Inner = () => {
      const { toast } = useToast();
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["info", "success", "warning", "danger", "neutral"] as const).map((t) => (
            <Button key={t} variant="secondary" onClick={() => toast({ tone: t, title: `${t} toast`, duration: 0 })}>
              {t}
            </Button>
          ))}
        </div>
      );
    };
    return (
      <ToastProvider position="bottom-center" max={4}>
        <Inner />
      </ToastProvider>
    );
  },
};

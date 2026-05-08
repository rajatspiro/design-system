import type { ReactNode } from "react";

export type TabsVariant = "underline" | "pill" | "segmented" | "enclosed";
export type TabsOrientation = "horizontal" | "vertical";
export type TabsSize = "sm" | "md" | "lg";

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  size?: TabsSize;
  fullWidth?: boolean;
  /** Accessible name for the tablist. */
  "aria-label"?: string;
}

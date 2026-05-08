import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "solid" | "soft" | "outline" | "dot";
export type BadgeTone = "neutral" | "brand" | "info" | "success" | "warning" | "danger";
export type BadgeSize = "xs" | "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: BadgeSize;
  leadingIcon?: ReactNode;
  /** Render an integer count (e.g. unread). Truncates to "99+". */
  count?: number;
  /** Render a small leading status dot. */
  withDot?: boolean;
  children?: ReactNode;
}

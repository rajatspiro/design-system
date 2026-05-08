import type { HTMLAttributes, ReactNode } from "react";

export type ProgressTone = "brand" | "success" | "warning" | "danger";
export type ProgressSize = "xs" | "sm" | "md" | "lg";
export type ProgressShape = "linear" | "circular";

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Numeric value 0–max. Omit for indeterminate. */
  value?: number;
  max?: number;
  shape?: ProgressShape;
  size?: ProgressSize;
  tone?: ProgressTone;
  /** Render as N equal segments showing step progress. Linear only. */
  segments?: number;
  /** Visible label rendered above the track. */
  label?: ReactNode;
  /** Auto-render `${pct}%` to the right of the label. */
  showPercentage?: boolean;
  /** Description rendered below the track. */
  description?: ReactNode;
  /** ARIA label when there's no visible label. */
  "aria-label"?: string;
}

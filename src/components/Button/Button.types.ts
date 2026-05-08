import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "destructive-secondary"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Visual / semantic variant. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Size token. Defaults to "md". */
  size?: ButtonSize;
  /** Icon rendered before the label. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: ReactNode;
  /** When true, removes label and renders a square icon-only button.
   *  An accessible name (`aria-label`) is then required. */
  iconOnly?: boolean;
  /** Stretch to 100% of the parent. */
  fullWidth?: boolean;
  /** Replace icons with a spinner. Disables interaction; label kept for context. */
  loading?: boolean;
  /** Visible label. Optional only when iconOnly is true. */
  children?: ReactNode;
}

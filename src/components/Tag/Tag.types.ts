import type { HTMLAttributes, ReactNode } from "react";
import type { BadgeTone, BadgeVariant, BadgeSize } from "../Badge/Badge.types.ts";

export interface TagProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: BadgeSize;
  leadingIcon?: ReactNode;
  /** Show an X to remove. Calls `onRemove`. */
  removable?: boolean;
  onRemove?: () => void;
  /** Renders the tag as an <a>. Forces interactive styling. */
  href?: string;
  /** Selected (toggled-on) state. */
  selected?: boolean;
  onSelect?: () => void;
  children: ReactNode;
}

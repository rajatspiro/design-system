import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> {
  /** "auto" grows with content; a number forces fixed rows. */
  rows?: number | "auto";
  /** Show character counter when true or when `maxLength` is set. */
  showCount?: boolean;
  /** Allow user-resize; disable the native handle when "none". */
  resize?: "vertical" | "horizontal" | "both" | "none";
  invalid?: boolean;
}

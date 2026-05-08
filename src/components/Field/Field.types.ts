import type { HTMLAttributes, ReactNode } from "react";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Field label. Required for accessibility. */
  label: ReactNode;
  /** Optional long-form description shown under the label. */
  description?: ReactNode;
  /** Helper text shown under the control when not in an error state. */
  helperText?: ReactNode;
  /** Error message — shown in place of helperText, sets aria-invalid on the control. */
  errorText?: ReactNode;
  /** Success message — shown when valid. */
  successText?: ReactNode;
  /** Mark the field as required (visual asterisk + aria-required passes through context). */
  required?: boolean;
  /** Disabled state, propagated to children via context. */
  disabled?: boolean;
  /** ID for the underlying control. Auto-generated if omitted. */
  htmlFor?: string;
  /** The control(s) — typically TextInput, Textarea, Radio group, etc. */
  children: ReactNode;
}

export interface FieldContextValue {
  controlId: string;
  describedById?: string;
  errorId?: string;
  required: boolean;
  disabled: boolean;
  invalid: boolean;
  status: "default" | "error" | "success";
}

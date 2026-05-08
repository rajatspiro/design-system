import type { InputHTMLAttributes, ReactNode } from "react";

export type TextInputSize = "sm" | "md" | "lg";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: TextInputSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Static text rendered before the input value (e.g. "https://"). */
  prefix?: ReactNode;
  /** Static text rendered after the input value (e.g. ".com"). */
  suffix?: ReactNode;
  /** Show an X clear button when the input has a value. */
  clearable?: boolean;
  /** Force-override the validity state. Usually inherited from <Field>. */
  invalid?: boolean;
  onClear?: () => void;
}

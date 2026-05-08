import type { InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: ReactNode;
  description?: ReactNode;
  /** Render the indeterminate ("mixed") visual state. Independent of `checked`. */
  indeterminate?: boolean;
}

export interface CheckboxOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  options: CheckboxOption[];
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

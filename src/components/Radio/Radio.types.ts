import type { InputHTMLAttributes, ReactNode } from "react";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: ReactNode;
  description?: ReactNode;
}

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  /** Accessible group label — usually provided by the surrounding <Field>. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

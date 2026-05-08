import type { ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  searchable?: boolean;
  /** Match trigger and listbox widths. */
  matchWidth?: boolean;
  size?: "sm" | "md" | "lg";
  id?: string;
}

export interface MultiSelectProps extends Omit<SelectProps, "value" | "defaultValue" | "onChange"> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  /** Render a "Select all" row that toggles all enabled options. */
  selectAll?: boolean;
}

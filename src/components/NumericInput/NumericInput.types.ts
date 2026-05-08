import type { TextInputProps } from "../TextInput/TextInput.types.ts";

export interface NumericInputProps
  extends Omit<TextInputProps, "type" | "value" | "defaultValue" | "onChange" | "prefix" | "suffix"> {
  value?: number | null;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  /** Static unit shown as suffix, e.g. "kg". */
  unit?: string;
  /** Format the value for display (defaults to thousands separator). */
  format?: (value: number) => string;
  onChange?: (value: number | null) => void;
}

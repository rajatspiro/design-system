import React, { forwardRef, useState, useCallback } from "react";
import type { TextInputProps } from "./TextInput.types.ts";
import { useField } from "../Field/Field.tsx";
import "./TextInput.css";

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      size = "md",
      leadingIcon,
      trailingIcon,
      prefix,
      suffix,
      clearable = false,
      invalid: invalidProp,
      disabled,
      readOnly,
      value,
      defaultValue,
      onChange,
      onClear,
      className,
      id,
      "aria-describedby": describedByProp,
      "aria-invalid": ariaInvalidProp,
      "aria-required": ariaRequiredProp,
      ...rest
    },
    ref
  ) => {
    const field = useField();
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(defaultValue ?? "");
    const currentValue = isControlled ? value : internal;
    const hasValue = currentValue != null && String(currentValue).length > 0;

    const invalid = invalidProp ?? field?.invalid ?? false;
    const isDisabled = disabled ?? field?.disabled ?? false;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternal(e.target.value);
        onChange?.(e);
      },
      [isControlled, onChange]
    );

    const handleClear = () => {
      if (!isControlled) setInternal("");
      onClear?.();
    };

    return (
      <div
        className={[
          "ds-input",
          `ds-input--${size}`,
          invalid && "ds-input--error",
          isDisabled && "ds-input--disabled",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {leadingIcon && (
          <span className="ds-input__icon ds-input__icon--leading" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {prefix && <span className="ds-input__affix">{prefix}</span>}

        <input
          ref={ref}
          className="ds-input__control"
          id={id ?? field?.controlId}
          aria-describedby={describedByProp ?? field?.describedById}
          aria-invalid={ariaInvalidProp ?? (invalid || undefined)}
          aria-required={ariaRequiredProp ?? (field?.required || undefined)}
          disabled={isDisabled}
          readOnly={readOnly}
          value={value as string | number | readonly string[] | undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          {...rest}
        />

        {suffix && <span className="ds-input__affix">{suffix}</span>}

        {clearable && hasValue && !isDisabled && !readOnly && (
          <button
            type="button"
            className="ds-input__clear"
            aria-label="Clear input"
            onClick={handleClear}
          >
            ×
          </button>
        )}

        {trailingIcon && (
          <span className="ds-input__icon ds-input__icon--trailing" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

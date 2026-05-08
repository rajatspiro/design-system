import React, { forwardRef, useState, useCallback, useRef, useImperativeHandle } from "react";
import type { NumericInputProps } from "./NumericInput.types.ts";
import { useField } from "../Field/Field.tsx";
import "../TextInput/TextInput.css";
import "./NumericInput.css";

const defaultFormat = (n: number) => n.toLocaleString();

const clamp = (n: number, min?: number, max?: number) => {
  if (typeof min === "number" && n < min) return min;
  if (typeof max === "number" && n > max) return max;
  return n;
};

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      size = "md",
      value,
      defaultValue,
      min,
      max,
      step = 1,
      unit,
      format = defaultFormat,
      onChange,
      disabled,
      readOnly,
      invalid: invalidProp,
      id,
      ...rest
    },
    ref
  ) => {
    const field = useField();
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<number | null>(defaultValue ?? null);
    const current = isControlled ? value ?? null : internal;
    const [focused, setFocused] = useState(false);

    const invalid = invalidProp ?? field?.invalid ?? false;
    const isDisabled = disabled ?? field?.disabled ?? false;

    const display = (() => {
      if (focused) return current == null ? "" : String(current);
      return current == null ? "" : format(current);
    })();

    const apply = useCallback(
      (n: number | null) => {
        const next = n == null ? null : clamp(n, min, max);
        if (!isControlled) setInternal(next);
        onChange?.(next);
      },
      [isControlled, onChange, min, max]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.\-]/g, "");
      if (raw === "" || raw === "-") return apply(null);
      const n = Number(raw);
      if (!Number.isNaN(n)) apply(n);
    };

    const stepBy = (delta: number) => {
      const base = current ?? 0;
      apply(base + delta);
      inputRef.current?.focus();
    };

    return (
      <div
        className={[
          "ds-input",
          "ds-numeric",
          `ds-input--${size}`,
          invalid && "ds-input--error",
          isDisabled && "ds-input--disabled",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          ref={inputRef}
          className="ds-input__control"
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={current ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          id={id ?? field?.controlId}
          aria-describedby={field?.describedById}
          aria-invalid={invalid || undefined}
          aria-required={field?.required || undefined}
          disabled={isDisabled}
          readOnly={readOnly}
          value={display}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") { e.preventDefault(); stepBy(step); }
            if (e.key === "ArrowDown") { e.preventDefault(); stepBy(-step); }
          }}
          {...rest}
        />
        {unit && <span className="ds-input__affix">{unit}</span>}
        <div className="ds-numeric__steppers">
          <button
            type="button"
            className="ds-numeric__stepper"
            aria-label="Increment"
            tabIndex={-1}
            disabled={isDisabled || readOnly || (max !== undefined && (current ?? 0) >= max)}
            onClick={() => stepBy(step)}
          >▴</button>
          <button
            type="button"
            className="ds-numeric__stepper"
            aria-label="Decrement"
            tabIndex={-1}
            disabled={isDisabled || readOnly || (min !== undefined && (current ?? 0) <= min)}
            onClick={() => stepBy(-step)}
          >▾</button>
        </div>
      </div>
    );
  }
);

NumericInput.displayName = "NumericInput";

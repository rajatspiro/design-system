import React, { forwardRef, useId, useState } from "react";
import type { RadioProps, RadioGroupProps } from "./Radio.types.ts";
import "./Radio.css";

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, disabled, id, className, ...rest }, ref) => {
    const generated = useId();
    const inputId = id ?? `radio-${generated}`;
    const descId = description ? `${inputId}-desc` : undefined;
    return (
      <label
        className={["ds-radio", disabled && "ds-radio--disabled", className].filter(Boolean).join(" ")}
        htmlFor={inputId}
      >
        <input
          ref={ref}
          type="radio"
          id={inputId}
          className="ds-radio__input"
          disabled={disabled}
          aria-describedby={descId}
          {...rest}
        />
        <span className="ds-radio__control" aria-hidden="true" />
        <span className="ds-radio__text">
          <span className="ds-radio__label">{label}</span>
          {description && <span id={descId} className="ds-radio__description">{description}</span>}
        </span>
      </label>
    );
  }
);
Radio.displayName = "Radio";

export const RadioGroup = ({
  name,
  value,
  defaultValue,
  onChange,
  options,
  orientation = "vertical",
  disabled,
  ...aria
}: RadioGroupProps) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;

  return (
    <div
      role="radiogroup"
      className={`ds-radio-group ds-radio-group--${orientation}`}
      aria-disabled={disabled || undefined}
      {...aria}
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          value={opt.value}
          checked={current === opt.value}
          disabled={disabled || opt.disabled}
          label={opt.label}
          description={opt.description}
          onChange={(e) => {
            if (!isControlled) setInternal(e.target.value);
            onChange?.(e.target.value);
          }}
        />
      ))}
    </div>
  );
};

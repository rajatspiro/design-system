import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import type { CheckboxProps, CheckboxGroupProps } from "./Checkbox.types.ts";
import "./Checkbox.css";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate = false, disabled, id, className, ...rest }, ref) => {
    const generated = useId();
    const inputId = id ?? `checkbox-${generated}`;
    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const descId = description ? `${inputId}-desc` : undefined;

    return (
      <label
        className={["ds-checkbox", disabled && "ds-checkbox--disabled", className].filter(Boolean).join(" ")}
        htmlFor={inputId}
      >
        <input
          ref={innerRef}
          type="checkbox"
          id={inputId}
          className="ds-checkbox__input"
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : undefined}
          aria-describedby={descId}
          {...rest}
        />
        <span className="ds-checkbox__control" aria-hidden="true">
          {indeterminate ? (
            <svg viewBox="0 0 16 16" className="ds-checkbox__mark"><path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" className="ds-checkbox__mark"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </span>
        <span className="ds-checkbox__text">
          <span className="ds-checkbox__label">{label}</span>
          {description && <span id={descId} className="ds-checkbox__description">{description}</span>}
        </span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export const CheckboxGroup = ({
  name,
  value,
  defaultValue,
  onChange,
  options,
  orientation = "vertical",
  disabled,
  ...aria
}: CheckboxGroupProps) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const current = isControlled ? value! : internal;

  const toggle = (v: string) => {
    const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      role="group"
      className={`ds-checkbox-group ds-checkbox-group--${orientation}`}
      aria-disabled={disabled || undefined}
      {...aria}
    >
      {options.map((opt) => (
        <Checkbox
          key={opt.value}
          name={name}
          value={opt.value}
          checked={current.includes(opt.value)}
          disabled={disabled || opt.disabled}
          label={opt.label}
          description={opt.description}
          onChange={() => toggle(opt.value)}
        />
      ))}
    </div>
  );
};

import React, { createContext, useContext, useId } from "react";
import type { FieldProps, FieldContextValue } from "./Field.types.ts";
import "./Field.css";

const FieldContext = createContext<FieldContextValue | null>(null);

/** Hook used by control children (TextInput, Textarea, etc.) to wire ARIA. */
export const useField = (): FieldContextValue | null => useContext(FieldContext);

export const Field = ({
  label,
  description,
  helperText,
  errorText,
  successText,
  required = false,
  disabled = false,
  htmlFor,
  children,
  className,
  ...rest
}: FieldProps) => {
  const generatedId = useId();
  const controlId = htmlFor ?? `field-${generatedId}`;
  const helperId = `${controlId}-helper`;
  const errorId = `${controlId}-error`;
  const descriptionId = `${controlId}-desc`;

  const status: FieldContextValue["status"] =
    errorText ? "error" : successText ? "success" : "default";

  const describedById = [
    description ? descriptionId : null,
    errorText ? errorId : helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const ctx: FieldContextValue = {
    controlId,
    describedById,
    errorId: errorText ? errorId : undefined,
    required,
    disabled,
    invalid: !!errorText,
    status,
  };

  return (
    <FieldContext.Provider value={ctx}>
      <div
        className={["ds-field", `ds-field--${status}`, className].filter(Boolean).join(" ")}
        data-disabled={disabled || undefined}
        {...rest}
      >
        <label htmlFor={controlId} className="ds-field__label">
          {label}
          {required && (
            <span className="ds-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {description && (
          <p id={descriptionId} className="ds-field__description">
            {description}
          </p>
        )}

        <div className="ds-field__control">{children}</div>

        {errorText ? (
          <p id={errorId} className="ds-field__error" role="alert">
            {errorText}
          </p>
        ) : successText ? (
          <p className="ds-field__success">{successText}</p>
        ) : helperText ? (
          <p id={helperId} className="ds-field__helper">
            {helperText}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
};

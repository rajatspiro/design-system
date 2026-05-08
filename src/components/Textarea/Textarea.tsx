import React, { forwardRef, useEffect, useRef, useImperativeHandle, useState } from "react";
import type { TextareaProps } from "./Textarea.types.ts";
import { useField } from "../Field/Field.tsx";
import "./Textarea.css";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      rows = 3,
      showCount = false,
      resize = "vertical",
      maxLength,
      invalid: invalidProp,
      disabled,
      readOnly,
      value,
      defaultValue,
      onChange,
      id,
      className,
      ...rest
    },
    ref
  ) => {
    const field = useField();
    const innerRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement, []);

    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(defaultValue ?? "");
    const current = isControlled ? (value ?? "") : internal;

    const invalid = invalidProp ?? field?.invalid ?? false;
    const isDisabled = disabled ?? field?.disabled ?? false;

    // Auto-resize
    useEffect(() => {
      if (rows !== "auto" || !innerRef.current) return;
      const el = innerRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [current, rows]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternal(e.target.value);
      onChange?.(e);
    };

    const length = String(current).length;

    return (
      <div
        className={[
          "ds-textarea",
          invalid && "ds-textarea--error",
          isDisabled && "ds-textarea--disabled",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <textarea
          ref={innerRef}
          className="ds-textarea__control"
          id={id ?? field?.controlId}
          aria-describedby={field?.describedById}
          aria-invalid={invalid || undefined}
          aria-required={field?.required || undefined}
          rows={rows === "auto" ? 1 : rows}
          maxLength={maxLength}
          disabled={isDisabled}
          readOnly={readOnly}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          style={{ resize }}
          {...rest}
        />
        {(showCount || maxLength != null) && (
          <div className="ds-textarea__count" aria-live="polite">
            {maxLength != null ? `${length} / ${maxLength}` : length}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

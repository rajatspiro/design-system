import React, { forwardRef } from "react";
import type { ButtonProps } from "./Button.types.ts";
import "./Button.css";

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

const Spinner = () => (
  <span className="ds-button__spinner" aria-hidden="true" />
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      iconOnly = false,
      fullWidth = false,
      loading = false,
      disabled = false,
      type = "button",
      className,
      children,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) => {
    const classes = cx(
      "ds-button",
      `ds-button--${variant}`,
      `ds-button--${size}`,
      iconOnly && "ds-button--icon-only",
      fullWidth && "ds-button--full-width",
      loading && "ds-button--loading",
      className
    );

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-label={iconOnly ? ariaLabel : ariaLabel}
        {...rest}
      >
        {loading ? (
          <Spinner />
        ) : (
          leadingIcon && (
            <span className="ds-button__icon" aria-hidden="true">
              {leadingIcon}
            </span>
          )
        )}
        {!iconOnly && children && (
          <span className="ds-button__label">{children}</span>
        )}
        {!loading && trailingIcon && !iconOnly && (
          <span className="ds-button__icon" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

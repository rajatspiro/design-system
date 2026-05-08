import React from "react";
import type { BadgeProps } from "./Badge.types.ts";
import "./Badge.css";

export const Badge = ({
  variant = "soft",
  tone = "neutral",
  size = "sm",
  leadingIcon,
  count,
  withDot = false,
  children,
  className,
  ...rest
}: BadgeProps) => {
  if (variant === "dot") {
    return (
      <span
        className={["ds-badge", "ds-badge--dot-only", `ds-badge--${tone}`, className].filter(Boolean).join(" ")}
        aria-hidden={!rest["aria-label"]}
        {...rest}
      />
    );
  }

  const display =
    count != null ? (count > 99 ? "99+" : String(count)) : children;

  return (
    <span
      className={[
        "ds-badge",
        `ds-badge--${variant}`,
        `ds-badge--${tone}`,
        `ds-badge--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {withDot && <span className={`ds-badge__dot ds-badge__dot--${tone}`} aria-hidden="true" />}
      {leadingIcon && <span className="ds-badge__icon" aria-hidden="true">{leadingIcon}</span>}
      {display}
    </span>
  );
};

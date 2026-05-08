import React from "react";
import type { TagProps } from "./Tag.types.ts";
import "../Badge/Badge.css";
import "./Tag.css";

export const Tag = ({
  variant = "soft",
  tone = "neutral",
  size = "sm",
  leadingIcon,
  removable = false,
  onRemove,
  href,
  selected = false,
  onSelect,
  className,
  children,
  ...rest
}: TagProps) => {
  const Tag = href ? "a" : onSelect ? "button" : "span";
  const interactive = !!(href || onSelect);

  const props: any = {
    className: [
      "ds-badge",
      `ds-badge--${variant}`,
      `ds-badge--${tone}`,
      `ds-badge--${size}`,
      "ds-tag",
      interactive && "ds-tag--interactive",
      selected && "ds-tag--selected",
      className,
    ]
      .filter(Boolean)
      .join(" "),
    ...rest,
  };
  if (href) props.href = href;
  if (Tag === "button") {
    props.type = "button";
    props["aria-pressed"] = selected;
    props.onClick = onSelect;
  }

  return (
    <Tag {...props}>
      {leadingIcon && <span className="ds-badge__icon" aria-hidden="true">{leadingIcon}</span>}
      <span className="ds-tag__label">{children}</span>
      {removable && (
        <button
          type="button"
          className="ds-tag__remove"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >×</button>
      )}
    </Tag>
  );
};

import React, { useId, useRef, useState } from "react";
import type { TabsProps } from "./Tabs.types.ts";
import "./Tabs.css";

export const Tabs = ({
  items,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  orientation = "horizontal",
  size = "md",
  fullWidth = false,
  "aria-label": ariaLabel,
}: TabsProps) => {
  // Trade-off: segmented + vertical doesn't survive — a vertical pill rail
  // looks better. We collapse to "pill" when both are requested.
  const effectiveVariant =
    orientation === "vertical" && variant === "segmented" ? "pill" : variant;

  const isControlled = value !== undefined;
  const firstEnabled = items.find((i) => !i.disabled)?.id ?? items[0]?.id;
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const current = isControlled ? value! : internal;
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const select = (id: string) => {
    if (!isControlled) setInternal(id);
    onChange?.(id);
  };

  const focusTab = (id: string) => {
    listRef.current?.querySelector<HTMLButtonElement>(`[data-tab-id="${id}"]`)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.id === current);
    if (idx < 0) return;
    const horizontal = orientation === "horizontal";
    const next = (delta: number) => {
      const target = enabled[(idx + delta + enabled.length) % enabled.length];
      select(target.id);
      focusTab(target.id);
    };
    if ((horizontal && e.key === "ArrowRight") || (!horizontal && e.key === "ArrowDown")) {
      e.preventDefault(); next(1);
    } else if ((horizontal && e.key === "ArrowLeft") || (!horizontal && e.key === "ArrowUp")) {
      e.preventDefault(); next(-1);
    } else if (e.key === "Home") {
      e.preventDefault(); select(enabled[0].id); focusTab(enabled[0].id);
    } else if (e.key === "End") {
      e.preventDefault(); const last = enabled[enabled.length - 1]; select(last.id); focusTab(last.id);
    }
  };

  return (
    <div
      className={[
        "ds-tabs",
        `ds-tabs--${effectiveVariant}`,
        `ds-tabs--${orientation}`,
        `ds-tabs--${size}`,
        fullWidth && "ds-tabs--full-width",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className="ds-tabs__list"
        onKeyDown={onKeyDown}
      >
        {items.map((item) => {
          const selected = item.id === current;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              data-tab-id={item.id}
              id={`${baseId}-tab-${item.id}`}
              aria-controls={`${baseId}-panel-${item.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className={["ds-tabs__trigger", selected && "ds-tabs__trigger--active"].filter(Boolean).join(" ")}
              onClick={() => select(item.id)}
            >
              {item.icon && <span className="ds-tabs__icon" aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && <span className="ds-tabs__badge">{item.badge}</span>}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== current}
          tabIndex={0}
          className="ds-tabs__panel"
        >
          {item.id === current && item.content}
        </div>
      ))}
    </div>
  );
};

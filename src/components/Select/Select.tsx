import React, { useMemo, useRef, useState } from "react";
import type { SelectProps, SelectOption } from "./Select.types.ts";
import { Popover } from "../Popover/Popover.tsx";
import { useField } from "../Field/Field.tsx";
import "./Select.css";

const filterOptions = (opts: SelectOption[], query: string) => {
  if (!query) return opts;
  const q = query.toLowerCase();
  return opts.filter((o) => String(o.label).toLowerCase().includes(q));
};

export const Select = ({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  disabled,
  invalid,
  searchable = false,
  matchWidth = true,
  size = "md",
  id,
}: SelectProps) => {
  const field = useField();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue ?? null);
  const current = isControlled ? value ?? null : internal;
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterOptions(options, query), [options, query]);
  const [activeIdx, setActiveIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === current);
  const isInvalid = invalid ?? field?.invalid;
  const isDisabled = disabled ?? field?.disabled;

  return (
    <Popover
      matchWidth={matchWidth}
      trigger={
        <button
          type="button"
          id={id ?? field?.controlId}
          disabled={isDisabled}
          aria-invalid={isInvalid || undefined}
          aria-required={field?.required || undefined}
          aria-describedby={field?.describedById}
          className={[
            "ds-select-trigger",
            `ds-select-trigger--${size}`,
            isInvalid && "ds-select-trigger--error",
            isDisabled && "ds-select-trigger--disabled",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className={selectedOption ? "ds-select-trigger__value" : "ds-select-trigger__placeholder"}>
            {selectedOption?.label ?? placeholder}
          </span>
          <span className="ds-select-trigger__chevron" aria-hidden="true">▾</span>
        </button>
      }
    >
      {({ close }) => (
        <div role="listbox" aria-activedescendant={filtered[activeIdx]?.value} ref={listRef} className="ds-select-list">
          {searchable && (
            <input
              type="text"
              autoFocus
              placeholder="Search…"
              className="ds-select-search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(filtered.length - 1, i + 1)); }
                else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(0, i - 1)); }
                else if (e.key === "Enter") {
                  e.preventDefault();
                  const opt = filtered[activeIdx];
                  if (opt && !opt.disabled) {
                    if (!isControlled) setInternal(opt.value);
                    onChange?.(opt.value);
                    close();
                  }
                }
              }}
            />
          )}
          {filtered.length === 0 && <div className="ds-select-empty">No results</div>}
          {filtered.map((opt, i) => (
            <div
              key={opt.value}
              role="option"
              id={opt.value}
              aria-selected={opt.value === current}
              aria-disabled={opt.disabled || undefined}
              tabIndex={-1}
              className={[
                "ds-select-option",
                opt.value === current && "ds-select-option--selected",
                opt.disabled && "ds-select-option--disabled",
                i === activeIdx && "ds-select-option--active",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => {
                if (opt.disabled) return;
                if (!isControlled) setInternal(opt.value);
                onChange?.(opt.value);
                close();
              }}
            >
              <div className="ds-select-option__main">
                <span>{opt.label}</span>
                {opt.value === current && <span className="ds-select-option__check" aria-hidden="true">✓</span>}
              </div>
              {opt.description && <div className="ds-select-option__desc">{opt.description}</div>}
            </div>
          ))}
        </div>
      )}
    </Popover>
  );
};

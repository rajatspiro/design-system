import React, { useMemo, useState } from "react";
import type { MultiSelectProps, SelectOption } from "../Select/Select.types.ts";
import { Popover } from "../Popover/Popover.tsx";
import { useField } from "../Field/Field.tsx";
import "../Select/Select.css";

const filterOptions = (opts: SelectOption[], q: string) => {
  if (!q) return opts;
  const Q = q.toLowerCase();
  return opts.filter((o) => String(o.label).toLowerCase().includes(Q));
};

export const MultiSelect = ({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  disabled,
  invalid,
  searchable = true,
  selectAll = false,
  matchWidth = true,
  size = "md",
  id,
}: MultiSelectProps) => {
  const field = useField();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const current = isControlled ? value! : internal;
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterOptions(options, query), [options, query]);

  const isDisabled = disabled ?? field?.disabled;
  const isInvalid = invalid ?? field?.invalid;
  const enabledValues = options.filter((o) => !o.disabled).map((o) => o.value);
  const allSelected = enabledValues.every((v) => current.includes(v));

  const set = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  const toggle = (v: string) => set(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);

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
            "ds-multiselect-trigger",
            `ds-select-trigger--${size}`,
            isInvalid && "ds-select-trigger--error",
            isDisabled && "ds-select-trigger--disabled",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {current.length === 0 ? (
            <span className="ds-select-trigger__placeholder">{placeholder}</span>
          ) : (
            current.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span key={v} className="ds-multiselect-chip">
                  {opt?.label ?? v}
                  <button
                    type="button"
                    className="ds-multiselect-chip__x"
                    aria-label={`Remove ${typeof opt?.label === "string" ? opt!.label : v}`}
                    onClick={(e) => { e.stopPropagation(); toggle(v); }}
                  >×</button>
                </span>
              );
            })
          )}
          <span className="ds-select-trigger__chevron" aria-hidden="true">▾</span>
        </button>
      }
    >
      {() => (
        <div role="listbox" aria-multiselectable="true" className="ds-select-list">
          {searchable && (
            <input
              type="text"
              autoFocus
              placeholder="Search…"
              className="ds-select-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          {selectAll && enabledValues.length > 0 && (
            <div
              role="option"
              aria-selected={allSelected}
              tabIndex={-1}
              className="ds-select-option"
              onClick={() => set(allSelected ? [] : enabledValues)}
            >
              <div className="ds-select-option__main">
                <span><strong>{allSelected ? "Clear all" : "Select all"}</strong></span>
                {allSelected && <span className="ds-select-option__check" aria-hidden="true">✓</span>}
              </div>
            </div>
          )}
          {filtered.map((opt) => {
            const checked = current.includes(opt.value);
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={checked}
                aria-disabled={opt.disabled || undefined}
                tabIndex={-1}
                className={[
                  "ds-select-option",
                  checked && "ds-select-option--selected",
                  opt.disabled && "ds-select-option--disabled",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => !opt.disabled && toggle(opt.value)}
              >
                <div className="ds-select-option__main">
                  <span>{opt.label}</span>
                  {checked && <span className="ds-select-option__check" aria-hidden="true">✓</span>}
                </div>
                {opt.description && <div className="ds-select-option__desc">{opt.description}</div>}
              </div>
            );
          })}
        </div>
      )}
    </Popover>
  );
};

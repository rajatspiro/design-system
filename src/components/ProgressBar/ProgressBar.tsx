import React from "react";
import type { ProgressBarProps } from "./ProgressBar.types.ts";
import "./ProgressBar.css";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const ProgressBar = ({
  value,
  max = 100,
  shape = "linear",
  size = "md",
  tone = "brand",
  segments,
  label,
  showPercentage = false,
  description,
  className,
  "aria-label": ariaLabel,
  ...rest
}: ProgressBarProps) => {
  const indeterminate = value == null;
  const pct = indeterminate ? null : Math.round((clamp(value, 0, max) / max) * 100);

  if (shape === "circular") {
    const stroke = size === "lg" ? 6 : size === "md" ? 4 : 3;
    const dim = size === "lg" ? 64 : size === "md" ? 48 : 32;
    const radius = (dim - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = indeterminate ? 0 : circumference - ((pct ?? 0) / 100) * circumference;

    return (
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        aria-busy={indeterminate || undefined}
        className={["ds-progress-circular", className].filter(Boolean).join(" ")}
        {...rest}
      >
        <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} className={indeterminate ? "ds-progress-circular__svg ds-progress-circular__svg--spin" : "ds-progress-circular__svg"}>
          <circle cx={dim / 2} cy={dim / 2} r={radius} stroke="var(--progress-circular-track)" strokeWidth={stroke} fill="none" />
          <circle
            cx={dim / 2} cy={dim / 2} r={radius}
            stroke={`var(--progress-fill-${tone})`}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
          />
        </svg>
        {!indeterminate && showPercentage && <span className="ds-progress-circular__pct">{pct}%</span>}
      </div>
    );
  }

  // Linear
  const sizeClass = `ds-progress--${size}`;

  return (
    <div className={["ds-progress", sizeClass, className].filter(Boolean).join(" ")} {...rest}>
      {(label || showPercentage) && (
        <div className="ds-progress__header">
          {label && <span className="ds-progress__label">{label}</span>}
          {!indeterminate && showPercentage && <span className="ds-progress__pct">{pct}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        aria-busy={indeterminate || undefined}
        className={["ds-progress__track", indeterminate && "ds-progress__track--indeterminate"].filter(Boolean).join(" ")}
      >
        {segments && !indeterminate ? (
          <div className="ds-progress__segments">
            {Array.from({ length: segments }).map((_, i) => {
              const segPct = ((pct ?? 0) / 100) * segments;
              const filled = i < Math.floor(segPct);
              const partial = i === Math.floor(segPct) ? (segPct - Math.floor(segPct)) * 100 : 0;
              return (
                <div key={i} className="ds-progress__segment">
                  {filled && <div className="ds-progress__fill" style={{ inlineSize: "100%", background: `var(--progress-fill-${tone})` }} />}
                  {!filled && partial > 0 && <div className="ds-progress__fill" style={{ inlineSize: `${partial}%`, background: `var(--progress-fill-${tone})` }} />}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="ds-progress__fill"
            style={{
              inlineSize: indeterminate ? undefined : `${pct}%`,
              background: `var(--progress-fill-${tone})`,
            }}
          />
        )}
      </div>
      {description && <p className="ds-progress__description">{description}</p>}
    </div>
  );
};

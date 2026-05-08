import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";
import { createPortal } from "react-dom";
import "./Popover.css";

export interface PopoverProps {
  trigger: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: (args: { close: () => void }) => ReactNode;
  /** Preferred placement; auto-flips to "top" if there's no room below. */
  placement?: "bottom-start" | "bottom-end";
  /** Match the trigger's width. */
  matchWidth?: boolean;
}

/**
 * Internal popover primitive used by Select, MultiSelect, and Menu.
 * Anchors to a trigger, flips on viewport collision, traps focus when open,
 * closes on outside click / Escape, and returns focus to the trigger on close.
 */
export const Popover = ({
  trigger,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  placement = "bottom-start",
  matchWidth = false,
}: PopoverProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const popoverId = useId();

  const [pos, setPos] = useState<{ top: number; left: number; minWidth: number; flipped: boolean }>({
    top: 0,
    left: 0,
    minWidth: 0,
    flipped: false,
  });

  // Position
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const t = triggerRef.current.getBoundingClientRect();
    const margin = 4;
    const popH = popoverRef.current?.offsetHeight ?? 0;
    const popW = popoverRef.current?.offsetWidth ?? t.width;
    const spaceBelow = window.innerHeight - t.bottom;
    const spaceAbove = t.top;
    const flipUp = spaceBelow < popH + margin && spaceAbove > spaceBelow;

    const top = flipUp
      ? window.scrollY + t.top - popH - margin
      : window.scrollY + t.bottom + margin;
    let left = window.scrollX + (placement === "bottom-end" ? t.right - popW : t.left);
    // Shift on viewport collision
    const max = window.scrollX + window.innerWidth - popW - margin;
    if (left > max) left = max;
    if (left < margin) left = margin;

    setPos({ top, left, minWidth: t.width, flipped: flipUp });
  }, [open, placement]);

  // Outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  // Initial focus inside the popover when opened
  useEffect(() => {
    if (open && popoverRef.current) {
      const first = popoverRef.current.querySelector<HTMLElement>(
        '[role="menuitem"], [role="option"], button, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }
  }, [open]);

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<any>, {
        ref: triggerRef as React.Ref<HTMLElement>,
        id: (trigger.props as any).id ?? triggerId,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": open ? popoverId : undefined,
        onClick: (e: React.MouseEvent) => {
          (trigger.props as any).onClick?.(e);
          setOpen(!open);
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          (trigger.props as any).onKeyDown?.(e);
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            if (!open) {
              e.preventDefault();
              setOpen(true);
            }
          }
        },
      })
    : trigger;

  return (
    <>
      {triggerEl}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            role="presentation"
            className="ds-popover"
            style={{
              top: pos.top,
              left: pos.left,
              minWidth: matchWidth ? pos.minWidth : undefined,
            }}
          >
            {children({ close: () => { setOpen(false); triggerRef.current?.focus(); } })}
          </div>,
          document.body
        )}
    </>
  );
};

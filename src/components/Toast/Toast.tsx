import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ToastContextValue,
  ToastInstance,
  ToastOptions,
  ToastPosition,
} from "./Toast.types.ts";
import "./Toast.css";

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

const ICONS: Record<ToastInstance["tone"], string> = {
  info: "i", success: "✓", warning: "!", danger: "!", neutral: "•",
};

interface ProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  /** Max simultaneously visible. Overflow queues. Default 3. */
  max?: number;
}

export const ToastProvider = ({
  children,
  position = "top-right",
  max = 3,
}: ProviderProps) => {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const queue = useRef<ToastInstance[]>([]);
  const timers = useRef<Map<string, number>>(new Map());
  const paused = useRef<Set<string>>(new Set());

  const flushQueue = useCallback(() => {
    setToasts((prev) => {
      const slots = max - prev.length;
      if (slots <= 0 || queue.current.length === 0) return prev;
      const next = queue.current.splice(0, slots);
      return [...prev, ...next];
    });
  }, [max]);

  const startTimer = useCallback((t: ToastInstance) => {
    if (t.duration === 0) return;
    const id = window.setTimeout(() => dismiss(t.id), t.duration);
    timers.current.set(t.id, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearTimer = useCallback((id: string) => {
    const handle = timers.current.get(id);
    if (handle) window.clearTimeout(handle);
    timers.current.delete(id);
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
      // After remove, give next queued toast a slot.
      requestAnimationFrame(flushQueue);
    },
    [clearTimer, flushQueue]
  );

  const toast = useCallback(
    (options: ToastOptions): string => {
      const instance: ToastInstance = {
        id: options.id ?? `t-${Math.random().toString(36).slice(2, 9)}`,
        tone: options.tone ?? "neutral",
        title: options.title,
        description: options.description,
        action: options.action,
        duration: options.duration ?? 5000,
        dismissible: options.dismissible ?? true,
      };
      setToasts((prev) => {
        if (prev.length >= max) {
          queue.current.push(instance);
          return prev;
        }
        return [...prev, instance];
      });
      return instance.id;
    },
    [max]
  );

  const dismissAll = useCallback(() => {
    timers.current.forEach((h) => window.clearTimeout(h));
    timers.current.clear();
    queue.current = [];
    setToasts([]);
  }, []);

  // Start/refresh timers when visible toasts change.
  useEffect(() => {
    toasts.forEach((t) => {
      if (!timers.current.has(t.id) && !paused.current.has(t.id)) {
        startTimer(t);
      }
    });
  }, [toasts, startTimer]);

  // Cleanup on unmount.
  useEffect(() => () => timers.current.forEach((h) => window.clearTimeout(h)), []);

  const value = useMemo<ToastContextValue>(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={`ds-toast-region ds-toast-region--${position}`}
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`ds-toast ds-toast--${t.tone}`}
            role={t.tone === "danger" || t.tone === "warning" ? "alert" : "status"}
            aria-live={t.tone === "danger" || t.tone === "warning" ? "assertive" : "polite"}
            onMouseEnter={() => {
              paused.current.add(t.id);
              clearTimer(t.id);
            }}
            onMouseLeave={() => {
              paused.current.delete(t.id);
              startTimer(t);
            }}
            onFocus={() => {
              paused.current.add(t.id);
              clearTimer(t.id);
            }}
            onBlur={() => {
              paused.current.delete(t.id);
              startTimer(t);
            }}
          >
            <span className="ds-toast__icon" aria-hidden="true">{ICONS[t.tone]}</span>
            <div className="ds-toast__body">
              <div className="ds-toast__title">{t.title}</div>
              {t.description && <div className="ds-toast__description">{t.description}</div>}
            </div>
            {t.action && (
              <button
                type="button"
                className="ds-toast__action"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            {t.dismissible && (
              <button
                type="button"
                className="ds-toast__dismiss"
                aria-label="Dismiss notification"
                onClick={() => dismiss(t.id)}
              >×</button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

import type { ReactNode } from "react";

export type ToastTone = "info" | "success" | "warning" | "danger" | "neutral";
export type ToastPosition =
  | "top-right" | "top-center" | "bottom-right" | "bottom-center";

export interface ToastOptions {
  id?: string;
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  /** Milliseconds before auto-dismiss. 0 = never. Default 5000. */
  duration?: number;
  /** Disable the dismiss "×" button. */
  dismissible?: boolean;
}

export interface ToastInstance extends Required<Pick<ToastOptions, "id" | "tone" | "duration" | "dismissible">> {
  title: ReactNode;
  description?: ReactNode;
  action?: ToastOptions["action"];
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

import type { ReactElement, ReactNode } from "react";

export type MenuItem =
  | {
      kind?: "item";
      id: string;
      label: ReactNode;
      icon?: ReactNode;
      shortcut?: string;
      disabled?: boolean;
      destructive?: boolean;
      onSelect: () => void;
    }
  | { kind: "divider"; id: string }
  | {
      kind: "checkbox";
      id: string;
      label: ReactNode;
      checked: boolean;
      onChange: (checked: boolean) => void;
      disabled?: boolean;
    }
  | {
      kind: "submenu";
      id: string;
      label: ReactNode;
      icon?: ReactNode;
      items: MenuItem[];
    };

export interface MenuProps {
  trigger: ReactElement;
  items: MenuItem[];
  /** Accessible name for the menu — required if the trigger has no visible label. */
  "aria-label"?: string;
}

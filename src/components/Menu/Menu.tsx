import React, { useState } from "react";
import type { MenuItem, MenuProps } from "./Menu.types.ts";
import { Popover } from "../Popover/Popover.tsx";
import "./Menu.css";

const MenuList = ({
  items,
  onClose,
  ariaLabel,
}: {
  items: MenuItem[];
  onClose: () => void;
  ariaLabel?: string;
}) => {
  const [openSub, setOpenSub] = useState<string | null>(null);

  return (
    <div role="menu" aria-label={ariaLabel} className="ds-menu">
      {items.map((item) => {
        if ("kind" in item && item.kind === "divider") {
          return <div key={item.id} role="separator" className="ds-menu__divider" />;
        }
        if ("kind" in item && item.kind === "checkbox") {
          return (
            <button
              key={item.id}
              type="button"
              role="menuitemcheckbox"
              aria-checked={item.checked}
              disabled={item.disabled}
              tabIndex={-1}
              className="ds-menu__item"
              onClick={() => item.onChange(!item.checked)}
            >
              <span className="ds-menu__check" aria-hidden="true">{item.checked ? "✓" : ""}</span>
              <span className="ds-menu__label">{item.label}</span>
            </button>
          );
        }
        if ("kind" in item && item.kind === "submenu") {
          const isOpen = openSub === item.id;
          return (
            <div key={item.id} className="ds-menu__submenu-wrapper">
              <button
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                tabIndex={-1}
                className="ds-menu__item"
                onClick={() => setOpenSub(isOpen ? null : item.id)}
              >
                {item.icon && <span className="ds-menu__icon" aria-hidden="true">{item.icon}</span>}
                <span className="ds-menu__label">{item.label}</span>
                <span className="ds-menu__shortcut" aria-hidden="true">›</span>
              </button>
              {isOpen && (
                <div className="ds-menu__submenu">
                  <MenuList items={item.items} onClose={onClose} />
                </div>
              )}
            </div>
          );
        }
        // Plain item
        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            tabIndex={-1}
            className={[
              "ds-menu__item",
              item.destructive && "ds-menu__item--destructive",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              item.onSelect();
              onClose();
            }}
          >
            {item.icon && <span className="ds-menu__icon" aria-hidden="true">{item.icon}</span>}
            <span className="ds-menu__label">{item.label}</span>
            {item.shortcut && <span className="ds-menu__shortcut" aria-hidden="true">{item.shortcut}</span>}
          </button>
        );
      })}
    </div>
  );
};

export const Menu = ({ trigger, items, "aria-label": ariaLabel }: MenuProps) => (
  <Popover trigger={trigger}>
    {({ close }) => <MenuList items={items} onClose={close} ariaLabel={ariaLabel} />}
  </Popover>
);

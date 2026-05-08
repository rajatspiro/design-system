import React, { Children, cloneElement, isValidElement, forwardRef } from "react";
import type { HTMLAttributes, ReactElement } from "react";
import type { ButtonProps } from "../Button/Button.types.ts";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Override the variant of every child Button. */
  variant?: ButtonProps["variant"];
  /** Override the size of every child Button. */
  size?: ButtonProps["size"];
  /** Accessible group name. */
  "aria-label"?: string;
}

/**
 * Connected horizontal group of Buttons. Children must be <Button> elements.
 * Borders collapse between adjacent buttons.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, variant, size, className, ...rest }, ref) => {
    const wrapped = Children.map(children, (child) => {
      if (!isValidElement(child)) return child;
      const el = child as ReactElement<ButtonProps>;
      return cloneElement(el, {
        variant: variant ?? el.props.variant,
        size: size ?? el.props.size,
      });
    });

    return (
      <div
        ref={ref}
        role="group"
        className={["ds-button-group", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {wrapped}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

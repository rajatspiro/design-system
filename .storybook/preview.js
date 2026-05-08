import React, { useEffect } from "react";
import "../src/index.css";

/* ---- Theme + density decorator ----
 * Toggles [data-theme] and [data-density] on <html> based on global toolbars.
 * Storybook UI gets a Theme (Light/Dark) and Density (Compact/Comfortable)
 * picker; Chromatic snapshots the four-corner matrix via parameters.chromatic.modes.
 */
const withGlobals = (Story, context) => {
  const theme = context.globals.theme || "light";
  const density = context.globals.density || "compact";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (density === "comfortable") root.setAttribute("data-density", "comfortable");
    else root.removeAttribute("data-density");
  }, [theme, density]);

  return React.createElement(
    "div",
    {
      style: {
        background: "var(--color-surface-default)",
        color: "var(--color-text-primary)",
        padding: "var(--space-4)",
        minHeight: "100%",
        fontFamily: "var(--font-family-sans)",
      },
      "data-story-theme": theme,
      "data-story-density": density,
    },
    React.createElement(Story, null)
  );
};

/** @type { import('@storybook/react-webpack5').Preview } */
const preview = {
  decorators: [withGlobals],

  globalTypes: {
    theme: {
      name: "Theme",
      description: "Design system theme",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark",  title: "Dark",  icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      name: "Density",
      description: "Touch-target density",
      defaultValue: "compact",
      toolbar: {
        icon: "graphline",
        items: [
          { value: "compact",     title: "Compact" },
          { value: "comfortable", title: "Comfortable" },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },

    /* Chromatic four-corner matrix.
     * `modes` requires the @chromatic-com/storybook addon to capture all
     * four snapshots per story. Without that addon, snapshots default to
     * whatever the toolbars are set to.
     */
    chromatic: {
      modes: {
        "light-compact":     { theme: "light", density: "compact" },
        "dark-compact":      { theme: "dark",  density: "compact" },
        "light-comfortable": { theme: "light", density: "comfortable" },
        "dark-comfortable":  { theme: "dark",  density: "comfortable" },
      },
      diffThreshold: 0.2,
      pauseAnimationAtEnd: true,
    },

    viewport: {
      viewports: {
        mobile:  { name: "Mobile (375)",  styles: { width: "375px",  height: "812px" } },
        tablet:  { name: "Tablet (768)",  styles: { width: "768px",  height: "1024px" } },
        desktop: { name: "Desktop (1280)", styles: { width: "1280px", height: "800px" } },
      },
    },

    a11y: { test: "todo" },
  },
};

export default preview;

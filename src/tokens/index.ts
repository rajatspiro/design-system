/**
 * Token type definitions.
 * Provides autocomplete and type-safety for token names so that
 * dynamic consumers (e.g. `style={{ color: t('--color-text-primary') }}`)
 * stay in sync with the CSS layer.
 *
 * The CSS variables themselves are declared in:
 *   - tokens/primitives.css
 *   - tokens/semantics.css
 *   - tokens/component-tokens.css
 *
 * Strict layering rule:
 *   PrimitiveToken  ← raw values
 *   SemanticToken   ← may consume PrimitiveToken only
 *   ComponentToken  ← may consume SemanticToken only
 *   Components      ← may consume ComponentToken only
 */

/* ---------- PRIMITIVE TOKENS ---------- */

export type ColorScale =
  | "50" | "100" | "200" | "300" | "400" | "500"
  | "600" | "700" | "800" | "900" | "950";

export type ColorFamily =
  | "neutral" | "brand" | "info" | "success" | "warning" | "danger";

export type ColorPrimitiveToken =
  | `--color-${ColorFamily}-${ColorScale}`
  | "--color-white"
  | "--color-black"
  | "--color-transparent";

export type SpacePrimitiveToken =
  | "--space-0" | "--space-1" | "--space-2" | "--space-3" | "--space-4"
  | "--space-5" | "--space-6" | "--space-8" | "--space-10" | "--space-12"
  | "--space-16" | "--space-20" | "--space-24" | "--space-32";

export type FontSizeToken =
  | "--font-size-50" | "--font-size-100" | "--font-size-200"
  | "--font-size-300" | "--font-size-400" | "--font-size-500"
  | "--font-size-600" | "--font-size-700" | "--font-size-800"
  | "--font-size-900";

export type FontWeightToken =
  | "--font-weight-regular" | "--font-weight-medium"
  | "--font-weight-semibold" | "--font-weight-bold";

export type FontFamilyToken =
  | "--font-family-sans" | "--font-family-serif" | "--font-family-mono";

export type LineHeightToken =
  | "--line-height-tight" | "--line-height-snug" | "--line-height-normal"
  | "--line-height-relaxed" | "--line-height-loose";

export type LetterSpacingToken =
  | "--letter-spacing-tight" | "--letter-spacing-normal"
  | "--letter-spacing-wide"  | "--letter-spacing-wider";

export type RadiusToken =
  | "--radius-none" | "--radius-xs" | "--radius-sm" | "--radius-md"
  | "--radius-lg" | "--radius-xl" | "--radius-2xl" | "--radius-full";

export type BorderWidthToken =
  | "--border-width-0" | "--border-width-1" | "--border-width-2" | "--border-width-4";

export type ShadowToken =
  | "--shadow-0" | "--shadow-1" | "--shadow-2"
  | "--shadow-3" | "--shadow-4" | "--shadow-5";

export type OpacityToken =
  | "--opacity-0" | "--opacity-5" | "--opacity-10" | "--opacity-20"
  | "--opacity-40" | "--opacity-60" | "--opacity-80" | "--opacity-100";

export type DurationToken =
  | "--duration-instant" | "--duration-fast" | "--duration-base"
  | "--duration-slow" | "--duration-slower";

export type EaseToken =
  | "--ease-linear" | "--ease-in" | "--ease-out"
  | "--ease-in-out" | "--ease-spring";

export type ZIndexToken =
  | "--z-base" | "--z-dropdown" | "--z-sticky" | "--z-overlay"
  | "--z-modal" | "--z-toast" | "--z-tooltip";

export type PrimitiveToken =
  | ColorPrimitiveToken
  | SpacePrimitiveToken
  | FontSizeToken
  | FontWeightToken
  | FontFamilyToken
  | LineHeightToken
  | LetterSpacingToken
  | RadiusToken
  | BorderWidthToken
  | ShadowToken
  | OpacityToken
  | DurationToken
  | EaseToken
  | ZIndexToken;

/* ---------- SEMANTIC TOKENS ---------- */

export type SurfaceToken =
  | "--color-surface-default" | "--color-surface-raised"
  | "--color-surface-sunken"  | "--color-surface-overlay"
  | "--color-surface-inverse" | "--color-surface-brand"
  | "--color-surface-info-subtle" | "--color-surface-success-subtle"
  | "--color-surface-warning-subtle" | "--color-surface-danger-subtle";

export type TextColorToken =
  | "--color-text-primary" | "--color-text-secondary" | "--color-text-tertiary"
  | "--color-text-muted"   | "--color-text-disabled"  | "--color-text-inverse"
  | "--color-text-on-brand"| "--color-text-link"      | "--color-text-link-hover"
  | "--color-text-success" | "--color-text-warning"   | "--color-text-danger"
  | "--color-text-info";

export type BorderColorToken =
  | "--color-border-default" | "--color-border-subtle" | "--color-border-strong"
  | "--color-border-focus"   | "--color-border-disabled"
  | "--color-border-error"   | "--color-border-success"
  | "--color-border-warning" | "--color-border-info";

export type ActionRole = "primary" | "secondary" | "tertiary" | "destructive";
export type ActionSlot = "bg" | "bg-hover" | "bg-active" | "bg-disabled" | "fg";
export type ActionToken = `--color-action-${ActionRole}-${ActionSlot}`;

export type FeedbackRole = "info" | "success" | "warning" | "danger";
export type FeedbackSlot = "bg" | "border" | "fg" | "icon";
export type FeedbackToken = `--color-feedback-${FeedbackRole}-${FeedbackSlot}`;

export type ElevationToken =
  | "--elevation-e0" | "--elevation-e1" | "--elevation-e2"
  | "--elevation-e3" | "--elevation-e4" | "--elevation-e5";

export type TypographyRole =
  | "display-l" | "display-m" | "display-s"
  | "heading-1" | "heading-2" | "heading-3"
  | "heading-4" | "heading-5" | "heading-6"
  | "body-l" | "body-m" | "body-s"
  | "label-l" | "label-m" | "label-s"
  | "caption" | "code" | "overline";

export type TypographyTokenSlot = "size" | "line" | "weight";
export type TypographyToken = `--text-${TypographyRole}-${TypographyTokenSlot}`;

export type SpacingRoleToken =
  | "--space-inset-sm" | "--space-inset-md" | "--space-inset-lg" | "--space-inset-xl"
  | "--space-stack-xs" | "--space-stack-sm" | "--space-stack-md"
  | "--space-stack-lg" | "--space-stack-xl"
  | "--space-inline-xs" | "--space-inline-sm"
  | "--space-inline-md" | "--space-inline-lg";

export type SemanticToken =
  | SurfaceToken
  | TextColorToken
  | BorderColorToken
  | ActionToken
  | FeedbackToken
  | ElevationToken
  | TypographyToken
  | SpacingRoleToken;

/* ---------- COMPONENT TOKENS ---------- */

export type ButtonVariant =
  | "primary" | "secondary" | "tertiary"
  | "destructive" | "destructive-secondary" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type InputSize = "sm" | "md" | "lg";

export type ComponentToken =
  | `--button-${string}`
  | `--field-${string}`
  | `--input-${string}`
  | `--numeric-${string}`
  | `--textarea-${string}`
  | `--radio-${string}`
  | `--checkbox-${string}`
  | `--toast-${string}`
  | `--badge-${string}`
  | `--tag-${string}`
  | `--tabs-${string}`
  | `--dropdown-${string}`
  | `--select-${string}`
  | `--progress-${string}`;

/* ---------- UNION ---------- */

export type DesignToken = PrimitiveToken | SemanticToken | ComponentToken;

/**
 * Type-safe helper for referencing tokens in inline styles.
 *
 *   style={{ color: t("--color-text-primary") }}
 */
export const t = (token: DesignToken): string => `var(${token})`;

/* ---------- THEME ---------- */

export type Theme = "light" | "dark";

/** Apply a theme to the document via the [data-theme] attribute. */
export const setTheme = (theme: Theme): void => {
  if (typeof document !== "undefined") {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
};

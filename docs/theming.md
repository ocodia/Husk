# Theming

Husk has three token levels: reference scales, semantic roles and local component geometry. All defaults live in the `husk` cascade layer. Unlayered application CSS overrides them without specificity battles. Native HTML and interaction semantics stay the same when a theme changes.

## Reference scales

Set reference overrides on `:root`. Lengths use rem so they respect the user's root font size. These scales are available now:

| Family | Names | Defaults, in order |
| --- | --- | --- |
| Spacing | `--husk-space-0` through `--husk-space-8` | `0`, `.25rem`, `.5rem`, `.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem` |
| Radius | `--husk-radius-none`, `-sm`, `-md`, `-lg`, `-pill` | `0`, `.125rem`, `.375rem`, `.75rem`, `999px` |
| Font size | `--husk-font-size-xs`, `-sm`, `-md`, `-lg`, `-xl`, `-2xl`, `-3xl` | `.75rem`, `.875rem`, `1rem`, `1.2rem`, `1.4rem`, `2.25rem`, `3rem` |
| Weight | `--husk-font-weight-normal`, `-medium`, `-bold` | `400`, `600`, `700` |
| Line height | `--husk-line-height-body`, `--husk-line-height-heading` | `1.6`, `1.2` |

Suffixes in the tables share the full prefix of the first name. For example, radius `-sm` means `--husk-radius-sm`.

The existing `--husk-space` defaults to `var(--husk-space-4)` and `--husk-radius` to `var(--husk-radius-md)`. Existing application overrides still win. Global spacing controls the established margins/layout gaps and default panel padding; it does not rescale every control's padding.

Body text uses `--husk-font-size-body`, defaulting to `clamp(var(--husk-font-size-md), .96rem + .2vw, 1.125rem)`. Heading 1 uses `--husk-font-size-heading-1`, defaulting to `clamp(2rem, 1.5rem + 2vw, var(--husk-font-size-3xl))`; heading 2 uses `--husk-font-size-heading-2`, defaulting to `clamp(1.65rem, 1.35rem + 1vw, var(--husk-font-size-2xl))`. Headings 3–6 use xl, lg, md and sm. These preserve the previous default sizes. Inline small text and code retain relative em sizing.

```css
:root {
  --husk-space-4: 1.125rem;
  --husk-radius-md: .5rem;
  --husk-font-size-xl: 1.5rem;
  --husk-content-width: 80rem;
}
```

## Semantic roles

| Purpose | Available variables |
| --- | --- |
| Text and backgrounds | `--husk-text`, `--husk-heading`, `--husk-muted`, `--husk-canvas`, `--husk-surface` |
| Boundaries and errors | `--husk-border`, `--husk-control-border`, `--husk-invalid` |
| Links | `--husk-link`, `--husk-link-hover` |
| Actions | `--husk-action-bg`, `--husk-action-hover`, `--husk-action-text` |
| Focus | `--husk-focus`, `--husk-focus-edge`, `--husk-focus-width` |
| Header and highlights | `--husk-header-bg`, `--husk-header-border`, `--husk-mark-bg`, `--husk-mark-text` |
| Typography | `--husk-font-sans`, `--husk-font-mono`, plus size/weight/line-height tokens above |
| Geometry | `--husk-space`, `--husk-radius`, `--husk-content-width`, `--husk-reading-width`, `--husk-gutter` |

Each of **info**, **success**, **warning**, **danger**, **selected**, **disabled** and **busy** has a `--husk-<role>-text`, `--husk-<role>-bg` and `--husk-<role>-border` triplet. For example, `--husk-warning-text`, `--husk-warning-bg` and `--husk-warning-border`. All have coordinated light/dark defaults.

`--husk-invalid` defaults to `var(--husk-danger-border)`, preserving its previous colors and independent override. Selection text defaults to the heading color; its marker defaults to the link color. Busy colors default to the information triplet. Disabled native controls now use the disabled colors at full opacity so text remains legible. Native disabled behavior is unchanged.

State colors alone do not implement widgets or semantics. Use visible state wording, a marker, and the appropriate native/ARIA state. The workspace uses selection colors with `aria-current`; workbench samples use explicit headings. Callout, badge, toast, size and density APIs remain planned.

```css
:root {
  --husk-success-text: #14532d;
  --husk-success-bg: #edf8f0;
  --husk-success-border: #287a45;
}
```

Define foreground/background/marker pairs together, including separate dark values. Colors are semantic roles rather than a requirement to reuse the brand action color for every status.

## Focus is one coordinated pair

The default pair is yellow `--husk-focus: #ffdd00` and dark `--husk-focus-edge: #0b0c0c`, with `--husk-focus-width: 3px`. Controls/error summaries use the pair as an outline and outer edge. Focused links/disclosures use the focus fill, dark text and edge. Skip links use the same colors. Header and workspace navigation no longer hard-code a separate palette.

```css
:root {
  --husk-focus: #bde9ff;
  --husk-focus-edge: #102a43;
  --husk-focus-width: 3px;
}
```

Keep the width at least 3px and verify both colors together. A light color remains distinct against dark surfaces and a dark edge against light surfaces; focused text must also contrast with its fill. Changing only one color can destroy that relationship. The workbench offers both pairs for inspection.

In forced-colors mode, focused controls, summaries and skip links use a system `Highlight` outline with an offset and no box shadow. Focused text uses `LinkText` on `Canvas`. The browser's contrast palette takes precedence over the brand pair. Follow the [GOV.UK focus rationale](https://design-system.service.gov.uk/get-started/focus-states/) and verify custom surfaces in their actual context.

## Component scope and precedence

Layout variables are listed in [the current reference](reference.md#layout-elements). Set local geometry on the component itself:

```css
#projects {
  --husk-grid-min: 20rem;
  --husk-grid-gap: var(--husk-space-5);
}
```

Each nested layout declares its own geometry defaults. Global semantic colors inherit. CSS aliases resolve where they are declared: changing a reference token on a descendant does not recompute an inherited root alias. Override references on `:root`, or override the local semantic/component variable directly.

Precedence follows normal CSS: an explicit application `--husk-space` overrides its default reference alias; a root reference override updates aliases that still use the default. Legacy light/dark color and font fallbacks remain supported. `--interactive` continues to control links only; actions have separate tokens.

Global light/dark modes are root-scoped. An embedded light panel on a dark page requires explicit local semantic values, including aliases that need recomputation. `data-theme` on an arbitrary descendant is not a complete theme switch.

## Use the forest brand

```html
<html lang="en" data-brand="forest">
  <!-- in head, after Husk -->
  <link rel="stylesheet" href="css/husk.css">
  <link rel="stylesheet" href="themes/forest.css">
</html>
```

The optional stylesheet supplies light/dark link, action, selection and header colors. It keeps shared text, surfaces, feedback and focus defaults. Paths above are relative to a project root.

Set `data-theme="light"` or `data-theme="dark"` on `html` to force a mode; remove it for system preference. For another brand, start from [forest.css](../themes/forest.css): declare light values, a `prefers-color-scheme: dark` override excluding explicit light, and an explicit-dark override. Verify hover, invalid, selected and disabled states as well as the default palette.

## Verify a theme

The [theme workbench](../examples/themes.html) shows real controls, disabled/read-only states, semantic color samples and selectable focus palettes. Its state sample selectors are demonstration application CSS, not a public variant API.

Browser checks exercise computed token overrides, legacy fallbacks, text/marker contrast in two brands and modes, checkbox dimensions, and focused controls/text/header/summary/skip links. Default state text is checked against 4.5:1; applicable sample markers against 3:1. Disabled text is held to the same text target as a design choice, even though inactive controls are exempt from the relevant contrast criteria. [WCAG non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Test forced colors, text resizing/spacing, zoom, reflow, print and actual screen-reader behavior separately. Contrast calculations are partial evidence. Applications that override tokens must verify the resulting combinations. Dated results and remaining work are in [ACCESSIBILITY.md](../ACCESSIBILITY.md).

## Still planned

Full palette ramps, elevation/motion scales, shared action variants, density and control-size APIs, nested theme switching and token JSON export remain roadmap work. No attributes or package entry points are added by defining these tokens.

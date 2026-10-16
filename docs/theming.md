# Theming

Theme by changing variables, keeping HTML meaning and interaction contracts intact. The current stylesheet provides a semantic palette, system/light/dark modes, local layout variables and low-specificity defaults inside the `husk` cascade layer.

## Use the current tokens

| Purpose | Available variables |
| --- | --- |
| Text and backgrounds | `--husk-text`, `--husk-heading`, `--husk-muted`, `--husk-canvas`, `--husk-surface` |
| Boundaries and errors | `--husk-border`, `--husk-control-border`, `--husk-invalid` |
| Links | `--husk-link`, `--husk-link-hover` |
| Actions | `--husk-action-bg`, `--husk-action-hover`, `--husk-action-text` |
| Focus | `--husk-focus`, `--husk-focus-edge` (some link/summary/skip styles currently use fixed accessible colors) |
| Header and highlights | `--husk-header-bg`, `--husk-header-border`, `--husk-mark-bg`, `--husk-mark-text` |
| Typography | `--husk-font-sans`, `--husk-font-mono` |
| Geometry | `--husk-space`, `--husk-radius`, `--husk-content-width`, `--husk-reading-width`, `--husk-gutter` |

Layout variables are listed in [the current reference](reference.md#layout-elements). Set component geometry on the component itself: each nested layout declares its own defaults. Global semantic colors inherit; repeated nested components do not inherit an ancestor's local gap override.

```css
/* Application CSS, loaded after husk.css */
:root {
  --husk-content-width: 80rem;
  --husk-radius: .5rem;
}
#projects {
  --husk-grid-min: 20rem;
  --husk-grid-gap: 1.5rem;
}
```

Global light/dark overrides are root-scoped today. An embedded light panel on a dark page requires explicit local variables; `data-theme` on an arbitrary descendant is not a supported complete theme switch.

## Use the forest brand

```html
<html lang="en" data-brand="forest">
  <!-- in head, after Husk -->
  <link rel="stylesheet" href="css/husk.css">
  <link rel="stylesheet" href="themes/forest.css">
</html>
```

The optional stylesheet supplies coordinated light/dark link, action and header colors. It leaves shared text, surfaces, borders and focus defaults in place. Paths above are relative to a project root. The theme workbench demonstrates both the default and forest brand.

Set `data-theme="light"` or `data-theme="dark"` on `html` to force a mode; remove it for the system preference. To define another brand, start from [forest.css](../themes/forest.css): declare light values, a `prefers-color-scheme: dark` override excluding explicit light, and an explicit-dark override. Define text/background pairs together, including hover and invalid states. Changing one “primary” color cannot guarantee a usable theme.

## Token architecture for the full system

The next foundation phase will introduce three documented levels without removing existing names:

1. Reference values: palettes, a rem spacing scale (4/8/12/16/24/32px equivalents), typography, radii, elevation and motion.
2. Semantic roles: text/surface/border, action emphasis, informational/success/warning/danger feedback, selection, focus, disabled and busy states.
3. Component aliases: local geometry and exceptional semantic needs. Avoid a new token for every declaration.

Only the variables in the current reference exist today. Proposed density, shared sizes, variant attributes, elevation/motion scales, theme-scoped components and token JSON export are roadmap work. Preserve legacy variable fallbacks while introducing aliases; document precedence and migration.

## Verify a theme

Test default, hover, focus, selected/current, invalid, disabled and busy states in both modes. Target WCAG 2.2 AA: normal text 4.5:1, large text 3:1, and applicable UI boundaries/state indicators 3:1 against adjacent colors. Also check keyboard focus, forced colors, zoom, reflow, print and reduced motion. Contrast ratios alone do not establish accessibility. [WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

The workbench reports its actual selected brand and mode; it does not automatically certify arbitrary palettes. Applications that override tokens inherit responsibility for verifying the result. Current browser evidence and remaining checks are in [ACCESSIBILITY.md](../ACCESSIBILITY.md).

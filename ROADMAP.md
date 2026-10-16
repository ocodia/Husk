# Husk roadmap

Husk is becoming an HTML-first UI system. Keep the CSS foundation useful on its own. Add optional elements and behavior as real interfaces need them.

This document records the agreed direction. Unchecked items are planned, not shipped. Element names and APIs below are proposals.

## Accessibility foundation

Use [ACCESSIBILITY.md](ACCESSIBILITY.md) as the component contract. Learn from GOV.UK while retaining native controls, light DOM, and the `h-` vocabulary.

- [x] Add CSS-only `h-field`, `h-hint`, and `h-error` wrappers.
- [x] Add optional `h-error-summary` focus and error-link behavior.
- [x] Add `h-skip-link` to the examples and strengthen focus/control contrast.
- [x] Demonstrate linked errors and preserved hints in the workspace form.
- [x] Add repeatable browser component checks and optional automated audits.
- [ ] Record a browser and assistive-technology test matrix with dated results.
- [ ] Supply verified transcripts/captions and visual descriptions for the legacy media examples.
- [ ] Complete zoom, text spacing, forced-colors, RTL, and screen-reader checks.
- [ ] Test tasks with disabled users before treating components as release-ready.

## Principles

- Use native HTML for content, controls, and platform behavior.
- Keep ordinary pages and forms class-free.
- Use custom elements for recurring arrangements or compound behavior that HTML does not supply.
- Prefer useful defaults over required configuration. Add attributes only for meaningful alternatives.
- Keep application content in light DOM by default so Husk and application CSS can style it.
- Reserve shadow DOM for components with a demonstrated need for isolated internals.
- Keep native buttons, links, inputs, and selects inside compound components where practical.
- Use native state attributes and appropriate ARIA states as the source of truth. Do not duplicate them with styling classes.
- Make the basic content usable before an optional behavior module loads.
- Use the WAI-ARIA Authoring Practices Guide (APG) as the interaction baseline. Validate implementations in actual browsers and assistive technology.

## Delivered foundation

- [x] Named cascade layer with low-specificity defaults.
- [x] CSS variables for theme, spacing, fonts, radius, and content width.
- [x] System light/dark themes and an optional root theme override.
- [x] Separate link and action colors, visible keyboard focus, and native validation styling.
- [x] Responsive content widths, logical properties, intrinsic image sizing, and print styles.
- [x] Optional `stack`, `cluster`, `grid`, and `table-scroll` classes.
- [x] Native disclosure, popover, and dialog styles.
- [x] Expanded element examples and optional demonstration JavaScript.
- [x] Select padding, arrow clearance, and a native forced-colors fallback.

These checks describe shipped features, not completion of a full accessibility audit.

## Layout elements

- [x] Add CSS-only `h-stack`, `h-cluster`, and `h-grid` elements with the same defaults as the existing layout classes.
- [x] Keep the class forms as compatible alternatives; neither form should require JavaScript.
- [ ] Establish one documented element prefix. Use `h-` provisionally; confirm it before publishing the component API.
- [x] Create a real application example combining a sidebar, toolbar, main content, form, and detail panel.
- [x] Document wrapping, content sizing, overflow, and reading-order behavior.

```html
<h-stack>
  <header><h1>Projects</h1></header>
  <h-grid>
    <section><h2>Current</h2><p>Project details.</p></section>
    <section><h2>Archived</h2><p>Previous work.</p></section>
  </h-grid>
</h-stack>
```

The first application example is [Fieldwork](workspace.html). Its layout works without JavaScript; optional application behavior saves project details and tasks on the device. The layout contract is in [the README](README.md#layout-elements).

Do not infer cards from `article`, sidebars from every `aside`, or grids from every `section`. Structure supplies meaning; a layout element supplies arrangement.

## General interface conventions

### Navigation and commands

Use links for destinations and buttons for actions. A row of links remains navigation even when it looks like tabs. Mark the current destination with `aria-current="page"`.

Ordinary sidebars should start as labelled `nav` elements with nested lists of links. Add disclosure controls when sections need collapsing. Do not assign menu or tree roles simply because navigation has nested items. [Disclosure navigation guidance](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/).

Reserve command menus for actions such as Rename, Duplicate, Export, and Delete. Opening a menu moves focus into its items. Arrows navigate; Enter activates; Escape closes and returns focus. Supply keyboard and visible-button access to context actions. [Menu pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).

### Tabs

Test whether headings and links are enough before introducing tabs. Use tabs for alternate panels within one context. Start with `h-tabs` as an optional enhancement over linked, readable sections, including a readable narrow-screen fallback. Do not hide sequential instructions or information users need to compare. [GOV.UK tabs guidance](https://design-system.service.gov.uk/components/tabs/).

Tab enters at the active tab; horizontal arrows move between tabs. Include Home/End. Use automatic activation only when panels appear immediately; otherwise require Enter/Space. Keep `aria-selected`, panel visibility, and label/control relationships synchronized. Inactive panels must not leave hidden controls in the keyboard sequence. [Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

### Trees

Use a true tree for explorer-style interaction with files, layers, or document nodes. Start with a single-selection `h-tree`; defer multi-selection and virtualization.

Up/Down move among visible nodes. Right expands or enters children. Left collapses or returns to the parent. Include Home/End and type-ahead. Expansion, selection, and activation are separate operations. A branch chevron expands without navigating. Only branches expose `aria-expanded`. Keep focused and selected nodes visually distinct. [Tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).

### Disclosures, choices, and toolbars

Keep `details`/`summary` for simple disclosures. Use native select for choosing an option; add a combobox only when search or richer suggestions justify it. Radio buttons express one choice from a visible set. Checkboxes express independent choices.

A toolbar groups related controls. Adopt its arrow-key interaction only when the component implements the complete toolbar pattern. Keep a plain group of buttons when that is sufficient. [Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/), [combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

### Dialogs and feedback

Use a modal dialog when a task must interrupt the current context. Prefer inline editing or a non-modal panel for routine work. Give dialogs a visible accessible title, deliberate initial focus, a close control, and a focus-return destination. Closing nested overlays should affect the topmost relevant overlay. [Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Show errors next to the affected control and associate the message with it. Use polite status announcements for background completion. Reserve urgent announcements for urgent information. Never require a disappearing toast to understand or repair a failed operation.

### Keyboard and focus

Follow DOM reading order; do not use positive `tabindex`. Tab moves between controls or compound widgets; arrows move within widgets that define that behavior. Use a single Tab entry point for tabs, trees, and command menus. Moving focus must not accidentally trigger navigation or destructive actions. After removing a focused item, move focus to a logical surviving control. [Keyboard guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/).

### Visual language

Adopt these as Husk design decisions, then test them in the application example:

- Distinguish focus, hover, pressed, selected, current, expanded, disabled, invalid, and busy states. Give each a consistent treatment across components.
- Use an outline for keyboard focus. Use fill plus a persistent marker for selection or current location. Do not rely on color alone.
- Keep surface, text, border, accent, danger, and focus variables separate. Add state variables only when multiple components need them.
- Use a small spacing scale based on 4px increments. Start with 4, 8, 12, 16, 24, and 32px expressed in rem. Review current spacing before introducing new tokens.
- Keep comfortable controls as the default. Add compact density only for interfaces that need it; preserve usable pointer targets and text zoom.
- Prefer one clear primary action per task group. Use labelled actions such as “Save changes” and “Delete project”. Offer undo where practical.
- Give icon-only controls accessible names. Keep destructive or unfamiliar actions visibly labelled. Do not make hover the only way to discover actions.
- Use a consistent icon family and stroke weight. Keep icons secondary to meaning and labels.
- Design empty, loading, error, and success states alongside the populated state. Preserve context while work is in progress.
- Keep data as semantic tables until spreadsheet-style cell navigation is needed. CSS `h-grid` layout must not acquire the unrelated ARIA `grid` role.

## Component delivery order

| Phase | Deliverables | Reason |
| --- | --- | --- |
| 1 | Layout elements and a realistic application example | Test composition before expanding the API |
| 2 | Disclosure navigation and tabs | Cover common navigation and panel patterns |
| 3 | Command menus and toolbars | Establish focus, dismissal, and command conventions |
| 4 | Single-selection tree | Build on established focus and state behavior |
| 5 | Searchable choices, multi-selection, richer data widgets | Add complexity only when the application requires it |

- [ ] Write each component's markup, keyboard, focus, state, and fallback contract before implementation.
- [ ] Keep component behavior modules optional and independent of `js/examples.js`.
- [ ] Initialize ARIA roles and hidden states only when the corresponding behavior is ready.
- [ ] Preserve content and native actions if enhancement fails.
- [ ] Establish lifecycle cleanup, repeated-initialization behavior, and nested-widget event ownership.
- [ ] Specify public events and attributes per component. Reuse native `input`/`change` semantics only when they describe the actual operation.
- [ ] Add real examples for loading, failure, long labels, nested widgets, and dynamic removal.

## Acceptance criteria

For each behavior component, verify keyboard operation, accessible names and states, focus movement, pointer/touch access, and behavior with JavaScript unavailable. Check light/dark themes, forced colors, right-to-left text, narrow screens, and zoom. Test in Chromium, Firefox, and Safari, with representative screen-reader checks.

Keep a proposed 5 KB gzip budget for the CSS foundation. Measure optional component CSS and JavaScript separately. Add dependencies only when they remove more complexity than they introduce.

APG examples are implementation guidance. They do not replace testing or establish conformance by themselves. [Pattern index](https://www.w3.org/WAI/ARIA/apg/patterns/).

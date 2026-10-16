# Accessibility in Husk

Husk's target is WCAG 2.2 AA, with stronger defaults where practical. This is a development target, not a claim that Husk or applications built with it have passed a full audit.

GOV.UK supplies useful design guidance. Husk implements its own markup and behavior, so GOV.UK's research and conformance do not transfer automatically. Accessibility requires continued testing with disabled people and assistive technology. [GOV.UK accessibility strategy](https://design-system.service.gov.uk/accessibility/accessibility-strategy/).

## HTML first, custom elements around it

Custom elements provide composition and enhancement. Native elements provide labels, controls, form submission, headings, lists, and landmarks.

```html
<h-field>
  <label for="name">Project name</label>
  <h-hint id="name-hint">Use a short name, up to 100 characters.</h-hint>
  <h-error id="name-error" hidden>Error: Enter a project name</h-error>
  <input id="name" name="name" maxlength="100"
         aria-describedby="name-hint" required>
</h-field>
```

`h-field`, `h-hint`, and `h-error` are CSS-only wrappers. They do not generate or replace the native label or input. An author's explicit IDs and associations work before JavaScript loads. Use a fieldset and legend for related controls; these wrappers do not replace their semantics. [GOV.UK text input guidance](https://design-system.service.gov.uk/components/text-input/).

Keep light DOM as the default. Do not move native controls behind a shadow boundary merely to encapsulate their styling. Add ARIA only when native HTML does not provide the required semantics. Layout elements remain non-interactive and receive no widget roles.

## Error recovery

Use specific messages that identify the answer and explain the correction. Keep the entered values. Show an inline message and a summary linking to every affected control. Add `aria-invalid="true"` and append the error ID to `aria-describedby`, preserving hint IDs. Prefix inline messages with real text such as “Error:”; color is not the only signal. [GOV.UK error messages](https://design-system.service.gov.uk/components/error-message/).

Place the summary near the top of main content. On unsuccessful submission, prefix the document title with “Error:”, show the summary, and focus it. Summary links focus the corresponding fields. The same error wording appears in the links and beside the fields. [GOV.UK error summary](https://design-system.service.gov.uk/components/error-summary/).

```html
<h-error-summary hidden tabindex="-1"
                 role="region" aria-labelledby="errors-title">
  <h2 id="errors-title">There is a problem</h2>
  <ul></ul>
</h-error-summary>
```

Load `js/components.js` to register the summary behavior. Its application API is:

```js
summary.show([{ control: nameInput, message: 'Enter a project name' }]);
summary.clear();
```

`show()` creates plain-text links and focuses the summary. It requires an `h2`, a `ul`, and controls with unique document IDs. Error links also reveal containing disclosures. `clear()` hides the summary and removes its links. The component cleans up its event listener when disconnected.

The application owns validation, inline messages, field associations, and the document title. The component does not invent validation rules or alter those states. A server can render a visible summary and inline errors using the same HTML; links still navigate without JavaScript.

The workspace demonstrates this contract. It validates on submission, preserves answers, retains errors until resubmission or reset, and restores the original title after correction. Native browser validation remains enabled unless the custom summary behavior is ready. Production applications must also validate submitted data on the server. [GOV.UK validation guidance](https://design-system.service.gov.uk/patterns/validation/).

Avoid combining focus movement with multiple assertive live announcements of the same errors. Husk's summary uses a labelled region and programmatic focus. Routine save messages use a separate polite status. Announcements still need verification with screen readers.

## Navigation and focus

`h-skip-link` wraps a real anchor. It becomes visible on focus and leads to a native `main` with `tabindex="-1"`. Keep it first in the body. No JavaScript is required. [GOV.UK skip link](https://design-system.service.gov.uk/components/skip-link/).

```html
<h-skip-link><a href="#main">Skip to main content</a></h-skip-link>
<main id="main" tabindex="-1">...</main>
```

Husk uses a yellow-and-dark focus treatment to remain distinguishable across surfaces. Text links and summaries receive a contrasting focused background. Forced-colors mode uses a system outline. Form-control borders have a separate contrast token. Test customized themes independently. [GOV.UK focus guidance](https://design-system.service.gov.uk/get-started/focus-states/).

## Complexity must earn its place

Use headings and links before hiding content behind tabs. Tabs are suitable for related alternate panels, not sequential instructions or information users must compare. The future `h-tabs` must preserve readable linked sections without JavaScript and support a readable narrow-screen fallback. [GOV.UK tabs guidance](https://design-system.service.gov.uk/components/tabs/).

Prefer disclosure navigation to trees for ordinary sidebars. Keep native select unless search is needed. Reserve command menus and ARIA grids for interfaces that need their complete interaction models. Follow the WAI-ARIA APG keyboard conventions for enhanced widgets.

## Component release checks

Every interactive component must document and check:

- Native markup, accessible names, descriptions, grouping, and states.
- Every keyboard operation, focus entry/exit, dismissal, and restoration.
- Behavior before JavaScript loads and when it fails.
- Empty, invalid, busy, disabled, long-content, and nested states.
- Text contrast, control contrast, and focus visibility in light/dark themes.
- 320 CSS-pixel reflow, 200% text resizing, 400% zoom, and user text spacing.
- Pointer targets, touch, right-to-left content, forced colors, reduced motion, and print.
- Chromium, Firefox, and Safari, with documented screen-reader/browser combinations.

Use automated checks to find defects, then perform manual checks and user testing. Do not hide audit findings with rule exclusions simply to obtain a passing score.

## Checks available now

Serve the repository and open `tests/accessibility.html`.

- **Run component checks** tests summary naming, focus, safe message rendering, error-link focus, disclosure opening, cleanup on reconnect, and clearing errors. It needs no network connection.
- **Check without JavaScript** loads the workspace with scripts blocked and checks native labels, hints, validation, and 320px LTR/RTL layout.
- **Audit examples with axe-core** loads pinned axe-core 4.14.0 from jsDelivr inside a test iframe. It checks all three examples in light/dark themes, plus the workspace's error state. This is a test-only dependency. Results include incomplete checks for manual review.

Manual checks still required include full keyboard traversal, actual screen-reader announcements, zoom/text-spacing behavior, forced colors, RTL, native control differences, and testing with disabled people. A passing automated run is not an accessibility certification.

The legacy audio/video examples still require verified transcripts, captions, and any necessary visual descriptions. Do not treat those media assets as a completed accessible-content example. Native select popup contrast also requires platform-specific manual review.

## Recorded checks: 16 October 2026

Safari on macOS, using the local HTTP examples:

- Six error-summary component checks passed.
- No-JavaScript workspace checks passed, including 320px LTR/RTL page overflow.
- Axe-core 4.14.0 reported zero violations for index, form, and workspace in both light/dark themes, including the embedded form preview.
- The workspace error-state audit reported zero violations. Browser assertions passed for summary focus, error links, preserved hints, field focus, and reset cleanup.
- Axe left native select contrast for manual review on each page, plus video captions on the index. These are not counted as passed checks.
- Default control-border contrast calculates to 4.82:1 in light mode and 5.94:1 in dark mode. Focus yellow/dark contrast calculates to 14.55:1. These figures cover those token pairs, not every possible theme or native popup.

This is a partial test record. Chromium, Firefox, actual screen-reader output, text resizing/zoom, forced colors, and disabled-user testing have not yet been completed for this change.

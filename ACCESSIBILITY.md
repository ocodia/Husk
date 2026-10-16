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

When used alone, the summary leaves validation, inline messages, field associations, and the document title to the application. An enclosing `h-form` now coordinates those responsibilities for one native form. The component does not invent validation rules or alter those states. A server can render a visible summary and inline errors using the same HTML; links still navigate without JavaScript.

The workspace uses `h-form` to demonstrate this contract. It validates on submission, preserves answers, retains errors until resubmission or reset, and restores the original title after correction. Native browser validation remains enabled unless the custom summary behavior is ready. Production applications must also validate submitted data on the server. [GOV.UK validation guidance](https://design-system.service.gov.uk/patterns/validation/).

Avoid combining focus movement with multiple assertive live announcements of the same errors. Husk's summary uses a labelled region and programmatic focus. Routine save messages use a separate polite status. Announcements still need verification with screen readers.

## Navigation and focus

`h-skip-link` wraps a real anchor. It becomes visible on focus and leads to a native `main` with `tabindex="-1"`. Keep it first in the body. No JavaScript is required. [GOV.UK skip link](https://design-system.service.gov.uk/components/skip-link/).

```html
<h-skip-link><a href="#main">Skip to main content</a></h-skip-link>
<main id="main" tabindex="-1">...</main>
```

Husk defaults to a yellow-and-dark focus pair across controls, links, disclosures, summaries, skip links and header/workspace navigation. Focused text uses the pair for fill/text/edge; controls and error summaries retain the two-color outline treatment. Both colors and the shared 3px width use documented tokens. Forced-colors mode uses a system outline and system text/background colors. Form-control borders have a separate contrast token. Test customized themes independently. [GOV.UK focus guidance](https://design-system.service.gov.uk/get-started/focus-states/).

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

- **Run component checks** tests summary naming, focus, safe message rendering, error-link focus, disclosure opening, native submission, form validation and reset, server-error adoption, custom-validity precedence, incomplete-summary fallback, dynamic fields, reconnect behavior, and layout variables. It needs no network connection.
- **Run example checks** tests catalogue filtering/reset, real brand/mode changes, token aliases and legacy overrides, state contrast, focus palettes, checkbox sizing, form values/errors, parsed server-response recovery, native dialog focus, and all five newer example pages at 320px in LTR/RTL with scripts blocked. It needs no network connection.
- **Check without JavaScript** loads the workspace with scripts blocked and checks native labels, hints, validation, and 320px LTR/RTL layout.
- **Audit examples with axe-core** loads pinned axe-core 4.14.0 from jsDelivr inside a test iframe. It checks all eight example pages in light/dark themes, both brands/focus palettes on the theme workbench (with header-link focus), and the workspace's error state. This is a test-only dependency. Results include incomplete checks for manual review.

Manual checks still required include full keyboard traversal, actual screen-reader announcements, zoom/text-spacing behavior, forced colors, RTL, native control differences, and testing with disabled people. A passing automated run is not an accessibility certification.

The legacy audio/video examples still require verified transcripts, captions, and any necessary visual descriptions. Do not treat those media assets as a completed accessible-content example. Native select popup contrast also requires platform-specific manual review.

## Recorded checks: 16 October 2026

Safari on macOS, using the local HTTP examples:

- All 37 component checks passed, covering error summaries, native submission, grouping, reset, dynamic fields, reconnect, multiple forms, and layout behavior.
- No-JavaScript workspace checks passed, including 320px LTR/RTL page overflow.
- Axe-core 4.14.0 reported zero violations for index, form, and workspace in both light/dark themes, including the embedded form preview.
- The workspace error-state audit reported zero violations. Browser assertions passed for summary focus, error links, preserved hints, field focus, and reset cleanup.
- Axe left native select contrast for manual review on each page, plus video captions on the index. These are not counted as passed checks.
- Default control-border contrast calculates to 4.82:1 in light mode and 5.94:1 in dark mode. Focus yellow/dark contrast calculates to 14.55:1. These figures cover those token pairs, not every possible theme or native popup.

This is a partial test record. Chromium, Firefox, actual screen-reader output, text resizing/zoom, forced colors, and disabled-user testing have not yet been completed for this change.

## UI-system documentation and examples: 17 October 2026

Safari on macOS, served locally:

- All 37 existing component checks and 27 new example integration checks passed. New checks cover catalogue filters and reset, theme attributes and computed colors, validation and FormData, dialog focus return, and four no-JavaScript pages at 320px in both LTR and RTL.
- Axe-core 4.14.0 reported zero violations for seven pages in light/dark, including both default/forest brands on the workbench (16 page/brand/mode combinations), plus the workspace's invalid-form state.
- The new example hub had no incomplete axe findings. Native select contrast remains an incomplete manual finding on the explorer, recipes and workbench; the legacy gallery's video captions remain unresolved.
- HTML/CSS parsing, JavaScript syntax, local documentation links/anchors and generated catalogue consistency checks passed.

These results do not complete the manual release gate. The full-system roadmap makes browser/screen-reader evidence, theme/state testing and disabled-user task testing prerequisites for stable components. Planned components have no accessibility implementation claim.

## Reusable-form contract

`h-form` wraps native HTML rather than replacing it. It automatically associates hints inside `h-field`, preserves other description IDs, and groups radio errors through their native fieldset. Valid submissions keep their native event and submitter; invalid submissions are stopped before ordinary application handlers. Validation runs on submission, not on every keystroke.

Required whitespace-only text is rejected. Disabled and read-only controls retain native validation eligibility. Custom validity messages remain supported. Authors can supply synchronous domain rules or display server errors through the documented API. Native validation remains the fallback before initialization, after disconnect, or when a wrapper contains multiple forms. Async validation remains an application responsibility.

Visible server field errors with explicit `aria-invalid="true"` are adopted without replacing a visible authored summary or moving focus. Clearing/correcting/resetting removes the adopted field states and error descriptions while preserving hints and answers (reset restores default answers). An existing server `Error: ` title prefix is removed when the last managed form clears. Server domain messages are not cached as generic required-field text. Follow the [server-rendered error contract](docs/reference.md#server-rendered-errors), including its native-validation eligibility and application-owned server rules.

Layout gap variables are local to their components. `h-sidebar` wraps in DOM order, and `h-panel` adds no interactive behavior or landmark role. These additions retain the earlier manual-testing obligations.

## Server-error recovery checks: 17 October 2026

| Browser on macOS | Component checks | Example checks | Axe audit |
| --- | --- | --- | --- |
| Chrome 155.0.8059.80 | 53 passed | 38 passed | Zero violations in 18 page/brand/mode combinations plus the workspace invalid state |
| Safari 27.0.1 | 53 passed | Expanded response suite not rerun | Expanded audit not rerun |

The 16 added component checks cover initial server markup, preserved focus/answers/links, title cleanup, domain-message reuse prevention, custom-validity precedence, external error associations, radio-group cleanup, cancelled/native reset, and incomplete-summary fallback. Example checks also load an actual pre-rendered response before component registration, exercise correction/resubmission, and verify 320px LTR/RTL fallback with scripts blocked.

The response page had no incomplete axe findings in light or dark mode. Existing native select contrast and legacy video-caption manual findings remain. HTML parsing, JavaScript syntax and documentation/catalogue integrity checks passed. Chrome's response page was also visually reviewed.

This adds partial browser evidence; it does not complete Firefox/Edge/mobile, screen-reader, zoom/text-spacing, forced-colors or disabled-user testing. External ownership changes, complex grouping, localization and async integration remain explicit Phase 0 work.

## Token and focus checks: 17 October 2026

Chrome 155.0.8059.80 on macOS, served locally:

- All 53 component checks and 93 example checks passed. The 55 new token checks cover rendered spacing/radius/type aliases, direct and legacy overrides, seven semantic state triplets across two brands/modes, disabled text, checkbox sizing and both focus palettes on inputs, text links, header links, error summaries and skip links.
- Sample text met 4.5:1 and applicable state markers met 3:1 against their own backgrounds in the checked default/forest light/dark combinations. Disabled text met the same text target by design; no inactive-marker contrast claim is made.
- Axe-core 4.14.0 reported zero violations in 22 page/brand/mode/focus combinations plus the workspace invalid state. The workbench audit focuses a real header link in each palette. An initially reported scrolling code-region issue was fixed with explicit keyboard focus and accessible names, then the audit was rerun successfully.
- The no-JavaScript workspace check passed. The expanded example suite also checked 320px LTR/RTL pages with scripts blocked. State samples were visually reviewed in Chrome.
- Existing native select contrast and legacy media-caption manual findings remain. Safari/Firefox/Edge/mobile and manual forced-colors, zoom/text-spacing and screen-reader checks were not rerun for this token change.
- HTML/CSS parsing, changed JavaScript syntax, documentation links and generated catalogue checks passed. Foundation CSS measured 21,230 bytes raw / 4,682 bytes gzip at level 9 without minification (previously 3,983 bytes gzip); optional brand/example styles are separate. This is a measurement, not a regression-budget enforcement tool.

The scales and shared colors are implemented; variants, control sizes, density and the remaining accessibility release evidence are still Phase 0 work.


## Native action and size checks: 17 October 2026

Chrome 155.0.8059.80 on macOS, served locally:

- All 53 component checks and 168 example checks passed, including 75 new control checks. The new assertions cover four action variants in both brands/light-dark modes, normal/hover-token text contrast, shared disabled/focus styles, unknown-value fallback, native submitters/name-value/reset behavior and unchanged link semantics.
- Small/default/large controls met their configured minimum dimensions, small text stayed at least 1rem, selects retained arrow clearance in LTR/RTL, wrapper attributes did not resize descendants, checkboxes stayed square and native select rows remained usable. Long button labels wrapped without clipping in a 280px fixture with the root font doubled. This is a text-resize simulation, not a manual browser-zoom test.
- The no-JavaScript workspace check passed, including 320px LTR/RTL overflow checks. Dark-mode action and size examples were visually reviewed.
- Axe-core 4.14.0 completed all 23 states (22 page/brand/mode/focus combinations plus the workspace invalid state) with zero violations.
- Native select contrast remains a manual review finding, including the three new size examples. The legacy gallery video-caption finding remains unresolved. Safari/Firefox/Edge/mobile, screen readers, actual zoom/text-spacing, touch and forced colors were not verified for this change.
- HTML/CSS parsing, changed JavaScript syntax, documentation links and generated catalogue checks passed. Foundation CSS measures 25,525 bytes raw / 5,172 bytes gzip at level 9 without minification; optional brand/example styles are separate. The provisional 5 KB gzip goal remains an unconfirmed budget, and these measurements are not enforced automatically.

Action variants and individual control sizes are implemented. Shared density and feedback variants remain Phase 0 work; this evidence does not establish WCAG conformance or stable component status.

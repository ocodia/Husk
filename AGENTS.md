# Working on Husk

Husk is an HTML-first UI system in development. This file applies to the entire repository.

## Read before changing code

1. `docs/architecture.md` — confirmed architecture and component ownership.
2. `docs/reference.md` — implemented API; do not infer APIs from plans.
3. `docs/components.json` — complete reference mapping, statuses, phases and acceptance work.
4. `docs/conventions.md`, `docs/theming.md`, `ACCESSIBILITY.md` — interaction, theme and evidence contracts.
5. `ROADMAP.md` — delivery sequence; proposals are not shipped features.

## Current implementation

- Library CSS: `css/husk.css`, named `husk` layer and low-specificity native styles.
- Library behavior: `js/components.js`, registers **only `h-form` and `h-error-summary`**.
- CSS-only elements: `h-stack`, `h-cluster`, `h-grid`, `h-sidebar`, `h-panel`, `h-field`, `h-hint`, `h-error`, `h-skip-link`.
- Optional brand: `themes/forest.css`, root `data-brand="forest"`.
- Application/demo code: `js/examples.js`, `js/workspace.js`, `css/workspace.css`, `examples/`. Do not include these as library entry points.
- No package.json, published npm package, module imports or per-component loader exists yet.

## Rules

Use native buttons, links, inputs, selects, options, details and dialogs wherever their semantics fit. Keep all components in **light DOM**. Do not use Shadow DOM. Preserve native form value ownership, labels, names, validation eligibility, submitters and reset. No placeholder custom-element registrations, pretend APIs or roles without their complete keyboard/focus behavior.

Native/foundation catalogue status describes available building blocks, not full Web Awesome parity or an accessibility certification. For planned names, write a specification before implementation. Follow `docs/component-template.md` and link the specification from the catalogue.

Keep ordinary markup class-free where practical. Prefer `h-` wrappers for composition and CSS variables for geometry/themes. Use meaningful defaults; no JSON configuration for ordinary content. Existing class alternatives remain compatible. Reference spacing/type/radius scales and semantic state/focus tokens exist; use `docs/theming.md` for their names and alias rules. Native button `data-variant` and supported native control `data-size` are implemented; see `docs/controls.md` for scope, defaults and tokens. Shared density and feedback APIs remain proposals.

Install behavior before hiding content or applying compound-widget ARIA roles. Own only the attributes/listeners/DOM changes required; preserve authored relationships. Handle disconnect/reconnect, late children and nested event ownership. Applications own persistence, routing, async data and business rules. Use `docs/forms.md` for external ownership, grouped errors, localization callbacks/prefixes and async cancellation/response ordering; async work stays outside synchronous form callbacks.

## Validation and generated files

Run `python3 tools/check_docs.py` after docs/catalogue changes. After editing `docs/components.json`, run `python3 tools/build_catalog.py`; it owns `docs/components.md` and `examples/components.html`. Use `--check` to detect stale output. Keep these generated files in version control.

For runtime changes, serve with `python3 -m http.server 8765` and run relevant checks in `tests/accessibility.html`. Record actual browser/manual results. Do not treat axe as proof of WCAG conformance or hide findings with exclusions. Do not mark roadmap release gates complete without evidence.

Preserve user changes and existing APIs. Do not commit or publish unless requested. Keep `README.md`, current reference, examples and machine catalogue consistent with implemented code. Update this file if entry points or registration counts change.

# Husk

An HTML-first UI system: native controls, accessible interaction patterns, `h-` elements for composition, and CSS variables for theming.

Husk is growing from a CSS foundation into a complete interface library. The foundation and form coordination work today. The full component suite is being designed and built in stages. **Planned components are not available APIs.**

## Start with HTML

```html
<link rel="stylesheet" href="css/husk.css">
<!-- Optional behavior for h-form and h-error-summary -->
<script src="js/components.js" defer></script>

<h-form>
  <form action="/projects" method="post">
    <h-field>
      <label for="project">Project name</label>
      <h-hint id="project-hint">Use a short, recognisable name.</h-hint>
      <h-error hidden>Error: Enter a project name</h-error>
      <input id="project" name="project" aria-describedby="project-hint" required>
    </h-field>
    <button type="submit">Create project</button>
  </form>
</h-form>
```

The native form owns submission. Husk adds linked errors and focus management. Basic controls and content work before JavaScript loads. There is no required build step, framework, runtime dependency, or package manager.

## What exists today

| Layer | Available now |
| --- | --- |
| Native HTML | Typography, lists, tables, media, form controls, disclosures, dialog and popover styling |
| Control presentation | Native button variants and small/default/large control sizes; [contract](docs/controls.md) |
| Composition | `h-stack`, `h-cluster`, `h-grid`, `h-sidebar`, `h-panel` |
| Form structure | `h-field`, `h-hint`, `h-error`, `h-skip-link` |
| Optional behavior | `h-form`, `h-error-summary` in `js/components.js`; [application integration](docs/forms.md) |
| Themes | System/light/dark, spacing/type/radius scales, semantic state/focus tokens, an optional forest brand |
| Examples | Element gallery, complete form, Fieldwork workspace, recipes, server error recovery, async form integration and theme workbench |

Only the two behavior elements are registered with `customElements`. CSS-only elements need no registration. Existing `.stack`, `.cluster`, `.grid`, and `.table-scroll` helpers remain supported.

## The complete system

The [roadmap](ROADMAP.md) covers every entry in the reviewed [Web Awesome catalogue](https://webawesome.com/docs/components), including companion items, media, helpers, and data visualization. Each maps to a native HTML recipe, an existing Husk primitive, or a proposed enhancement. The ambition is comparable breadth with Husk's own conventions; this is not API or feature parity.

- Native HTML supplies meaning, form values, and platform behavior.
- Light DOM throughout keeps content inspectable and application styling predictable.
- `h-` elements add arrangement or compound behavior where it helps.
- Minimal classes; useful defaults; explicit variants only when needed.
- CSS variables separate brand, semantic states, and component geometry.
- Current Chrome, Edge, Firefox, and Safari, with progressive enhancement.
- Plain CSS and JavaScript first; optional packages and individual modules come later.

Accessibility is a component release requirement. The target is WCAG 2.2 AA, informed by GOV.UK and WAI-ARIA APG. Current automated results are partial evidence, not a completed accessibility audit. Read the [test record](ACCESSIBILITY.md#recorded-checks-16-october-2026).

## Documentation

Start with the [documentation guide](docs/README.md), then use:

| Task | Read |
| --- | --- |
| Build a page | [Getting started](docs/getting-started.md) and [current API](docs/reference.md) |
| Choose a component | [Component coverage and contracts](docs/components.md) |
| Theme an interface | [Theming](docs/theming.md) |
| Design interactions | [UI conventions](docs/conventions.md) |
| Implement a component | [Architecture](docs/architecture.md), [component template](docs/component-template.md), [contributing](CONTRIBUTING.md) |
| Work with a coding agent | [AGENTS.md](AGENTS.md), [llms.txt](llms.txt), [machine-readable catalogue](docs/components.json) |

## Examples and checks

Run `python3 -m http.server 8765` from this directory. Open [the example hub](http://localhost:8765/examples/), [component explorer](http://localhost:8765/examples/components.html), or [browser checks](http://localhost:8765/tests/accessibility.html).

The existing [element gallery](index.html), [complete form](form.html), and [Fieldwork workspace](workspace.html) remain available. New examples use working features only; proposed components are described as contracts in the explorer.

Run documentation checks with `python3 tools/check_docs.py`. After changing the catalogue, run `python3 tools/build_catalog.py`; generated files are committed so reading docs needs no generator.

## License

[MIT](LICENSE). Reference systems inform scope and interaction design; Husk uses its own implementation, vocabulary, and documentation.

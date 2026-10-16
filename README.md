# Husk

Just enough CSS for conventional HTML. No classes required for documents, forms, and native elements.

```html
<link rel="stylesheet" href="css/husk.css">
```

Open [the examples](https://ocodia.github.io/Husk/) or [the complete form](https://ocodia.github.io/Husk/form.html). To preview locally, run `python3 -m http.server 8765` from this directory and visit `http://localhost:8765`.

Husk ships as plain CSS. There is no required build step, JavaScript, or dependency.

## HTML conventions

Use elements for their meaning: links navigate, buttons perform actions, and labels identify controls. Husk styles headings, text, lists, tables, code, media, forms, `details`, `dialog`, and `[popover]`.

```html
<form>
  <p>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required>
  </p>
  <button type="submit">Subscribe</button>
</form>
```

Controls use native checked, disabled, read-only, and validation states. `:user-invalid` marks invalid controls after interaction. Applications can set `aria-invalid="true"` and associate an error message with `aria-describedby`. Color alone does not explain an error.

Husk supplies keyboard focus outlines and preserves native controls. It does not turn arbitrary elements into interactive widgets.

## Layout

The body provides a full-width canvas. Its direct children share a content width and gutters; the direct header has a full-width background. Pages without a `main` still receive content widths. Images shrink to fit without stretching.

Most pages need no classes. Four optional helpers cover explicit arrangements:

- `stack`: consistent vertical spacing between children.
- `cluster`: a horizontal group that wraps.
- `grid`: columns that adapt to available width.
- `table-scroll`: local horizontal scrolling for wide tables.

```html
<div class="grid">
  <section><h2>First</h2><p>First item.</p></section>
  <section><h2>Second</h2><p>Second item.</p></section>
</div>
```

For a keyboard-scrollable table wrapper, add `tabindex="0"`, `role="region"`, and an accessible name through `aria-labelledby`. Articles and sections receive no automatic card treatment.

## Themes and customization

Husk follows the system light or dark theme. Set `data-theme="light"` or `data-theme="dark"` on `html` to force a theme. Remove the attribute to return to the system preference. Theme persistence is the application's choice.

All defaults live inside the `husk` cascade layer. Normal unlayered application CSS can override them with simple selectors. Most defaults use `:where()` to keep specificity low.

```css
:root {
  --husk-content-width: 72rem;
  --husk-reading-width: 68ch;
  --husk-gutter: clamp(1rem, 3vw, 2rem);
  --husk-space: 1rem;
  --husk-radius: .375rem;
  --husk-action-bg: #005cc5;
  --husk-action-hover: #004799;
  --husk-action-text: #fff;
}
```

Color variables include `--husk-text`, `--husk-heading`, `--husk-canvas`, `--husk-surface`, `--husk-muted`, `--husk-border`, `--husk-link`, `--husk-link-hover`, `--husk-focus`, and `--husk-invalid`. Fonts use `--husk-font-sans` and `--husk-font-mono`. Set readable foreground/background pairs for each theme, including hover states.

The original `--text`, `--headings`, `--body-bg`, `--details`, `--borders`, font, header, highlight, and dark-theme variables remain supported as fallback values. `--interactive` and `--interactive-alt` now control links only. Use the separate `--husk-action-*` variables for buttons. This prevents bright dark-mode links from also setting an unsuitable button background.

## Native interactions

`details` and `summary` provide disclosures. Popover controls use normal HTML:

```html
<button type="button" popovertarget="help">Help</button>
<div id="help" popover>Helpful content.</div>
```

A modal dialog can be opened with the browser's `showModal()` API. Close it with a `form method="dialog"` button. Supply an accessible title through `aria-labelledby`. Popovers are not modal dialogs.

`js/examples.js` powers only the index page's theme selector, dialog opener, and validation demonstration. Do not include it in an application. The CSS does not depend on it. Native popover support varies in older browsers; provide an application fallback if needed.

## Migration

This upgrade changes layout, spacing, and the cascade. Review pages that depend on the old constrained body, full-width images, per-element bottom margins, or button colors shared with links. The obsolete `.button` selector and invalid nested `a button` pattern are no longer styled as an API.

The stylesheet includes print styles and adds no decorative animation. Use current browsers with cascade layers and `:where()` support; `:has()`, `:user-invalid`, and popovers enhance supported browsers. Older browsers without cascade layers do not receive these layered styles.

## Checks

When changing Husk, check both HTML examples, light and dark themes, keyboard focus, native validation, dialog focus return, popover dismissal, narrow screens, zoom, print, and right-to-left content. Keep ordinary element examples class-free and reserve layout classes for explicit arrangements.

## License

[MIT](LICENSE).

// Optional light-DOM behavior. Native labels, controls, and hints stay in HTML.
let summaryId = 0;

class HErrorSummary extends HTMLElement {
  connectedCallback() {
    this._events?.abort();
    this._events = new AbortController();
    this.setAttribute('tabindex', '-1');
    const heading = this.querySelector('h2');
    if (heading && !heading.id) {
      do { heading.id = `h-error-summary-${++summaryId}`; }
      while (document.getElementById(heading.id) !== heading);
    }
    if (!this.hasAttribute('role')) this.setAttribute('role', 'region');
    if (heading && !this.hasAttribute('aria-labelledby')) this.setAttribute('aria-labelledby', heading.id);
    this.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || !this.contains(link)) return;
      let id;
      try { id = decodeURIComponent(link.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      // A server-rendered summary can also point into a closed disclosure.
      for (let parent = target.parentElement; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
      target.focus();
      target.scrollIntoView({ block: 'center' });
    }, { signal: this._events.signal });
  }

  disconnectedCallback() { this._events?.abort(); }

  show(errors) {
    const list = this.querySelector('ul');
    if (!list || !this.querySelector('h2')) throw new Error('h-error-summary needs an h2 and a ul.');
    const items = errors.map(({ control, message }) => {
      if (!control?.id || document.getElementById(control.id) !== control) {
        throw new Error('Error controls need unique IDs in the document.');
      }
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${encodeURIComponent(control.id)}`;
      link.textContent = message;
      item.append(link);
      return item;
    });
    list.replaceChildren(...items);
    this.hidden = items.length === 0;
    if (items.length) this.focus();
  }

  clear() {
    this.hidden = true;
    this.querySelector('ul')?.replaceChildren();
  }
}

if (!customElements.get('h-error-summary')) customElements.define('h-error-summary', HErrorSummary);

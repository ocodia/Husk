// Optional light-DOM behavior. Native labels, controls, and hints stay in HTML.
(() => {
  let nextId = 0;
  const documentErrors = new WeakMap();
  const authoredMessages = new WeakMap();

  function identify(element, prefix) {
    if (!element.id) {
      do { element.id = `h-${prefix}-${++nextId}`; }
      while (element.ownerDocument.getElementById(element.id) !== element);
    }
    return element.id;
  }

  function describe(control, id, add = true) {
    const ids = new Set((control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    if (add) ids.add(id); else ids.delete(id);
    if (ids.size) control.setAttribute('aria-describedby', [...ids].join(' '));
    else control.removeAttribute('aria-describedby');
  }

  class HErrorSummary extends HTMLElement {
    connectedCallback() {
      this._events?.abort();
      this._events = new AbortController();
      this.refresh();
      this.addEventListener('click', (event) => {
        const link = event.target.closest?.('a[href^="#"]');
        if (!link || !this.contains(link)) return;
        let id;
        try { id = decodeURIComponent(link.hash.slice(1)); } catch { return; }
        const target = this.ownerDocument.getElementById(id);
        if (!target) return;
        event.preventDefault();
        for (let parent = target.parentElement; parent; parent = parent.parentElement) {
          if (parent.localName === 'details') parent.open = true;
        }
        target.focus();
        target.scrollIntoView({ block: 'center' });
      }, { signal: this._events.signal });
    }

    disconnectedCallback() { this._events?.abort(); }

    refresh() {
      this.setAttribute('tabindex', '-1');
      const heading = this.querySelector('h2');
      if (!this.hasAttribute('role')) this.setAttribute('role', 'region');
      if (heading && (!this.hasAttribute('aria-labelledby') || this.getAttribute('aria-labelledby') === this._headingId)) {
        this._headingId = identify(heading, 'error-summary');
        this.setAttribute('aria-labelledby', this._headingId);
      }
    }

    show(errors, { focus = true } = {}) {
      this.refresh();
      const list = this.querySelector('ul');
      if (!list || !this.querySelector('h2')) throw new Error('h-error-summary needs an h2 and a ul.');
      const items = errors.map(({ control, message }) => {
        const doc = this.ownerDocument;
        if (!control?.id || doc.getElementById(control.id) !== control) throw new Error('Error controls need unique IDs in the document.');
        const item = doc.createElement('li');
        const link = doc.createElement('a');
        link.href = `#${encodeURIComponent(control.id)}`;
        link.textContent = message;
        item.append(link);
        return item;
      });
      list.replaceChildren(...items);
      this.hidden = items.length === 0;
      if (items.length && focus) this.focus();
    }

    clear() { this.hidden = true; this.querySelector('ul')?.replaceChildren(); }
  }

  class HForm extends HTMLElement {
    connectedCallback() {
      this._managed = new Map();
      this._errorElements = new WeakMap();
      this._errors = [];
      this._observer = new MutationObserver(() => this.refresh());
      this._observer.observe(this, { childList: true, subtree: true });
      this.refresh();
      // Child custom elements may upgrade after their parent's connected callback.
      queueMicrotask(() => { if (this.isConnected) this.refresh(); });
    }

    disconnectedCallback() {
      this._observer?.disconnect();
      this.clear();
      this._unbind();
    }

    get form() { return this._form || null; }

    _unbind() {
      this._events?.abort();
      if (this._form) this._form.noValidate = this._nativeNoValidate;
      this._form = null;
    }

    refresh() {
      if (!this.isConnected) return;
      const forms = [...this.querySelectorAll('form')].filter((form) => form.closest('h-form') === this);
      const form = forms.length === 1 ? forms[0] : null;
      if (form !== this._form) {
        this.clear();
        this._unbind();
        if (!form) return;
        this._form = form;
        this._nativeNoValidate = form.noValidate;
        this._events = new AbortController();
        form.addEventListener('submit', (event) => {
          if (!this._ready || event.submitter?.formNoValidate) return;
          try {
            if (this.validate()) return;
          } catch (error) {
            event.preventDefault();
            event.stopImmediatePropagation();
            throw error;
          }
          event.preventDefault();
          event.stopImmediatePropagation();
        }, { capture: true, signal: this._events.signal });
        form.addEventListener('reset', (event) => {
          queueMicrotask(() => { if (!event.defaultPrevented) this.clear(); });
        }, { signal: this._events.signal });
      }
      if (!form) return;
      let summary = [...this.querySelectorAll('h-error-summary')].find((item) => item.closest('h-form') === this);
      if (!summary) {
        summary = this.ownerDocument.createElement('h-error-summary');
        summary.hidden = true;
        summary.innerHTML = '<h2>There is a problem</h2><ul></ul>';
        this.prepend(summary);
      }
      this._summary = summary;
      summary.refresh?.();
      // Do not turn off the browser's UI unless the replacement can render errors.
      this._ready = typeof summary.show === 'function' && !!summary.querySelector('h2') && !!summary.querySelector('ul');
      form.noValidate = this._ready ? true : this._nativeNoValidate;
      for (const control of this._controls()) {
        const field = control.closest('h-field');
        if (!field) continue;
        for (const hint of field.querySelectorAll('h-hint')) {
          if (hint.closest('h-field') === field) describe(control, identify(hint, 'hint'));
        }
      }
      this._adoptErrors();
      if (this._errors.length && summary.hidden && this._ready) {
        summary.show(this._errors, { focus: false });
      }
      if (this._errors.some(({ control }) => control.form !== form || !control.isConnected)) {
        this.showErrors(this._errors.filter(({ control }) => control.form === form && control.isConnected), { focus: false });
      }
    }

    _controls() {
      return [...(this._form?.elements || [])].filter((control) => ['input', 'select', 'textarea'].includes(control.localName));
    }

    _errorTarget(control) {
      return control.type === 'radio' ? control.closest('fieldset') || control : control;
    }

    _findError(control) {
      const target = this._errorTarget(control);
      const ids = `${control.getAttribute('aria-describedby') || ''} ${target.getAttribute('aria-describedby') || ''}`.split(/\s+/);
      const linked = ids.map((id) => this.ownerDocument.getElementById(id)).find((item) => item?.localName === 'h-error');
      if (linked) return linked;
      const field = control.closest('h-field');
      const container = field || (target !== control ? target : null);
      const error = container && [...container.querySelectorAll('h-error')].find((item) =>
        field ? item.closest('h-field') === field : !item.closest('h-field') && item.closest('fieldset') === container);
      return error || (this._errorElements.get(control)?.isConnected ? this._errorElements.get(control) : null);
    }

    _adoptErrors() {
      let adopted = false;
      for (const control of this._controls()) {
        if (this._managed.has(control) || !control.willValidate || control.getAttribute('aria-invalid') !== 'true') continue;
        const error = this._findError(control);
        if (!error || error.hidden || !error.textContent.trim()) continue;
        identify(control, 'control');
        identify(error, 'error');
        // A server's domain error is not a reusable required-field message.
        if (!authoredMessages.has(error)) authoredMessages.set(error, '');
        this._errorElements.set(control, error);
        const target = this._errorTarget(control);
        describe(target, error.id);
        this._managed.set(control, { error, target });
        if (!control.name || control.type !== 'radio' || !this._errors.some(({ control: other }) => other.type === 'radio' && other.name === control.name)) {
          this._errors.push({ control, message: error.textContent.trim().replace(/^Error:\s*/i, '') });
        }
        adopted = true;
      }
      if (adopted) this._title(true, { fromMarkup: true });
    }

    _errorElement(control) {
      const field = control.closest('h-field') || (control.type === 'radio' ? control.closest('fieldset') : null);
      let error = this._findError(control);
      if (!error) {
        error = this.ownerDocument.createElement('h-error');
        error.hidden = true;
        if (field) field.append(error); else control.insertAdjacentElement('afterend', error);
      }
      identify(error, 'error');
      this._errorElements.set(control, error);
      if (!authoredMessages.has(error)) authoredMessages.set(error, error.hidden ? error.textContent.trim().replace(/^Error:\s*/i, '') : '');
      return error;
    }

    _title(invalid, { fromMarkup = false } = {}) {
      const doc = this.ownerDocument;
      let state = documentErrors.get(doc);
      if (invalid && !state) {
        state = { base: fromMarkup ? doc.title.replace(/^Error: /, '') : doc.title, owners: new Set() };
        documentErrors.set(doc, state);
      }
      if (!state) return;
      if (invalid) state.owners.add(this); else state.owners.delete(this);
      const errorTitle = state.base.startsWith('Error: ') ? state.base : `Error: ${state.base}`;
      if (state.owners.size) doc.title = errorTitle;
      else {
        if (doc.title === errorTitle) doc.title = state.base;
        documentErrors.delete(doc);
      }
    }

    clear() {
      for (const [control, { error, target }] of this._managed || []) {
        control.removeAttribute('aria-invalid');
        if (target !== control) describe(control, error.id, false);
        describe(target, error.id, false);
        error.hidden = true;
      }
      this._managed?.clear();
      this._errors = [];
      this._summary?.clear?.();
      this._title(false);
    }

    showErrors(errors, { focus = true } = {}) {
      if (!this._form) throw new Error('h-form needs exactly one native form.');
      if (!this._ready) throw new Error('h-form needs a usable error summary before displaying errors.');
      const unique = new Map();
      for (const { control, message } of errors) {
        if (control?.form !== this._form || !control.willValidate || typeof message !== 'string' || !message.trim()) {
          throw new Error('Each error needs a validating control in this form and a message.');
        }
        identify(control, 'control');
        unique.set(control, { control, message });
      }
      this.clear();
      this._errors = [...unique.values()];
      for (const { control, message } of this._errors) {
        const error = this._errorElement(control);
        error.textContent = `Error: ${message}`;
        error.hidden = false;
        control.setAttribute('aria-invalid', 'true');
        const target = this._errorTarget(control);
        describe(target, error.id);
        this._managed.set(control, { error, target });
      }
      this._title(this._errors.length > 0);
      this._summary.show(this._errors, { focus });
    }

    validate({ focus = true } = {}) {
      this.refresh();
      if (!this._form || !this._ready) return false;
      const errors = [];
      const radios = new Set();
      for (const control of this._controls()) {
        if (!control.willValidate) continue;
        const textual = control.localName === 'textarea' || ['text', 'search', 'email', 'url', 'tel', 'password'].includes(control.type);
        const empty = control.required && textual && !control.value.trim();
        const tooLong = control.maxLength >= 0 && control.value.length > control.maxLength;
        const tooShort = control.minLength > 0 && control.value.length > 0 && control.value.length < control.minLength;
        if (!empty && !tooLong && !tooShort && control.validity.valid) continue;
        if (control.type === 'radio' && control.name) {
          if (radios.has(control.name)) continue;
          radios.add(control.name);
        }
        const legend = control.type === 'radio' ? control.closest('fieldset')?.querySelector('legend') : null;
        const label = legend?.textContent.trim() || control.labels?.[0]?.textContent.trim() || control.name || 'This answer';
        const authored = authoredMessages.get(this._errorElement(control));
        let message = control.validationMessage;
        if (control.validity.customError) {
          // Keep the application's explicit message even when another rule fails.
          message = control.validationMessage;
        }
        else if (empty || control.validity.valueMissing) {
          const verb = control.localName === 'select' || ['checkbox', 'radio', 'file'].includes(control.type) ? 'Select' : 'Enter';
          message = authored || `${verb} ${label.toLowerCase()}`;
        }
        else if (tooLong) message = `${label} must be ${control.maxLength} characters or fewer`;
        else if (tooShort) message = `${label} must be ${control.minLength} characters or more`;
        errors.push({ control, message });
      }
      if (this.validator) {
        const extra = this.validator(this._form);
        if (!Array.isArray(extra)) throw new TypeError('h-form validator must return an array of errors synchronously.');
        errors.push(...extra);
      }
      this.showErrors(errors, { focus });
      return this._errors.length === 0;
    }
  }

  if (!customElements.get('h-error-summary')) customElements.define('h-error-summary', HErrorSummary);
  if (!customElements.get('h-form')) customElements.define('h-form', HForm);
})();

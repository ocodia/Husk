// Optional application behavior. Layout elements do not depend on this file.
(() => {
  const form = document.querySelector('#project-form');
  const status = document.querySelector('#save-status');
  const tasks = [...document.querySelectorAll('input[name="task"]')];
  const storageKey = 'husk-fieldwork-project-v1';
  const stages = ['Planning', 'In progress', 'Ready for review'];
  const errorSummary = document.querySelector('#project-errors');
  const pageTitle = document.title;
  const enhancedValidation = typeof errorSummary?.show === 'function';
  const fields = [
    { control: form.elements.name, missing: 'Enter a project name', long: 'Project name must be 100 characters or fewer' },
    { control: form.elements.summary, missing: 'Enter a summary', long: 'Summary must be 500 characters or fewer' },
    { control: form.elements.stage, missing: 'Select a project stage' },
    { control: form.elements.date, missing: 'Enter a complete target date in the format shown' }
  ];
  let dirty = false;
  function validDate(value) {
    if (value === '') return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  let saved = {
    name: form.elements.name.value,
    summary: form.elements.summary.value,
    stage: form.elements.stage.value,
    date: form.elements.date.value,
    tasks: tasks.filter((task) => task.checked).map((task) => task.value)
  };

  // Stored data is optional and untrusted. Keep the example usable if it fails.
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && typeof stored.name === 'string' && stored.name.trim() && stored.name.length <= 100 &&
        typeof stored.summary === 'string' && stored.summary.trim() && stored.summary.length <= 500 &&
        stages.includes(stored.stage) && typeof stored.date === 'string' &&
        validDate(stored.date) && Array.isArray(stored.tasks)) {
      saved = {
        name: stored.name, summary: stored.summary, stage: stored.stage, date: stored.date,
        tasks: tasks.filter((task) => stored.tasks.includes(task.value)).map((task) => task.value)
      };
    }
  } catch {
    status.textContent = 'Browser storage is unavailable. Changes will last until this page is closed.';
  }

  function showProject() {
    document.querySelector('#project-title').textContent = saved.name;
    document.querySelector('#project-description').textContent = saved.summary;
    document.querySelector('#detail-stage').textContent = saved.stage;
    const date = document.querySelector('#detail-date');
    date.dateTime = saved.date;
    date.textContent = saved.date ? new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'long' }).format(new Date(`${saved.date}T12:00:00`)) : 'Not set';
  }

  function fillForm() {
    for (const key of ['name', 'summary', 'stage', 'date']) form.elements[key].value = saved[key];
    tasks.forEach((task) => { task.checked = saved.tasks.includes(task.value); });
    showProgress();
  }

  function showProgress() {
    const count = tasks.filter((task) => task.checked).length;
    const label = `${count} of ${tasks.length} done`;
    document.querySelector('#task-count').textContent = label;
    const progress = document.querySelector('#task-progress');
    progress.value = count;
    progress.textContent = label;
  }

  function persist(message) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(saved));
      status.textContent = message;
    } catch {
      status.textContent = 'Updated for this visit. Browser storage is unavailable, so reloading may lose changes.';
    }
  }

  function clearErrors() {
    fields.forEach(({ control }) => {
      const error = document.getElementById(`${control.id}-error`);
      if (!error) return;
      error.hidden = true;
      control.removeAttribute('aria-invalid');
      const descriptions = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter((id) => id && id !== error.id);
      if (descriptions.length) control.setAttribute('aria-describedby', descriptions.join(' '));
      else control.removeAttribute('aria-describedby');
    });
    errorSummary?.clear?.();
    document.title = pageTitle;
  }

  function validate() {
    const errors = fields.flatMap(({ control, missing, long }) => {
      if (!control.willValidate) return [];
      const empty = control.required && !control.value.trim();
      const tooLong = control.maxLength > -1 && control.value.length > control.maxLength;
      if (!empty && !tooLong && control.validity.valid) return [];
      const message = empty ? missing : tooLong ? long : control === form.elements.date ? missing : control.validationMessage;
      return [{ control, message }];
    });
    clearErrors();
    errors.forEach(({ control, message }) => {
      const error = document.getElementById(`${control.id}-error`);
      error.textContent = `Error: ${message}`;
      error.hidden = false;
      control.setAttribute('aria-invalid', 'true');
      const descriptions = new Set((control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      descriptions.add(error.id);
      control.setAttribute('aria-describedby', [...descriptions].join(' '));
    });
    if (errors.length) {
      status.textContent = '';
      document.title = `Error: ${pageTitle}`;
      errorSummary.show(errors);
    }
    return errors.length === 0;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (enhancedValidation && !validate()) return;
    const name = form.elements.name.value.trim();
    const summary = form.elements.summary.value.trim();
    if (!name || !summary) {
      status.textContent = 'Enter a project name and summary with more than spaces.';
      return;
    }
    saved = { ...saved, name, summary, stage: form.elements.stage.value, date: form.elements.date.value };
    dirty = false;
    showProject();
    persist('Changes saved on this device.');
    document.querySelector('#activity-note').textContent = 'Project details updated just now.';
  });
  form.addEventListener('reset', (event) => {
    event.preventDefault();
    fillForm();
    dirty = false;
    clearErrors();
    status.textContent = 'Edits reverted to the last saved version.';
  });
  form.addEventListener('input', () => {
    if (!dirty) { dirty = true; status.textContent = 'You have unsaved edits.'; }
  });
  tasks.forEach((task) => task.addEventListener('change', () => {
    saved.tasks = tasks.filter((item) => item.checked).map((item) => item.value);
    showProgress();
    persist(`Task progress saved on this device.${dirty ? ' Project edits are still unsaved.' : ''}`);
  }));

  document.querySelector('#export-project').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fieldwork-project.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  fillForm();
  showProject();
  // Leave native validation enabled until the summary behavior is available.
  if (enhancedValidation) form.noValidate = true;
  document.querySelector('#save-actions').hidden = false;
  document.querySelector('#export-project').hidden = false;
})();

// Demonstration application only. Persistence/server validation belong to the app.
(() => {
  const form = document.querySelector('#recipe-form');
  const output = document.querySelector('#recipe-output');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const formats = values.getAll('format');
    output.textContent = `Project checked: ${values.get('project')}. Visibility: ${values.get('visibility')}. Exports: ${formats.length ? formats.join(', ') : 'none'}. Nothing was sent.`;
  });
  form.addEventListener('input', () => { output.textContent = ''; });
  form.addEventListener('reset', (event) => queueMicrotask(() => { if (!event.defaultPrevented) output.textContent = ''; }));
  document.querySelector('#recipe-submit').hidden = false;
  const dialog = document.querySelector('#recipe-dialog');
  const opener = document.querySelector('#recipe-open-dialog');
  if (typeof dialog.showModal === 'function') {
    opener.addEventListener('click', () => dialog.showModal());
    dialog.addEventListener('close', () => opener.focus());
    opener.hidden = false;
  }
})();

// Workbench application only. Theme choices are not persisted.
(() => {
  const root = document.documentElement;
  const brand = document.querySelector('#brand');
  const mode = document.querySelector('#mode');
  function update() {
    if (brand.value === 'default') delete root.dataset.brand;
    else root.dataset.brand = brand.value;
    if (mode.value === 'system') delete root.dataset.theme;
    else root.dataset.theme = mode.value;
    document.querySelector('#theme-selection').textContent = `${brand.selectedOptions[0].textContent} · ${mode.selectedOptions[0].textContent}.`;
  }
  brand.addEventListener('change', update);
  mode.addEventListener('change', update);
  update();
  document.querySelector('#theme-controls').hidden = false;
  const form = document.querySelector('#theme-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector('#theme-result').textContent = 'The project name is complete. Nothing was sent.';
  });
  form.addEventListener('input', () => { document.querySelector('#theme-result').textContent = ''; });
  document.querySelector('#theme-submit').hidden = false;
})();

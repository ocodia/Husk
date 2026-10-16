// Real browser integration checks for the documentation applications. No network dependency.
const exampleButton = document.querySelector('#run-examples');
exampleButton.addEventListener('click', async () => {
  const frame = document.querySelector('#audit-frame');
  const buttons = [...document.querySelectorAll('main > h-cluster button')];
  const passed = [];
  const check = (condition, message) => { assert(condition, message); passed.push(message); };
  const settle = async () => { await Promise.resolve(); await Promise.resolve(); };
  async function load(route, nojs = false) {
    if (nojs) frame.setAttribute('sandbox', 'allow-same-origin');
    else frame.removeAttribute('sandbox');
    await new Promise((resolve) => { frame.onload = resolve; frame.src = route; });
    return frame.contentWindow;
  }
  buttons.forEach((button) => { button.disabled = true; });
  frame.hidden = false;
  try {
    let win = await load('../examples/components.html');
    let doc = win.document;
    const query = doc.querySelector('#query');
    const category = doc.querySelector('#category');
    const status = doc.querySelector('#status');
    const shown = () => [...doc.querySelectorAll('[data-component]')].filter((item) => !item.hidden);
    const update = (control, value) => { control.value = value; control.dispatchEvent(new win.Event('input', { bubbles: true })); };
    check(shown().length === 90 && !doc.querySelector('#catalog-filter').hidden, 'Explorer initializes with all 90 reference entries.');
    update(query, 'combobox');
    check(shown().some((item) => item.id === 'combobox') && shown().length < 90, 'Search finds matching contracts.');
    update(category, 'Actions');
    check(shown().length === 0 && !doc.querySelector('#catalog-empty').hidden, 'Combined filters show an explicit empty result.');
    doc.querySelector('#catalog-filter').reset();
    await settle();
    check(shown().length === 90 && doc.querySelector('#catalog-empty').hidden, 'Reset clears filters and restores all entries.');
    update(status, 'planned');
    check(shown().length > 0 && shown().every((item) => item.dataset.status === 'planned'), 'Planned APIs can be distinguished from available routes.');
    win = await load('../examples/themes.html');
    doc = win.document;
    const root = doc.documentElement;
    const brand = doc.querySelector('#brand');
    const mode = doc.querySelector('#mode');
    const choose = (control, value) => { control.value = value; control.dispatchEvent(new win.Event('change', { bubbles: true })); };
    check(!doc.querySelector('#theme-controls').hidden, 'Theme controls appear after their behavior initializes.');
    choose(mode, 'light');
    const defaultLight = win.getComputedStyle(root).getPropertyValue('--husk-action-bg');
    choose(brand, 'forest');
    check(root.dataset.brand === 'forest' && win.getComputedStyle(root).getPropertyValue('--husk-action-bg') !== defaultLight, 'Forest changes real light-theme action tokens.');
    choose(mode, 'dark');
    const forestDark = win.getComputedStyle(root).getPropertyValue('--husk-action-bg');
    choose(brand, 'default');
    check(root.dataset.theme === 'dark' && win.getComputedStyle(root).getPropertyValue('--husk-action-bg') !== forestDark, 'Both brands have distinct dark-theme action tokens.');
    choose(mode, 'system');
    check(!root.hasAttribute('data-theme') && !root.hasAttribute('data-brand'), 'System/default selections restore native preference behavior.');
    const themeForm = doc.querySelector('#theme-form');
    themeForm.requestSubmit();
    check(!doc.querySelector('h-error-summary').hidden && doc.activeElement === doc.querySelector('h-error-summary'), 'Theme preview demonstrates real invalid-form focus.');
    doc.querySelector('#theme-name').value = 'Field guide';
    themeForm.requestSubmit();
    check(doc.querySelector('h-error-summary').hidden && doc.querySelector('#theme-result').textContent.includes('Nothing was sent'), 'Theme preview accepts valid native values without navigation.');
    win = await load('../examples/patterns.html');
    doc = win.document;
    const form = doc.querySelector('#recipe-form');
    doc.querySelector('#recipe-name').value = 'Field guide';
    form.querySelector('[name="format"][value="pdf"]').checked = true;
    form.requestSubmit();
    check(doc.querySelector('#recipe-output').textContent.includes('pdf'), 'Recipe reads actual FormData including native checkbox values.');
    form.reset();
    await settle();
    check(doc.querySelector('#recipe-name').value === '' && doc.querySelector('#recipe-output').textContent === '', 'Recipe reset clears values, errors and application feedback.');
    const opener = doc.querySelector('#recipe-open-dialog');
    opener.click();
    check(doc.querySelector('#recipe-dialog').open && doc.activeElement.localName === 'button', 'Native dialog opens with focus inside.');
    doc.querySelector('#recipe-dialog').close();
    await new Promise((resolve) => win.requestAnimationFrame(() => win.requestAnimationFrame(resolve)));
    check(doc.activeElement === opener, 'Native dialog closes with focus returned to its trigger.');
    win = await load('../examples/server-errors.html');
    doc = win.document;
    const serverForm = doc.querySelector('#server-form');
    const serverName = serverForm.elements.project;
    const serverSummary = doc.querySelector('h-error-summary');
    check(!serverSummary.hidden && serverName.value === 'Coastal field guide' && doc.title.startsWith('Error: ') && doc.activeElement !== serverSummary, 'A real parsed server-response page preserves initial errors and focus.');
    serverForm.requestSubmit();
    check(doc.activeElement === serverSummary && serverSummary.textContent.includes('already in use'), 'The response demo rechecks the original rejected value.');
    serverName.value = '';
    serverForm.requestSubmit();
    check(!serverSummary.textContent.includes('already in use') && serverName.getAttribute('aria-invalid') === 'true', 'An empty replacement receives its own required-field error.');
    serverName.value = 'New field guide';
    serverForm.requestSubmit();
    check(serverSummary.hidden && !doc.title.startsWith('Error: ') && serverName.getAttribute('aria-describedby') === 'server-project-hint' && doc.querySelector('#server-result').textContent.includes('Nothing was sent'), 'Successful correction clears initial server errors, retains hints and restores the page title.');
    serverForm.reset();
    await settle();
    check(serverName.value === 'Coastal field guide' && serverSummary.hidden && doc.querySelector('#server-result').textContent === '', 'Reset restores the original response value and clears feedback.');
    serverForm.requestSubmit();
    check(!serverSummary.hidden && serverSummary.textContent.includes('already in use'), 'Reset does not bypass the next domain validation.');
    frame.style.inlineSize = '320px';
    for (const route of ['index', 'components', 'patterns', 'themes', 'server-errors']) {
      win = await load(`../examples/${route}.html`, true);
      doc = win.document;
      for (const dir of ['ltr', 'rtl']) {
        doc.documentElement.dir = dir;
        check(doc.documentElement.scrollWidth <= doc.documentElement.clientWidth + 1, `${route} remains within 320px in ${dir} without JavaScript.`);
      }
      check(!doc.querySelector('main').hidden, `${route} keeps baseline content without JavaScript.`);
      if (route === 'server-errors') {
        check(!doc.querySelector('h-error-summary').hidden && !doc.querySelector('h-error').hidden, 'Server messages remain visible without JavaScript.');
        check(!doc.querySelector('#server-form').noValidate && doc.querySelector('#server-project').value === 'Coastal field guide', 'Server responses preserve native validation and answers without JavaScript.');
      }
    }
    reportResults(`PASS: ${passed.length} example checks\n\n${passed.join('\n')}`);
  } catch (error) {
    reportResults(`FAIL after ${passed.length} example checks: ${error.message}`);
  } finally {
    buttons.forEach((button) => { button.disabled = false; });
    frame.style.removeProperty('inline-size');
    document.querySelector('#result-title').focus();
  }
});

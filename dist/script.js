/* Normal document scrolling. Only explicit controls change content. */
const menuButton = document.querySelector('[data-menu]');
const navigation = document.querySelector('#site-navigation');
if (menuButton && navigation) {
  document.documentElement.classList.add('enhanced');
  menuButton.hidden = false;
}
function closeMenu(restoreFocus = false) {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  if (restoreFocus) menuButton.focus();
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
// All stage descriptions remain visible when JavaScript is unavailable.
document.querySelectorAll('[data-stage-explorer]').forEach(explorer => {
  const buttons = [...explorer.querySelectorAll('[data-stage-button]')];
  const panels = [...explorer.querySelectorAll('[data-stage-panel]')];
  const tablist = explorer.querySelector('.stage-tabs');
  tablist.hidden = false;
  tablist.setAttribute('role', 'tablist');
  function select(index, focus = false) {
    buttons.forEach((button, i) => {
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', buttons[i].id);
      panel.tabIndex = 0;
    });
    explorer.querySelectorAll('[data-flow-node]').forEach((node, i) => node.classList.toggle('selected', i <= index));
    if (focus) buttons[index].focus();
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      select(next, true);
    });
  });
  select(0);
});

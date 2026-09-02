const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.archive-card')];
const emptyState = document.getElementById('archive-empty');
const loadMore = document.getElementById('load-more');
const PAGE_SIZE = 10;
let activeFilter = 'all';
let visibleCount = PAGE_SIZE;

function filteredCards() {
  return cards.filter(card => activeFilter === 'all' || card.dataset.series === activeFilter);
}

function renderArchive({ updateUrl = true } = {}) {
  const matches = filteredCards();
  cards.forEach(card => {
    const matchesFilter = matches.includes(card);
    const position = matches.indexOf(card);
    card.hidden = !matchesFilter || position >= visibleCount;
  });
  filterButtons.forEach(button => {
    const active = button.dataset.filter === activeFilter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  if (emptyState) emptyState.hidden = matches.length > 0;
  if (loadMore) loadMore.hidden = matches.length <= visibleCount;
  if (updateUrl) {
    const url = new URL(window.location.href);
    if (activeFilter === 'all') url.searchParams.delete('series');
    else url.searchParams.set('series', activeFilter);
    url.searchParams.delete('category');
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }
}

function selectFilter(key, options) {
  if (!filterButtons.some(button => button.dataset.filter === key)) key = 'all';
  activeFilter = key;
  visibleCount = PAGE_SIZE;
  renderArchive(options);
}

filterButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectFilter(button.dataset.filter));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % filterButtons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + filterButtons.length) % filterButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = filterButtons.length - 1;
    selectFilter(filterButtons[next].dataset.filter);
    filterButtons[next].focus();
  });
});

loadMore?.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderArchive({ updateUrl: false });
});

const query = new URLSearchParams(window.location.search);
selectFilter(query.get('series') || query.get('category') || 'all', { updateUrl: false });

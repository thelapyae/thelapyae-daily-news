// Client-side search for the published story cards.
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const stories = [...document.querySelectorAll('.story')];
const emptyState = document.querySelector('#emptyState');
const resultCount = document.querySelector('#resultCount');

function filterStories(query) {
  const needle = query.trim().toLocaleLowerCase();
  let visible = 0;
  for (const story of stories) {
    const haystack = `${story.textContent} ${story.dataset.search || ''}`.toLocaleLowerCase();
    const match = !needle || haystack.includes(needle);
    story.hidden = !match;
    if (match) visible += 1;
  }
  emptyState.hidden = visible !== 0;
  resultCount.textContent = `သတင်း ${visible} ပုဒ်`;
}

searchInput.addEventListener('input', () => filterStories(searchInput.value));
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  filterStories(searchInput.value);
  document.querySelector('#headlines').scrollIntoView({ behavior: 'smooth' });
});

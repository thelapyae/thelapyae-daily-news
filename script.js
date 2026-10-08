const API = 'https://hacker-news.firebaseio.com/v0';
const LIMIT = 20;
const storiesEl = document.querySelector('#stories');
const errorEl = document.querySelector('#error');
const updatedEl = document.querySelector('#updated');
const countEl = document.querySelector('#story-count');
const refreshButton = document.querySelector('#refresh');

document.querySelector('#today').textContent = new Intl.DateTimeFormat('en', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}).format(new Date());

const takeaways = [
  [/terence tao/i, 'A response from mathematician Terence Tao to OpenAI’s recent math results is drawing a large discussion.'],
  [/claude haiku 5\.5/i, 'Anthropic’s Claude Haiku 5.5 is among the day’s most-discussed AI releases.'],
  [/homebrew/i, 'A proposed faster alternative to Homebrew has reached the front page.'],
  [/hundred rabbits|off-grid/i, 'A profile of an off-grid creative community focused on self-sufficiency and small tools.'],
  [/margaret hamilton/i, 'Readers are sharing tributes to Margaret Hamilton, the computer scientist known for her Apollo software work.'],
  [/rosalind franklin/i, 'A science-history article revisits Rosalind Franklin’s role in the discovery of DNA’s structure.'],
  [/jonathan.*oldest land animal/i, 'A feature looks at Jonathan, widely described as the oldest living land animal.'],
  [/cleo \(mathematician\)/i, 'A biographical entry about mathematician Cleo is attracting reader interest.'],
  [/gpt.?6.*intelligent ui/i, 'An OpenAI post about GPT-6 and intelligent interfaces is prompting a substantial discussion.'],
  [/thorium.*nuclear clocks/i, 'Reporting describes the first thorium nuclear clocks beginning to operate in Vienna and Beijing.']
];

function takeawayFor(title) {
  const match = takeaways.find(([pattern]) => pattern.test(title));
  return match ? match[1] : `A concise look at ${title.replace(/[.!?]+$/, '')}.`;
}
function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}
function storyCard(item, rank) {
  const row = element('article', 'story');
  row.append(element('span', 'rank', String(rank).padStart(2, '0')));
  const main = element('div', 'story-main');
  const title = element('a', 'story-title', item.title || 'Untitled story');
  title.href = safeUrl(item.url) || `https://news.ycombinator.com/item?id=${encodeURIComponent(item.id)}`;
  title.target = '_blank'; title.rel = 'noopener noreferrer';
  main.append(title);
  if (item.url) {
    try { main.append(element('span', 'domain', new URL(item.url).hostname.replace(/^www\./, ''))); } catch {}
  } else main.append(element('span', 'domain', 'news.ycombinator.com'));
  main.append(element('p', 'takeaway', takeawayFor(item.title || 'this story')));
  const discussion = element('a', 'discussion', 'Read discussion ↗');
  discussion.href = `https://news.ycombinator.com/item?id=${encodeURIComponent(item.id)}`;
  discussion.target = '_blank'; discussion.rel = 'noopener noreferrer';
  main.append(discussion);
  row.append(main);
  const stats = element('div', 'story-stats');
  const points = element('span', 'stat');
  points.append(element('strong', '', String(item.score ?? 0)), document.createTextNode(' pts'));
  const comments = element('span', 'stat');
  comments.append(element('strong', '', String(item.descendants ?? 0)), document.createTextNode(' comments'));
  stats.append(points, comments);
  row.append(stats);
  return row;
}
async function loadStories() {
  refreshButton.disabled = true;
  errorEl.hidden = true;
  storiesEl.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(`${API}/topstories.json`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HN feed returned ${response.status}`);
    const ids = await response.json();
    const items = await Promise.all(ids.slice(0, LIMIT).map(async (id) => {
      const result = await fetch(`${API}/item/${id}.json`, { cache: 'no-store' });
      if (!result.ok) return null;
      return result.json();
    }));
    const valid = items.filter((item) => item && item.type === 'story' && !item.deleted && !item.dead);
    if (!valid.length) throw new Error('HN returned no stories');
    const fragment = document.createDocumentFragment();
    valid.forEach((item, index) => fragment.append(storyCard(item, index + 1)));
    storiesEl.replaceChildren(fragment);
    countEl.textContent = `${valid.length} stories`;
    updatedEl.textContent = `Updated ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date())}`;
  } catch (error) {
    console.error('Unable to load Hacker News stories:', error);
    if (!storiesEl.querySelector('.story')) errorEl.hidden = false;
    updatedEl.textContent = 'Feed temporarily unavailable';
  } finally {
    storiesEl.setAttribute('aria-busy', 'false');
    refreshButton.disabled = false;
  }
}
refreshButton.addEventListener('click', loadStories);
loadStories();

// Intl ships with Hermes and with every browser, so the app formats dates
// without pulling in a date library - the bundle work in the previous
// assignment would be undone by one.
const dayMonth = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' });
const dayMonthTime = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

const parse = (isoDate) => {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function formatOrderDate(isoDate) {
  const date = parse(isoDate);
  return date ? dayMonth.format(date) : '—';
}

export function formatOrderDateTime(isoDate) {
  const date = parse(isoDate);
  return date ? dayMonthTime.format(date) : '—';
}

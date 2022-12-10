export function currency(num) {
  const n = parseInt(num, 10);
  return `${n
    .toFixed(0)
    .replace(/./g, (c, i, a) => (i && c !== '.' && (a.length - i) % 3 === 0 ? `, ${c}`.replace(/\s/g, '') : c))}`;
}

export function toReadableDate(time) {
  return new Date(time * 1000).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function toUnixTimestamp(time) {
  const timestamp = Date.parse(time);
  if (Number.isNaN(timestamp)) return null;
  return timestamp / 1000;
}

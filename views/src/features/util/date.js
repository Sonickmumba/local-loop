export const formatMonthYear = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

export const formatTradeDate = (isoString) => {
  if (!isoString) return '';

  const date = new Date(isoString);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

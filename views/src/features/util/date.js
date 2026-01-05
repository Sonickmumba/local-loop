export const formatMonthYear = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  export const formatTradeDate = (isoString) => {
  const date = new Date(isoString);

  const day = date.toLocaleDateString('en-US', {
    weekday: 'long'
  });

  const month = date.toLocaleDateString('en-US', {
    month: 'short'
  });

  const dayOfMonth = date.getDate();

  const year = date.getFullYear();

  return {
    day,        // Saturday
    month,      // Dec
    date: dayOfMonth, // 28
    year        // 2026
  };
}


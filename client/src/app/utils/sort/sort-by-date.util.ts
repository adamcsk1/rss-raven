export const sortByDate =
  (direction: 'asc' | 'desc' = 'asc') =>
  <T extends { date: string }>(a: T, b: T): number => {
    if ((a.date || '') > (b.date || '')) return direction === 'asc' ? 1 : -1;
    if (a.date === b.date) return 0;
    return direction === 'asc' ? -1 : 1;
  };

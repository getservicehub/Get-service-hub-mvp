export function getRotatedWindow<T>(items: T[], itemsPerWindow: number, periodDays: number): T[] {
  if (items.length <= itemsPerWindow) return items;

  const totalWindows = Math.ceil(items.length / itemsPerWindow);
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const windowIndex = Math.floor(daysSinceEpoch / periodDays) % totalWindows;

  const start = windowIndex * itemsPerWindow;
  const end = start + itemsPerWindow;

  const window = items.slice(start, end);

  if (window.length < itemsPerWindow) {
    const remaining = itemsPerWindow - window.length;
    window.push(...items.slice(0, remaining));
  }

  return window;
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function createMonthLabel(monthIndex: number, year: number) {
  return `${MONTH_NAMES[monthIndex].toUpperCase()} ${year}`;
}

export function createId(prefix: string) {
  const randomId =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${prefix}-${randomId}`;
}

export function getFilenameFromPath(path: string) {
  return path.split('/').filter(Boolean).pop() ?? path;
}

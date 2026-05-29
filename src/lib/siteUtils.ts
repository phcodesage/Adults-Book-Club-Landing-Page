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

export function isBookExpired(year: number, monthIndex: number, schedule?: string) {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const targetMonthStart = new Date(year, monthIndex, 1);

  if (targetMonthStart < currentMonthStart) {
    return true;
  }

  if (targetMonthStart > currentMonthStart) {
    return false;
  }

  // If it is the current month, check the meeting dates if available.
  if (schedule) {
    const datePart = schedule.split(',')[0];
    const days = (datePart.match(/\d+/g) || []).map((d) => Number.parseInt(d, 10));
    if (days.length > 0) {
      const lastMeetingDay = Math.max(...days);
      const today = now.getDate();
      return today > lastMeetingDay;
    }
  }

  return false;
}

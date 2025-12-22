import dayjs from 'dayjs';

/**
 * Format date to DD/MM/YYYY
 * @param date - Date string, Date object, or dayjs object
 * @returns Formatted date string (DD/MM/YYYY) or '-' if invalid
 */
export function formatDate(
  date: string | Date | dayjs.Dayjs | null | undefined
): string {
  if (!date) return '-';
  const d = dayjs(date);
  if (!d.isValid()) return '-';
  return d.format('DD/MM/YYYY');
}

/**
 * Format date to DD/MM/YYYY HH:mm
 * @param date - Date string, Date object, or dayjs object
 * @returns Formatted date string (DD/MM/YYYY HH:mm) or '-' if invalid
 */
export function formatDateTime(
  date: string | Date | dayjs.Dayjs | null | undefined
): string {
  if (!date) return '-';
  const d = dayjs(date);
  if (!d.isValid()) return '-';
  return d.format('DD/MM/YYYY HH:mm');
}

/**
 * Format date to DD/MM/YYYY HH:mm:ss
 * @param date - Date string, Date object, or dayjs object
 * @returns Formatted date string (DD/MM/YYYY HH:mm:ss) or '-' if invalid
 */
export function formatDateTimeWithSeconds(
  date: string | Date | dayjs.Dayjs | null | undefined
): string {
  if (!date) return '-';
  const d = dayjs(date);
  if (!d.isValid()) return '-';
  return d.format('DD/MM/YYYY HH:mm:ss');
}

/**
 * Format date to a readable format (e.g., "15 Jan 2024, 02:30 PM")
 * @param date - Date string, Date object, or dayjs object
 * @returns Formatted date string or '-' if invalid
 */
export function formatDateReadable(
  date: string | Date | dayjs.Dayjs | null | undefined
): string {
  if (!date) return '-';
  const d = dayjs(date);
  if (!d.isValid()) return '-';
  return d.format('DD MMM YYYY, HH:mm');
}

/**
 * Format date to a long readable format (e.g., "15 January 2024, 02:30 PM")
 * @param date - Date string, Date object, or dayjs object
 * @returns Formatted date string or '-' if invalid
 */
export function formatDateLong(
  date: string | Date | dayjs.Dayjs | null | undefined
): string {
  if (!date) return '-';
  const d = dayjs(date);
  if (!d.isValid()) return '-';
  return d.format('DD MMMM YYYY, HH:mm');
}

/**
 * Check if a date is valid
 * @param date - Date string, Date object, or dayjs object
 * @returns true if date is valid, false otherwise
 */
export function isValidDate(
  date: string | Date | dayjs.Dayjs | null | undefined
): boolean {
  if (!date) return false;
  return dayjs(date).isValid();
}

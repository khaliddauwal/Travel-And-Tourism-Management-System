/**
 * Date utility functions — single source of truth for all date handling.
 *
 * Display format : DD/MM/YYYY  (Day-Month-Year)
 * Backend format : YYYY-MM-DD  (ISO date, what MySQL expects)
 */

/**
 * Parse any date string safely.
 * Handles both ISO "2026-04-01" and MySQL datetime "2026-04-01 21:55:54".
 */
function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  // Replace MySQL space separator with T so Date() parses it correctly
  const normalized = value.replace(" ", "T");
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a date string for display: DD/MM/YYYY
 * Falls back to the raw string if parsing fails.
 */
export function formatDateToDisplay(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return value ?? "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Format a date string for display with time: DD/MM/YYYY HH:MM
 */
export function formatDateTimeToDisplay(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return value ?? "—";
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh   = String(d.getHours()).padStart(2, "0");
  const min  = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

/**
 * Convert any date value to YYYY-MM-DD for backend submission.
 * Accepts a Date object or a date string in any common format.
 */
export function formatDateToBackend(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : parseDate(value as string);
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Get tomorrow's date as YYYY-MM-DD (for date input min attribute).
 */
export function getTomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDateToBackend(d);
}

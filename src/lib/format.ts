const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "POA";
  return currency.format(value);
}

export const formatPounds = formatPrice;

export function hueIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % 5;
}

export function formatDate(
  dateValue: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!dateValue) return "";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString(
    "en-GB",
    options || {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

export const formatDateTime = formatDate;

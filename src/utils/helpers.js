/**
 * Compact-format a large number (e.g. 1,200,000,000 → "1.20B")
 */
export const formatNumber = (num) => {
  if (num == null) return "N/A";
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
};

/**
 * Format a price with currency symbol, handling sub-cent values
 */
export const formatPrice = (price, symbol) => {
  if (price == null) return `${symbol}—`;
  if (price < 0.01) return `${symbol}${price.toFixed(6)}`;
  return `${symbol}${price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

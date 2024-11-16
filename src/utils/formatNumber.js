export const formatNumber = (value) => {
  if (value == null || isNaN(value)) {
    return "0"; // Or any default string you prefer
  }

  const truncateToTwoDecimals = (num) => Math.trunc(num * 100) / 100;

  if (value >= 10000000) {
    return `${truncateToTwoDecimals(value / 10000000)}Cr`;
  } else if (value >= 100000) {
    return `${truncateToTwoDecimals(value / 100000)}L`;
  } else if (value >= 1000) {
    return `${truncateToTwoDecimals(value / 1000)}k`;
  } else {
    return value.toString();
  }
};
export const formatNumberLacksAndCrore = (num) => {
  if (num < 1)
    return (num * 100000).toLocaleString('en-IN'); // For 0.1 -> 1 Thousand
  else if (num >= 1 && num < 10)
    return (num * 100000).toLocaleString('en-IN'); // For 1 -> 1 Lakh
  else if (num >= 10 && num < 100)
    return (num * 100000).toLocaleString('en-IN'); // For 10 -> 10 Lakh
  else if (num >= 100 && num < 1000)
    return (num * 100000).toLocaleString('en-IN'); // For 100 -> 1 Crore
  else return num.toLocaleString('en-IN'); // Default for numbers >= 1000
};
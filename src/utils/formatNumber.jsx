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

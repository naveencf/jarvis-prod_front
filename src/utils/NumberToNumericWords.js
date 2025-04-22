function NumberToNumericWords(num) {
  if (typeof num !== "number" || num < 0) return "Invalid input";

  num = Math.round(num); // Round off decimals

  const parts = [];

  const crore = Math.floor(num / 10000000);
  if (crore > 0) parts.push(`${crore} Crore`);

  const lakh = Math.floor((num % 10000000) / 100000);
  if (lakh > 0) parts.push(`${lakh} Lakh`);

  const thousand = Math.floor((num % 100000) / 1000);
  if (thousand > 0) parts.push(`${thousand} Thousand`);

  const hundred = Math.floor((num % 1000) / 100);
  if (hundred > 0) parts.push(`${hundred} Hundred`);

  const remainder = num % 100;
  if (remainder > 0) parts.push(`${remainder}`);

  return parts.length > 0 ? parts.join(" ") : "Zero";
}
export default NumberToNumericWords;

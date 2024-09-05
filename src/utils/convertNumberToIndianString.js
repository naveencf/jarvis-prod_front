// Utility function to convert a number to words in the Indian numbering system
function numberToWords(num) {
  // Ignore decimals by taking the integer part of the number
  num = Math.floor(num);

  if (num === 0) return "Zero";

  const singleDigits = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];

  const twoDigits = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const teens = [
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const units = [
    { value: 10000000, label: "Crore" },
    { value: 100000, label: "Lakh" },
    { value: 1000, label: "Thousand" },
    { value: 100, label: "Hundred" },
  ];

  function convertTwoDigits(n) {
    if (n < 10) return singleDigits[n];
    if (n > 10 && n < 20) return teens[n - 11];
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return twoDigits[tens] + (ones ? " " + singleDigits[ones] : "");
  }

  function convertHundreds(n) {
    const hundredPart = Math.floor(n / 100);
    const remainder = n % 100;
    const hundredText = hundredPart
      ? singleDigits[hundredPart] + " Hundred"
      : "";
    return hundredText + (remainder ? " " + convertTwoDigits(remainder) : "");
  }

  function convertLargeNumbers(n) {
    for (const unit of units) {
      if (n >= unit.value) {
        const unitPart = Math.floor(n / unit.value);
        const remainder = n % unit.value;
        return (
          numberToWords(unitPart) +
          " " +
          unit.label +
          (remainder ? " " + numberToWords(remainder) : "")
        );
      }
    }
    return convertHundreds(n);
  }

  return convertLargeNumbers(num);
}

export default numberToWords;

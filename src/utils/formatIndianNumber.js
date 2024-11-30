export function formatIndianNumber(num) {
  return new Intl.NumberFormat("en-IN").format(num);
}
// export function formatIndianNumber(num) {
//   // Check if the input is a valid number
//   if (typeof num !== "number" || isNaN(num)) {
//     throw new Error("Input must be a valid number");
//   }

//   // Use Intl.NumberFormat for Indian number formatting
//   const formatted = new Intl.NumberFormat("en-IN").format(num);

//   // Remove formatting characters like commas and parse back to number
//   return parseFloat(formatted.replace(/,/g, ""));
// }
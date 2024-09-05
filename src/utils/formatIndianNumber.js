export function formatIndianNumber(num) {
  return new Intl.NumberFormat("en-IN").format(num);
}

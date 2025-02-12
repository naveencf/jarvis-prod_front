export const lengthFuntion = (num) => {
  let count = 0;
  for (let i = 0; i < num?.length; i++) {
    count++;
  }
  return count;
};

export function convertDateToDDMMYYYY(dateString) {
  if (String(dateString).startsWith("0000-00-00")) {
    return " ";
  }
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = date.getFullYear();

  if (day == "NaN" || month == "NaN" || year == "NaN") {
    return " ";
  } else {
    return `${day}/${month}/${year}`;
  }
}

const DateISOtoNormal = (IsoString) => {
  const formattedDate = IsoString?.split("T")[0]
    ?.split("-")
    ?.reverse()
    ?.join("-");
  return formattedDate;
};

// const generateInvoiceDate = () => {
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth() + 1;
//   let day = 30;

//   if (month === 2) {
//     day = 28;
//   }

//   const formattedDate = `${day.toString().padStart(2, "0")}-${month.toString().padStart(2, "0")}-${year}`;
//   return formattedDate;
// };

export default DateISOtoNormal;

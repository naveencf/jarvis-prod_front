const DateISOtoNormal = (IsoString) => {
  const formattedDate = IsoString?.split("T")[0]
    ?.split("-")
    ?.reverse()
    ?.join("-");
  return formattedDate;
};



export default DateISOtoNormal;

const ConvertDateToOpposite = (dateStr) => {
  if (!dateStr) return "";
  const [dd, mm, yyyy] = dateStr.split("-");
  return `${yyyy}-${mm}-${dd}`;
};
export default ConvertDateToOpposite;

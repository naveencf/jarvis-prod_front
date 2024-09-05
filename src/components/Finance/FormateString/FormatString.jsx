const FormatString = (s) => {
  // Remove leading underscores
  let formattedString = s?.replace(/^_+/, "");
  // Capitalize the first letter and make the rest lowercase
  if (formattedString) {
    formattedString =
      formattedString?.charAt(0)?.toUpperCase() +
      formattedString?.slice(1)?.toLowerCase();
  }
  return formattedString;
};

export default FormatString;

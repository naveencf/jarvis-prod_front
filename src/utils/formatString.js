const formatString = (s) => {
  // Remove leading underscores
  let formattedString = s?.replace(/^_+/, "");
  // Capitalize the first letter of each word and make the rest lowercase
  if (formattedString) {
    formattedString = formattedString
      .split(" ")
      .map(
        (word) => word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  }
  return formattedString;
};

export default formatString;

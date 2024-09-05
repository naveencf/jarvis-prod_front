export const FormatName = (name) => {
  const lettersOnly = /^[A-Za-z]+$/;

  const correctedNameParts = name?.split(" ").map((part) => {
    let filteredPart = part
      .split("")
      .filter((char) => char.match(lettersOnly))
      ?.join("");

    return (
      filteredPart.charAt(0)?.toUpperCase() + filteredPart?.slice(1)?.toLowerCase()
    );
  });

  return correctedNameParts.join(" ");
};

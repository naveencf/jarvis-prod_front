export const formatDate = (dateString) => {
  if (!dateString) {
    return;
  }
  const oldDate = dateString.split(" ");
  const arr = oldDate[0].toString().split("-");
  return `${arr[2]}-${arr[1]}-${arr[0]}`;
};

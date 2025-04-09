export const formatDate = (dateString) => {
  if (!dateString) {
    return;
  }
  const oldDate = dateString.split(' ');
  const arr = oldDate[0].toString().split('-');
  return `${arr[2]}-${arr[1]}-${arr[0]}`;
};

export const formatDateAsDDMMYY = (dateString) => {
  if (!dateString) return '';

  const [dd, mm, yy] = dateString.split('-');

  const fullYear = yy.length === 2 ? `20${yy}` : yy; 

  return `${dd}/${mm}/${fullYear}`;
};
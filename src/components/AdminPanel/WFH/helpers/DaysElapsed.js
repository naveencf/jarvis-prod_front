export const calculateDaysElapsed = (dateString) => {
  const givenDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate - givenDate;
  const daysElapsed = timeDifference / (1000 * 60 * 60 * 24);
  return Math.abs(Math.round(daysElapsed));
};

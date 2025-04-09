
const DateTimeUTCtoISO = (utcISOString) => {
    if (!utcISOString) return { date: null, time: null };


    const dateObj = new Date(utcISOString);

    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');

    const hours = dateObj.getUTCHours();
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');

    // Convert to 12-hour format with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = String(hours % 12 || 12).padStart(2, '0');

    const date = `${day}/${month}/${year}`;
    const time = `${hour12}:${minutes} ${period}`;

    return { date, time };
};

export default DateTimeUTCtoISO;

// dateTimeFormatter.js
export function FormateDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);

    // Format the date in dd-mm-yy format
    const dateFormatted = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });

    // Format the time in 12-hour format with AM/PM
    const timeFormatted = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return { dateFormatted, timeFormatted };
}

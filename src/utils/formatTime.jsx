
export const formatTime = (timeString) => {
    const oldDate = timeString.split(" ");
    const arr = oldDate[1].toString().split(":");
    arr[0] = Number(arr[0]) + 5;
    arr[1] = Number(arr[1]) + 30;
    if (arr[1] > 59) {
      arr[0]++;
      arr[1] -= 60;
    }
    const newTime = arr[0] > 11 ? `${arr[0] - 12}:${arr[1]} PM` : `${arr[0]}:${arr[1]} AM`;
    return newTime;
  };


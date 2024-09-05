import { useState, useEffect } from "react";

function CountdownTimer({ initialTime }) {
  const [remainingTime, setRemainingTime] = useState(initialTime);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [remainingTime]);

  // const difference = reqTime - remainingTime;
  const isDelayed = remainingTime === 0;

  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return (
    <div>
      <p>
        {/* {minutes}m {seconds}s ({isDelayed ? "Delay" : "Remain"}) */}
        {/* {remainingTime} */}
        {minutes}m {seconds}s (
        {isDelayed ? <span style={{ color: "red" }}>Delay </span> : "Remain"})
        {/* {remainingTime} */}
      </p>
    </div>
  );
}

export default CountdownTimer;

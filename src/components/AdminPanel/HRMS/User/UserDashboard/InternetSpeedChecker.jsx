import React, { useState, useEffect } from 'react';
import { IoReloadCircle } from "react-icons/io5";

const InternetSpeedChecker = () => {
  const [speed, setSpeed] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const checkInternetSpeed = async () => {
    const testFileUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg";
    const fileSizeInBytes = 1195327; 
    
    setIsTesting(true);
    const startTime = new Date().getTime();

    try {
      await fetch(testFileUrl, { cache: "no-cache" });
      const endTime = new Date().getTime();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = (fileSizeInBytes * 8) / (durationInSeconds * 1024 * 1024);

      setSpeed(speedMbps.toFixed(2));
    } catch (error) {
      console.error("Error checking internet speed:", error);
      setSpeed("0");
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    checkInternetSpeed(); // Initial check
    const interval = setInterval(checkInternetSpeed, 300000); 
    return () => clearInterval(interval); 
  }, []);

  // Determine chip style based on speed
  const getChipStyle = () => {
    let backgroundColor = "gray";
    
    if (speed && !isNaN(speed)) {
      if (speed < 3) {
        backgroundColor = "#ff4d4d"; // Red for low speed
      } else if (speed >= 3 && speed <= 10) {
        backgroundColor = "#ffcc00"; // Yellow for medium speed
      } else if (speed > 10) {
        backgroundColor = "#4caf50"; // Green for high speed
      }
    }

    return {
      backgroundColor,
      color: "white",
      padding: "8px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      display: "inline-flex",
      alignItems: "center",
      cursor: "pointer",
    };
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={getChipStyle()} onClick={checkInternetSpeed}>
        
          <>
            <span>{speed ? `${speed} Mbps` : "Not available"}</span>
            <span style={{ marginLeft: "8px" }}>
            <IoReloadCircle style={{fontSize:'20px'}} />
            </span>
          </>
        
      </div>
    </div>
  );
};

export default InternetSpeedChecker;

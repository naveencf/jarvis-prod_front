import { useState, useEffect } from "react";
import axios from "axios";

const useIPAddress = () => {
  const [ip, setIp] = useState("");

  const fetchIPAddress = async () => {
    try {
      const response = await axios.get("https://api64.ipify.org?format=json");
      setIp(response.data.ip);
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  useEffect(() => {
    fetchIPAddress();
  }, []);

  return ip;
};

export default useIPAddress;

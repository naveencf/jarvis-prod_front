import React, { useState } from "react";
import { useGetPostDetailofPagenVendorMutation } from "../../Store/API/Operation/OperationApi.js";

const GetVendorandPageData = ({ trigger, type }) => {
  const [getData, { isLoading, isError }] =
    useGetPostDetailofPagenVendorMutation();

  const [data, setData] = useState([]);

  async function fetchData() {
    let payload = {};
    payload[type] = trigger;
    try {
      const response = await getData(payload).unwrap();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [trigger]);

  return data;
};

export default GetVendorandPageData;

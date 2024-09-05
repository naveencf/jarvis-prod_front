import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { BarChart } from "@mui/x-charts/BarChart";
import FieldContainer from "../FieldContainer";
import {baseUrl} from '../../../utils/config'

const UserGraphs = () => {
  const [graphData, setGraphData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    axios
      .post(baseUrl+"get_user_graph_data", {
        caseType: "gender",
      })
      .then((res) => {
        setGraphData(res.data);
      });
  }, []);

  const handleFilterChange = async (e) => {
    const newFilter = e.target ? e.target.value : e;
    setSelectedFilter(newFilter);
    await axios
      .post(baseUrl+"get_user_graph_data", {
        caseType: e.target.value,
      })
      .then((res) => {
        setGraphData(res.data);
      });
  };

  return (
    <>
      <FieldContainer
        Tag="select"
        label="Select Filter"
        fieldGrid={3}
        value={selectedFilter}
        required={false}
        onChange={(e) => handleFilterChange(e)}
      >
        <option value=""> Select To See Graph </option>
        <option value="gender"> Gender </option>
        <option value="job"> Job Type </option>
        <option value="year"> Joined in year </option>
        <option value="experience"> Experience </option>
        <option value="age"> Age </option>
      </FieldContainer>

      <div style={{ marginBottom: "10%" }}></div>

      {graphData.length > 0 &&
        (selectedFilter == "job" || selectedFilter == "gender") && (
          <>
            <BarChart
              width={800}
              height={400}
              series={[
                {
                  data:
                    selectedFilter === "job"
                      ? graphData.map((item) => item.wfoCount)
                      : graphData.map((item) => item.maleCount),
                  label: selectedFilter === "job" ? "WFO" : "Male",
                  stack: "total",
                },
                {
                  data:
                    selectedFilter === "job"
                      ? graphData.map((item) => item.wfhCount)
                      : graphData.map((item) => item.femaleCount),
                  label: selectedFilter === "job" ? "WFH" : "FeMale",
                  stack: "total",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data:
                    selectedFilter === "job"
                      ? graphData.map((item) => item.dept_name)
                      : graphData.map((item) => item.dept_name),
                },
              ]}
              // onBarClick={(barData, index, event) => {
              //   // Add your event handling logic here
              //   console.log('Bar Clicked!');
              //   // You can perform actions based on the bar data, index, or event
              // }}
            />
          </>
        )}

      {graphData.length > 0 &&
        (selectedFilter == "year" ||
          selectedFilter == "age" ||
          selectedFilter == "experience") && (
          <>
            <BarChart
              width={800}
              height={400}
              series={[
                {
                  data:
                    selectedFilter === "year"
                      ? graphData.map((item) => item.userjoined)
                      : selectedFilter === "age"
                      ? graphData.map((item) => item.userCount)
                      : selectedFilter === "experience"
                      ? graphData.map((item) => item.userCounts)
                      : [],
                  label: "User Counts",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data:
                    selectedFilter === "year"
                      ? graphData.map((item) => item.year)
                      : selectedFilter === "age"
                      ? graphData.map((item) => item.age)
                      : selectedFilter === "experience"
                      ? graphData.map((item) => item.years)
                      : [],
                },
              ]}
            />
          </>
        )}
    </>
  );
};

export default UserGraphs;

// import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { OverviewBudget } from "./overview-budget";
import { OverviewLatestOrders } from "./overview-latest-orders";
import { OverviewLatestProducts } from "./overview-latest-products";
import { OverviewTraffic } from "./overview-traffic";
import AppWebsiteVisits from "./Overview-website-preview";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../utils/config";
import Linegraph from "./Linegraph";
import RadialBar from "./Radialchart";
import ExecutionRejected from "../Rejected/ExecutionRejected";
import { Button } from "@mui/material";

const gdata = [
  { name: 1, cost: 4.11, impression: 100 },
  { name: 2, cost: 2.39, impression: 120 },
  { name: 3, cost: 1.37, impression: 150 },
  { name: 4, cost: 1.16, impression: 180 },
  { name: 5, cost: 2.29, impression: 200 },
  { name: 6, cost: 3, impression: 499 },
  { name: 7, cost: 0.53, impression: 50 },
  { name: 8, cost: 2.52, impression: 100 },
  { name: 9, cost: 1.79, impression: 200 },
  { name: 10, cost: 2.94, impression: 222 },
  { name: 11, cost: 4.3, impression: 210 },
  { name: 12, cost: 4.41, impression: 300 },
  { name: 13, cost: 2.1, impression: 50 },
  { name: 14, cost: 8, impression: 190 },
  { name: 15, cost: 0, impression: 300 },
  { name: 16, cost: 9, impression: 400 },
  { name: 17, cost: 3, impression: 200 },
  { name: 18, cost: 2, impression: 50 },
  { name: 19, cost: 3, impression: 100 },
  { name: 20, cost: 7, impression: 100 },
];

const OverviewIndex = () => {
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState([]);
  useEffect(() => {
    const apiBodyData = [
      { status: "pending", filterCriteria: "m" },
      { status: "complete", filterCriteria: "m" },
      { status: "pending", filterCriteria: "w" },
      { status: "complete", filterCriteria: "w" },
      { status: "pending", filterCriteria: "q" },
      { status: "complete", filterCriteria: "q" },
      { status: "pending", filterCriteria: "y" },
      { status: "complete", filterCriteria: "y" },
    ];

    const fetchData = async () => {
      const responseArray = [];

      axios
        .get(baseUrl + "get_exe_sum", {
          loggedin_user_id: 52,
        })
        .then((response) => {
          setData(response.data);
        });

      for (const data of apiBodyData) {
        const formData = new URLSearchParams();
        formData.append("loggedin_user_id", 36);
        formData.append("filter_criteria", data.filterCriteria);
        formData.append("pendingorcomplete", data.status);

        try {
          const response = await axios.post(
            "https://sales.creativefuel.io/webservices/RestController.php?view=dashboardData",
            formData,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          responseArray.push({
            [data.filterCriteria + data.status]: response.data.body,
          });
        } catch (error) {
          return console.log(error);
        }
      }
      axios.get(baseUrl + "execution_graph").then((res) => {
        // console.log(res.data, "this is response");
        setCounts(res.data);
        // console.log(
        //   res.data.filter(
        //     (count) =>
        //       count?.interval_type === "Weekly" && count?.execution_status === 3
        //   )[0]?.count,
        //   "filter data"
        // );
      });

      setCounts(responseArray);
    };
    fetchData();
  }, []);

  return (
    <>
      {/* <Head>
      <title>Overview | Devias Kit</title>
    </Head> */}
      <div
      >
        <div className="card">
          <div className="card-body">
            <Button variant="outlined">
           Rejected   {data.filter((ele) => ele.execution_status == "4").length}{" "}
            </Button>
            <Button variant="outlined">
              Pending {data.filter((ele) => ele.execution_status == "1").length}{" "}
            </Button>
            <Button variant="outlined">
              On Going {data.filter((ele) => ele.execution_status == "2").length}{" "}
            </Button>
            <Button variant="outlined">
              Complete {data.filter((ele) => ele.execution_status == "3").length}{" "}
            </Button>
            <Button variant="outlined">
              Hold {data.filter((ele) => ele.execution_status == "5" || ele.execution_status=='6').length}{" "}
            </Button>
            <h3 className="card-head-title mb-2 ml-2">Execution</h3>
            <div className="flex-row gap16 sb">




              <OverviewBudget
                difference={12}
                complete={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Weekly" &&
                      count.execution_status === 3
                  )[0]?.count !== undefined
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Weekly" &&
                        count.execution_status === 3
                    )[0].count
                    : 0
                }
                pending={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Weekly" &&
                      count.execution_status === 1
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Weekly" &&
                        count.execution_status === 1
                    )[0].count
                    : 0
                }
                onGoing={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Weekly" &&
                      count.execution_status === 2
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Weekly" &&
                        count.execution_status === 2
                    )[0].count
                    : 0
                }

                sx={{ height: "100%" }}
                value="Weekly Execution"
              />


              <OverviewBudget
                difference={12}
                complete={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Monthly" &&
                      count.execution_status === 3
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Monthly" &&
                        count.execution_status === 3
                    )[0].count
                    : 0
                }
                pending={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Monthly" &&
                      count.execution_status === 1
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Monthly" &&
                        count.execution_status === 1
                    )[0].count
                    : 0
                }

                onGoing={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Monthly" &&
                      count.execution_status === 2
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Monthly" &&
                        count.execution_status === 2
                    )[0].count
                    : 0
                }

                sx={{ height: "100%" }}
                value="Monthly Execution"
              />


              <OverviewBudget
                difference={12}
                complete={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Quarterly" &&
                      count.execution_status === 3
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Quarterly" &&
                        count.execution_status === 3
                    )[0].count
                    : 0
                }
                pending={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Quarterly" &&
                      count.execution_status === 1
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Quarterly" &&
                        count.execution_status === 1
                    )[0].count
                    : 0
                }

                onGoing={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Quarterly" &&
                      count.execution_status === 2
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Quarterly" &&
                        count.execution_status === 2
                    )[0].count
                    : 0
                }

                sx={{ height: "100%" }}
                value="Quaterly Execution"
              />


              <OverviewBudget
                difference={12}
                complete={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Yearly" &&
                      count.execution_status === 3
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Yearly" &&
                        count.execution_status === 3
                    )[0].count
                    : 0
                }
                pending={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Yearly" &&
                      count.execution_status === 1
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Yearly" &&
                        count.execution_status === 1
                    )[0].count
                    : 0
                }
                onGoing={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Yearly" &&
                      count.execution_status === 2
                  )[0]?.count
                    ? counts.filter(
                      (count) =>
                        count.interval_type === "Yearly" &&
                        count.execution_status === 2
                    )[0].count
                    : 0
                }

                sx={{ height: "100%" }}
                value="Yearly Execution"
              />

            </div>
          </div>

        </div>
        <div className="flex-row gap16">

          <div className="card w-50">
            <div className="card-body">
              <div className="pack align-items-center sb mb-2">
                <h3 className="card-head-title">Overview</h3>
                <div className="op-das">
                  <button className="op-das-btn op-das-act">Team A</button>
                  <button className="op-das-btn ">Team B</button>
                  <button className="op-das-btn ">Team C </button>
                </div>
              </div>
              <Linegraph gdata={gdata} />
            </div>
          </div>
          <div className="card w-50">
            <div className="card-body">
              <h3 className="card-head-title mb-2 ml-2">Analytics</h3>
              <RadialBar />
            </div>
          </div>
        </div>

        {/* <Grid item xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Overview"
            // subheader="(+43%) than last year"
            chartLabels={[
              "01/01/2003",
              "02/01/2003",
              "03/01/2003",
              "04/01/2003",
              "05/01/2003",
              "06/01/2003",
              "07/01/2003",
              "08/01/2003",
              "09/01/2003",
              "10/01/2003",
              "11/01/2003",
            ]}
            chartData={[
              {
                name: "Team A",
                type: "column",
                fill: "solid",
                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
              },
              {
                name: "Team B",
                type: "area",
                fill: "gradient",
                data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
              },
              {
                name: "Team C",
                type: "line",
                fill: "solid",
                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
              },
            ]}
          />
        </Grid> */}
        {/* <Grid xs={12} md={6} lg={4}>
          <OverviewTraffic
            chartSeries={[63, 15, 22]}
            labels={["Inventory", "Pending", "Complete"]}
            sx={{ height: "100%" }}
          />
        </Grid> */}


        <OverviewLatestProducts products={data} sx={{ height: "100%" }} />


        <OverviewLatestOrders products={data} sx={{ height: "100%" }} />

        <ExecutionRejected />



      </div>
    </>
  );
};

// Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default OverviewIndex;

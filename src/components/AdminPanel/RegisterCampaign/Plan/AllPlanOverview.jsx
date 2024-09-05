import { Paper, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormContainer from "../../FormContainer";
import { baseUrl } from "../../../../utils/config";

const AllPlanOverview = () => {
  const { id } = useParams();
  const [allPlan, setAllPlan] = useState([]);
  const getData = async () => {
    const res = await axios.get(
      `${baseUrl}directplan/${id}`
    );
    setAllPlan(res?.data?.result?.pages);
  };

  useEffect(() => {
    getData();
  }, []);


  const col = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 120,
      renderCell: (params) => {
        const rowIndex = allPlan.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page",
      width: 150,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 200,
    },
    {
      field: "platform",
      headerName: "Platform",
      width: 200,
    },

    {
      field: "page_link",
      headerName: "Link",
      width: 500,
    },

    // {
    //   field: "Action",
    //   headerName: "Action",
    //   width: 200,
    //   renderCell: (params) => (
    //     <>
    //       <Button
    //         variant="outlined"
    //         color="error"
    //         onClick={() => downloadExcel(params)}
    //       >
    //         Excel{" "}
    //       </Button>
    //     </>
    //   ),
    // },
  ];

  return (
    <div className="master-card-css">
      <FormContainer mainTitle=" All Plan Overview" link="true"/>
      <div className="card body-padding">

      <DataGrid rows={allPlan} columns={col} getRowId={(row) => row?.p_id} />
      </div>
    </div>
  );
};

export default AllPlanOverview;

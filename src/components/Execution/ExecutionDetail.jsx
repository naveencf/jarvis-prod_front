import {
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {baseUrl} from '../../utils/config'

function ExecutionDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [pageIds, setPageIds] = useState([]);
  const [pageNames, setPageNames] = useState([]);
  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_exe_sum`)
      .then((res) => {
        setData(
          ...res.data.filter((ele) => ele._id == id)
        );
        setPageIds(() =>
          res.data?.filter((ele) => ele._id == id)[0]?.page_ids?.split(",")
        );
      });
  }, []);

  useEffect(() => {
    const form = new FormData();
    form.append("loggedin_user_id", 36);

    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=inventoryDataList",
        form
      )
      .then((res) => {
        setPageNames(
          pageIds.map((e) => res.data.body.filter((ele) => ele.p_id == e)[0])
        );
      });
  }, [pageIds]);
  const addSerialNumber = (rows) => {
    return rows.map((row, index) => ({
      ...row,
      S_No: index + 1,
    }));
  };
  const columns = [
    {
      field: "S_No",
      headerName: "S No",
      width: 90,
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },
    {
      field: "page_link",
      headerName: "Page Url",
      width: 150,
      renderCell: (params) => (
        <a href={params.row.page_link} rel="noreferrer" target="_blank">
          {" "}
          {params.row.page_link}
        </a>
      ),
    },
    {
      field: "page_status",
      headerName: "Page Status",
      width: 150,
    },
    {
      field: "platform",
      headerName: "Platform",
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => {
        return new Date(
          params.row.created_at?.split(" ")[0]
        ).toLocaleDateString();
      },
    },
  ];

  return (
    <>
      <Paper
        // justifyContent="space-between"
        sx={{ flexWrap: "wrap", flexDirection: "row", p: 2 }}
      >
        <Typography>Sales Booking Invoice Detail</Typography>
        <Stack direction="row" sx={{ mt: 2 }} justifyContent="space-evenly">
          <Stack direction="row" spacing={4}>
            <Button
              size="small"
              variant="outlined"
              //   startIcon={<ContentCopyOutlinedIcon />}
            >
              Customer Name : {data.cust_name}
            </Button>
            <Button
              size="small"
              variant="outlined"
              //   startIcon={<CopyAllOutlinedIcon />}
            >
              Sale Booking Date :
              {new Date(data.sale_booking_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </Button>
            {/* <Button
              size="small"
              variant="outlined"
              //   startIcon={<ContentPasteIcon />}
            >
              Campaign Amount :{data.campaign_amount}
            </Button> */}
          </Stack>
        </Stack>
      </Paper>
      <Paper
        justifyContent="space-between"
        sx={{ flexWrap: "wrap", flexDirection: "row", p: 2, mt: 4 }}
      >
        <Typography sx={{ mb: 4 }}>Record Service Detail</Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Typography> Services:{data.service_name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography> Iteration :</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              Start Date:{" "}
              {new Date(data.start_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Executive Name :{data.sales_executive_name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              End Date:{" "}
              {new Date(data.end_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography> Excel Upload</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography> Goal</Typography>
          </Grid>
          {/* <Grid item xs={6}>
            <Typography> Per Hour Amount</Typography>
          </Grid> */}
          {/* <Grid item xs={6}>
            <Typography> Campaign Amount : {data.campaign_amount}</Typography>
          </Grid> */}
          {/* <Grid item xs={6}>
            <Typography> Execution Done by:{data.execution_done_by}</Typography>
          </Grid> */}
          <Grid item xs={6}>
            <Typography> Description:{data.summary}</Typography>
          </Grid>
          {/* <Grid item xs={6}>
            <Typography> Services</Typography>
          </Grid> */}
          <Grid item xs={6}>
            <Typography> Hash tag</Typography>
          </Grid>
          {data?.execution_excel && (
            <Grid item xs={6}>
              <Typography>
                Excel:
                <Button href={data.execution_excel} color="success">
                  Download
                </Button>
              </Typography>
            </Grid>
          )}
        </Grid>
        {/* </Stack> */}
      </Paper>
      {pageNames.length > 0 && (
        <Paper
          justifyContent="space-between"
          sx={{ flexWrap: "wrap", flexDirection: "row", p: 2, mt: 4 }}
        >
          <DataGrid
            rows={addSerialNumber(pageNames)}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row.p_id}
          />
        </Paper>
      )}
    </>
  );
}

export default ExecutionDetail;

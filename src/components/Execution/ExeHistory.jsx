import  { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Button } from "@mui/material";
import DeleteHistoryConfirmation from "./DeleteHistoryConfirmation";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import OndemandVideoTwoToneIcon from "@mui/icons-material/OndemandVideoTwoTone";
import { baseUrl } from "../../utils/config";
import { render } from "react-dom";

export default function ExeHistory({ pageRow }) {
  const { id } = useParams();
  // console.log(id, "id");
  const [buttonAccess, setButtonAccess] = useState(false);
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [openDeleteHistoryConFirmation, setOpenDeleteHistoryConFirmation] =
    useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const handleClickOpenDeleteHistoryConFirmation = () => {
    setOpenDeleteHistoryConFirmation(true);
  };
  const handleCloseDeleteHistoryConFirmation = () => {
    setOpenDeleteHistoryConFirmation(false);
  };

  const apiCall = () => {
    axios
      .get(`${baseUrl}` + `v1/states_history/${id ?? pageRow._id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        // console.log(data, "data");
        if (!data) return;
        setData(data);
      });
  };

  useEffect(() => {
    apiCall();
    axios
      .get(baseUrl + "get_all_users", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setAllUsers(res.data.data);
      });
  }, []);

  const handleDeleteRowData = (data) => {
    setRowData(data);
    handleClickOpenDeleteHistoryConFirmation();
  };
  const columns = [
    {
      field: "S.No",
      headerName: "S.No",
      renderCell: (params) => {
        const rowIndex = data.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Creation Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.createdAt ? (
              <>
                {new Date(params.row.createdAt).toISOString().substr(8, 2)}/
                {new Date(params.row.createdAt).toISOString().substr(5, 2)}/
                {new Date(params.row.createdAt).toISOString().substr(2, 2)}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },

    {
      field: "reach",
      headerName: "Reach",
      width: 150,
      renderCell: (params) => {
        return (
          <div>{params.row?.reach ? <>{params.row.reach} &nbsp;</> : "NA"}</div>
        );
      },
    },
    {
      field: "impression",
      headerName: "Impression",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.impression ? (
              <>
                {params.row.impression} {params.row.percentage_impression}
                &nbsp;
                {params.row.impression_upload_image_url && (
                  <a
                    key="reach"
                    href={params.row.impression_upload_image_url}
                    title="Reach Impression Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "engagement",
      headerName: "Engagement",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.engagement ? (
              <>
                {params.row.engagement} {params.row.percentage_engagement}
                &nbsp;
                {params.row.engagement_upload_image_url && (
                  <a
                    key="engagement"
                    href={params.row.engagement_upload_image_url}
                    title="Engagement Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "story_view",
      headerName: "Story View",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.story_view ? (
              <>
                {params.row.story_view} {params.row.percentage_story_view}
                &nbsp;
                {params.row.story_view_upload_image_url && (
                  <a
                    key="storyImg"
                    href={params.row.story_view_upload_image_url}
                    title="Story View Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
                {params.row.story_view_upload_video_url && (
                  <a
                    key="storyVdo"
                    href={params.row.story_view_upload_video_url}
                    title="Story view Video"
                    download
                  >
                    <OndemandVideoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "city1_name",
      headerName: "City 1 and %",
      width: 150,
      valueGetter: (params) => {
        return (
          params.row.city1_name +
          " " +
          (`(${params.row.percentage_city1_name} %)` ?? "NA")
        );
      },
    },

    {
      field: "city2_name",
      headerName: "City 2 and %",
      width: 150,
      renderCell: (params) => {
        let data = params.row?.city2_name;
        let percentage = params.row?.percentage_city2_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "city3_name",
      headerName: "City 3 and %",
      width: 150,
      renderCell: (params) => {
        let data = params.row?.city3_name;
        let percentage = params.row?.percentage_city3_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "city4_name",
      headerName: "City 4 and %",
      width: 150,
      renderCell: (params) => {
        let data = params.row?.city4_name;
        let percentage = params.row?.percentage_city4_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "city5_name",
      headerName: "City 5 and %",
      width: 150,
      renderCell: (params) => {
        let data = params.row?.city5_name;
        let percentage = params.row?.percentage_city5_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country1_name",
      headerName: "Country 1 and %",
      width: 150,
      renderCell: (params) => {
        let data = params.row?.country1_name;
        let percentage = params.row?.percentage_country1_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country2_name",
      headerName: "Country 2 and %",

      width: 150,
      renderCell: (params) => {
        let data = params.row?.country2_name;
        let percentage = params.row?.percentage_country2_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country3_name",
      headerName: "Country 3 and %",
      width: 150,
      renderCell: (params) => {
        let data = params.row?.country3_name;
        let percentage = params.row?.percentage_country3_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country4_name",
      headerName: "Country 4 and %",
      width: 150,
      renderCell: (params) => {
        let data = params.row?.country4_name;
        let percentage = params.row?.percentage_country4_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      field: "country5_name",
      headerName: "Country 5 and %",
      width: 150,
      renderCell: (params) => {
        let data = params.row?.country5_name;
        let percentage = params.row?.percentage_country5_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },

    {
      field: "male_percent",
      headerName: "Male %",
      width: 150,
    },
    {
      field: "female_percent",
      headerName: "Female %",
      width: 150,
    },
    {
      field: "Age_13_17_percent",
      headerName: "Age 13-17 %",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.Age_13_17_percent ? (
              <>
                {params.row.Age_13_17_percent} &nbsp;{" "}
                {params.row.Age_upload_url && (
                  <a
                    key="cityVdo"
                    href={params.row.Age_upload_url}
                    title="Age Img"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "Age_18_24_percent",
      headerName: "Age 18-24 %",
      width: 150,
      renderCell: (params) => { 
          return params.row?.Age_18_24_percent ?? "NA"}
    },
    {
      field: "Age_25_34_percent",
      headerName: "Age 25-34 %",
      renderCell: (params) => {
        return params.row?.Age_25_34_percent ?? "NA";
      }
    },
    {
      field: "Age_35_44_percent",
      headerName: "Age 35-44 %",
      renderCell: (params) => {
        return params.row?.Age_35_44_percent ?? "NA";
      }
    },
    {
      field: "Age_45_54_percent",
      headerName: "Age 45-54 %",
      renderCell: (params) => {
        return params.row?.Age_45_54_percent ?? "NA";
      }
    },
    {
      field: "Age_55_64_percent",
      headerName: "Age 55-64 %",
      renderCell: (params) => {
        return params.row?.Age_55_64_percent ?? "NA";
      }
    },
    {
      field: "Age_65_plus_percent",
      headerName: "Age 65+ %",
      renderCell: params=>{
        return params.row?.Age_65_plus_percent ?? "NA";
      }
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.start_date ? (
              <>
                {new Date(params.row.start_date).toISOString().substr(8, 2)}/
                {new Date(params.row.start_date).toISOString().substr(5, 2)}/
                {new Date(params.row.start_date).toISOString().substr(2, 2)}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => {
        const data = params.row.end_date;
        if (isNaN(Date.parse(data))) {
          console.error("Invalid date:", data);
          return null;
        }
        return (
          <div>
            {data ? (
              <>
                {new Date(data).toISOString().substr(8, 2)}/
                {new Date(data).toISOString().substr(5, 2)}/
                {new Date(data).toISOString().substr(2, 2)}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
          <Button
            variant="contained"
            color="primary"
          >
          <Link to={`/admin/pageStats/${params.row._id}`}>Edit</Link>
          </Button>
          <Button
            onClick={() => handleDeleteRowData(params.row)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Stats History"
        link="/ip-master"
        buttonAccess={buttonAccess}
      />
      <div className="card body-padding fx-head nt-head">
        {data[0]?._id ? (
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            getRowId={(row) => row._id}
          />
        ) : (
          <h3 className="text-center">No Data Found</h3>
        )}
      </div>

      <DeleteHistoryConfirmation
        handleCloseDeleteHistoryConFirmation={
          handleCloseDeleteHistoryConFirmation
        }
        openDeleteHistoryConFirmation={openDeleteHistoryConFirmation}
        rowData={rowData}
        apiCall={apiCall}
      />
    </div>
  );
}
